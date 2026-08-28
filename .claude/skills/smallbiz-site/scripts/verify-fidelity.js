/**
 * verify-fidelity.js — prove the rebuild matches the original.
 *
 * Evaluate in BOTH pages at an IDENTICAL viewport, then diff the JSON.
 * Comparing a 500px pane against a 1280px one yields a 2x discrepancy and
 * hours of confusion, so set the viewport explicitly on both.
 *
 *   1. set viewport to 1280x720 on both tabs
 *   2. await settle()  (from extract-design.js)
 *   3. fidelity()
 *
 * Reading a diff:
 *   within ~2px          → correct
 *   one section off      → a layout rule in that section; drill into details()
 *   everything off       → different viewport. Re-check before debugging.
 */

async function fidelity(sectionIds) {
  // settle first: lazy images and IntersectionObserver reveals change height
  for (let y = 0; y < document.body.scrollHeight; y += 400) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 40));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
  await new Promise((r) => setTimeout(r, 900));

  const ids = sectionIds || [...document.querySelectorAll("section[id]")].map((s) => s.id);
  const sections = {};
  for (const id of ids) {
    const el = document.querySelector("#" + id);
    if (el) sections[id] = Math.round(el.getBoundingClientRect().height);
  }

  const h1 = document.querySelector("h1");
  const body = [...document.querySelectorAll("p")]
    .find((p) => p.textContent.trim().length > 80);
  const ff = (el) => (el ? getComputedStyle(el).fontFamily.split(",")[0] : null);

  return {
    viewport: window.innerWidth,
    pageHeight: document.body.scrollHeight,
    sections,
    type: {
      h1Family: ff(h1),
      h1Size: h1 && getComputedStyle(h1).fontSize,
      h1Weight: h1 && getComputedStyle(h1).fontWeight,
      h1Spacing: h1 && getComputedStyle(h1).letterSpacing,
      bodyFamily: ff(body),
      bodySize: body && getComputedStyle(body).fontSize,
      bodyLineHeight: body && getComputedStyle(body).lineHeight,
    },
    background: getComputedStyle(document.body).backgroundColor,
    images: {
      total: document.images.length,
      broken: [...document.images]
        .filter((i) => i.naturalWidth === 0)
        .map((i) => i.getAttribute("src")),
    },
  };
}

/** Drill into one section when its height doesn't match. */
function details(sectionSel) {
  const root = document.querySelector(sectionSel);
  if (!root) return "not found";
  const grid = root.querySelector('[class*="grid"]');
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  };
  return {
    section: box(root),
    grid: grid ? { ...box(grid), cols: getComputedStyle(grid).gridTemplateColumns } : null,
    // fixed-vs-stretched children is the usual culprit
    children: [...root.children].map((c) => ({
      tag: c.tagName.toLowerCase(),
      cls: (typeof c.className === "string" ? c.className : "").slice(0, 70),
      ...box(c),
    })),
    firstImage: root.querySelector("img") ? box(root.querySelector("img")) : null,
    buttons: [...root.querySelectorAll("button")].slice(0, 3).map(box),
  };
}
