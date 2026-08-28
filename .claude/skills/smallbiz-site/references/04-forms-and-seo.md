# Forms and SEO

## The form is the product

A no-code export's contact form is almost always theatre — an `onSubmit` that calls
`preventDefault()`, shows a thank-you, and drops the data. For a business whose site exists to
generate calls, this is the single most expensive defect you'll find.

## Netlify Forms with the App Router

Netlify detects forms by parsing deployed HTML at build time. React client components make that
unreliable, so ship a **static detection stub** as well. This is the documented Next.js pattern
and it costs nothing:

```html
<!-- public/__forms.html -->
<form name="estimate-request" data-netlify="true" netlify-honeypot="bot-field" hidden>
  <input type="hidden" name="form-name" value="estimate-request" />
  <input name="bot-field" />
  <input type="text" name="firstName" />
  <input type="email" name="email" />
  <textarea name="details"></textarea>
</form>
```

Post to it from the real form, so you keep inline success/error states instead of a page reload:

```tsx
const data = new FormData(e.currentTarget);
data.set("form-name", "estimate-request");
await fetch("/__forms.html", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
});
```

Requirements: matching `name` on the real form, a hidden `form-name` input, a honeypot
(`bot-field`) — contractor and trades sites attract heavy spam.

**Then prove it.** Enable notifications (*Forms → your form → Notifications*) and submit one real
lead from a phone on cellular. Until a submission has landed in the owner's inbox, the form is
not done.

Confirm the markup survives the build:

```bash
curl -s http://localhost:3000/ | grep -c 'name="estimate-request"'
```

## SEO for a local business

### The diagnostic that matters

```bash
curl -s https://SITE/ | wc -c
curl -s https://SITE/ | grep -c "DISTINCTIVE_BODY_PHRASE"
```

Client-rendered no-code output typically returns ~5 KB and zero matches. A correct static build
returns six figures of bytes with every phrase present. Record both numbers — it's the clearest
possible before/after for the owner.

### Non-negotiables

- **Remove `noindex`.** Preview platforms set it by default; carrying it over makes everything
  else pointless.
- **Real title and description.** Replace the builder's leftovers — those are frequently
  boilerplate from an unrelated template and will appear verbatim in search results.
- **`GeneralContractor` / `LocalBusiness` schema** with `areaServed`, `telephone`,
  `openingHoursSpecification`. This is what feeds local results.
- **`sitemap.ts` and `robots.ts`** as route handlers.
- **`metadataBase`** set to the real domain, or OG images resolve relative and break.

```ts
const schema = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: company.legal,
  telephone: company.phone,
  areaServed: [{ "@type": "State", name: "Maryland" }],
  openingHoursSpecification: [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    opens: "07:00", closes: "18:00",
  }],
};
```

### Placeholder domains are a launch blocker

Grep before every deploy. A canonical URL pointing at `example.com` tells Google to index a
domain that doesn't exist:

```bash
grep -rn "example.com" src/
```

### Off-site beats on-site

For a local business, the **Google Business Profile** usually drives more calls than the website.
Name, address, phone and hours must match the site exactly. Say this to the owner explicitly —
it's the highest-leverage thing they can do after launch, and it isn't your code.
