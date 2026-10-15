/* =============================================================================
   MNTR — media configuration
   -----------------------------------------------------------------------------
   The single place that says which video plays where. Each page has a
   <div class="video-frame" data-slot="…">; mntr.js fills it from the entry
   below whose `slot` matches, using the file for the page's language.

   Paths are relative to the /assets/ folder (e.g. "media/video/pitch-en.mp4"),
   so they work on mntrtutoring.ca and when a page is opened from Finder.

   Every entry has an English and a French file. A page only ever loads the
   file for its own language: if one is missing, the slot stays an empty,
   dimension-stable placeholder rather than playing the other language.

   Every video has its subtitles burned into the picture (open captions), so
   no separate caption track is attached; one would show the same text twice.
   A `captions: { en, fr }` WebVTT entry is still supported if ever needed.

   To swap a video: replace the file in assets/media/video/ (keep the name),
   or point `src` at a new file. `embed` (YouTube/Vimeo URL) also works and
   takes priority over `src` when filled.

   Source files: ~/Desktop/VIDEOS FOR WEBSITE/NEW BATCH 2 (October 15, 2026;
   Welcome from the folder above it), compressed for the web with ffmpeg
   (H.264 1080p, CRF 27, AAC 128k, fast start); picture and sound unchanged:
     pitch-*     "R-Score Mentorship Program Pitch"        homepage, mentorship
     tintro-*    "Traditional Tutoring Intro"              homepage, tutoring
     welcome-*   "Welcome Before Your Call"                post-booking, top
     overview-*  "Mentorship Programs Overview"            post-booking, mentorship Q1
     cost-*      "Mentorship Program Cost"                 post-booking, mentorship Q2
     risk-*      "Mentorship Program Risk, How Risky..."   post-booking, mentorship Q3
     tcost-*     "Traditional Tutoring Cost"               post-booking, tutoring Q1
   ========================================================================== */
window.MNTR_MEDIA = {

  /* Homepage, right column "Our Mentorship Program". */
  homepageSalesVideo: {
    slot: 'HOMEPAGE_SALES_VIDEO',
    src:    { en: 'media/video/pitch-en.mp4',   fr: 'media/video/pitch-fr.mp4' },
    poster: { en: 'media/video/pitch-en.webp',  fr: 'media/video/pitch-fr.webp' },
    embed:  { en: '', fr: '' },
    title:  { en: 'MNTR Mentorship: the program in two minutes', fr: 'Mentorat MNTR : le programme en deux minutes' }
  },

  /* Post-booking page, top: personal welcome before the consultation. */
  welcomeVideo: {
    slot: 'WELCOME_VIDEO',
    src:    { en: 'media/video/welcome-en.mp4',  fr: 'media/video/welcome-fr.mp4' },
    poster: { en: 'media/video/welcome-en.webp', fr: 'media/video/welcome-fr.webp' },
    embed:  { en: '', fr: '' },
    title:  { en: 'Welcome before your call', fr: 'Bienvenue avant votre appel' }
  },

  /* Post-booking page, left column: what the mentorship offer includes. */
  offerVideo: {
    slot: 'OFFER_VIDEO',
    src:    { en: 'media/video/overview-en.mp4',  fr: 'media/video/overview-fr.mp4' },
    poster: { en: 'media/video/overview-en.webp', fr: 'media/video/overview-fr.webp' },
    embed:  { en: '', fr: '' },
    title:  { en: 'Our mentorship programs: Core and Intensive', fr: 'Nos programmes de mentorat : Core et Intensif' }
  },

  /* Homepage, left column "Traditional Online Tutoring". */
  tutorIntroVideo: {
    slot: 'TUTOR_INTRO_VIDEO',
    src:      { en: 'media/video/tintro-en.mp4',  fr: 'media/video/tintro-fr.mp4' },
    poster:   { en: 'media/video/tintro-en.webp', fr: 'media/video/tintro-fr.webp' },
    embed:    { en: '', fr: '' },
    title:    { en: 'Traditional tutoring at MNTR', fr: 'Le tutorat traditionnel chez MNTR' }
  },

  /* Post-booking page, mentorship question 2. */
  mentorCostVideo: {
    slot: 'MENTOR_COST_VIDEO',
    src:      { en: 'media/video/cost-en.mp4',  fr: 'media/video/cost-fr.mp4' },
    poster:   { en: 'media/video/cost-en.webp', fr: 'media/video/cost-fr.webp' },
    embed:    { en: '', fr: '' },
    title:    { en: 'How much does the mentorship program cost?', fr: 'Combien coûte le programme de mentorat?' }
  },

  /* Post-booking page, mentorship question 3. */
  mentorRiskVideo: {
    slot: 'MENTOR_RISK_VIDEO',
    src:      { en: 'media/video/risk-en.mp4',  fr: 'media/video/risk-fr.mp4' },
    poster:   { en: 'media/video/risk-en.webp', fr: 'media/video/risk-fr.webp' },
    embed:    { en: '', fr: '' },
    title:    { en: 'How risky is the mentorship program?', fr: 'Le programme de mentorat est-il risqué?' }
  },

  /* Post-booking page, tutoring question. */
  tutorCostVideo: {
    slot: 'TUTOR_COST_VIDEO',
    src:      { en: 'media/video/tcost-en.mp4',  fr: 'media/video/tcost-fr.mp4' },
    poster:   { en: 'media/video/tcost-en.webp', fr: 'media/video/tcost-fr.webp' },
    embed:    { en: '', fr: '' },
    title:    { en: 'How much does tutoring cost?', fr: 'Combien coûte le tutorat?' }
  },

  /* Further videos: add entries with their own `slot` name. */
  additionalVideos: {}
};
