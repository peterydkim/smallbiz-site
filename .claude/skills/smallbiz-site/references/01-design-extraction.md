# Design extraction from a live site

## Why read the DOM instead of exporting

No-code builders often can't export usefully:

| Platform | Code export? | Notes |
|---|---|---|
| Figma **Make** | Yes — zip from the code view | Plugins do **not** run in Make files |
| Figma **Sites** / classic design | No HTML export | MCP `get_design_context` works on `/design/` only |
| Wix / Squarespace | No | DOM extraction only |
| Webflow | Yes (paid tier) | Export is usually clean |
| Framer | No | DOM extraction only |

Even when an export exists, reading the published DOM is often *faster* and gives you something
an export can't: the **resolved** values — computed fonts, final token values, real geometry.

Note that Figma Make and Figma Sites both publish to `*.figma.site`, so the domain does not tell
you which one you have. Check the HTML comment:

```bash
curl -s https://NAME.figma.site/ | head -3     # "<!-- Created in Figma Make -->"
```

## What to pull, in order

### 1. Design tokens

Most builders emit CSS custom properties on `:root`. This gives you the exact palette rather
than colors sampled from a screenshot:

```js
const cs = getComputedStyle(document.documentElement);
['--background','--foreground','--secondary','--card','--accent','--muted','--border']
  .map(v => [v, cs.getPropertyValue(v).trim()]).filter(([,x]) => x);
```

### 2. Real typography

The class list won't tell you the font — a global rule often applies it. Read computed styles
off actual headings and body text:

```js
const h1 = document.querySelector('h1'), s = getComputedStyle(h1);
({ ff: s.fontFamily, size: s.fontSize, weight: s.fontWeight, ls: s.letterSpacing });
```

Watch for a **display font applied by weight rather than by tag.** A common pattern: every
900-weight element uses a condensed face. That reproduces as one CSS rule, not fifty classes:

```css
h1, h2, h3, h4, h5, h6, .font-black { font-family: var(--font-display); }
```

### 3. Class-annotated structure

`scripts/extract-design.js` walks a subtree and prints tag + class + own text. Since the target
is usually Tailwind, the output is close to copy-paste ready.

Go section by section (`#services`, `#projects`, …). Dumping the whole page at depth 8 produces
unreadable output and burns context.

### 4. Content hidden behind interaction

Carousels and tab strips only render the active item's copy. Click through and harvest:

```js
const out = [];
for (const btn of root.querySelectorAll('button')) {
  btn.click();
  await new Promise(r => setTimeout(r, 220));   // let the transition settle
  out.push(root.querySelector('.caption')?.innerText);
}
```

### 5. Inline styles that classes don't cover

Builders frequently set critical sizing inline. Always check:

```js
el.getAttribute('style')     // e.g. "aspect-ratio: 16 / 7; max-height: 480px;"
```

Missing one of these is a top cause of "close but subtly wrong".

## Traps

**Screenshots go stale.** If the browser pane is hidden or unresponsive, screenshot tools can
return a blank or old frame while the DOM is perfectly fine. Verify with `get_page_text` or
computed styles before you go debugging a layout bug that doesn't exist.

**Smooth scrolling races your capture.** `html { scroll-behavior: smooth }` means a screenshot
right after `scrollTo` catches the old position. Use `behavior:'instant'` and wait.

**Lazy images read as broken.** An `<img>` below the fold has `naturalWidth === 0` and an empty
`currentSrc`. Scroll the whole page first, then check. Don't file a bug against the optimizer.

**Verify arbitrary utility classes actually compile.** Copying `duration-280` from another
project's markup produces nothing if your Tailwind build doesn't generate that value — the
transition silently never runs:

```bash
find .next -name "*.css" | xargs grep -l "280ms" || echo "class is a no-op"
```

**macOS screenshot filenames contain U+202F**, a narrow no-break space before AM/PM. A literal
`cp "Screenshot 2026-08-05 at 4.18.16 PM.png"` fails with "No such file". Glob instead:

```bash
cp Screenshot*4.18.16*.png dest.png
```
