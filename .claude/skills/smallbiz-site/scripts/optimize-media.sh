#!/usr/bin/env bash
#
# optimize-media.sh — compress client video for the web without wrecking color.
#
# The trap this exists to avoid: at high CRF, H.264 spends bits on luma and
# quantizes chroma hard. Mean brightness and mean saturation barely move while
# PEAK saturation collapses, so every average says "fine" and the video looks
# washed out. This script measures SATMAX before and after and fails loudly if
# too much color was lost.
#
# Usage:
#   ./optimize-media.sh encode  <src-dir> <out-dir> [prefix]   # encode + posters + verify
#   ./optimize-media.sh check   <file>                         # print SATMAX/SATAVG/YAVG
#   ./optimize-media.sh compare <original> <encoded>           # side-by-side + verdict
#   ./optimize-media.sh served  <url> <local-file>             # did the platform re-encode?
#
# Requires: ffmpeg, ffprobe, python3

set -euo pipefail

CRF="${CRF:-20}"          # 28 is for screencasts, not client footage
MAXW="${MAXW:-1920}"      # keep native res; 720p is soft on any 2x display
PRESET="${PRESET:-slow}"
MIN_RATIO="${MIN_RATIO:-0.90}"   # required SATMAX retention vs source

need() { command -v "$1" >/dev/null 2>&1 || { echo "error: $1 not found" >&2; exit 1; }; }
need ffmpeg; need ffprobe; need python3

# Average signalstats over the first N seconds. Emits: SATMAX SATAVG YAVG
stats() {
  ffprobe -v error -f lavfi -i "movie='${1//\'/\\\'}',signalstats" \
    -show_entries frame_tags -read_intervals "%+${2:-3}" -of json 2>/dev/null |
  python3 -c '
import json,sys
try: d=json.load(sys.stdin)
except Exception: print("0 0 0"); sys.exit()
a={}; n=0
for f in d.get("frames",[]):
    for k,v in f.get("tags",{}).items():
        k=k.replace("lavfi.signalstats.","")
        try: a[k]=a.get(k,0)+float(v)
        except ValueError: pass
    n+=1
print(f'"'"'{a.get("SATMAX",0)/n:.2f} {a.get("SATAVG",0)/n:.2f} {a.get("YAVG",0)/n:.2f}'"'"' if n else "0 0 0")'
}

human() { python3 -c "import sys;print(f'{int(sys.argv[1])/1048576:.1f}MB')" "$1"; }

cmd_check() {
  read -r smax savg yavg <<<"$(stats "$1")"
  printf "%-44s SATMAX=%6s  SATAVG=%5s  YAVG=%6s  %s\n" \
    "$(basename "$1")" "$smax" "$savg" "$yavg" "$(human "$(stat -f%z "$1" 2>/dev/null || stat -c%s "$1")")"
}

cmd_compare() {
  read -r a_max a_avg a_y <<<"$(stats "$1")"
  read -r b_max b_avg b_y <<<"$(stats "$2")"
  cmd_check "$1"; cmd_check "$2"
  python3 - "$a_max" "$b_max" "$MIN_RATIO" <<'PY'
import sys
src, out, floor = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3])
if src == 0: print("  ! could not measure source"); sys.exit(0)
r = out/src
verdict = "OK" if r >= floor else "COLOR LOSS — raise quality (lower CRF, add chroma-qp-offset)"
print(f"  peak saturation retained: {r*100:.1f}%  (floor {floor*100:.0f}%)  -> {verdict}")
sys.exit(0 if r >= floor else 1)
PY
}

# Some platforms serve uploads untouched. Re-encoding then only degrades.
cmd_served() {
  tmp="$(mktemp -t served).${1##*.}"
  curl -sSL "$1" -o "$tmp"
  h1=$(md5 -q "$tmp" 2>/dev/null || md5sum "$tmp" | cut -d' ' -f1)
  h2=$(md5 -q "$2" 2>/dev/null || md5sum "$2" | cut -d' ' -f1)
  echo "served : $h1  ($(human "$(stat -f%z "$tmp" 2>/dev/null || stat -c%s "$tmp")"))"
  echo "local  : $h2  ($(human "$(stat -f%z "$2" 2>/dev/null || stat -c%s "$2")"))"
  if [ "$h1" = "$h2" ]; then
    echo "-> IDENTICAL. The platform does no processing; your encode is the only lossy step."
  else
    echo "-> different. The platform re-encodes; compare quality before assuming yours is worse."
  fi
  rm -f "$tmp"
}

cmd_encode() {
  local src="$1" out="$2" prefix="${3:-clip}"
  mkdir -p "$out" "$out/../posters"
  local i=1 fail=0
  shopt -s nullglob
  for f in "$src"/*.mp4 "$src"/*.mov "$src"/*.MOV "$src"/*.MP4; do
    local dst="$out/${prefix}-${i}.mp4"
    ffmpeg -y -loglevel error -i "$f" \
      -vf "scale='min(${MAXW},iw)':-2" \
      -c:v libx264 -crf "$CRF" -preset "$PRESET" -profile:v high -pix_fmt yuv420p \
      -x264-params "chroma-qp-offset=-2" \
      -movflags +faststart -an "$dst"
    # poster: what viewers see while the clip loads — do not cheap out
    ffmpeg -y -loglevel error -ss 0.5 -i "$dst" -frames:v 1 -q:v 2 \
      "$out/../posters/${prefix}-${i}.jpg"
    echo "--- $(basename "$f") -> $(basename "$dst") ---"
    cmd_compare "$f" "$dst" || fail=1
    i=$((i+1))
  done
  echo
  echo "color metadata on output (must be tagged, or browsers guess BT.601):"
  ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height,color_range,color_space,color_transfer,color_primaries \
    -of default=noprint_wrappers=1 "$out/${prefix}-1.mp4" | sed 's/^/  /'
  [ "$fail" -eq 0 ] && echo && echo "All clips retained >= $(python3 -c "print(f'{float('$MIN_RATIO')*100:.0f}')")% peak saturation." \
    || { echo; echo "One or more clips lost too much color. Retry with CRF=$((CRF-2))."; return 1; }
}

case "${1:-}" in
  encode)  shift; cmd_encode "$@" ;;
  check)   shift; cmd_check "$@" ;;
  compare) shift; cmd_compare "$@" ;;
  served)  shift; cmd_served "$@" ;;
  *) sed -n '3,20p' "$0" | sed 's|^# \{0,1\}||'; exit 1 ;;
esac
