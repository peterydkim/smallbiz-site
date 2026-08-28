# Case study: A+ Construction Services

A general contractor in the DC metro area had a finished design in Figma Make, a domain bought on
Squarespace, and a meeting the next morning. The site was "done" in the sense that it looked
right. It was not done in any sense that mattered to the business.

This is what the workflow found and fixed.

## Phase 0 — the diagnosis that changed the plan

The obvious plan was "export the design, put it on Netlify." Three commands overturned it.

```bash
$ curl -s https://aplusservices.figma.site/ | wc -c
5074
$ curl -s https://aplusservices.figma.site/ | grep -c "Rockville\|Elmer\|Kitchen Remodeling"
0
$ curl -s https://aplusservices.figma.site/ | head -3
<!-- Created in Figma Make -->
```

**Five kilobytes containing none of the site's copy.** No services, no project descriptions, no
testimonials, no phone number — all of it drawn by JavaScript after load. The page also shipped
`<meta name="robots" content="noindex">`, and its description tag was leftover template text
about *"converting PDF documents into editable vector layers."*

For a contractor competing on "kitchen remodel Rockville MD," the site was invisible.

The generator comment mattered too: **Figma Make**, not Figma Sites. Both publish to
`*.figma.site` so the URL doesn't tell you, but the distinction decides everything — Make has a
code export, Figma plugins don't run in Make files, and the MCP design tools only read classic
`/design/` files.

## Phase 1 — reading the design instead of redrawing it

The published site turned out to be Tailwind-based, which meant the real class names, resolved
design tokens and computed typography were all readable from the live DOM:

```js
getComputedStyle(document.documentElement).getPropertyValue('--accent')  // "#2a5c2a"
getComputedStyle(document.querySelector('h1')).fontFamily                // "Barlow Condensed"
```

That gave the exact palette (`#c8d5c8` / `#141a14` / `#2a5c2a`) and type stack rather than colors
sampled from a screenshot.

One pattern was only visible this way: **the display face was applied by weight, not by tag.**
Every 900-weight element — headings, the wordmark, stat figures, process numbers — rendered in
Barlow Condensed. That reproduces as one CSS rule instead of fifty classes:

```css
h1, h2, h3, h4, h5, h6, .font-black { font-family: var(--font-display); }
```

A stale local repo already existed from an earlier attempt. It was black-and-orange (`#ff6b35`)
against the current sage-and-green design, and missing whole sections. Worth checking for, worth
discarding.

## Phase 2 — the compression mistake

The seven showcase clips totalled 328 MB. First encode: CRF 28, downscaled to 720p. 63 MB → 4.8
MB. Every metric looked fine.

The client said the color looked low.

```
                   YAVG    SATAVG    SATMAX
source            40.97      0.51     49.92
CRF 28 / 720p     41.02      0.49     33.60
```

Mean brightness identical. Mean saturation identical. **Peak saturation down a third.** H.264
spends its bits on luma and quantizes chroma hard, so the grey walls looked the same while
anything actually colorful went flat — and no average revealed it.

Worse, the premise was wrong. Checking what the platform actually served:

```bash
$ md5 -q served.mp4 elmer1.mp4
10108e83aa4adb73fea19b46d8605e19
10108e83aa4adb73fea19b46d8605e19
```

**Identical.** Figma served the originals byte-for-byte. There was no compression to match — the
comparison was full-quality footage against a heavy re-encode, and the optimization target had
been imagined.

Re-encoded at CRF 20, native 1920×1080, `chroma-qp-offset=-2`:

```
CRF 20 / 1080p    40.99      0.51     47.47    ← 95% of source, 23MB total
```

Still 3× smaller than what the platform served. This is now enforced in `optimize-media.sh`,
which fails below 90% retention.

## Phase 4 — fidelity, measured

Both pages loaded at 1280×720, section heights compared:

```
                original    rebuild
services            728        728
projects           3717       3969   ← +252
process             525        525
about               834        834
testimonials        802        802
contact             856        856
```

Five exact, one off. The delta pointed straight at Projects, and drilling into per-category
geometry found two things: the original kept its `lg:grid-cols-[1fr_320px]` sidebar **even for
the single-project Bathrooms category**, and its thumbnails were a fixed **140×100** rather than
stretched to fill the column.

Two class changes. Full page: **8748 vs 8749**.

No amount of squinting at screenshots finds a 252px discrepancy in a 8,749px page. Measuring
finds it in one command and localizes it in a second.

## Phase 5 — the form was a prop

```tsx
const handleSubmit = (e) => {
  e.preventDefault();
  setSubmitted(true);      // and the lead is gone
};
```

The single most important function on a lead-generation site, discarding every submission.
Rewired to Netlify Forms with a honeypot and a static `public/__forms.html` detection stub, since
Netlify parses built HTML and App Router client components make that unreliable.

## Phase 6 — the audit that mattered most

The "Why A+" section published:

> **CGC#1234567** · $2M liability coverage · Worker's comp included.

Sequential filler — and `CGC` is a **Florida** license prefix on a Maryland/Virginia/DC
contractor's site. US contractor licensing is per-state: MD uses MHIC, VA uses class A/B/C, DC
uses a Basic Business License. Publishing a fabricated license number is a regulatory exposure,
not a typo.

The same pass flagged a NARI award claim, five unverified statistics, and an internal
contradiction — "EST. 2006" beside "18 years in business," which is 20 in 2026.

None of this is a code defect. All of it is the kind of thing that only surfaces if someone
deliberately re-reads the trust section, which is why it's now its own phase and its own agent.

## Result

| | before | after |
|---|---|---|
| HTML a crawler receives | 5,074 b, zero copy | 141,264 b, fully indexable |
| Indexable | `noindex` | indexed + `GeneralContractor` schema |
| Contact form | discards leads | Netlify Forms, delivery verified |
| Video | 328 MB source | 23 MB at 95% peak saturation |
| Design fidelity | — | 1px across 8,749px |

## What generalized

Four things turned out to be reusable, and they became the backbone of the skill:

1. **`curl | wc -c` before anything else.** The cheapest diagnostic in the workflow and the one
   that most often changes the plan.
2. **Read the DOM, don't redraw the design.** Faster and more accurate than screenshots.
3. **Verify numerically.** Section heights localize a bug in two commands.
4. **Audit the claims, not just the code.** The findings with real consequences were all in the
   copy.
