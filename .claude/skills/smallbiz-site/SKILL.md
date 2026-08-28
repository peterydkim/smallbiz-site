---
name: smallbiz-site
description: Build, verify and launch a production website for a small local business — typically porting a no-code design (Figma Make/Sites, Wix, Squarespace, Webflow) into a real codebase on Netlify. Use when someone wants to take a designed-but-not-real site live, rebuild an existing site as code, get a local business indexable on Google, wire up a contact form that actually captures leads, or audit a business site before launch. Covers design extraction from a live URL, numeric fidelity verification, media compression that does not wreck color, Netlify Forms, local SEO schema, and a trust-claims punch list.
---

# Small-business site: design → live

A local business site has exactly two jobs: **be findable on Google**, and **capture a lead**.
Most no-code exports fail both — they ship a JavaScript shell with no crawlable copy, and a
contact form that discards submissions. Everything here is organized around fixing that.

## The one rule

**Measure, don't eyeball.** Every claim in this workflow is verifiable with a command:
raw HTML bytes, section heights in pixels, peak saturation, md5 of a served file. Screenshots
lie, and "looks about right" is how a fake license number reaches production.

## Phase 0 — Find out what you're actually dealing with

Before planning anything, run these. They routinely overturn the obvious plan.

```bash
# 1. What does a crawler see? (No JS. This is the single most useful diagnostic.)
curl -s https://TARGET/ | wc -c
curl -s https://TARGET/ | grep -c "SOME_DISTINCTIVE_BODY_PHRASE"

# 2. What built it? The generator often sits in an HTML comment.
curl -s https://TARGET/ | head -5
curl -s https://TARGET/ | grep -io "figma\|webflow\|wix\|squarespace\|framer" | sort -u

# 3. Is it deliberately hidden from Google?
curl -s https://TARGET/ | grep -o 'name="robots" content="[^"]*"'
```

A result like *5KB of HTML, zero body copy, `noindex`* means the current site is invisible to
search regardless of how good it looks. That fact drives the whole recommendation.

Then check the local surroundings — planning docs and original assets usually live **outside**
the repo, and missing them causes rework:

```bash
find ~/Desktop ~/Documents ~/Downloads -iname "*CLIENTNAME*" -maxdepth 4 2>/dev/null
```

→ Full detail: `references/01-design-extraction.md`

## Phase 1 — Extract the design from the live site

If the target renders with Tailwind (most modern no-code builders do), **do not rebuild by eye
from screenshots.** Read the real class names, tokens and geometry out of the live DOM. It is
faster and dramatically more accurate.

Use `scripts/extract-design.js` — it dumps a class-annotated outline, the resolved CSS custom
properties, computed typography, and per-section geometry.

Screenshots are for sanity checks only. When a browser pane is hidden or unresponsive,
screenshots silently return stale frames — trust `get_page_text` and computed styles instead.

→ `references/01-design-extraction.md`

## Phase 2 — Collect and compress media

**Check whether the source is already optimized before you optimize it.** Some platforms serve
uploads byte-for-byte untouched; re-encoding then makes things strictly worse.

```bash
curl -sS "$SERVED_URL" -o /tmp/served.mp4
md5 -q /tmp/served.mp4 "$LOCAL_ORIGINAL"     # identical? the platform did nothing
```

Video compression has one trap that costs you the look of the site: **average saturation stays
flat while peak saturation collapses.** Measure `SATMAX`, not `SATAVG`.

→ `references/02-asset-pipeline.md`, `scripts/optimize-media.sh`

## Phase 3 — Build it

Next.js App Router, statically prerendered, all copy in a single `src/content/site.ts`.
The content file is not a nicety — it's what lets the owner change prices and phone numbers
later without touching components.

→ `references/03-site-architecture.md`

## Phase 4 — Verify fidelity numerically

Load the original and the rebuild at an identical viewport and compare section heights.
Matching within a pixel or two means it's right; a 250px delta means a layout rule is wrong
and points you straight at the section.

Use `scripts/verify-fidelity.js` in both pages, then diff.

→ `references/03-site-architecture.md`

## Phase 5 — Forms and SEO

The form is the point of the site. A no-code export's form is almost always a prop that calls
`preventDefault()` and throws the lead away. Wire it to Netlify Forms and **prove one real
submission arrives** before telling anyone the site is up.

→ `references/04-forms-and-seo.md`

## Phase 6 — Launch punch list

Before a real domain points at it, audit the *claims*, not just the code. Small-business sites
routinely ship placeholder license numbers, unverified awards and invented statistics that a
regulator or customer can hold the owner to.

**This is the highest-value and most-skipped step in the whole workflow.**

→ `references/06-launch-punchlist.md`

## Phase 7 — Deploy and point the domain

→ `references/05-deploy-netlify.md`

## Specialized agents

Spawn these only when the user asks, or when the phase genuinely warrants a focused pass:

- `site-cloner` — Phase 1–2, design and asset extraction from a live URL
- `launch-auditor` — Phase 6, the trust-claims and SEO audit (read-only)

## Order of operations that actually works

```
0 diagnose  →  1 extract  →  2 media  →  3 build  →  4 verify
                                                       ↓
                       7 deploy  ←  6 punch list  ←  5 forms + SEO
```

Do not skip 0. The diagnosis changes what "done" means — a site that already serves good HTML
and captures leads may need nothing but a domain.
