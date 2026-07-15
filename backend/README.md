# MNTR Tutoring — form-protection backend

The website itself is static (GitHub Pages), which is actually great for
security: there is no server of ours to hack, and **payments never touch our
code** — Stripe and Cal.com handle them entirely on their own secure pages.

The two remaining weak points were the **contact form** and the **newsletter
form**. Before this backend existed, both posted directly from the visitor's
browser to:

- `formsubmit.co/ajax/<our email>` — our email address was visible in the
  page source, and anyone could spam that endpoint;
- a **Google Apps Script URL** — visible in the page source, so anyone could
  flood the newsletter Google Sheet with junk rows.

This folder contains a small backend (a **Cloudflare Worker** — free tier is
more than enough) that the forms talk to instead. It:

- hides the email address and Apps Script URL (they live only in Cloudflare);
- validates every submission (required fields, length limits, email format);
- silently drops bots (hidden honeypot field + "filled the form in under
  3 seconds" check);
- rate-limits each visitor IP (5 submissions per 10 minutes);
- only accepts requests coming from `mntrtutoring.ca` (CORS allowlist);
- never reveals error internals to the caller.

The website works with or without it: until you paste the Worker URL into the
pages (step 4 below), the forms keep using their original direct endpoints.

---

## Deploying (about 15 minutes, free)

### 1. Create the Worker

**Option A — dashboard, paste the code in (no repo connection needed):**
1. Sign up / log in at [dash.cloudflare.com](https://dash.cloudflare.com).
2. Go to **Workers & Pages → Create → Worker**, name it `mntr-forms`, deploy
   the "Hello World" it gives you.
3. Click **Edit code**, delete everything, paste in the full contents of
   [`worker.js`](../worker.js) (repo root), then **Deploy**.

**Option B — dashboard, connect the Git repo directly:**
Cloudflare's Git-connected Worker deploy looks for `wrangler.toml` at the
**repository root** — it has no field to point at a subfolder in the simple
flow. That's why `worker.js` and `wrangler.toml` live at the repo root
(not in this `backend/` folder): connecting the repo and deploying should
find them with no extra configuration.

**Option C — command line:** install Node.js, then from the repo root run
`npx wrangler deploy` and follow the login prompt.

Either way you end up with a URL like:

```
https://mntr-forms.<your-account>.workers.dev
```

### 2. Set the three secrets

In the Worker's page: **Settings → Variables and Secrets → Add**, type
**Secret**, add these three:

| Name | Value |
|---|---|
| `CONTACT_ENDPOINT` | `https://formsubmit.co/ajax/mntrtutoring.info@gmail.com` — better: replace the email with your FormSubmit **random alias** (see step 5) |
| `NEWSLETTER_ENDPOINT` | same as above |
| `SHEET_WEBAPP_URL` | your Google Apps Script Web App URL (the `https://script.google.com/macros/s/…/exec` one) |

(Command-line equivalent: `npx wrangler secret put CONTACT_ENDPOINT` etc.)

### 3. Test it

From a terminal (or any online HTTP tester):

```bash
curl -s -X POST https://mntr-forms.<your-account>.workers.dev/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@example.com","message":"Hello from the backend test","t":9999}'
```

You should get `{"success":true}` and an email in the inbox.

### 4. Point the website at it

In each of these four files there is a `BACKEND_URL = ''` line near the top of
the `<script>` block at the bottom of the page:

- `contact.html` and `contact-fr.html`
- `book.html` and `book-fr.html`

Paste your Worker URL in (no trailing slash):

```js
var BACKEND_URL = 'https://mntr-forms.<your-account>.workers.dev';
```

Commit/upload the change. Done — submissions now flow through the backend.

### 5. Rotate the exposed endpoints (important!)

The old Google Apps Script URL and plain email endpoint were public in the
page source for anyone who looked, so after the backend is live:

1. **Google Apps Script:** open the script (Extensions → Apps Script from the
   Google Sheet), **Deploy → Manage deployments**, archive/delete the current
   deployment and create a **new** one. That gives a brand-new URL — put it in
   the `SHEET_WEBAPP_URL` secret. The old leaked URL stops working forever.
2. **FormSubmit:** visit [formsubmit.co](https://formsubmit.co), submit once
   to your email, and in the confirmation you'll get a **random alias string**
   (looks like `formsubmit.co/ajax/a1b2c3d4e5…`). Use the alias form in the
   `CONTACT_ENDPOINT` / `NEWSLETTER_ENDPOINT` secrets so your raw email is not
   used anywhere.

### 6. Optional extras

- **Custom domain for the Worker** (e.g. `forms.mntrtutoring.ca`): Worker →
  Settings → Domains & Routes. Cosmetic only; the workers.dev URL is fine.
- **Cloudflare Turnstile** (free, invisible CAPTCHA) can be added later if
  spam ever gets past the honeypot + rate limit.

---

## What this does *not* need to cover

- **Payments** — Stripe Payment Links and Cal.com run on their own hosted,
  PCI-compliant pages. No card data ever touches this site or this Worker.
- **The site's own pages** — GitHub Pages serves them read-only over HTTPS;
  there is no login, database, or user data stored on the site.
