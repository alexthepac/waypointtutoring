# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: parents in Quebec looking for reliable, premium academic support for a CEGEP student, usually evaluating the service on behalf of their child and often joining the consultation call. Secondary: ambitious CEGEP students aiming at competitive university programs (medicine and other selective admissions), and students who are serious about raising their academic performance. Both groups arrive from ads or word of mouth, mostly on phones, and decide whether to apply for a free consultation.

## Product Purpose

MNTR is a Quebec tutoring and academic mentorship company. It sells semester-long mentorship for CEGEP students rather than isolated tutoring sessions: a dedicated mentor, personalized weekly study planning, one-on-one tutoring, exam preparation and strategy, study methods and time management, university-application and extracurricular guidance, and ongoing progress monitoring with the family. Success for the website is a qualified family applying for and booking the free 30-minute online consultation.

## Positioning

"MNTR Mentorship. More than just tutoring." The mechanism a neighbouring tutoring service cannot truthfully copy: one mentor owns the student's whole semester (plan, sessions, exam prep, reporting), and that structure lets MNTR attach a conditional R-score performance guarantee to two semester-long tracks (Core, threshold above 35; Intensive, threshold above 36). The remedy is a separate complimentary mentorship program the following semester, not a refund and not a repeat of the paid program.

## Operating Context

- Free consultation is booked through Acuity Scheduling (owner 40491971, appointment type 98756528), embedded on the homepage. Acuity sends the confirmation email with the video-call link.
- Mentors are medical and university students (McGill Med-P, Université de Montréal medicine, McGill honours mathematics and physics, Dawson College enriched sciences).
- Weekly Academic Plans, Scheduled Sessions, Assigned Tasks, a mid-semester parent report, exam strategy sessions, and a monthly parent check-in for students under 18 are contractual parts of the program.
- Payments run biweekly through Stripe, first charge on the day of the first session.
- Site is static HTML on GitHub Pages at mntrtutoring.ca; a Cloudflare Worker (worker.js) protects legacy forms and a Stripe webhook; Google Ads tag and Meta Pixel run behind a cookie-consent banner (consent.js) under Quebec Law 25.

## Capabilities and Constraints

- Exactly three primary page types per language, six routes: /en, /en/staff, /en/confirmation and /fr, /fr/equipe, /fr/confirmation. Policies, programs, FAQ and about content live inside those pages (sections and overlays), never as extra routes.
- Both languages share one information architecture; French is written for Quebec, not France.
- Acuity has no documented redirect; landing on the confirmation page after a booking requires a custom-conversion-tracking snippet pasted into Acuity (documented in README-REDESIGN.md). The "booked" state must never be shown without that signal.
- Two videos are not yet produced: the homepage sales video and the confirmation explainer. Their slots stay empty and dimension-stable (HOMEPAGE_SALES_VIDEO_PENDING, CONFIRMATION_VIDEO_PENDING) and are filled from assets/js/media.js.
- Legal text comes only from "MNTR — TERMS AND CONDITIONS" (October 2026 PDF). Its Payment Policy has an unfinished semester-fee sentence and a bracketed payment count; its Privacy Policy is a heading only. French legal text is a faithful implementation pending approval.
- Undecided / not to be invented: prices, number of sessions per track, what differs between Core and Intensive beyond the threshold and eligibility, testimonials, statistics, student results.

## Brand Commitments

- Name: MNTR (also "MNTR Tutoring" / "Tutorat MNTR" on legacy pages). Logo: the mountain line mark (assets/img/logo-mark.png, logo-mark-white.png).
- Previous identity: minimalist white and red. The owner wants it preserved and elevated.
- Reference animation v0.mp4 (12 frames, 1 s): a printer's test-page collage with a goat silhouette; its colour, texture and stop-motion rhythm are the binding aesthetic reference. The goat is to be replaced by the hero typography.
- Hero message, binding in both languages: "MNTR MENTORSHIP / MORE THAN JUST TUTORING" and "MENTORAT MNTR / BIEN PLUS QUE DU TUTORAT".
- Primary CTA label: "APPLY FOR A FREE CONSULTATION" / "FAIRE UNE DEMANDE DE CONSULTATION GRATUITE".
- Hand-drawn homepage wireframe (October 2026): logo top-left, centred hero message, curved divider, sales video, apply button with "already applied" link, embedded consultation scheduling, staff section.
- Voice: confident, specific, grounded; no generic AI marketing phrases, no invented numbers or social proof, no fear or false urgency.
- Confirmed with the owner on 2026-10-13: single type family (Archivo), light theme only, legacy pages moved to an unpublished folder, confirmation page built for the Acuity redirect.

## Evidence on Hand

- Real staff profiles and photos: James, Lea (no photo), Daniel, Laura, Mani, Noa (Daphne, Ziyi and Bassma removed at the owner's request, 2026-10-13); management Alexandre, Mani, Sofia (assets/img/team/).
- Policy PDF text (assets/js/policies.en.js reproduces it; policies.fr.js is the French implementation for review).
- Contact: mntrtutoring.info@gmail.com, +1 514-652-0018, Instagram @mntrtutoring, LinkedIn company page.
- Absent, never to be fabricated: testimonials, student results, admission statistics, pricing, the two pending videos.

## Product Principles

- Mentorship, not sessions: every surface explains the semester-long structure before it sells.
- Say only what the contract says: guarantees, cancellation and payment claims mirror the policy text.
- Parents must be able to trust it in one viewport; students must want it.
- One action: apply for the free consultation, reachable from everywhere in two taps.
- Both languages are first-class, same architecture, Quebec French.

## Accessibility & Inclusion

Keyboard-operable menu, policy viewer and accordions; focus management and escape-to-close; prefers-reduced-motion honoured (the hero stop-motion freezes); hreflang and lang attributes per route; legal documents readable at mobile widths.
