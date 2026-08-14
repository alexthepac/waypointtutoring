/* =============================================================================
   MNTR Tutoring — "book your sessions" email sender (Google Apps Script)

   Deployed as a Web App, this receives a POST from the Cloudflare Worker each
   time a package is purchased on Stripe, and emails the customer their booking
   link from your own Gmail (mntrtutoring.info@gmail.com). That way, if they
   ever lose the thank-you-page link, the email always gets them back to the
   booking calendar — and they book every session of their package from it.

   The Worker is the ONLY thing allowed to trigger this: every request must
   include the shared SECRET_TOKEN below, which also lives in the Worker as the
   BOOKING_EMAIL_TOKEN secret. Requests without the exact token are ignored, so
   a stranger who finds this URL can't use it to send email.

   -------- SETUP (about 5 minutes) --------
   1. Go to https://script.google.com  ->  New project.
   2. Delete the sample code, paste this whole file in.
   3. Change SECRET_TOKEN below to a long random string of your own (letters +
      numbers, ~30 chars). Keep a copy — you'll paste the SAME value into the
      Worker's BOOKING_EMAIL_TOKEN secret.
   4. Deploy -> New deployment -> type "Web app".
        - Execute as: Me (mntrtutoring.info@gmail.com)
        - Who has access: Anyone
      Deploy, authorise when Google asks (it needs permission to send email
      as you), and copy the /exec URL it gives you.
   5. Paste that /exec URL into the Worker's BOOKING_EMAIL_URL secret.

   NOTE: after editing this file you must deploy a NEW VERSION for the change
   to go live (Deploy -> Manage deployments -> edit -> Version: New version).
   ========================================================================== */

/* CHANGE THIS to your own long random string, and use the same value for the
   Worker's BOOKING_EMAIL_TOKEN secret. */
var SECRET_TOKEN = 'CHANGE_ME_to_a_long_random_string_1234567890';

/* Every package, keyed by the `package` metadata value set on its Stripe
   Payment Link. Each one points at its own hidden, FREE Cal.com event — the
   customer has already paid, so the calendar must not charge again. */
var PACKAGES = {
  'tutorat-5': {
    nameEn: 'Academic tutoring, 5-session package',
    nameFr: 'Tutorat scolaire, forfait 5 séances',
    detailEn: 'Five 60-minute one-on-one sessions, online',
    detailFr: 'Cinq séances individuelles de 60 minutes, en ligne',
    url: 'https://cal.com/mntr-iif8ix/1-on-1-tutoring-copy'
  },
  'methode-casper': {
    nameEn: 'Casper Preparation',
    nameFr: 'Préparation Casper',
    detailEn: 'Seven one-on-one sessions of 60 to 90 minutes, online',
    detailFr: 'Sept séances individuelles de 60 à 90 minutes, en ligne',
    url: 'https://cal.com/mntr-iif8ix/1-on-1-casper-prep-package'
  },
  'methode-mem': {
    nameEn: 'Interview Preparation (MMI)',
    nameFr: 'Préparation aux entrevues (MEM)',
    detailEn: 'Seven one-on-one sessions of 60 to 90 minutes, online',
    detailFr: 'Sept séances individuelles de 60 à 90 minutes, en ligne',
    url: 'https://cal.com/mntr-iif8ix/mmi-prep-package'
  },
  'methode-integrale': {
    nameEn: 'Combined Preparation · Casper + interviews',
    nameFr: 'Préparation combinée · Casper + entrevues',
    detailEn: 'Fourteen one-on-one sessions of 60 to 90 minutes, online',
    detailFr: 'Quatorze séances individuelles de 60 à 90 minutes, en ligne',
    url: 'https://cal.com/mntr-iif8ix/mmi-and-casper-prep-package'
  }
};

/* Used only when the Payment Link carries no `package` metadata. $500 is
   deliberately absent: Casper and MMI both cost that, so guessing would be
   wrong half the time — those fall through to the every-link email instead. */
var AMOUNT_FALLBACK = {
  20000: 'tutorat-5',
  90000: 'methode-integrale'
};

/* Logo shown at the top of the email — the dark mountain mark, hosted on the
   live site, since it needs to be visible on the email's white background. */
var LOGO_URL = 'https://mntrtutoring.ca/logo-mark.png';

var CONTACT_EMAIL = 'mntrtutoring.info@gmail.com';

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};

    /* Only the Worker (which knows the token) may send email. */
    if (!p.token || p.token !== SECRET_TOKEN) {
      return _text('forbidden');
    }

    var email = (p.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return _text('bad email');
    }

    var name = (p.name || '').trim();
    var amount = parseInt(p.amount, 10);
    if (isNaN(amount) || amount < 0) amount = 0;

    /* Resolve the package: the Payment Link's metadata first, then the amount,
       then nothing (which sends the every-link version). */
    var key = (p.pkg || '').trim();
    var pack = PACKAGES[key] || PACKAGES[AMOUNT_FALLBACK[amount]] || null;

    var greetingEn = name ? ('Hi ' + name + ',') : 'Hi there,';
    var greetingFr = name ? ('Bonjour ' + name + ',') : 'Bonjour,';
    var paid = amount ? _money(amount) : '';

    var subject = pack
      ? (pack.nameEn + ' · book your sessions')
      : 'Book your MNTR Tutoring sessions · Réservez vos sessions';

    var htmlBody = pack
      ? _htmlForPackage(pack, greetingEn, greetingFr, paid)
      : _htmlForUnknown(greetingEn, greetingFr, paid);

    var plainBody = pack
      ? _plainForPackage(pack, greetingEn, greetingFr, paid)
      : _plainForUnknown(greetingEn, greetingFr, paid);

    GmailApp.sendEmail(email, subject, plainBody, {
      name: 'MNTR Tutoring',
      htmlBody: htmlBody,
      replyTo: CONTACT_EMAIL
    });

    return _text('sent');
  } catch (err) {
    return _text('error');
  }
}

/* ------------------------------------------------------------ templates -- */

function _shell(inner) {
  return '<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#16141c;line-height:1.6">' +
    '<p style="text-align:center;margin:0 0 24px">' +
      '<img src="' + LOGO_URL + '" alt="MNTR Tutoring" width="40" height="40" style="display:inline-block" />' +
    '</p>' + inner +
    '<p style="font-size:13px;color:#666;margin-top:28px">MNTR Tutoring · Québec<br>' +
      'Questions? Just reply to this email. · Des questions? Répondez à ce courriel.</p>' +
  '</div>';
}

function _button(url, label) {
  return '<p style="text-align:center;margin:28px 0 12px">' +
    '<a href="' + url + '" style="background:#16141c;color:#fff;text-decoration:none;' +
    'font-weight:bold;padding:14px 28px;border-radius:8px;display:inline-block">' + label + '</a>' +
  '</p>';
}

/* A small receipt block: what they bought, what it includes, what they paid. */
function _receipt(rows) {
  var out = '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;' +
    'background:#f7f5f1;border-radius:10px;padding:4px 0;margin:20px 0">';
  for (var i = 0; i < rows.length; i++) {
    out += '<tr>' +
      '<td style="padding:8px 16px;font-size:13px;color:#6d675f;white-space:nowrap;vertical-align:top">' + _esc(rows[i][0]) + '</td>' +
      '<td style="padding:8px 16px;font-size:14px;color:#16141c;font-weight:bold">' + _esc(rows[i][1]) + '</td>' +
    '</tr>';
  }
  return out + '</table>';
}

function _htmlForPackage(pack, greetingEn, greetingFr, paid) {
  var rowsEn = [['Package', pack.nameEn], ['Includes', pack.detailEn]];
  if (paid) rowsEn.push(['Paid', paid]);
  var rowsFr = [['Forfait', pack.nameFr], ['Comprend', pack.detailFr]];
  if (paid) rowsFr.push(['Payé', paid]);

  return _shell(
    '<h2 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px">Thank you for your purchase!</h2>' +
    '<p>' + _esc(greetingEn) + '</p>' +
    '<p>Your package is confirmed. Use the button below to book your sessions — ' +
      '<strong>keep this email</strong>, because you book <em>every</em> session of your ' +
      'package from this same link, whenever you are ready.</p>' +
    _receipt(rowsEn) +
    _button(pack.url, 'Book your sessions') +
    '<p style="font-size:13px;color:#666">If the button does not work, paste this into your browser:<br>' +
      '<a href="' + pack.url + '" style="color:#16141c">' + pack.url + '</a></p>' +
    '<p style="font-size:13px;color:#666">Need to reschedule? Use the link in your Cal.com confirmation, ' +
      'or reply to this email and we will move it for you.</p>' +
    '<hr style="border:none;border-top:1px solid #eee;margin:28px 0">' +
    '<h2 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px">Merci pour votre achat!</h2>' +
    '<p>' + _esc(greetingFr) + '</p>' +
    '<p>Votre forfait est confirmé. Utilisez le bouton ci-dessus pour réserver vos séances — ' +
      '<strong>gardez ce courriel</strong>, car vous réservez <em>chaque</em> séance de votre ' +
      'forfait à partir de ce même lien, quand vous le souhaitez.</p>' +
    _receipt(rowsFr) +
    '<p style="font-size:13px;color:#666">Besoin de reporter une séance? Utilisez le lien de votre ' +
      'confirmation Cal.com, ou répondez à ce courriel et nous la déplacerons pour vous.</p>'
  );
}

function _plainForPackage(pack, greetingEn, greetingFr, paid) {
  return greetingEn + '\n\n' +
    'Your package is confirmed. Keep this email: you book every session of your ' +
    'package from this same link, whenever you are ready.\n\n' +
    'Package: ' + pack.nameEn + '\n' +
    'Includes: ' + pack.detailEn + '\n' +
    (paid ? 'Paid: ' + paid + '\n' : '') +
    'Book here: ' + pack.url + '\n\n' +
    'Need to reschedule? Reply to this email.\n\n' +
    '-----\n\n' +
    greetingFr + '\n\n' +
    'Votre forfait est confirmé. Gardez ce courriel : vous réservez chaque séance ' +
    'de votre forfait à partir de ce même lien.\n\n' +
    'Forfait : ' + pack.nameFr + '\n' +
    'Comprend : ' + pack.detailFr + '\n' +
    (paid ? 'Payé : ' + paid + '\n' : '') +
    'Réservez ici : ' + pack.url + '\n\n' +
    'MNTR Tutoring · Québec';
}

/* No package metadata and an amount that cannot identify one (a $500 purchase
   is either Casper or MMI). Sends every link, clearly labelled. */
function _htmlForUnknown(greetingEn, greetingFr, paid) {
  var links = '';
  var order = ['methode-casper', 'methode-mem', 'methode-integrale', 'tutorat-5'];
  for (var i = 0; i < order.length; i++) {
    var pk = PACKAGES[order[i]];
    links += '<p style="margin:0 0 10px;font-size:14px">' +
      _esc(pk.nameEn) + ': <a href="' + pk.url + '" style="color:#16141c">' + pk.url + '</a></p>';
  }
  return _shell(
    '<h2 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px">Thank you for your purchase!</h2>' +
    '<p>' + _esc(greetingEn) + '</p>' +
    '<p>Your package is confirmed' + (paid ? ' (' + _esc(paid) + ')' : '') + '. Use the link below that ' +
      'matches what you bought — <strong>keep this email</strong>, because you book every ' +
      'session of your package from that same link.</p>' +
    links +
    '<hr style="border:none;border-top:1px solid #eee;margin:28px 0">' +
    '<h2 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px">Merci pour votre achat!</h2>' +
    '<p>' + _esc(greetingFr) + '</p>' +
    '<p>Votre forfait est confirmé. Utilisez le lien ci-dessus correspondant à votre achat, ' +
      'et <strong>gardez ce courriel</strong> pour réserver chaque séance.</p>'
  );
}

function _plainForUnknown(greetingEn, greetingFr, paid) {
  var lines = '';
  var order = ['methode-casper', 'methode-mem', 'methode-integrale', 'tutorat-5'];
  for (var i = 0; i < order.length; i++) {
    lines += PACKAGES[order[i]].nameEn + ': ' + PACKAGES[order[i]].url + '\n';
  }
  return greetingEn + '\n\n' +
    'Your package is confirmed' + (paid ? ' (' + paid + ')' : '') + '. Book with the link that ' +
    'matches what you bought, and keep this email so you can book each session:\n\n' +
    lines + '\n' +
    '-----\n\n' +
    greetingFr + '\n\n' +
    'Votre forfait est confirmé. Réservez avec le lien correspondant à votre achat, ' +
    'et gardez ce courriel pour réserver chaque séance.\n\n' +
    'MNTR Tutoring · Québec';
}

/* ---------------------------------------------------------------- utils -- */

/* Cents to a dollar string: 20000 -> "$200", 16250 -> "$162.50". */
function _money(cents) {
  var d = cents / 100;
  return '$' + (d % 1 === 0 ? String(d) : d.toFixed(2));
}

function _text(s) {
  return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.TEXT);
}

function _esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
