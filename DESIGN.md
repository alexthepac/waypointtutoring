---
name: MNTR Mentorship
description: A printer's proof sheet. Paper, ink, one red; Archivo condensed and heavy; sharp corners; stop-motion at 12 fps.
colors:
  paper: "#f7f5ef"
  paper-2: "#efece4"
  paper-3: "#e6e2d7"
  ink: "#151413"
  ink-2: "#45433f"
  ink-3: "#66635b"
  rule: "rgba(21, 20, 19, 0.16)"
  rule-strong: "rgba(21, 20, 19, 0.42)"
  red: "#d8231a"
  red-deep: "#b4190f"
  swatch-blue: "#5c9fe0"
  swatch-yellow: "#f0c12a"
  swatch-green: "#5bb245"
  swatch-pink: "#e35f8e"
typography:
  hero-word:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "var(--fit, 30vw)"
    fontWeight: 800
    lineHeight: 0.78
    letterSpacing: "-0.04em"
    fontVariation: "wdth 100, uppercase, fit-to-width"
  hero-ship:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.6rem, 7.6vw, 7rem)"
    fontWeight: 700
    lineHeight: 0.86
    letterSpacing: "-0.03em"
    fontVariation: "wdth 62 to 84, uppercase"
  hero-sub:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.15rem, 2.1vw, 1.7rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "0.01em"
    fontVariation: "italic, uppercase"
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.6rem, 6.4vw, 5.8rem)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.02em"
    fontVariation: "wdth 84, uppercase"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.1rem, 4.6vw, 4rem)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.02em"
    fontVariation: "wdth 84, uppercase"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.15rem, 1.7vw, 1.4rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.005em"
    fontVariation: "wdth 86, uppercase"
  figure:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3.2rem, 6vw, 5.4rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.03em"
    fontVariation: "wdth 84, tabular-nums"
  lede:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.1rem, 1.5vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
    fontVariation: "wdth 100"
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
    fontVariation: "wdth 100"
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.1em"
    fontVariation: "wdth 90, uppercase"
  button:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.86rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.08em"
    fontVariation: "wdth 92, uppercase"
rounded:
  none: "0"
  circle: "50%"
spacing:
  hair: "2px"
  xs: "6px"
  sm: "12px"
  md: "18px"
  lg: "24px"
  xl: "32px"
  col-gap: "clamp(16px, 2vw, 28px)"
  gutter: "clamp(18px, 4vw, 56px)"
  section-tight: "clamp(48px, 7vw, 96px)"
  section: "clamp(72px, 10vw, 136px)"
  sec-head-gap: "clamp(36px, 5vw, 64px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.red}"
    textColor: "{colors.paper}"
  button-red:
    backgroundColor: "{colors.red}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "52px"
  button-red-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "52px"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "52px"
  button-paper-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-lg:
    padding: "0 32px"
    height: "62px"
  button-sm:
    padding: "0 16px"
    height: "40px"
  text-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "0 0 3px"
  lang-switch:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.none}"
    padding: "7px 10px"
  lang-switch-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  card-remedy:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "clamp(18px, 2.4vw, 26px)"
  card-booking:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "18px 20px"
  doc-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    width: "820px"
  doc-tab:
    backgroundColor: "transparent"
    textColor: "{colors.ink-3}"
    padding: "10px 14px 12px"
  doc-tab-selected:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
  nav-drawer:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    width: "min(100%, 520px)"
    padding: "0 clamp(24px, 5vw, 56px) 36px"
  video-frame:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.none}"
  book-frame:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.none}"
    height: "820px"
  footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  footer-wordmark:
    backgroundColor: "transparent"
    textColor: "rgba(247, 245, 239, 0.12)"
    typography: "{typography.hero-word}"
---

# Design System: MNTR Mentorship

## Overview

**Creative North Star: "The Printer's Proof Sheet"**

The site is one printed sheet being pulled off the press: warm paper, near-black ink, one press red, and the CMYK-style swatches, halftone dots, registration mark and colour wheel that a printer uses to check a run. The reference is the owner's 12-frame stop-motion collage (v0.mp4); its texture lives inside the word MNTR in the hero at full strength and returns once, static and dimmed, in the footer wordmark. Trim marks in the four corners of the hero and of the red closing section, and a live "Frame 01 / 12" counter beside MNTR, say outright that the page is a proof being checked. Everything outside the hero is exceptionally clean: paper, hairline rules, condensed heavy caps, regular-width reading text, and a single red used for the action and for the marks a proofreader would make by hand.

Density is editorial rather than dashboard: wide sections (72–136px of block padding), one or two columns, long measure limited to 62ch, and large headlines that carry the structure without boxes. Depth is tonal (three paper tints, one ink) and the only shadow in the system belongs to the policy document panel. Corners are sharp without exception; the only circles are the colour wheel, the registration mark, the empty-video play ring and the hand-drawn marker rings, which are printed marks rather than UI chrome. The build is light-only by owner decision; there is no dark theme and none should be inferred.

Motion is of two kinds. The hero is authored stop motion: elements appear on numbered frames (an 83ms frame unit, 12 fps), MENTORSHIP widens in six steps, the MNTR fill loops through its 12-frame sprite with `steps(12)` while the counter ticks in step with it, and a red marker stroke draws itself around the word. Everything else is fast and exponential: the ease-out curve `cubic-bezier(0.23, 1, 0.32, 1)` at 160–320ms for hovers, drawers, accordions and reveals.

**Key Characteristics:**
- Paper and ink with one red; the swatch colours appear only as printed marks.
- One family, Archivo variable, condensed (wdth 62–92) and heavy for display, wdth 100 regular for reading.
- Sharp corners everywhere; hairlines organise content, boxes are rare.
- Flat tonal depth; a single modal shadow.
- Stop-motion hero at 12 fps; everything else under 320ms on an exponential ease-out.
- The two wordmarks (hero and footer) are fit to the container width by script, bookending the sheet.
- Light theme only.

## Colors

A warm paper, three inks, one press red, and four swatch colours reserved for printed marks.

### Primary
- **Press Red** (`{colors.red}`): the single accent. Primary call-to-action fill, the hover wipe on ink buttons, the marker stroke around MENTORSHIP, the red start of the curved divider, the sliding underline on text links, the focus outline, text selection, the big R-score threshold figures, confirmation step numbers, the active policy tab underline, the red-drenched final CTA section, the small dash bullets, the thin marker rings around the journey numbers, and the multiply overlay (55%) that turns a hovered portrait into a red proof print. Hover colour for links in the drawer and footer.
- **Press Red, deep** (`{colors.red-deep}`): declared as the pressed/deep companion of the red. Reserved; the shipped build does not yet reach for it.

### Neutral
- **Paper** (`{colors.paper}`): page background, text on ink and red surfaces, the drawer and the document sheet. On the red section it also takes over the marks: trim marks, the marker stroke, the halftone dots (at 70%) and the fourth swatch.
- **Paper 2** (`{colors.paper-2}`): the quieter tint. Alternate section background, the empty video frame, the guarantee remedy card, the booking card, neutral notices, scrollbar track.
- **Paper 3** (`{colors.paper-3}`): portrait placeholder background behind photos and initials.
- **Ink** (`{colors.ink}`): all headings and primary text, default button fill, the footer, the current-language chip, hairline strokes on the curve and checklist boxes, the trim marks, the gradient bar and the registration mark in the hero.
- **Ink 2** (`{colors.ink-2}`): reading colour for ledes, descriptions, FAQ answers, bios and secondary nav text.
- **Ink 3** (`{colors.ink-3}`): labels, captions, clause numbers, school lines, inactive tabs, scrollbar thumb.
- **Rule** (`{colors.rule}`): ordinary hairline dividers (section tops, FAQ items, drawer list, policy tabs, footer bottom in its paper-alpha form).
- **Rule, strong** (`{colors.rule-strong}`): structural hairlines and frames (journey and track tops, FAQ top, ghost button border, video and booking frame borders, document sheet border, language switch).

### Tertiary (printed marks only)
- **Swatch Blue** (`{colors.swatch-blue}`), **Swatch Yellow** (`{colors.swatch-yellow}`), **Swatch Green** (`{colors.swatch-green}`), **Swatch Pink** (`{colors.swatch-pink}`): the proof-strip chips (18×9px), the hero swatch row (46×20px, 34×13px on phones), the swatch stack on the red section (46×18px, 30×12px on phones), the conic colour wheel, the blue scribble, and yellow as the highlighter behind unresolved legal text (`mark.gap`). They never fill a surface, colour text, or mark state.

### Named Rules
**The One Red Rule.** Red is the only colour that carries meaning: action, emphasis, the proofreader's hand. It never becomes a background except in the final drenched section, and the swatch colours never substitute for it.

**The Printed Marks Rule.** Blue, yellow, green and pink exist as small printed objects (a chip, a dot field, a wheel, a scribble) with fixed pixel sizes. They are not a secondary palette; no component, chart, badge or state may use them.

**The Three Inks Rule.** Text hierarchy is carried by ink, ink-2 and ink-3 on paper, never by size alone and never by colour outside the ink ramp.

## Typography

**Display Font:** Archivo variable (wdth 62–125, wght 400–900), loaded from Google Fonts; fallback Helvetica Neue, Arial
**Body Font:** Archivo (same family, wdth 100)
**Label/Mono Font:** none; no mono, no serif

**Character:** one family doing two jobs through the width axis. Condensed, heavy, uppercase Archivo (wdth 84, wght 700–800, tight tracking) reads as press lettering; regular-width Archivo at 400 reads as clean print copy. Italic appears once, for the tagline "More than just tutoring" (500, italic, uppercase) under the circled MENTORSHIP.

### Hierarchy
- **Hero word** (800, `var(--fit)`, 0.78, -0.04em): the word MNTR only, wdth 100, filled with the sprite through `background-clip: text`. There is no clamp: `mntr.js` measures the four letters at 100px and sets an inline font-size so they span the container (99.5%), re-fitting on font load and resize; the CSS fallback is 30vw (24vw in the footer). The footer wordmark is the same token, static and at 60% opacity.
- **Hero ship** (700, `clamp(2.6rem, 7.6vw, 7rem)`, 0.86, -0.03em): MENTORSHIP, animating from wdth 62 to 84 in six steps inside the red marker, with the italic sub (500, `clamp(1.15rem, 2.1vw, 1.7rem)`, 1.15, 0.01em) beneath it.
- **Display** (700, `clamp(2.6rem, 6.4vw, 5.8rem)`, 0.94, wdth 84, uppercase, -0.02em): confirmation and final-CTA headlines (`h-xl`); the statement block uses the same voice at `clamp(2rem, 5vw, 4.4rem)`.
- **Headline** (700, `clamp(2.1rem, 4.6vw, 4rem)`, 0.94, wdth 84, uppercase): every section heading (`h-lg`), limited to 18ch. A mid step at `clamp(1.5rem, 2.8vw, 2.3rem)` serves staff names and document titles.
- **Title** (700, `clamp(1.15rem, 1.7vw, 1.4rem)`, 1, wdth 86, uppercase): service, journey and track-note headings, team names at 1.1–1.25rem.
- **Figure** (800, `clamp(3.2rem, 6vw, 5.4rem)`, 0.9, wdth 84, tabular): big numbers only. R-score thresholds in red, journey numbers in ink (`clamp(2.4rem, 4vw, 3.6rem)`) inside a thin red marker ring, confirmation step numbers in red (`clamp(3.4rem, 8vw, 7.5rem)`).
- **Lede** (400, `clamp(1.1rem, 1.5vw, 1.3rem)`, 1.5, ink-2): one per section, 48–52ch. The hero lede is `clamp(1rem, 1.4vw, 1.15rem)` in a 46ch column.
- **Body** (400, 1.0625rem, 1.55): reading text, 62ch max; descriptions in ink-2 at 0.98–1rem; policy body at 1rem/1.6.
- **Label** (600, 0.74rem, 0.1em, uppercase, wdth 90, ink-3): functional labels only: "Menu", "Policies", "Document", "Video coming soon", "Loading the calendar", the hero frame counter ("Frame 01 / 12", ink-2 with the tabular number in ink at 700), definition-list terms, footer column heads, the threshold unit under the big figure.
- **Button** (600, 0.86rem, 0.08em, uppercase, wdth 92): all buttons; 0.94rem large, 0.76rem small; the FAQ question is the same weight at `clamp(1.05rem, 1.5vw, 1.3rem)`, wdth 92, no tracking.

### Named Rules
**The Width Axis Rule.** Hierarchy is made with the width axis, not with a second family. Display sits at wdth 84 (86–92 for smaller titles and buttons); reading text sits at wdth 100. Nothing is set wider than 100; the MNTR wordmarks sit at exactly 100.

**The Caps-Carry-Structure Rule.** Uppercase is reserved for condensed display, labels and buttons. Reading text, ledes, FAQ questions and the italic tagline are sentence case.

**The No-Eyebrow Rule.** Section heads are a headline and optionally one lede. There are no kickers or eyebrows above headings; the label style belongs to functional labels inside components.

**The Fit-To-Width Rule.** The MNTR wordmark is never given a type size. It is fit to its container by script (`.fit`), in the hero and the footer only; no other text is sized this way, and the visible hero type is decorative (`aria-hidden`) behind a screen-reader-only h1.

## Layout

A single centred wrap of 1360px with a fluid gutter (`clamp(18px, 4vw, 56px)`). Sections stack with `clamp(72px, 10vw, 136px)` of block padding (tight variant `clamp(48px, 7vw, 96px)`), separated by a hairline top rule where content needs organising or by a tint change to paper-2 or red. A section head (max 880px; headline 18ch; lede 52ch) sits `clamp(36px, 5vw, 64px)` above its content.

Two-column sections split 5/7 (statement + services), 4/8 (booking aside + scheduler) or 6/6 (tracks) from 900–1000px, with the left column sticky below the 68px header (`top: calc(68px + 24px)`). The services grid is one column, then two at 640px with the first item spanning both. The journey is four equal columns from 860px. Staff and confirmation use a 12-column grid (`column-gap: clamp(16px, 2vw, 28px)`): portraits span 4 columns and alternate sides per row; confirmation steps put the big number in columns 1–3 and the body in 4–11. The homepage team strip is a 12-column asymmetric row (3/2/3/2/2 spans, every second portrait lifted 36px) that collapses on phones below 700px to an edge-bleeding horizontal scroller (64% wide cards, scroll-snap).

Breakpoints as used: 520 (adaptive button wraps), 560, 640, 700, 720 (document panel centres), 760, 860, 900 (header CTA appears, two-column layouts, full hero marks), 1000, 1200 (colour wheel and scribble). The header is 68px, sticky, paper at 88% with a 10px backdrop blur, gaining a hairline bottom rule once scrolled.

The hero fills `100svh - 68px` as a column with its content pushed to both ends. A top row (`clamp(96px, 16vh, 150px)` from the top, `clamp(110px, 20vh, 190px)` from 900px) splits 7fr/5fr at 900px, bottom-aligned: the circled MENTORSHIP and its italic sub on the left, the lede (46ch) and the two buttons on the right; on phones the row stacks. The band above the row is kept free of text and holds the printed marks: the swatch row top-left at the gutter, the halftone field, gradient bar and colour wheel in a line top-right (wheel at `calc(gutter + 250px)`, bar at `calc(gutter + 190px)`, 2–3% from the top), the registration mark at 46%/7% and the blue scribble at 32%/14% between them. The MNTR wordmark sits on the bottom edge (`clamp(28px, 5vh, 56px)` below the row) with the frame counter right-aligned 1.9em above it; `overflow: hidden` trims the letters at the sheet edge. Between 900 and 1199px the wheel and scribble are dropped; below 900px only the swatch row and a smaller dot field (96×90px) remain. Trim marks sit 10px inside each corner. The curved divider that closes the hero is `clamp(56px, 8vw, 110px)` tall.

## Elevation & Depth

Flat. Depth is tonal: paper, paper-2 and paper-3 for surfaces; ink and red as the two "drenched" surfaces (footer and final CTA); hairlines in two strengths do the rest. Frames (video, scheduler, cards) are a 1px strong rule, never a shadow. Hover states move or recolour; they do not lift. The two overlays use a scrim (ink at 40% for the navigation drawer, 55% for the document panel) and the drawer is a flat paper sheet with a left hairline.

### Shadow Vocabulary
- **Document lift** (`box-shadow: 0 24px 60px -24px rgba(21, 20, 19, 0.55)`): the policy document sheet only. It is the one object in the system that sits above the page rather than on it.

### Named Rules
**The One Shadow Rule.** The only shadow belongs to the document panel. No card, button, header or hover state casts one.

## Shapes

Sharp corners without exception: `border-radius: 0` on buttons, frames, cards, chips, inputs, the drawer and the document sheet. The circles that exist are printed marks, not UI: the conic colour wheel (120px ring, masked to a 46–47% hole), the registration mark (24px crosshair, 1.2px stroke), the play ring in an empty video frame (56–84px, 1.5px ink stroke) and the hand-drawn rings around the journey numbers. Trim marks are an 18px L of two 1px ink lines placed 10px inside each corner of the hero and the red closing section (paper on red). Portraits are 4:5 (team and directory) or 1:1 (management); video frames are 16:9.

Lines are the structural device: 1px hairlines in two alphas, a 1.5px ink curve with a 4px red start, 2px dashes as bullets (10–14px wide, red), 2px underlines (red, offset 0.16–0.18em), 2px burger bars, 1.5px plus/cross in the FAQ. The red marker stroke is a hand-drawn SVG path (`stroke-width: 5`, round caps; 3.5 in the thin variant used in the statement and the red closing headline; 3 on the 120×120 ring around journey numbers) drawn in with `pathLength="1"` dash animation over 0.7s, staggered through `--dd` (0.1s default; 0.1–0.7s across the four journey steps). Halftone fields are a radial-gradient dot grid (1.45px dots on an 11px cell; 1px on 12px in the video frame), red on paper and paper-at-70% on the red section, faded out at the bottom through a mask. The proof strip is six 18×9px chips: red, blue, yellow, green, pink, ink (paper replaces ink on the footer).

## Components

### Buttons
A sharp bar of ink with a red wipe. All variants share the same geometry and type; only fill and wipe colour differ.
- **Shape:** sharp (0), 1px border matching the fill, min-height 52px, padding 0 24px, condensed uppercase label (600, 0.86rem, 0.08em, wdth 92), 12px gap to a 16px inline arrow.
- **Primary (ink):** ink fill, paper text. Hover: a red `::before` panel slides in from the left (`translateX(-101%)` to 0, 260ms ease-out) and the border turns red; the arrow nudges 4px right. Active scales to 0.97.
- **Red:** red fill, paper text; the wipe is ink. This is the hero and section CTA.
- **Ghost:** transparent, ink text, strong-rule border; wipe is ink and text turns paper.
- **Paper:** paper fill and border, ink text; used on the red section; wipe is ink.
- **Sizes:** large 62px / 0 32px / 0.94rem; small 40px / 0 16px / 0.76rem (header Apply). The adaptive variant lets the long CTA label wrap below 520px.
- **Focus:** the wipe is applied on `:focus-visible` as well, plus the global 2px red outline offset 3px.

### Text link
Inline weight-600 text (0.95rem) with a 2px red underline that grows from 0 to 100% width on hover (260ms ease-out), 14px arrow nudging 3px. On red sections the underline is paper. Reading-text links use a plain 1px underline; emphasised ones (`ul-red`, "already applied") use a 2px red underline and turn red on hover.

### Language switch
Two 0.76rem uppercase cells inside one strong-rule hairline box, 7px 10px padding; the current language is an ink cell with paper text, the other turns red on hover.

### Cards / Containers
Boxes are rare and always the same: 1px strong (or ordinary) rule, paper-2 fill, sharp corners. Used for the guarantee remedy note (`clamp(18px, 2.4vw, 26px)` padding), the confirmation booking card (18px 20px), and neutral notices in policy text. The red notice variant uses a 1px red border on a faint red tint. Lists carry structure with top hairlines instead of cards: journey items (strong rule, red line drawing across on reveal in 150ms stagger, the number ringed by a thin red marker drawn in 0.2s apart), tracks, FAQ items, staff rows.

### Inputs / Fields
No native form fields of its own; the scheduler is an Acuity iframe inside the book-frame (white, strong-rule border, 820px min-height) with a loading state: a 120px by 2px rule with a 40%-wide red segment sliding across (0.9s ease-in-out loop), a label under it, then a fade-out when loaded; on failure the bar hides and fallback links show. Global `accent-color` and `caret-color` are red.

### Navigation
- **Header:** sticky 68px paper-at-88% bar with blur; brand mark 34px + "MNTR" (700, 1.2rem, 0.04em) and a small "Mentorship" label from 640px; right side: language switch, small ink Apply button from 900px, 44px burger (three 2px ink bars, morphing to a cross).
- **Drawer:** right-anchored paper sheet, `min(100%, 520px)`, slides in over 320ms on `cubic-bezier(0.32, 0.72, 0, 1)` behind a 40% ink scrim; items stagger in 40ms apart. Links are condensed uppercase (`clamp(1.5rem, 3.6vh, 2.2rem)`, 700, wdth 84) between hairlines; hover turns red and indents 8px. A "Policies" label introduces a list of red-dash policy buttons; the foot holds contact and the language switch. Focus is trapped and Escape closes.
- **Footer:** ink surface, paper text at 100/78/66/72% alphas, 4/2/2/2/2 column grid from 900px, label-style column heads, a proof strip in the bottom row and the "MNTR" wordmark fit to the full wrap width (800, wdth 100, 0.8 line-height), filled with the first frame of the hero sprite at 60% opacity, static (no stepping); the fallback is paper at 12%. It is the bookend of the hero.

### Policy document panel
The sheet is the system's only elevated object: paper, 1px strong rule, max 820px wide, bottom-anchored on phones and centred from 720px, entering with a 16px rise and 0.98 scale over 240ms. Head: "Document" label, condensed uppercase title (`clamp(1.4rem, 2.6vw, 2rem)`), 44px close. Tabs: uppercase 0.78rem buttons with a 2px underline that turns red when selected. Body at 1rem/1.6 with uppercase condensed h3s, numbered clauses in a `3.2em 1fr` grid with ink-3 tabular numbers, and a yellow highlighter (`mark.gap`) on unresolved legal text. Deep-linkable via `#policy=`.

### Hero
The signature: a proof sheet with trim marks in its four corners. The top row splits at 900px: left, MENTORSHIP (700, `clamp(2.6rem, 7.6vw, 7rem)`) widening from wdth 62 to 84 in six steps (0.5s) while a red marker stroke draws around it, and the italic sub "More than just tutoring" beneath; right, the lede and the red and ghost large buttons. Along the bottom edge the word MNTR (800, wdth 100, fit to the wrap width by `.fit`) is filled with `assets/media/hero-sprite.webp` through `background-clip: text` and steps through 12 frames every 2s (`steps(12, end)`, `background-size: auto 1200%`) while it is on screen; the fallback where clipping is unsupported is solid ink with a 1px ink text-stroke. A frame counter ("Frame 01 / 12", label style) sits above the wordmark's right end and is advanced by `mntr.js` every 2000/12 ms, restarting the sprite loop whenever it starts so the two agree; it pauses with the loop off-screen or in a hidden tab. Every hero element pops in on a numbered frame (`--s` × 83ms, `steps(1)`): MNTR 0, MENTORSHIP 1, dots 2, swatches 3, sub and bar 4, wheel 5, offer column and registration mark 6, scribble 8, counter 9. The printed marks live in the text-free top band: swatch row top-left (blue, pink, yellow, ink), halftone field, gradient bar (22×160px, ink to ink-3 to transparent) and colour wheel top-right, registration mark and blue scribble between; phones keep only the swatch row and a smaller dot field. The visible type is `aria-hidden`; the h1 is screen-reader-only ("MNTR Mentorship: more than just tutoring"). The curved divider (1.5px ink, 4px red start) draws in and closes the viewport. Reduced motion freezes the sprite on frame 0, shows MENTORSHIP at wdth 84 with everything visible, and leaves the counter at 01.

**Sprite provenance.** `assets/media/hero-sprite.webp` (640×7680px, 12 rows of 640×640, referenced as `hero-sprite.webp?v=2`) is built from the owner-supplied reference animation `v0.mp4`, kept unplayed at `assets/media/hero-reference-v0.mp4`. Each row is a collage tile of seven zoomed crops from the edges and corners of the matching frame (top-left and top-right corners, left and right strips, the top-centre band in the middle, bottom-left and bottom-right corners), deliberately excluding the goat at the centre of every frame; only the collage texture and the 12 fps rhythm ship. Produced with Pillow (LANCZOS, cover-fit per cell) and saved as WebP at quality 78. Regenerate from the reference clip with the same crop plan rather than replacing the texture.

### Video frame
A 16:9 paper-2 frame with a strong-rule border and a faint ink dot grid vignetted to the edges. Empty state: a 1.5px ink play ring on a paper-at-70% disc and the label "Video coming soon". Filled from `assets/js/media.js`; when media is present the dots and empty state disappear. The two slots (homepage sales video, confirmation explainer) ship empty by decision: no stock footage or placeholder thumbnail.

### Portraits
4:5 (1:1 for management) paper-3 blocks with `object-position: center 22%`. Under a hover-capable fine pointer the portrait becomes a proof print: the photo zooms 3% (0.5s), goes grayscale with contrast 1.15, a red multiply overlay (`::before`, opacity 0.55, 260ms) sits over it, and a proof strip fades in at the bottom-left corner. Touch devices see the plain photo. Missing photos show the initials (800, up to 7rem) over a 28% ink-3 halftone with a "Portrait to come" label.

### Final section
The red drenched closing block (`section--red.final`) is the second proof sheet: trim marks in paper at its corners, a paper halftone block top-left at the gutter (150×120px; 80×70px on phones), a vertical swatch stack bottom-right (blue, pink, yellow, paper; 46×18px, 30×12px on phones), a centred display headline (14ch) with the last word ringed by a thin paper marker, a paper lede and the paper button.

### FAQ
Hairline-separated rows; the question is a 600-weight button (wdth 92) with a 28px plus that rotates into a minus; the answer expands with a `grid-template-rows: 0fr → 1fr` transition (260ms) and reads in ink-2 at 66ch.

### Reveals
Content below the hero uses a single restrained reveal: 14px rise and fade over 0.5s ease-out, optional per-element delay. The draw-in (`.draw`, 0.7s, delay `--dd`), the journey red line and the journey number rings (0.1/0.3/0.5/0.7s) are the only other scroll-triggered motions. All motion collapses under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** set every heading in condensed Archivo (wdth 84, 700–800, uppercase, -0.02em) and every paragraph at wdth 100, 400.
- **Do** use red for exactly one job per view: the primary action, a marker stroke, a big figure, or a drenched closing section.
- **Do** organise content with 1px hairlines (rule 16% for ordinary, 42% for structural) before reaching for a box.
- **Do** keep swatch colours at printed-mark sizes (18×9px chips, 11px halftone cells, a 110px wheel).
- **Do** keep corners square (0) on every surface, including frames, chips and overlays.
- **Do** keep interface motion on `cubic-bezier(0.23, 1, 0.32, 1)` between 160 and 320ms; use stepped timing (`steps()`, 83ms frames) only for authored stop-motion.
- **Do** keep pending media slots empty and dimension-stable through `media.js`.
- **Do** keep the hero sprite tied to its reference clip; regenerate it from `hero-reference-v0.mp4` with the same edge-and-corner crop plan (goat excluded) rather than replacing the texture.
- **Do** size the MNTR wordmark with `.fit` (script fit-to-width) in the hero and footer; the footer copy stays static at 60%.
- **Do** keep the printed marks (trim marks, swatches, dots, wheel, bar, registration mark, scribble) `aria-hidden` and in text-free bands.

### Don't:
- **Don't** introduce a second family, a serif or a mono; the width axis is the whole typographic range.
- **Don't** add kickers or eyebrows above section headings; the label style is for functional labels inside components only.
- **Don't** use blue, yellow, green or pink as a background, text colour, badge or state.
- **Don't** add shadows anywhere but the document panel, and never on hover.
- **Don't** round a corner, pill a button or tint a card beyond paper-2.
- **Don't** add a dark theme; the system is light-only by decision.
- **Don't** place stock video, a fake thumbnail or a photo-of-student hero in a pending slot.
- **Don't** invent testimonials, numbers, prices or statistics as visual content; proof is the program structure and real people.
- **Don't** give the sprite fill, the frame counter or trim marks to any surface other than the hero, the red closing section and the footer wordmark.

## Homepage variant: Orwell structure (October 2026)

The `/en/` and `/fr/` homepages run a page-scoped variant (`assets/css/orwell.css`, `body.theme-o`) that overrides parts of the system above. Ground is cream `#f1eee8` with a darker band `#e8e4dc`; ink `#121211`. The first screen is a full-bleed photograph (Radcliffe Camera, Oxford; Julian Herzog, CC BY 4.0, credited in the hero corner and footer) pinned with `position: sticky`, and the content sits in a cream panel that scrolls up over it. The intro is a white bracket pair around "LOADING" that opens outward over 0.6s (`cubic-bezier(0.77, 0, 0.175, 1)`) while the sprite-filled MNTR is revealed from the centre by `clip-path`; the cream header then slides down. Headings are uppercase Archivo at wdth 112-115 and weight 500 for statements, weight 800 at wdth 92 for large headings; everything is centred. Text links are bracketed (`.o-link`), section edges are full-width hairlines, and the team appears as three portraits with the centre one larger. Red stays reserved for the primary Apply button. The staff page still uses the system above.

The homepage video section is split in two (`.o-split`): "Traditional Online Tutoring" left at weight 500 in ink-2, "Our Mentorship Program" right at weight 800 and a 1.14 share of the width, with one hairline between them carrying a small "or"; columns stack below 900px. The intro's wordmark slide is 25% longer than the original (the M halves meet a quarter of the way past centre), same 620ms and curve.

The confirmation pages use the same variant as panels: cream sections with a 14-22px radius, separated by 10-16px gaps that look through to the same Oxford photo fixed behind the page, never by a dark bar. Mentorship is always the left (wider) column and tutoring the right, in every section, so the two services can be followed down the page. Packages use hairline rules and a large threshold numeral, not cards; the contact form uses square, 1px-ruled fields. The "no rounded corners" rule above applies inside panels; the panel edge itself is the one rounded shape.
