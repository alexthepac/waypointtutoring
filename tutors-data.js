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
    does: ['tutoring', 'casper', 'interview'],
    en: { school: 'Med-P at McGill', teaches: 'Tutoring, Casper and interview prep, high school and CEGEP', langs: 'English', avail: 'Mon, Wed & Sat mornings, Tue & Wed evenings' },
    fr: { school: 'Med-P à McGill', teaches: 'Tutorat, préparation Casper et entrevues, secondaire et cégep', langs: 'Anglais', avail: 'Lun, mer et sam en matinée, mar et mer en soirée' } },
  { key: 'daphne', name: 'Daphne', photo: 'daphne.jpg',
    cal: 'https://cal.com/mntr-iif8ix/tutoring-with-daphne',
    does: ['casper', 'interview'],
    en: { school: 'Med-P at McGill', teaches: 'Everything in high school and CEGEP, plus Casper and interview prep', langs: 'English and French', avail: 'Mon, Wed & Thu mornings' },
    fr: { school: 'Med-P à McGill', teaches: 'Tout le secondaire et le cégep, plus la préparation Casper et entrevues', langs: 'Français et anglais', avail: 'Lun, mer et jeu en matinée' } },
  { key: 'bassma', name: 'Bassma', photo: 'bassma.jpg',
    cal: 'https://cal.com/mntr-iif8ix/casper-prep-package-bassma',
    does: ['casper', 'interview'],
    en: { school: 'Université de Sherbrooke · School of Medicine', teaches: 'Casper and interview prep only', langs: 'English and French', avail: 'Saturday & Sunday mornings' },
    fr: { school: 'Université de Sherbrooke · Faculté de médecine', teaches: 'Préparation Casper et entrevues seulement', langs: 'Français et anglais', avail: 'Samedi et dimanche en matinée' } },
  { key: 'mani', name: 'Mani', photo: 'Mani%20pic.jpg',
    cal: 'https://cal.com/mntr-iif8ix/tutoring-with-mani',
    does: [],
    en: { school: 'Dawson College · Enriched Pure and Applied Sciences', teaches: 'High school and CEGEP sciences', langs: 'English', avail: 'Weeknights and weekends' },
    fr: { school: 'Collège Dawson · Sciences pures et appliquées enrichies', teaches: 'Sciences du secondaire et du cégep', langs: 'Anglais', avail: 'Soirs de semaine et fins de semaine' } },
  { key: 'noa', name: 'Noa', photo: 'noa.jpg',
    cal: '',
    does: ['tutoring', 'casper'],
    en: { school: 'McGill University · Honours Mathematics and Physics', teaches: 'Mathematics and physics', langs: 'English and French', avail: '' },
    fr: { school: 'Université McGill · Mathématiques et physique (Honours)', teaches: 'Mathématiques et physique', langs: 'Français et anglais', avail: '' } },
  { key: 'ziyi', name: 'Ziyi', photo: 'ziyi.jpg',
    cal: 'https://cal.com/mntr-iif8ix/tutoring-with-ziyi',
    does: ['tutoring', 'casper', 'interview'],
    en: { school: 'Med-P at McGill', teaches: 'French tutoring, plus Casper and interview prep', langs: 'English and French', avail: 'Weeknights and weekends' },
    fr: { school: 'Med-P à McGill', teaches: 'Tutorat en français, plus la préparation Casper et entrevues', langs: 'Français et anglais', avail: 'Soirs de semaine et fins de semaine' } },
  { key: 'lea', name: 'Lea', photo: '',
    cal: 'https://cal.com/mntr-iif8ix/lea-bookings',
    does: ['tutoring', 'casper', 'interview'],
    en: { school: 'Med-P at McGill', teaches: 'Casper prep, plus academic tutoring', langs: 'English and French', avail: 'Wednesdays, Fridays and weekends' },
    fr: { school: 'Med-P à McGill', teaches: 'Préparation Casper, ainsi que le tutorat académique', langs: 'Français et anglais', avail: 'Mercredis, vendredis et fins de semaine' } },
  { key: 'daniel', name: 'Daniel', photo: '',
    cal: 'https://cal.com/mntr-iif8ix/booking-with-daniel',
    does: ['tutoring', 'casper'],
    en: { school: 'McGill School of Medicine', teaches: 'Casper prep, plus CEGEP tutoring', langs: '', avail: '' },
    fr: { school: 'École de médecine de McGill', teaches: 'Préparation Casper, ainsi que le tutorat au cégep', langs: '', avail: '' } }
  ],

  /* The tutors to offer for a given checkout service key, bookable ones
     first. An unknown key, or one nobody covers, returns everyone rather
     than an empty page. */
  forService: function (service) {
    var kind = this.SERVICE_KIND[service] || '';
    var list = this.list.slice();
    if (kind) {
      var matching = list.filter(function (t) { return t.does.indexOf(kind) !== -1; });
      if (matching.length) list = matching;
    }
    return list.sort(function (a, b) { return (b.cal ? 1 : 0) - (a.cal ? 1 : 0); });
  }
};
