# Asset pipeline

## Check before you compress

Some platforms serve uploads **completely untouched**. Re-encoding then only degrades:

```bash
curl -sS "$SERVED_URL" -o /tmp/served.mp4
md5 -q /tmp/served.mp4 "$LOCAL_ORIGINAL"
# identical hashes → the platform did no processing; your encode is the only lossy step
```

Prefer the owner's **original camera files** over re-downloading a platform's CDN copies —
they're higher resolution and haven't been through someone else's encoder. Match them by
filename stem; builders usually keep it (`20181102_141538.jpg` → `20181102_141538.942979f9.jpg`).

## Video: the saturation trap

**Average saturation is a liar.** At high CRF, H.264 spends its bits on luma and quantizes
chroma hard. The result: mean brightness and mean saturation barely move, while *peak*
saturation collapses. Grey walls look identical; anything actually colorful goes flat. Viewers
describe it as "washed out" and you'll find nothing wrong in the averages.

A real measurement from this repo's example project:

| | source | CRF 28 / 720p | CRF 20 / 1080p |
|---|---|---|---|
| YAVG (brightness) | 40.97 | 41.02 | 40.99 |
| SATAVG (mean sat) | 0.51 | 0.49 | 0.51 |
| **SATMAX (peak sat)** | **49.92** | **33.60** ✗ | **47.47** ✓ |
| size | 4.9 MB | 0.3 MB | 1.6 MB |

CRF 28 looks fine by every average and is visibly wrong on screen.

### Measure it

```bash
ffprobe -v error -f lavfi -i "movie='FILE',signalstats" \
  -show_entries frame_tags -read_intervals "%+3" -of json
```

Average `lavfi.signalstats.SATMAX` across frames and compare to the source. **Target ≥ 90% of
source SATMAX.**

### Settings that work

```bash
ffmpeg -y -i in.mp4 \
  -vf "scale='min(1920,iw)':-2" \
  -c:v libx264 -crf 20 -preset slow -profile:v high -pix_fmt yuv420p \
  -x264-params "chroma-qp-offset=-2" \
  -movflags +faststart -an \
  out.mp4
```

- **`-crf 20`** — 28 is for screencasts, not client footage.
- **`chroma-qp-offset=-2`** — negative gives chroma *more* bits. This is the single highest-value flag here.
- **Keep native resolution.** A 720p file in a full-width band is soft on any 2× display.
- **`-an`** — background video is muted; audio is pure waste.
- **`+faststart`** — moves the index to the front so playback starts before full download.
- Always confirm `color_space` / `color_transfer` / `color_primaries` survive:

```bash
ffprobe -v error -select_streams v:0 \
  -show_entries stream=color_range,color_space,color_transfer,color_primaries \
  -of default=noprint_wrappers=1 out.mp4
```

Untagged output makes browsers guess BT.601, which shifts color on its own.

### Posters

Generate one per clip and reference it with `poster=`. It's what viewers see while a clip loads,
so don't cheap out — `-q:v 2`, not `-q:v 6`.

```bash
ffmpeg -y -ss 0.5 -i out.mp4 -frames:v 1 -q:v 2 poster.jpg
```

### Loading strategy

Only the visible clip should load: `preload="auto"` on the first, `preload="metadata"` on the
rest. Seven 1080p clips can sit on disk at 23 MB while first view costs 1.6 MB.

## Images

Serve through `next/image` and let it emit AVIF/WebP. **Next's default quality of 75 is too low
for photography** — a portfolio shot at 1200px lands around 56 KB and looks soft. Use 88.

Next 16 requires declaring allowed values:

```ts
// next.config.ts
images: { qualities: [75, 88], formats: ["image/avif", "image/webp"] }
```

```tsx
<Image src={p.img} alt={p.alt} width={1600} height={1200}
       sizes="(max-width: 1024px) 100vw, 70vw" quality={88} />
```

Give the first above-the-fold image `priority`. Everything else lazy-loads by default.

A 3.9 MB / 5712×4284 camera original becoming a 94 KB AVIF is normal and correct — do not
pre-shrink originals before handing them to the optimizer.
