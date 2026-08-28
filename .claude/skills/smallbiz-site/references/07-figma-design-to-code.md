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

## The reverse direction

To push a built page *back* into Figma — handing a designer something to iterate on, or keeping
a file in sync with shipped code — that's `use_figma`, gated behind the `figma-use` and
`figma-generate-design` skills. Different direction, different skill; don't improvise it.
