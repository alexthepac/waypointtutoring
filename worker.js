/* =============================================================================
   MNTR Tutoring — form-protection backend (Cloudflare Worker)

   Sits between the website's forms and the services behind them (FormSubmit
   email + Google Sheet), so that:
     - the destination email / Google Apps Script URL are no longer visible
       in the page source (they live here, as Worker environment variables)
     - every submission is validated (required fields, length caps, email
       format) before anything is forwarded
     - bots are dropped (honeypot field + minimum time-on-page check)
     - each visitor IP is rate-limited (default: 5 submissions / 10 minutes)
     - only requests coming from the real site are accepted (CORS allowlist)

   Endpoints:
     POST /api/contact         { name, email, topic?, message, website?, t? }
     POST /api/newsletter      { email, page?, website?, t? }
     POST /api/stripe-webhook  Stripe checkout.session.completed events —
                               emails package buyers their booking link so
                               they can always get back to it.

   Environment variables (set in the Cloudflare dashboard or via
   `wrangler secret put` — see backend/README.md):
     CONTACT_ENDPOINT       FormSubmit AJAX URL for contact messages,
                            e.g. https://formsubmit.co/ajax/<your-alias-or-email>
     NEWSLETTER_ENDPOINT    FormSubmit AJAX URL for newsletter notifications
                            (can be the same as CONTACT_ENDPOINT)
     SHEET_WEBAPP_URL       Google Apps Script Web App URL that logs newsletter
                            signups to the Google Sheet
     STRIPE_WEBHOOK_SECRET  Signing secret of the Stripe webhook endpoint
                            (starts with whsec_…). Used to verify events are
                            genuinely from Stripe. Without it, /api/stripe-webhook
                            rejects everything.
     BOOKING_EMAIL_URL      Google Apps Script Web App URL that sends the
                            "book your sessions" email from your Gmail
                            (see backend/booking-email.gs)
     BOOKING_EMAIL_TOKEN    Shared secret sent to BOOKING_EMAIL_URL so only
                            this Worker can trigger those emails
     ALLOWED_ORIGINS        optional comma-separated origin allowlist; defaults
                            to the production domains below
   ========================================================================== */

/* Any Stripe Payment Link checkout at or above this amount (in cents) is
   treated as a package purchase and triggers the booking-link email. Packages
   are $162.50 (5-pack) and $300 (10-pack); single sessions ($35) and
   the $5 reservation fee are all well below this, so they never trigger it —
   even with a promo code applied to a pack. Update if pack pricing ever
   changes. */
const PACK_MIN_CENTS = 10000;

/* How long after Stripe signs an event we still accept it (replay protection). */
const STRIPE_SIG_TOLERANCE_S = 5 * 60;

const DEFAULT_ALLOWED_ORIGINS = [
  'https://mntrtutoring.ca',
  'https://www.mntrtutoring.ca',
  'https://alexthepac.github.io',
];

/* Field length caps — anything longer is rejected, not truncated. */
const MAX_LEN = { name: 100, email: 254, topic: 150, message: 5000, page: 300 };

/* Rate limit: max submissions per IP per window. In-memory per Worker
   isolate, so it's a burst limiter rather than a global counter — Cloudflare's
   own DDoS protection handles volumetric attacks in front of this. */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const RATE_MAP_CAP = 10000;
const rateHits = new Map(); // ip -> { count, windowStart }

/* A real human takes longer than this to fill a form. Submissions that
   arrive faster (client reports time-on-page in `t`) are treated as bots. */
const MIN_FILL_MS = 3000;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    /* Stripe webhook: handled first, before the CORS/rate-limit/JSON-parse
       path. Stripe posts server-to-server (no Origin header) and its signature
       must be verified against the RAW request body, so this can't share the
       generic body = await request.json() flow below. */
    if (new URL(request.url).pathname === '/api/stripe-webhook') {
      return handleStripeWebhook(request, env);
    }

    if (request.method !== 'POST') {
      return json({ success: false, error: 'Method not allowed' }, 405, cors);
    }

    /* Reject browsers that aren't on the allowlist. Requests with no Origin
       header (curl, server-to-server) are allowed through here — the rate
       limiter and validation below still apply to them. */
    if (origin && !isAllowedOrigin(origin, env)) {
      return json({ success: false, error: 'Origin not allowed' }, 403, cors);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (isRateLimited(ip)) {
      return json(
        { success: false, error: 'Too many submissions. Please try again later.' },
        429,
        cors
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ success: false, error: 'Invalid request body' }, 400, cors);
    }
    if (typeof body !== 'object' || body === null) {
      return json({ success: false, error: 'Invalid request body' }, 400, cors);
    }

    /* Bot checks: honeypot field filled, or form submitted inhumanly fast.
       Respond with success so bots don't learn they were filtered. */
    if (isBot(body)) {
      return json({ success: true }, 200, cors);
    }

    const url = new URL(request.url);
    try {
      if (url.pathname === '/api/contact') {
        return await handleContact(body, env, cors);
      }
      if (url.pathname === '/api/newsletter') {
        return await handleNewsletter(body, env, cors);
      }
    } catch (e) {
      /* Never leak internals to the client. */
      return json({ success: false, error: 'Something went wrong. Please email us directly.' }, 502, cors);
    }

    return json({ success: false, error: 'Not found' }, 404, cors);
  },
};

/* ---------------------------------------------------------------- handlers */

async function handleContact(body, env, cors) {
  const name = clean(body.name, MAX_LEN.name);
  const email = clean(body.email, MAX_LEN.email);
  const topic = clean(body.topic, MAX_LEN.topic);
  const message = clean(body.message, MAX_LEN.message);

  if (!name || !email || !message) {
    return json({ success: false, error: 'Please fill in your name, email and message.' }, 400, cors);
  }
  if (name === null || email === null || topic === null || message === null || !isEmail(email)) {
    return json({ success: false, error: 'Please check your details and try again.' }, 400, cors);
  }
  if (!env.CONTACT_ENDPOINT) {
    return json({ success: false, error: 'Backend not configured' }, 500, cors);
  }

  const res = await fetch(env.CONTACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name,
      email,
      topic,
      message,
      _subject: 'New inquiry from the MNTR Tutoring website',
      _captcha: 'false',
    }),
  });
  const ok = res.ok && isFormSubmitSuccess(await safeJson(res));

  return ok
    ? json({ success: true }, 200, cors)
    : json({ success: false, error: 'Delivery failed. Please email us directly.' }, 502, cors);
}

async function handleNewsletter(body, env, cors) {
  const email = clean(body.email, MAX_LEN.email);
  const page = clean(body.page, MAX_LEN.page);

  if (!email || !isEmail(email)) {
    return json({ success: false, error: 'Please enter a valid email address.' }, 400, cors);
  }

  /* 1) Log the signup as a row in the Google Sheet. */
  let sheetOk = false;
  if (env.SHEET_WEBAPP_URL) {
    try {
      const res = await fetch(env.SHEET_WEBAPP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:
          'email=' + encodeURIComponent(email) +
          '&source=newsletter&page=' + encodeURIComponent(page || ''),
      });
      sheetOk = res.ok;
    } catch (e) { /* fall through — notification email below may still work */ }
  }

  /* 2) Notification email via FormSubmit. */
  let mailOk = false;
  if (env.NEWSLETTER_ENDPOINT) {
    try {
      const res = await fetch(env.NEWSLETTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          _subject: 'MNTR Newsletter signup',
          _captcha: 'false',
          _template: 'box',
        }),
      });
      mailOk = res.ok && isFormSubmitSuccess(await safeJson(res));
    } catch (e) { /* ignore */ }
  }

  return sheetOk || mailOk
    ? json({ success: true }, 200, cors)
    : json({ success: false, error: 'Signup failed. Please try again.' }, 502, cors);
}

/* -------------------------------------------------------- Stripe webhook */

/* Emails a package buyer their booking link when Stripe reports a completed
   checkout. Returns 200 for anything we intentionally ignore (so Stripe stops
   retrying), 400 for a bad/forged signature, 500 only when a genuine package
   email fails to send (so Stripe retries it). */
async function handleStripeWebhook(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  if (!env.STRIPE_WEBHOOK_SECRET) {
    /* Not configured yet — refuse rather than trust unsigned input. */
    return new Response('Webhook not configured', { status: 503 });
  }

  const raw = await request.text();
  const sigHeader = request.headers.get('Stripe-Signature') || '';

  const valid = await verifyStripeSignature(raw, sigHeader, env.STRIPE_WEBHOOK_SECRET);
  if (!valid) {
    return new Response('Invalid signature', { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch (e) {
    return new Response('Bad JSON', { status: 400 });
  }

  /* We only act on completed checkouts. Everything else is acknowledged. */
  if (!event || event.type !== 'checkout.session.completed') {
    return new Response('ignored', { status: 200 });
  }

  const session = (event.data && event.data.object) || {};
  const amount = typeof session.amount_total === 'number' ? session.amount_total : 0;

  /* Only package purchases (>= PACK_MIN_CENTS) get the booking email. */
  if (amount < PACK_MIN_CENTS) {
    return new Response('not a package', { status: 200 });
  }

  const email =
    (session.customer_details && session.customer_details.email) ||
    session.customer_email ||
    '';
  if (!isEmail(email)) {
    /* Paid but no usable email — nothing we can send to; don't make Stripe
       retry forever. */
    return new Response('no email', { status: 200 });
  }

  if (!env.BOOKING_EMAIL_URL || !env.BOOKING_EMAIL_TOKEN) {
    return new Response('email sender not configured', { status: 503 });
  }

  const name =
    (session.customer_details && session.customer_details.name) || '';

  try {
    const res = await fetch(env.BOOKING_EMAIL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:
        'token=' + encodeURIComponent(env.BOOKING_EMAIL_TOKEN) +
        '&email=' + encodeURIComponent(email) +
        '&name=' + encodeURIComponent(name) +
        '&amount=' + encodeURIComponent(String(amount)),
    });

    /* Apps Script answers 200 even when it REFUSES to send (wrong token, bad
       email, internal error) — the outcome is in the body, not the status. So
       checking res.ok alone silently swallows every failure and tells Stripe
       the mail went out. Only the literal 'sent' means it actually did. */
    const body = (await res.text() || '').trim().toLowerCase();
    if (!res.ok || body !== 'sent') {
      const reason = body || ('http ' + res.status);
      /* 'bad email' can't be fixed by retrying — acknowledge so Stripe stops,
         but say why. Everything else is worth a retry. */
      if (reason === 'bad email') {
        return new Response('email rejected by sender: ' + reason, { status: 200 });
      }
      return new Response('booking email not sent: ' + reason, { status: 500 });
    }
  } catch (e) {
    return new Response('send error: ' + (e && e.message ? e.message : e), { status: 500 });
  }

  return new Response('ok', { status: 200 });
}

/* Verify a Stripe-Signature header against the raw body using the endpoint's
   signing secret (HMAC-SHA256), with timestamp tolerance and a constant-time
   compare. Mirrors Stripe's own construct-event check. */
async function verifyStripeSignature(rawBody, sigHeader, secret) {
  if (!sigHeader) return false;

  let t = '';
  const v1 = [];
  for (const part of sigHeader.split(',')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (k === 't') t = val;
    else if (k === 'v1') v1.push(val);
  }
  if (!t || v1.length === 0) return false;

  /* Reject stale/replayed events. */
  const ts = parseInt(t, 10);
  if (!Number.isFinite(ts)) return false;
  const nowS = Math.floor(Date.now() / 1000);
  if (Math.abs(nowS - ts) > STRIPE_SIG_TOLERANCE_S) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(t + '.' + rawBody));
  const expected = [...new Uint8Array(sigBuf)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  /* Stripe may list several v1 signatures; accept if any matches. */
  return v1.some((sig) => timingSafeEqual(sig, expected));
}

/* Length-and-content constant-time string compare. */
function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/* ----------------------------------------------------------------- helpers */

function allowedOrigins(env) {
  if (env.ALLOWED_ORIGINS) {
    return env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return DEFAULT_ALLOWED_ORIGINS;
}

function isAllowedOrigin(origin, env) {
  return allowedOrigins(env).includes(origin);
}

function corsHeaders(origin, env) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    Vary: 'Origin',
  };
  if (origin && isAllowedOrigin(origin, env)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    headers['Access-Control-Max-Age'] = '86400';
  }
  return headers;
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers });
}

/* Trim, enforce the length cap, and strip control characters (which also
   blocks header/newline injection in anything built from these values).
   Returns null when the value is over the cap, '' when absent. */
function clean(value, maxLen) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return null;
  const s = value.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  if (s.length > maxLen) return null;
  return s;
}

function isEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= MAX_LEN.email;
}

function isBot(body) {
  if (typeof body.website === 'string' && body.website.trim() !== '') return true;
  if (typeof body.t === 'number' && body.t >= 0 && body.t < MIN_FILL_MS) return true;
  return false;
}

function isRateLimited(ip) {
  const now = Date.now();
  /* Cap memory: if the map grows too large, drop expired windows first. */
  if (rateHits.size > RATE_MAP_CAP) {
    for (const [key, entry] of rateHits) {
      if (now - entry.windowStart > RATE_WINDOW_MS) rateHits.delete(key);
    }
    if (rateHits.size > RATE_MAP_CAP) rateHits.clear();
  }
  const entry = rateHits.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    rateHits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch (e) {
    return null;
  }
}

function isFormSubmitSuccess(data) {
  return !!data && (data.success === true || data.success === 'true');
}
