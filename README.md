# smallbiz-site

An open-source **agent workflow** for taking a small business from a no-code design to a live,
indexable, lead-capturing website.

It exists because no-code exports fail the same two ways every time: they ship a JavaScript
shell with no crawlable copy, and a contact form that silently discards submissions. A local
business site has exactly two jobs — **be findable** and **capture a lead** — and the polished
preview usually does neither.

This repo is both the toolkit and a real site built with it.

---

## The result it produced

A general contractor's site, ported from Figma Make to Next.js on Netlify:

| | before | after |
|---|---|---|
| HTML a crawler receives | 5,074 bytes, **zero body copy** | 141,264 bytes, fully indexable |
| Indexable | `noindex` | indexed, with `GeneralContractor` schema |
| Meta description | boilerplate about *converting PDFs to vector layers* | written for the business |
| Contact form | `preventDefault()`, lead discarded | Netlify Forms, delivery verified |
| Showcase video | 328 MB of source footage | 23 MB, 95% of source peak saturation |
| Design fidelity | — | within **1px** of the original across the full page |

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

Full write-up: [`docs/CASE-STUDY.md`](docs/CASE-STUDY.md).

---

## The one rule

**Measure, don't eyeball.** Every claim here is checkable with a command — raw HTML bytes,
section heights in pixels, peak saturation, the md5 of a served file. Screenshots lie, and
"looks about right" is how a placeholder license number reaches production.

---

## Quickstart

Requires [Claude Code](https://claude.com/claude-code). Works in the terminal, the desktop app,
and on the web at [claude.ai/code](https://claude.ai/code) — no local install needed for the web
route, though the media scripts need `ffmpeg` wherever they run.

```bash
git clone https://github.com/YOURNAME/smallbiz-site.git
cd smallbiz-site
claude
```

Then just describe the job:

```
Take https://theirsite.example/ and rebuild it as a real site on Netlify.
Their photos are in ~/Desktop/ClientName/.
```

The `smallbiz-site` skill loads automatically. To invoke a piece directly:

```
/smallbiz-site
```

Or spawn a focused agent:

```
Use the site-cloner agent on https://theirsite.example/
Use the figma-implementer agent on <figma-url?node-id=1-2>
Use the launch-auditor agent before I point the domain
```

---

## What's in here

```
.claude/
├── skills/smallbiz-site/
│   ├── SKILL.md                        the 8-phase workflow
│   ├── references/
│   │   ├── 01-design-extraction.md     reading a design out of a live DOM
│   │   ├── 02-asset-pipeline.md        video/image compression that keeps color
│   │   ├── 03-site-architecture.md     Next.js layout + fidelity verification
│   │   ├── 04-forms-and-seo.md         Netlify Forms, schema, the crawlability test
│   │   ├── 05-deploy-netlify.md        deploy routes, DNS, launch-day checks
│   │   ├── 06-launch-punchlist.md      the trust-claims audit
│   │   └── 07-figma-design-to-code.md  Track B — Figma MCP, tokens, gotchas
│   └── scripts/
│       ├── extract-design.js           tokens, typography, structure, geometry
│       ├── verify-fidelity.js          numeric original-vs-rebuild diff
│       └── optimize-media.sh           encode + measure peak saturation
└── agents/
    ├── site-cloner.md                  Track A — extract from a live URL
    ├── figma-implementer.md            Track B — Figma file to tokens + spec
    └── launch-auditor.md               read-only pre-launch audit

src/, public/                           the worked example (a real client site)
```

---

## The workflow

```
                  ┌ 1a  live site  → DOM extraction ┐
0 diagnose  →─────┤                                 ├→ 2 media → 3 build → 4 verify
                  └ 1b  Figma file → MCP + tokens   ┘                          ↓
                            7 deploy  ←  6 punch list  ←  5 forms + SEO  ←─────┘
```

**Two entry paths.** If the client has a real Figma file, read it over MCP — you recover the
designer's *intent* (variables, components, constraints) rather than whatever values a builder
compiled out. If all that exists is a published site, extract from the live DOM. Everything from
Phase 2 on is identical.

**Phase 0 is not optional.** The diagnosis changes what "done" means. Three commands:

```bash
curl -s https://TARGET/ | wc -c                      # 5KB means no real content
curl -s https://TARGET/ | grep -c "A_REAL_PHRASE"    # 0 means invisible to Google
curl -s https://TARGET/ | head -5                    # the generator, often in a comment
```

---

## Three things this gets right that most rebuilds don't

**Prefer the design file; fall back to the DOM — never to screenshots.** A Figma file read over
MCP gives you real design variables and component structure. Failing that, modern no-code
builders emit Tailwind, so real class names and resolved tokens are readable from the published
page. Redrawing from a screenshot is the last resort and it shows.

**Average saturation is a liar.** At high CRF, H.264 quantizes chroma hard. Mean brightness and
mean saturation barely move while *peak* saturation collapses — every average says fine and the
video looks washed out.

```
                   YAVG    SATAVG    SATMAX
source            40.97      0.51     49.92
CRF 28 / 720p     41.02      0.49     33.60   ← looks washed out
CRF 20 / 1080p    40.99      0.51     47.47   ← correct
```

`optimize-media.sh` measures `SATMAX` and fails the build if retention drops below 90%.

**Audit the claims, not just the code.** The highest-value, most-skipped step. Builders fill
trust sections with plausible filler — license numbers, awards, statistics — that reads as
finished so nobody re-reads it. In the example project the audit caught a sequential placeholder
license number carrying a *Florida* prefix on a Maryland/Virginia/DC contractor's site. That's a
regulatory exposure, not a typo.

---

## Scope

**Built for:** a single-page or few-page marketing site for a local service business — trades,
clinics, studios, restaurants. Netlify + Next.js.

**Not built for:** e-commerce, booking systems, multi-tenant apps, CMS integration.

**Assumes:** you own the site you're rebuilding, or are authorized to. Don't point it at a
competitor.

---

## Contributing

Issues and PRs welcome. The bar for a new reference entry is the same as the existing ones: it
must be something you can *verify with a command*, not general advice.

## License

MIT — see [LICENSE](LICENSE).
