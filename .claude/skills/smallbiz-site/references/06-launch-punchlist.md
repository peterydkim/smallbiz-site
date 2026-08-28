# Launch punch list

Run this before a real domain points at the site. It audits **claims**, not code — the
highest-value and most-skipped step in the workflow.

## Why this exists

No-code and AI-assisted builders fill trust sections with plausible-looking filler: license
numbers, awards, warranties, statistics. It reads as finished, so nobody re-reads it. For a
licensed trade, publishing a fabricated license number is a regulatory exposure, not a typo.

You are not the arbiter of what's true. Your job is to **surface every checkable claim and make
the owner confirm it**, then flag anything that is provably wrong.

## Stop-ship

**License and registration numbers.** Sequential filler (`CGC#1234567`, `#123456`) is the
giveaway. Also verify the *prefix matches the jurisdiction*: `CGC` is Florida, so it is
categorically wrong on a Maryland/Virginia/DC site regardless of the digits. US contractor
licensing is per-state — MD uses MHIC, VA uses class A/B/C, DC uses a Basic Business License.

**Awards.** "NARI Excellence in Remodeling 2022 & 2023" is verifiable and worth money in a
dispute. Keep only what the owner can produce.

**Insurance and warranty figures.** "$2M liability", "5-year workmanship warranty" — these are
contractual promises.

**Statistics.** Projects completed, satisfaction percentage, value delivered. Ask for the basis.

**Internal arithmetic.** "EST. 2006" beside "18 years in business" is 20 years in 2026. Cheap to
catch, embarrassing to ship.

## Fix before launch

- `noindex` carried over from the preview platform
- Title still the builder's default (`"CompanyName Website"`)
- Meta description still boilerplate from an unrelated template
- Placeholder domains in canonical/OG/sitemap — `grep -rn "example.com" src/`
- Stale copyright year — use `new Date().getFullYear()`
- Dead footer links (`href="#"` on Privacy, Terms, Licensing, Careers). Write them or remove
  them; a dead "Licensing" link next to a license claim is a bad pairing
- Free email (`business@gmail.com`) once the domain exists — a visible trust signal for anyone
  quoting five-figure jobs

## Verify

- Contact form delivers to a real inbox — **tested, not assumed**
- Phone number is a working `tel:` link
- Every image has meaningful `alt` text
- Loads on a phone over cellular
- Owner's name, address, phone, hours match their Google Business Profile exactly

## Reporting it

Separate what you *know* is wrong from what needs the owner's confirmation:

```
STOP-SHIP  License number CGC#1234567 is sequential filler, and CGC is a
           Florida prefix on a Maryland/Virginia/DC site.
VERIFY     NARI award 2022 & 2023 — can you produce it?
VERIFY     500+ projects, 98% satisfaction, $2M+ delivered — what's the basis?
FIXED      Copyright year now dynamic; meta description replaced; noindex removed.
```

If the owner reaffirms a claim after you've flagged it, that's their call — record it and move
on. Flag once, clearly, then respect the decision.
