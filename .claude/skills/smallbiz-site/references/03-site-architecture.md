# Site architecture

## Stack

Next.js App Router, statically prerendered, Tailwind v4, TypeScript. A marketing site for a
local business is a handful of sections and a form — the whole page should come out `○ Static`.

Confirm it in the build output. Anything marked dynamic means something needs fixing:

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /robots.txt
└ ○ /sitemap.xml
○  (Static)  prerendered as static content
```

## All copy in one file

`src/content/site.ts` exports every string, image path, list item and testimonial. Components
import from it and contain no literal copy.

This matters more than it looks. The owner will want to change a phone number, add a service, or
swap a photo three weeks after launch. If that means editing JSX, it means calling you. If it
means editing one obvious file, they can do it — or an agent can, safely, without touching layout.

Mark unverified claims right where they live so they can't quietly ship:

```ts
// TODO(owner): CGC#1234567 is placeholder filler, and "CGC" is a Florida
// prefix. Replace with real MD/VA/DC numbers before the domain points here.
body: "CGC#1234567 · $2M liability coverage",
```

## Tailwind v4 tokens

Put the extracted palette in `@theme` so utilities generate from it:

```css
@import "tailwindcss";

@theme {
  --color-background: #c8d5c8;
  --color-foreground: #141a14;
  --color-accent:     #2a5c2a;
  --font-sans:    var(--font-body), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-display-face), sans-serif;
}
```

If the design applies a display face by weight rather than by tag, encode that as one rule
instead of scattering classes:

```css
h1, h2, h3, h4, h5, h6, .font-black { font-family: var(--font-display); }
```

## Fidelity verification

Load original and rebuild at an **identical viewport** and compare section heights.

```js
// scripts/verify-fidelity.js — run in both, diff the output
['services','projects','process','about','testimonials','contact']
  .map(id => [id, Math.round(document.querySelector('#'+id).getBoundingClientRect().height)]);
```

Scroll the full page first so lazy content and reveal animations have settled, then measure.

Reading the results:

- **within ~2px** — correct.
- **one section off by 50–300px** — a specific layout rule is wrong. Drill into that section's
  child geometry (element widths, grid template columns, fixed vs stretched children).
- **everything off proportionally** — different viewport. Re-check before debugging anything.

A worked example: Projects came out +252px. Measuring per-category showed the original kept its
`lg:grid-cols-[1fr_320px]` sidebar even for a single-project category, and its thumbnails were a
fixed 140×100 rather than stretched to fill the column. Two class changes, exact match.

> Measure at a real desktop width (1280 is a good default) and set it explicitly on **both**
> pages. Comparing a 500px-wide pane against a 1280px one produces a 2× discrepancy and hours of
> confusion.

## Scroll reveals

One `<Reveal>` component wrapping sections, using `IntersectionObserver` with `once` semantics.
Fall back to visible when the observer is unavailable so content is never permanently hidden:

```tsx
if (typeof IntersectionObserver === "undefined") { setShown(true); return; }
```

Respect `prefers-reduced-motion` globally rather than per component.
