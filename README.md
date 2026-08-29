# smallbiz-site

**An agent workflow where the agent's output isn't trusted.**

Every phase ends in a numeric check, and a mandatory audit gate blocks claims that can't be
substantiated. It's built for taking a small business from a no-code design to a live,
indexable, lead-capturing website — but the reason it exists is the checks.

---

## Why: the averages lied

I compressed a client's showcase footage. 328 MB down to 4.8 MB. Every metric said it was fine.

```
                   YAVG (brightness)   SATAVG (mean saturation)
source                        40.97                       0.51
my encode                     41.02                       0.49
```

The client said the color looked washed out. He was right and every average I had was wrong:

```
                   SATMAX (peak saturation)
source                              49.92
my encode                           33.60   ← a third of the color, gone
```

H.264 spends its bits on luma and quantizes chroma hard. The grey walls came through identically;
anything actually colorful went flat. **No average could see it**, because the mean of a mostly
grey frame barely moves when its few saturated pixels collapse.

Then it got worse. I'd assumed the hosting platform was compressing the source and had been
optimizing to match it. An md5 said otherwise:

```
served by the platform   10108e83aa4adb73fea19b46d8605e19
the original file        10108e83aa4adb73fea19b46d8605e19
```

Byte-identical. There was no compression to match. I'd optimized against a target I had imagined.

Both mistakes are now automated checks. `optimize-media.sh` measures `SATMAX` and **fails below
90% retention**. Phase 0 md5s the served file before anyone compresses anything.

That's the whole thesis: **plausible-looking output is the failure mode, and the fix is a check
that can fail.**

---

## What that looks like across the workflow

| Phase | The check that can fail |
|---|---|
| 0 Diagnose | `curl \| wc -c` — how much HTML does a crawler actually receive? |
| 1 Extract | read design tokens from source, never sample colors from a screenshot |
| 2 Media | `SATMAX` ≥ 90% of source, or the encode is rejected |
| 4 Verify | section heights diffed against the original at a fixed viewport |
| 5 Forms | a real submission must land in a real inbox — tested, not assumed |
| 6 Audit | every verifiable claim surfaced for the owner to confirm |

Phase 6 is the one people skip. On the example project it caught a contractor **license number
that was sequential filler carrying a Florida prefix — on a Maryland/Virginia/DC business.** That
is a regulatory exposure, not a typo, and no test suite would ever have found it.

---

## The worked example

A general contractor's site, ported from Figma Make to Next.js on Netlify:

| | before | after |
|---|---|---|
| HTML a crawler receives | 5,074 bytes, **zero body copy** | 141,264 bytes, fully indexable |
| Indexable | `noindex` | indexed, with `GeneralContractor` schema |
| Meta description | boilerplate about *converting PDFs to vector layers* | written for the business |
| Contact form | `preventDefault()`, lead discarded | Netlify Forms, delivery verified |
| Showcase video | 328 MB of source | 23 MB at 95% of source peak saturation |
| Design fidelity | — | **1px** across an 8,749px page |

Fidelity was verified numerically, not by eye — section heights at a fixed 1280px viewport:

```
                original    rebuild
services            728        728
projects           3717       3717
process             525        525
about               834        834
testimonials        802        802
contact             856        856
full page          8749       8748
```

Projects was initially off by 252px. Measuring localized it in one command; the original kept a
320px sidebar even for its single-project category, and used fixed 140×100 thumbnails rather than
stretched ones. Two class changes. **No amount of squinting at screenshots finds 252px in 8,749.**

Full write-up including the mistakes: [`docs/CASE-STUDY.md`](docs/CASE-STUDY.md).

---

## Honest scope

This is **one worked example**, not a battle-tested framework. The workflow generalizes from a
single project, and it's shaped by that project's stack: Next.js, Tailwind, Netlify, a
single-page marketing site for a local service business.

**Not built for:** e-commerce, booking systems, multi-tenant apps, CMS integration.

What I claim is transferable is the method — measure, don't eyeball — and the specific traps
documented in the references, each of which cost me real time to find.

---

## Quickstart

Requires [Claude Code](https://claude.com/claude-code). Works in the terminal, the desktop app,
and on the web at [claude.ai/code](https://claude.ai/code). The media scripts need `ffmpeg`
wherever they run.

```bash
git clone https://github.com/YOURNAME/smallbiz-site.git
cd smallbiz-site
claude
```

Then describe the job:

```
Take https://theirsite.example/ and rebuild it as a real site on Netlify.
Their photos are in ~/Desktop/ClientName/.
```

The `smallbiz-site` skill loads automatically. Or invoke a piece directly:

```
/smallbiz-site
Use the site-cloner agent on https://theirsite.example/
Use the figma-implementer agent on <figma-url?node-id=1-2>
Use the launch-auditor agent before I point the domain
```

---

## The workflow

```
                  ┌ 1a  live site  → DOM extraction ┐
0 diagnose  →─────┤                                 ├→ 2 media → 3 build → 4 verify
                  └ 1b  Figma file → MCP + tokens   ┘                          ↓
                            7 deploy  ←  6 punch list  ←  5 forms + SEO  ←─────┘
```

**Two entry paths.** A real Figma file read over MCP recovers the designer's *intent* — variables,
components, constraints. DOM extraction recovers only what's *rendered*. On the example project
that distinction was concrete: the DOM had no error state on screen, so a `--destructive` token
went missing and a stock Tailwind red got substituted for it. Reading the source caught it.

**Phase 0 is not optional.** It changes what "done" means:

```bash
curl -s https://TARGET/ | wc -c                      # 5KB means no real content
curl -s https://TARGET/ | grep -c "A_REAL_PHRASE"    # 0 means invisible to Google
curl -s https://TARGET/ | head -5                    # the generator, often in a comment
```

---

## What's in here

```
.claude/
├── skills/smallbiz-site/
│   ├── SKILL.md                        the 8-phase workflow
│   ├── references/
│   │   ├── 01-design-extraction.md     reading a design out of a live DOM
│   │   ├── 02-asset-pipeline.md        compression that keeps color
│   │   ├── 03-site-architecture.md     Next.js layout + fidelity verification
│   │   ├── 04-forms-and-seo.md         Netlify Forms, schema, crawlability
│   │   ├── 05-deploy-netlify.md        deploy routes, DNS, launch-day checks
│   │   ├── 06-launch-punchlist.md      the trust-claims audit
│   │   └── 07-figma-design-to-code.md  Figma MCP, tokens, gotchas
│   └── scripts/
│       ├── extract-design.js           tokens, typography, structure, geometry
│       ├── verify-fidelity.js          numeric original-vs-rebuild diff
│       └── optimize-media.sh           encode + measure peak saturation
└── agents/
    ├── site-cloner.md                  Track A — extract from a live URL
    ├── figma-implementer.md            Track B — Figma file to tokens + spec
    └── launch-auditor.md               read-only pre-launch audit

src/, public/                           the worked example
```

---

## Contributing

Issues and PRs welcome. The bar for a new reference entry is the same as the existing ones: it
must be something you can **verify with a command**, not general advice.

## License

MIT — see [LICENSE](LICENSE).
