/**
 * extract-design.js — pull a design out of a live page.
 *
 * Not a Node script. Evaluate these in the page context of the site you're
 * cloning: a browser console, or any agent tool that runs JS in a tab
 * (Claude Code's `javascript_tool`, Playwright's `page.evaluate`, CDP
 * `Runtime.evaluate`). Each function returns plain JSON.
 *
 * Order: tokens() → typography() → outline(section) → geometry() → carousel()
 */

/** Resolved CSS custom properties. The real palette, not screenshot guesses. */
function tokens(names) {
  const cs = getComputedStyle(document.documentElement);
  const want = names || [
    "--background", "--foreground", "--secondary", "--card", "--muted",
    "--accent", "--accent-foreground", "--border", "--radius",
    "--font-sans", "--font-serif", "--font-mono",
  ];
  const out = {};
  for (const n of want) {
    const v = cs.getPropertyValue(n).trim();
    if (v) out[n] = v;
  }
  // Fall back to scraping :root blocks when nothing is exposed.
  if (!Object.keys(out).length) {
    for (const s of document.querySelectorAll("style")) {
      const m = s.textContent.match(/:root[^{]*\{[^}]*\}/g);
      if (m) out.__rootCss = (out.__rootCss || "") + m.join("\n");
    }
  }
  return out;
}

/** Computed type for headings + body. Catches fonts applied by global rule. */
function typography() {
  const pick = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      text: el.textContent.trim().slice(0, 40),
      family: s.fontFamily.split(",")[0],
      size: s.fontSize, weight: s.fontWeight,
      spacing: s.letterSpacing, height: s.lineHeight,
      transform: s.textTransform, color: s.color,
    };
  };
  const body = [...document.querySelectorAll("p")]
    .find((p) => p.textContent.trim().length > 80);
  return {
    h1: pick(document.querySelector("h1")),
    h2: pick(document.querySelector("h2")),
    h3: pick(document.querySelector("h3")),
    body: pick(body),
    families: [...new Set(
      [...document.querySelectorAll("h1,h2,h3,p,a,span,button,li,label")]
        .map((e) => getComputedStyle(e).fontFamily)
    )],
  };
}

/**
 * Class-annotated structure. On a Tailwind target this is close to
 * copy-paste ready. Go one section at a time — a whole-page dump at
 * depth 8 is unreadable and burns context.
 */
function outline(root, maxDepth = 6, textLen = 70) {
  if (typeof root === "string") root = document.querySelector(root);
  if (!root) return "not found";
  const skip = ["script", "style", "svg", "path", "defs", "noscript"];
  const lines = [];
  (function walk(el, d) {
    if (d > maxDepth) return;
    const tag = el.tagName.toLowerCase();
    if (skip.includes(tag)) return;
    const cls = (typeof el.className === "string" ? el.className : "").trim();
    const own = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim()).filter(Boolean)
      .join(" ").slice(0, textLen);
    // Inline styles carry critical sizing builders don't express as classes.
    const style = el.getAttribute && el.getAttribute("style");
    let attrs = "";
    if (["input", "textarea", "select"].includes(tag)) {
      attrs = ` [${el.type || tag}${el.placeholder ? ` ph="${el.placeholder}"` : ""}` +
              `${el.required ? " required" : ""}]`;
    }
    lines.push(
      "  ".repeat(d) + "<" + tag + attrs +
      (cls ? ` class="${cls}"` : "") +
      (style ? ` style="${style}"` : "") +
      ">" + (own ? " » " + own : "")
    );
    [...el.children].forEach((c) => walk(c, d + 1));
  })(root, 0);
  return lines.join("\n");
}

/** Section heights for fidelity comparison. Run at an explicit viewport. */
function geometry(ids) {
  const out = { viewport: window.innerWidth, pageHeight: document.body.scrollHeight };
  const list = ids || [...document.querySelectorAll("section[id]")].map((s) => s.id);
  out.sections = {};
  for (const id of list) {
    const el = document.querySelector("#" + id);
    if (el) out.sections[id] = Math.round(el.getBoundingClientRect().height);
  }
  return out;
}

/** Harvest copy hidden behind carousels/tabs by clicking through. */
async function carousel(rootSel, captionSel) {
  const root = document.querySelector(rootSel);
  if (!root) return "not found";
  const btns = [...root.querySelectorAll("button")];
  const items = [];
  const read = () => {
    const cap = root.querySelector(captionSel);
    const img = root.querySelector("img");
    return {
      caption: cap ? cap.innerText.split("\n") : null,
      img: img && (img.currentSrc || img.src).split("/").pop(),
    };
  };
  if (!btns.length) return [read()];
  for (const b of btns) {
    b.click();
    await new Promise((r) => setTimeout(r, 220)); // let the transition settle
    items.push(read());
  }
  btns[0].click();
  return items;
}

/** Scroll the whole page so lazy images and reveal animations settle. */
async function settle() {
  for (let y = 0; y < document.body.scrollHeight; y += 400) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 40));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
  await new Promise((r) => setTimeout(r, 800));
  return "settled";
}
