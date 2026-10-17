# MNTR Mentorship website (October 2026 redesign)

Static HTML on GitHub Pages at `mntrtutoring.ca`. No build step: edit the
files, commit, push.

## Routes

| English | French | File |
|---|---|---|
| `/en/` | `/fr/` | `en/index.html`, `fr/index.html` |
| `/en/staff/` | `/fr/equipe/` | `en/staff/index.html`, `fr/equipe/index.html` |
| `/en/confirmation/` | `/fr/confirmation/` | `en/confirmation/index.html`, `fr/confirmation/index.html` |

`/` (`index.html`) sends French-language browsers to `/fr/` and everyone else
to `/en/`; a remembered choice from the language switcher wins.

Policies are not pages. They open in a document panel from the menu, the
footer, and in-page links, and can be deep-linked:
`/en/#policy=terms`, `#policy=cancellation`, `#policy=payment`, `#policy=privacy`
(same on `/fr/`).

## Where things live

```
assets/css/mntr.css        the whole design system (tokens at the top)
assets/js/mntr.js          menu, policy viewer, language switch, reveals,
                           FAQ, video slots, booking states, confirmation state
assets/js/media.js         VIDEO CONFIGURATION (see below)
assets/js/policies.en.js   policy text, English (verbatim from the PDF)
assets/js/policies.fr.js   policy text, French (for review before publishing)
assets/media/hero-sprite.webp   12 collage tiles (one per frame of v0.mp4) made
                                of zoomed crops from the frame edges and corners,
                                the parts without the goat; fills the word MNTR
assets/media/hero-reference-v0.mp4   the original clip, reference only
assets/img/team/           optimised staff portraits
assets/img/teacher-student.svg   public-domain line drawing (Openclipart 315318, CC0)
                                 shown in the hero's top-right corner
consent.js                 cookie banner + Meta Pixel + Google Consent Mode (unchanged
                           except the privacy link now points at the policy panel)
worker.js, wrangler.toml, backend/   Cloudflare Worker for the legacy forms and the
                           Stripe webhook (untouched)
_legacy/                   every page of the previous site. GitHub Pages does not
                           publish folders starting with "_", so these are offline.
PRODUCT.md, DESIGN.md, .impeccable/   design documentation
```

## Videos

Self-hosted MP4s in `assets/media/video/`, wired up in `assets/js/media.js`.
Each slot has an English and a French file; a page only ever loads the file
for its own language (no fallback to the other one). Nothing autoplays.

| Slot (`data-slot`) | Where | English | French |
|---|---|---|---|
| `HOMEPAGE_SALES_VIDEO` | homepage, right column "Our Mentorship Program" | `pitch-en.mp4` | `pitch-fr.mp4` |
| `TUTOR_INTRO_VIDEO` | homepage, left column "Traditional Online Tutoring" | `tintro-en.mp4` | `tintro-fr.mp4` |
| `WELCOME_VIDEO` | post-booking page, top | `welcome-en.mp4` | `welcome-fr.mp4` |
| `OFFER_VIDEO` | post-booking, mentorship question "What's included?" | `overview-en.mp4` | `overview-fr.mp4` |
| `MENTOR_COST_VIDEO` | post-booking, mentorship question "How much does it cost?" | `cost-en.mp4` | `cost-fr.mp4` |
| `MENTOR_RISK_VIDEO` | post-booking, mentorship question "How risky is this?" | `risk-en.mp4` | `risk-fr.mp4` |
| `TUTOR_COST_VIDEO` | post-booking, tutoring question "How much does tutoring cost?" | `tcost-en.mp4` | `tcost-fr.mp4` |

Sources: `~/Desktop/VIDEOS FOR WEBSITE/NEW BATCH 2` (and Welcome from the folder above it) ("R-Score Mentorship Program Pitch",
"Welcome Before Your Call", "Mentorship Programs Overview"), re-encoded for the
web only (H.264 1080p, CRF 27, AAC 128k, fast start; 11 to 24 MB each, under
GitHub's 100 MB file limit). Picture and sound are unchanged. Posters
(`*.webp`, same names) are frames from each video. To replace a video, drop a
new file in with the same name; to use YouTube/Vimeo instead, fill `embed`.
A `play` sends a `video_play` event.

## Booking flow and the confirmation page

The free consultation is still the Acuity Scheduling appointment type
`98756528` (owner `40491971`), embedded on `/en/#book` and `/fr/#book`, same
as before. Acuity sends the confirmation email.

Acuity does not offer a "redirect after booking" setting and its embed does
not tell the parent page when a booking completes. The supported way to
land visitors on our confirmation page is Acuity's custom conversion tracking
box, which runs code on Acuity's own confirmation screen:

1. In Acuity: **Integrations → Custom conversion tracking → Set up**.
2. Paste this, then save:

```html
<script>
  (function () {
    /* Only for the free consultation, not for paid session bookings. */
    if ('%appointmentType%' !== '98756528' && '%type%'.indexOf('Consultation') === -1) return;
    setTimeout(function () {
      window.top.location = 'https://mntrtutoring.ca/en/confirmation/?status=booked&when=' +
        encodeURIComponent('%clientDate%');
    }, 800);
  })();
</script>
```

3. Book a test consultation and confirm you land on the confirmation page
   with the "Your consultation is booked" headline and the date card.

Notes:
- The page shows the booked headline **only** when `status=booked` is in the
  URL, so nobody who simply clicks "Already applied or booked?" sees a
  booking they do not have. Without the snippet, everyone sees the neutral
  "We've received your application" state.
- A visitor who booked from the French homepage is sent to
  `/fr/confirmation/` automatically (the language is remembered in the
  browser).
- Only the appointment date string is passed. No name or email goes in the
  URL, and the query string is removed from the address bar once read.
- Acuity's placeholder names (`%appointmentType%`, `%type%`, `%clientDate%`)
  come from Acuity's custom conversion tracking help page; verify in a test
  booking that the type check fires, and remove the `%type%` fallback if
  `%appointmentType%` is the numeric ID.
- Acuity does not support custom code, so test after any Acuity update.

## Analytics

Google Ads tag `AW-18318813201` on every page, consent-denied by default;
`consent.js` upgrades it and loads the Meta Pixel after "Accept". Events sent
with `gtag('event', …)`: `cta_click` (with `cta` = `hero_apply`,
`video_apply`, `final_apply`, `header_apply`, `menu_apply`, `staff_apply`),
`booking_widget_loaded`, `video_play`, `policy_view`, `confirmation_view`,
`consultation_booked`, `contact_sent`.

## Legal content that still needs you

- **Payment Policy**: the semester fee amount is missing and the number of
  payments is `[8]` in the source PDF. Both are highlighted in yellow in the
  panel with a "draft pending final figures" notice. Replace them in
  `policies.en.js` and `policies.fr.js` and delete the notice.
- **Privacy Policy**: the PDF has only the heading. The panel shows the
  privacy policy that was already published on the old site, with a notice
  saying so. It mentions a newsletter, a contact form and Web3Forms that no
  longer exist on the new pages; revise when you write the final text.
- **French policies** are a faithful implementation, not a certified legal
  translation. Each carries a "prepared for review" notice; have them
  approved, then remove the notices.

## Legacy pages

The previous site's pages are no longer in this repository (an archive is
kept outside it). Their old addresses redirect to the new pages.
Anything that linked to them needs repointing:

- Stripe Payment Links / checkout success URLs that pointed at
  `thank-you.html` or `thank-you-fr.html`.
- `backend/booking-email.gs` and `backend/README.md` reference the old
  thank-you page.
- Any ads or social links to `tutoring.html`, `preparation.html`,
  `book.html`, `contact.html`.

The root-level photos (`hero.jpg`, `*.jpg`) were left in place because
`hero.jpg` is still the Open Graph image and the legacy pages reference them.

## Homepage design (Orwell-style, October 2026)

The homepages (`en/index.html`, `fr/index.html`) follow the structure of
orwell.au: a full-bleed photograph pinned behind the page, a bracket loader
that closes into the M of the word MNTR before the word slides to centre, a slim cream header (Menu, logo, Apply), and a
cream panel that rises over the photo as you scroll. Styles are in
`assets/css/orwell.css` (scoped to `body.theme-o`); the intro logic is in
`assets/js/mntr.js` under "Orwell-style homepage intro". The two homepages are
generated together; edit both or regenerate them from one template.

Hero photograph: "Radcliffe Camera Oxford 2018 02" by Julian Herzog,
CC BY 4.0 (https://commons.wikimedia.org/wiki/File:Radcliffe_Camera_Oxford_2018_02.jpg).
The licence requires the credit line, which appears in the corner of the hero
and in the footer. Files: `assets/media/hero-radcliffe.webp` (2400px) and
`assets/media/hero-radcliffe-1200.webp` (phones).

## Saved mockups (not published)

- `_mockups/a/en/` and `_mockups/a/fr/`: the previous proof-sheet homepage,
  frozen with its own copy of the stylesheet and script so later changes do
  not alter it.
- `_mockups/b/`: black hero with a mentor mosaic and a video card that rises
  over it.

View them with the local server, for example `http://localhost:8765/_mockups/a/en/`.

### Typeface

Orwell uses Die Grotesk (Klim Type Foundry) and ABC Favorit (Dinamo), both
commercial. The site uses Archivo (free, Google Fonts) as a stand-in, set
bold and slightly wide. To switch to Die Grotesk, buy a web licence from Klim,
add its `@font-face` to `assets/css/orwell.css`, and keep the family name
"Die Grotesk A": the font stack `--o-font` already lists it first.

## Post-booking page (October 2026)

`/en/confirmation/` and `/fr/confirmation/`, one page each, in this order:
A. welcome video ("You're all set. Here's what happens next."), B. two
columns (mentorship left with the offer video; tutoring right, heading only,
left empty on purpose), C. packages in the same columns (Core and Intensive
from the overview video and the terms; tutoring on the right), D. contact.

- Sections are cream panels with rounded corners over the homepage's Oxford
  photo, which sits once, fixed, behind the page (`.o-bg`); the gaps between
  panels show it. Styles: the "Post-booking page" block in `orwell.css`.
- Prices are not shown. Each package has an empty `.o-price` line marked
  `hidden`; write the price in and remove `hidden` (example in the page source).
- The contact form posts to the same Worker as the old contact page
  (`mntr-forms.alexthepac.workers.dev/api/contact`), with the honeypot and
  3-second check. Its CORS only accepts mntrtutoring.ca, so it can only be
  tested on the live site.
- Both pages are generated from one template so they stay in step: edit
  `_tools/build_confirmation.py` and run `python3 _tools/build_confirmation.py`
  from the site root (it overwrites both pages).

## Privacy, consent and legal mechanics (October 14, 2026)

Full findings and open items: `_audit/MNTR-compliance-security-audit.html`
(unpublished folder). Research notes with official sources:
`_audit/legal-research-notes.md`.

- **Consent** (`consent.js`, loaded first in every page head): the Google Ads
  tag and the Meta Pixel are not downloaded at all until the visitor allows
  them (Accept all / Reject optional / Customize, equal weight). Choice kept
  12 months in localStorage `mntr-privacy`; "Cookie settings" in every menu
  and footer reopens it; withdrawing deletes `_gcl_*`/`_fb*` cookies and
  reloads. `mntr.js` `track()` only sends events the visitor allowed.
- **Adults only**: the homepage calendar (and Acuity's script) load only
  after the 18+/parent confirmation; "I'm under 18" shows a polite message.
  The contact form requires the same confirmation and the Worker refuses
  submissions without it. **Also add it as a required question in Acuity.**
- **Legal pages**: `/en/legal/` and `/fr/juridique/` are generated from
  `assets/js/policies.*.js` by `node _tools/build_legal.mjs` (run after any
  policy edit, and after rebuilding the confirmation pages).
  They include the online cancellation form (`/api/cancel`).
- **Worker** (`worker.js`): new `/api/cancel`, adult check on `/api/contact`,
  newsletter endpoint disabled. Deploy the website first, then the Worker.
- **Not published** (`_config.yml`): worker/backend source, internal docs and
  unused photos of people.
- **Security**: Content Security Policy and referrer policy in a `<meta>` on
  every page (GitHub Pages cannot send headers). If a new third-party script
  is added, add its domain to the CSP in every page and in
  `_tools/build_confirmation.py`, or it will be blocked.
- **Captions**: `assets/media/video/*.vtt`, automatic transcription, to be
  proofread.

## Packages and purchases (October 15, 2026)

Post-booking page, packages section: tutoring left (single session, 5-session
package), mentorship right (Core, Intensive 2 h, Complete Intensive 3 h). Prices,
Acuity links, the number of payments (8) and the 5% pay-in-full discount are
constants at the top of `_tools/build_confirmation.py`; change them there and
re-run it, then `node _tools/build_legal.mjs`. Buy links only work after the
18+ confirmation box. Open legal points: see audit items C12 and D9.
