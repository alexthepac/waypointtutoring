/* =============================================================================
   MNTR Tutoring — "book your sessions" email sender (Google Apps Script)

   Deployed as a Web App, this receives a POST from the Cloudflare Worker each
   time a package is purchased on Stripe, and emails the customer their booking
   link from your own Gmail (mntrtutoring.info@gmail.com). That way, if they
   ever lose the thank-you-page link, the email always gets them back to the
   booking calendar.

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
   ========================================================================== */

/* CHANGE THIS to your own long random string, and use the same value for the
   Worker's BOOKING_EMAIL_TOKEN secret. */
var SECRET_TOKEN = 'CHANGE_ME_to_a_long_random_string_1234567890';

/* The hidden, free Cal.com event where package customers book their sessions. */
var BOOKING_URL = 'https://cal.com/mntr-iif8ix/1-on-1-tutoring-copy';

/* Logo shown at the top of the email — the dark mountain mark, hosted on the
   live site, since it needs to be visible on the email's white background. */
var LOGO_URL = 'https://mntrtutoring.ca/logo-mark.png';

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
    var greetingEn = name ? ('Hi ' + name + ',') : 'Hi there,';
    var greetingFr = name ? ('Bonjour ' + name + ',') : 'Bonjour,';

    var subject = 'Book your MNTR Tutoring sessions · Réservez vos sessions';

    var htmlBody =
      '<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#16141c;line-height:1.6">' +
        '<p style="text-align:center;margin:0 0 24px">' +
          '<img src="' + LOGO_URL + '" alt="MNTR Tutoring" width="40" height="40" style="display:inline-block" />' +
        '</p>' +
        '<h2 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px">Thank you for your purchase!</h2>' +
        '<p>' + _esc(greetingEn) + '</p>' +
        '<p>Your tutoring package is confirmed. Use the button below to schedule your sessions — ' +
          '<strong>bookmark this email</strong> so you can come back and book each session whenever you\'re ready.</p>' +
        '<p style="text-align:center;margin:28px 0">' +
          '<a href="' + BOOKING_URL + '" style="background:#16141c;color:#fff;text-decoration:none;' +
          'font-weight:bold;padding:14px 28px;border-radius:8px;display:inline-block">Book your sessions</a>' +
        '</p>' +
        '<p style="font-size:13px;color:#666">Or paste this link into your browser:<br>' +
          '<a href="' + BOOKING_URL + '" style="color:#16141c">' + BOOKING_URL + '</a></p>' +
        '<hr style="border:none;border-top:1px solid #eee;margin:28px 0">' +
        '<h2 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px">Merci pour votre achat!</h2>' +
        '<p>' + _esc(greetingFr) + '</p>' +
        '<p>Votre forfait de tutorat est confirmé. Utilisez le bouton ci-dessus pour planifier vos sessions — ' +
          '<strong>gardez ce courriel</strong> pour revenir réserver chaque session quand vous le souhaitez.</p>' +
        '<p style="font-size:13px;color:#666;margin-top:28px">MNTR Tutoring · Québec<br>' +
          'Des questions? Répondez simplement à ce courriel.</p>' +
      '</div>';

    var plainBody =
      greetingEn + '\n\n' +
      'Your tutoring package is confirmed. Book your sessions here (keep this ' +
      'email so you can book each one whenever you\'re ready):\n' +
      BOOKING_URL + '\n\n' +
      '-----\n\n' +
      greetingFr + '\n\n' +
      'Votre forfait est confirmé. Réservez vos sessions ici (gardez ce ' +
      'courriel pour réserver chacune quand vous le souhaitez):\n' +
      BOOKING_URL + '\n\n' +
      'MNTR Tutoring · Québec';

    GmailApp.sendEmail(email, subject, plainBody, {
      name: 'MNTR Tutoring',
      htmlBody: htmlBody,
    });

    return _text('sent');
  } catch (err) {
    return _text('error');
  }
}

function _text(s) {
  return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.TEXT);
}

function _esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
