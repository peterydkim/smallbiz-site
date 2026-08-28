# Deploy and domain

## Three routes onto Netlify

| Route | Time | When |
|---|---|---|
| **Netlify CLI** | ~5 min | Fastest to a live URL. No GitHub account decision needed. |
| **Git integration** | ~10 min | Best long-term: auto-deploy, preview URLs, one-click rollback |
| Drag-and-drop | n/a for Next.js | Only for a pre-built static folder |

Don't default to Git out of habit. If there's a deadline tonight, the CLI is live sooner and you
can connect Git afterwards without changing anything about the site.

Long term, Git integration earns its keep for one reason above the others: **every branch gets
its own preview URL**, so the owner reviews changes on their phone before anything touches
production.

```bash
# CLI route
npm i -g netlify-cli && netlify login
netlify deploy --build --prod

# Git route
gh repo create SITENAME --private --source=. --push
# then: Netlify → Add new site → Import an existing project → GitHub
```

`netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Forms are detected from uploaded HTML either way, so the CLI route does not cost you form
handling.

## Pointing the domain

**Verify the site works on its `.netlify.app` URL before touching DNS.** Debugging a build
problem and a DNS problem simultaneously is miserable.

Add the domain in Netlify first (*Domain management → Add a domain*), then create records at the
registrar:

| Type | Host | Value |
|---|---|---|
| A | `@` | `75.2.60.5` |
| CNAME | `www` | `<site>.netlify.app` |

Squarespace has a built-in preset: *DNS → Add Preset → Netlify*.

**Keep the registrar's nameservers.** Delegating the whole zone to Netlify also moves MX records,
so a domain email set up later has to be rebuilt there. Two records leave mail untouched. Adding
records also tends to propagate faster than re-delegation.

Make `www` primary with the apex redirecting — CNAME resolution outperforms an apex A record on
external DNS.

Let Netlify issue the Let's Encrypt certificate once records resolve, then enable *Force HTTPS*.

## Expectation setting

Propagation is usually under an hour but can take 48. If a demo lands before it resolves, the
`.netlify.app` URL is a completely professional thing to show — "the custom domain is finishing
propagation" needs no apology.

## Launch-day checks

```bash
curl -sI https://DOMAIN | head -1                       # 200
curl -s  https://DOMAIN | grep -c "DISTINCTIVE_PHRASE"  # >0: copy is in the HTML
curl -s  https://DOMAIN | grep -c noindex               # 0
curl -sI https://DOMAIN | grep -i strict-transport      # HTTPS enforced
```

Then, from a phone **on cellular rather than wifi** — this is what proves the site is genuinely
public and not resolving from a local cache:

1. The site loads.
2. Submit the contact form.
3. The lead arrives in the owner's inbox.
