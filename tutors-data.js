/* ===================================================================
   TUTOR ROSTER  ·  the single source of truth

   Read by the booking board (tutors.html, tuteurs-fr.html) and by the
   thank-you pages, so a tutor added or changed here appears everywhere
   at once. Edit this file, not the pages.

   cal    each tutor's own Cal.com event. Empty until that person has
          one; their card then shows a disabled button instead of a
          dead link.
   does   which packages they can be booked for. A buyer only ever sees
          the people who can take their booking.
   en/fr  the wording shown on each language's pages.

   AFTER EDITING THIS FILE, bump the ?v= number on the four
   <script src="tutors-data.js?v=..."> tags (tutors.html, tuteurs-fr.html,
   thank-you.html, thank-you-fr.html). Browsers cache this file, so without
   a new number a visitor who has been on the site before keeps seeing the
   old roster.
   =================================================================== */
window.MNTR_TUTORS = {

  /* Which kind of package each checkout service key belongs to. A key
     that is not listed shows everyone, which is the safe way to be wrong. */
  SERVICE_KIND: {
    'tutorat-5': 'tutoring', 'tutorat-1': 'tutoring', pack5: 'tutoring', pack10: 'tutoring',
    'methode-casper': 'casper', 'casper-pack5': 'casper', 'casper-pack10': 'casper',
    'casper-hourly': 'casper',
    'methode-mem': 'interview', 'methode-integrale': 'interview'
  },

  list: [
  { key: 'james', name: 'James', photo: 'james.jpeg',
    cal: 'https://cal.com/mntr-iif8ix/tutoring-with-james',
    acuity: '',
    does: ['tutoring', 'casper', 'interview'],
    en: { school: 'Med-P at McGill', teaches: 'Tutoring, Casper and interview prep, high school and CEGEP', langs: 'English', avail: 'Mon, Wed & Sat mornings, Tue & Wed evenings' },
    fr: { school: 'Med-P à McGill', teaches: 'Tutorat, préparation Casper et entrevues, secondaire et cégep', langs: 'Anglais', avail: 'Lun, mer et sam en matinée, mar et mer en soirée' } },
  { key: 'daphne', name: 'Daphne', photo: 'daphne.jpg',
    cal: 'https://cal.com/mntr-iif8ix/tutoring-with-daphne',
    acuity: '',
    does: ['casper', 'interview'],
    en: { school: 'Med-P at McGill', teaches: 'Everything in high school and CEGEP, plus Casper and interview prep', langs: 'English and French', avail: 'Mon, Wed & Thu mornings' },
    fr: { school: 'Med-P à McGill', teaches: 'Tout le secondaire et le cégep, plus la préparation Casper et entrevues', langs: 'Français et anglais', avail: 'Lun, mer et jeu en matinée' } },
  { key: 'bassma', name: 'Bassma', photo: 'bassma.jpg',
    cal: 'https://cal.com/mntr-iif8ix/casper-prep-package-bassma',
    acuity: '',
    does: ['casper', 'interview'],
    en: { school: 'Université de Sherbrooke · School of Medicine', teaches: 'Casper and interview prep only', langs: 'English and French', avail: 'Saturday & Sunday mornings' },
    fr: { school: 'Université de Sherbrooke · Faculté de médecine', teaches: 'Préparation Casper et entrevues seulement', langs: 'Français et anglais', avail: 'Samedi et dimanche en matinée' } },
  { key: 'mani', name: 'Mani', photo: 'Mani%20pic.jpg',
    cal: 'https://cal.com/mntr-iif8ix/tutoring-with-mani',
    acuity: '',
    does: [],
    en: { school: 'Dawson College · Enriched Pure and Applied Sciences', teaches: 'High school and CEGEP sciences', langs: 'English', avail: 'Weeknights and weekends' },
    fr: { school: 'Collège Dawson · Sciences pures et appliquées enrichies', teaches: 'Sciences du secondaire et du cégep', langs: 'Anglais', avail: 'Soirs de semaine et fins de semaine' } },
  { key: 'noa', name: 'Noa', photo: 'noa.jpg',
    cal: '',
    acuity: '',
    does: ['tutoring', 'casper'],
    en: { school: 'McGill University · Honours Mathematics and Physics', teaches: 'Mathematics and physics', langs: 'English and French', avail: '' },
    fr: { school: 'Université McGill · Mathématiques et physique (Honours)', teaches: 'Mathématiques et physique', langs: 'Français et anglais', avail: '' } },
  { key: 'ziyi', name: 'Ziyi', photo: 'ziyi.jpg',
    cal: 'https://cal.com/mntr-iif8ix/tutoring-with-ziyi',
    acuity: '',
    does: ['tutoring', 'casper', 'interview'],
    en: { school: 'Med-P at McGill', teaches: 'French tutoring, plus Casper and interview prep', langs: 'English and French', avail: 'Weeknights and weekends' },
    fr: { school: 'Med-P à McGill', teaches: 'Tutorat en français, plus la préparation Casper et entrevues', langs: 'Français et anglais', avail: 'Soirs de semaine et fins de semaine' } },
  { key: 'lea', name: 'Lea', photo: '',
    cal: 'https://cal.com/mntr-iif8ix/lea-bookings',
    acuity: '',
    does: ['tutoring', 'casper', 'interview'],
    en: { school: 'Med-P at McGill', teaches: 'Casper prep, plus academic tutoring', langs: 'English and French', avail: 'Wednesdays, Fridays and weekends' },
    fr: { school: 'Med-P à McGill', teaches: 'Préparation Casper, ainsi que le tutorat académique', langs: 'Français et anglais', avail: 'Mercredis, vendredis et fins de semaine' } },
  { key: 'daniel', name: 'Daniel', photo: 'daniel.jpg',
    cal: 'https://cal.com/mntr-iif8ix/booking-with-daniel',
    acuity: '',
    does: ['tutoring', 'casper'],
    en: { school: 'Medical student at Université de Montréal', teaches: 'Casper prep, plus CEGEP tutoring', langs: 'English and French', avail: '' },
    fr: { school: 'Étudiant en médecine à l’Université de Montréal', teaches: 'Préparation Casper, ainsi que le tutorat au cégep', langs: 'Français et anglais', avail: '' } },
  { key: 'laura', name: 'Laura', photo: 'laura.jpg',
    cal: 'https://cal.com/mntr-iif8ix/laura-bookings',
    acuity: '',
    does: ['tutoring', 'casper'],
    en: { school: 'Med-P at McGill', teaches: 'Tutoring and Casper prep', langs: 'English and French', avail: 'Mon to Wed after 4pm, Thu after 9pm, weekends after 10am' },
    fr: { school: 'Med-P à McGill', teaches: 'Tutorat et préparation Casper', langs: 'Français et anglais', avail: 'Lun au mer après 16 h, jeu après 21 h, fins de semaine après 10 h' } }
  ],

  /* The tutors to offer for a given checkout service key, bookable ones
     first. An unknown key, or one nobody covers, returns everyone rather
     than an empty page. */
  /* ACUITY SCHEDULER: where booking now happens. */
  SCHEDULER: 'https://app.acuityscheduling.com/schedule.php?owner=40491971',

  /* Services still paid on Stripe. Their buyers have no package in Acuity,
     so sending them there risks charging them twice: they keep booking on
     each tutor's Cal.com link until these packages move to Acuity too, at
     which point this list empties and the Cal.com links can go. */
  STRIPE_PAID: ['methode-mem', 'methode-integrale'],

  /* Where this tutor's booking button goes for a given purchase. */
  link: function (t, service) {
    if (this.STRIPE_PAID.indexOf(service) !== -1) return t.cal || '';
    return t.acuity || this.SCHEDULER;
  },

  /* True when the link is this tutor's own calendar rather than the shared
     scheduler, so the button can say "Book with <name>" honestly. */
  isPersonal: function (t, service) {
    var l = this.link(t, service);
    return !!l && l !== this.SCHEDULER;
  },

  /* The tutors to offer for a given checkout service key, those with their
     own bookable calendar first. An unknown key, or one nobody covers,
     returns everyone rather than an empty page. */
  forService: function (service) {
    var self = this;
    var kind = this.SERVICE_KIND[service] || '';
    var list = this.list.slice();
    if (kind) {
      var matching = list.filter(function (t) { return t.does.indexOf(kind) !== -1; });
      if (matching.length) list = matching;
    }
    return list.sort(function (a, b) {
      return (self.isPersonal(b, service) ? 1 : 0) - (self.isPersonal(a, service) ? 1 : 0);
    });
  }
};
