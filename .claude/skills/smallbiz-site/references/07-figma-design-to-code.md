# Track B — Figma design → code

Two ways into this workflow:

| | Source of truth | Use when |
|---|---|---|
| **Track A** | a live published site | no Figma file, or you're rebuilding someone's existing site |
| **Track B** | a Figma design file | a designer laid it out properly — **prefer this** |

Track B usually produces a better result, and the reason is structural: a real Figma file carries
**variables, components and constraints**. You get a designed token system rather than whatever
values a builder happened to compile out. Cloning a rendered page recovers the *output*; reading
the design file recovers the *intent*.

## Mandatory prerequisite

**Load the `figma-design-to-code` skill before calling `get_design_context`.** This is not
optional and not a formality — skipping it produces code that ignores the target project's
existing components, tokens and conventions.

```
/figma-design-to-code
```

If the slash command isn't available, read the MCP resource
`skill://figma/figma-design-to-code/SKILL.md`.

Pass `skillNames: "figma-design-to-code"` on the call (prefix with `resource:` if you loaded it
as a resource). It's logging only, but the skill asks for it.

## Tool support by file type

Getting this wrong wastes calls. The `/make/`, `/design/`, `/board/` and `/slides/` path segment
in the URL is what decides it.

| Tool | `/design/` | `/make/` | Gives you |
|---|---|---|---|
| `get_design_context` | ✅ | ✅ (`nodeId: "0:1"`) | reference code + screenshot + hints |
| `get_variable_defs` | ✅ | ❌ | **design tokens** — the highest-value call |
| `get_metadata` | ✅ | ❌ | node tree: ids, names, positions, sizes |
| `get_screenshot` | ✅ | ❌ | visual check |
| `search_design_system` | ✅ | — | components/variables/styles across libraries |

Both Figma Make and Figma Sites publish to `*.figma.site`, so the published URL never tells you
which product built it. The *editor* URL does.

## Sequence

1. **Get a node-specific URL.** `?node-id=1-2` → `fileKey` from the path, `nodeId` `1:2`. A
   file-only URL has no node — ask for one rather than guessing. (Exception: a Make file, where
   `get_design_context` takes `0:1`.)
2. **`get_metadata` first on a large file** to orient and pick a node. Don't dump the whole page.
3. **`get_variable_defs` on the top frame.** This is the payoff — real tokens like
   `{'color/surface/default': '#c8d5c8'}` map straight into the Tailwind `@theme` block. Do this
   *before* writing components so nothing gets hardcoded.
4. **`get_design_context` per section.** One call returns reference code, a screenshot and hints.
5. **Adapt, don't paste.** The output is React + Tailwind *reference*. Match the target project's
   stack and reuse its existing components and tokens.
6. **Honor hints by priority** — earlier overrides later:
   Code Connect snippet → component docs → design annotations → design tokens → raw hex.
7. **Download every asset.** Exported asset URLs **expire in about 7 days**, so committed code
   must reference downloaded bytes, never the remote URL. Preserve the outer box and inner leaf
   dimensions separately; don't apply one global size to unlike assets.

## How this joins the main workflow

Track B replaces Phase 1 only. Everything downstream is unchanged:

```
Track A  live site  → DOM extraction  ┐
                                      ├→ 2 media → 3 build → 4 verify → 5 forms+SEO → 6 audit → 7 deploy
Track B  Figma file → MCP + tokens    ┘
```

**Phase 0 still applies.** Even with a Figma file, `curl` the client's current site first — the
crawlability and lead-capture diagnosis is what justifies the whole project.

**Phase 4 changes shape.** There's no live page to diff section heights against, so verify
against the Figma frames instead: `get_screenshot` per section, compare to the built page, and
check the rendered values against `get_variable_defs` output. Tokens are the objective check —
a color that doesn't appear in the variable list is a bug.

## Figma Make: what `get_design_context` actually returns

On a `/make/` file it does **not** return inline code. It returns **resource links to the entire
source tree** — `App.tsx`, `styles/theme.css`, `package.json`, every shadcn/ui component, and
every bundled image — with the note "Start with App.tsx."

Reading those links needs an MCP client that supports the **resources API**. Some clients don't:
`ListMcpResourcesTool` returns nothing and reads fail with *"server does not support
resources."* Check before planning around it.

`forceCode: true` will inline the code instead, but on a Make file that means the whole
shadcn/ui set — 60+ files. Reach for it only on a small project.

**Fallback when links aren't readable:** the published site serves its compiled stylesheet at
`/_components/v2/<hash>.css`. Every authored token is in it:

```bash
curl -s https://NAME.figma.site/_components/v2/<hash>.css |
  grep -oE ':root\{[^}]*\}' | head -1 | tr ',' '\n' |
  grep -oE '\-\-[a-z-]+:\s*#[0-9a-fA-F]+' | sort -u
```

This recovers the **authored** palette, including tokens the rendered page never exercises. On
the example project it surfaced `--destructive: #c0392b`, which a DOM-only extraction had missed
because no error state was on screen — a stock Tailwind red had been substituted for it.

Two things this fallback does that DOM extraction can't:

- **Unused tokens.** Anything the design system defines but the page doesn't currently render.
- **Other themes.** shadcn ships a `.dark` block; the compiled CSS carries it even when the live
  site only ever uses light.

## The reverse direction

To push a built page *back* into Figma — handing a designer something to iterate on, or keeping
a file in sync with shipped code — that's `use_figma`, gated behind the `figma-use` and
`figma-generate-design` skills. Different direction, different skill; don't improvise it.
