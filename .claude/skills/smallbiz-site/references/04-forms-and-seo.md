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

**Then prove it — through the UI, not the endpoint.** This distinction is the whole point and it
is easy to get wrong:

```bash
# This proves the transport works. It does NOT prove the form works.
curl -X POST https://SITE/__forms.html --data-urlencode "form-name=..." ...
```

A curl POST bypasses the React component entirely. On this project the endpoint returned 200 and
submissions were being stored correctly, while every visitor who clicked Send saw **"That didn't
send."** The lead was captured and the customer was told it had failed — the worst possible
combination, and invisible to endpoint testing.

The cause is a React trap worth knowing on its own:

```tsx
const res = await fetch("/__forms.html", { ... });
setStatus("sent");
e.currentTarget.reset();   // BUG: currentTarget is null after an await
```

React nulls `currentTarget` once the handler's synchronous phase ends, so this throws a
`TypeError` *after* a successful POST. The `catch` then reports failure. Capture the node first:

```tsx
const form = e.currentTarget;   // before any await
// ...
form.reset();
setStatus("sent");
```

The tell in the data: **duplicate submissions seconds apart from the same browser.** That is a
visitor who saw an error and pressed Send again. If you see that pattern, the transport is fine
and the success path is broken.

**Verification that actually counts:**

1. Load the real domain in a browser and submit the form by clicking the button.
2. Assert the success element renders and the error element does not.
3. Assert the fields cleared.
4. Confirm the submission appears in the dashboard.
5. Enable notifications (*Forms → your form → Notifications*) and confirm one lands in the
   owner's inbox, from a phone on cellular.

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
