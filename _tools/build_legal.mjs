#!/usr/bin/env node
/* Builds the static legal pages from the same text the policy viewer uses:
     assets/js/policies.en.js -> en/legal/index.html
     assets/js/policies.fr.js -> fr/juridique/index.html
   Header, menu and footer are taken from the post-booking page (same folder
   depth), so the three stay identical. Run from the site root after editing
   a policy:  node _tools/build_legal.mjs */
import fs from 'node:fs';

const L = {
  en: {
    dir: 'en/legal', conf: 'en/confirmation/index.html', twinConf: '../../fr/confirmation/', twin: '../../fr/juridique/',
    title: 'Legal: terms, policies and privacy | MNTR Tutoring',
    desc: 'MNTR Tutoring terms and conditions, R-score guarantee terms, cancellation and payment policies, privacy policy and privacy choices.',
    h1: 'Legal', lede: 'Our terms, our policies and your privacy choices, in one place. Nothing here requires an account, a booking or accepting cookies.',
    toc: 'On this page', choices: 'Privacy choices', choicesBtn: 'Change your cookie choices',
    reqH: 'Privacy requests', req: 'To access, correct or delete your personal information, withdraw consent, or make a complaint, write to <a href="mailto:mntrtutoring.info@gmail.com">mntrtutoring.info@gmail.com</a> (see section 2 of the privacy policy).',
    top: 'Back to top', current: 'Legal', canon: 'https://mntrtutoring.ca/en/legal/',
    cancel: {
      h: 'Cancel a contract online',
      intro: 'Clients can cancel their tutoring or mentorship contract at any time by sending a notice: with this form, by email to <a href="mailto:mntrtutoring.info@gmail.com">mntrtutoring.info@gmail.com</a>, or with the cancellation form attached to your contract. Under our <a href="#cancellation" data-policy="cancellation">cancellation policy</a>, the contract ends on the date the notice is sent; any amount owing or refund is calculated under that policy and the Consumer Protection Act.',
      name: 'Your name', nameHint: '(the person who signed the contract)', email: 'Email you use with MNTR', student: 'Student’s name', program: 'Program',
      programs: [['core', 'Core'], ['intensive', 'Intensive'], ['tutoring', 'Traditional tutoring'], ['other', 'Other']], choose: 'Choose…',
      message: 'Message', optional: '(optional; no reason is needed)', send: 'Send cancellation notice',
    },
  },
  fr: {
    dir: 'fr/juridique', conf: 'fr/confirmation/index.html', twinConf: '../../en/confirmation/', twin: '../../en/legal/',
    title: 'Informations juridiques : conditions, politiques et confidentialité | Tutorat MNTR',
    desc: 'Conditions générales de Tutorat MNTR, garantie de cote R, politiques d’annulation et de paiement, politique de confidentialité et choix en matière de témoins.',
    h1: 'Informations juridiques', lede: 'Nos conditions, nos politiques et vos choix de confidentialité, au même endroit. Aucun compte, aucune réservation ni aucun témoin n’est requis pour les consulter.',
    toc: 'Sur cette page', choices: 'Choix de confidentialité', choicesBtn: 'Modifier vos choix de témoins',
    reqH: 'Demandes relatives à vos renseignements', req: 'Pour accéder à vos renseignements personnels, les faire rectifier ou supprimer, retirer votre consentement ou déposer une plainte, écrivez à <a href="mailto:mntrtutoring.info@gmail.com">mntrtutoring.info@gmail.com</a> (voir la section 2 de la politique de confidentialité).',
    top: 'Haut de page', current: 'Informations juridiques', canon: 'https://mntrtutoring.ca/fr/juridique/',
    cancel: {
      h: 'Annuler un contrat en ligne',
      intro: 'Les clients peuvent annuler leur contrat de tutorat ou de mentorat en tout temps en envoyant un avis : avec ce formulaire, par courriel à <a href="mailto:mntrtutoring.info@gmail.com">mntrtutoring.info@gmail.com</a>, ou avec le formulaire d’annulation joint à votre contrat. Selon notre <a href="#cancellation" data-policy="cancellation">politique d’annulation</a>, le contrat prend fin à la date d’envoi de l’avis; le montant dû ou le remboursement, s’il y a lieu, est calculé selon cette politique et la Loi sur la protection du consommateur.',
      name: 'Votre nom', nameHint: '(la personne qui a signé le contrat)', email: 'Courriel utilisé avec MNTR', student: 'Nom de l’élève', program: 'Programme',
      programs: [['core', 'Core'], ['intensive', 'Intensif'], ['tutoring', 'Tutorat traditionnel'], ['other', 'Autre']], choose: 'Choisir…',
      message: 'Message', optional: '(facultatif; aucune raison n’est requise)', send: 'Envoyer l’avis d’annulation',
    },
  },
};

function policies(lang) {
  const window = {};
  new Function('window', fs.readFileSync(`assets/js/policies.${lang}.js`, 'utf8'))(window);
  return window.MNTR_POLICIES;
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

for (const lang of ['en', 'fr']) {
  const t = L[lang], P = policies(lang);
  const src = fs.readFileSync(t.conf, 'utf8');
  const cut = (a, b) => src.slice(src.indexOf(a), src.indexOf(b));
  let head = src.slice(0, src.indexOf('<title>'));
  let assets = cut('<link rel="preconnect"', '</head>');
  let chrome = cut('<body', '<!-- The homepage');
  let footer = cut('<footer', '<script src="../../assets/js/mntr.js');
  const tail = src.slice(src.indexOf('<script src="../../assets/js/mntr.js'));
  // This page's language twin, and no "current page" mark on "After you apply".
  chrome = chrome.split(t.twinConf).join(t.twin).replace(' aria-current="page">', '>').replace('href="#contact"', 'href="../confirmation/#contact"');
  footer = footer.split(t.twinConf).join(t.twin);

  const toc = P.order.map((k) => `<li><a href="#${k}">${esc(P.docs[k].title)}</a></li>`).join('')
    + `<li><a href="#cancel">${esc(t.cancel.h)}</a></li><li><a href="#choices">${esc(t.choices)}</a></li>`;
  const c = t.cancel;
  const cancel = `
  <section class="o-pnl o-legal-doc" id="cancel" aria-labelledby="cancel-t">
    <div class="wrap o-legal-wrap">
      <h2 id="cancel-t" class="o-legal-h">${esc(c.h)}</h2>
      <div class="doc-body o-legal-body"><p>${c.intro}</p></div>
      <!-- Online cancellation (CPA s. 187.28). Sent to the MNTR form Worker (/api/cancel). -->
      <form class="o-form o-cancel" data-cancel-form action="https://mntr-forms.alexthepac.workers.dev/api/cancel" method="post">
        <div class="o-hp" aria-hidden="true"><label>Website <input type="text" name="_honey" tabindex="-1" autocomplete="off" /></label></div>
        <div class="o-f2">
          <div class="o-field"><label for="xName">${esc(c.name)} <small>${esc(c.nameHint)}</small></label><input id="xName" name="name" type="text" required maxlength="100" autocomplete="name" /></div>
          <div class="o-field"><label for="xEmail">${esc(c.email)}</label><input id="xEmail" name="email" type="email" required maxlength="254" autocomplete="email" /></div>
        </div>
        <div class="o-f2">
          <div class="o-field"><label for="xStudent">${esc(c.student)}</label><input id="xStudent" name="student" type="text" required maxlength="100" /></div>
          <div class="o-field"><label for="xProgram">${esc(c.program)}</label><select id="xProgram" name="program" required><option value="">${esc(c.choose)}</option>${c.programs.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('')}</select></div>
        </div>
        <div class="o-field"><label for="xMsg">${esc(c.message)} <small>${esc(c.optional)}</small></label><textarea id="xMsg" name="message" rows="3" maxlength="5000"></textarea></div>
        <div class="o-form-foot">
          <button class="btn" type="submit">${esc(c.send)}</button>
          <p class="o-form-status" role="status" aria-live="polite"></p>
        </div>
      </form>
    </div>
  </section>`;
  const docs = P.order.map((k) => {
    const d = P.docs[k];
    return `
  <section class="o-pnl o-legal-doc" id="${k}" aria-labelledby="${k}-t">
    <div class="wrap o-legal-wrap">
      <p class="o-legal-kind">${esc(d.kind)}</p>
      <h2 id="${k}-t" class="o-legal-h">${esc(d.title)}</h2>
      <div class="doc-body o-legal-body">${d.html}</div>
      <p class="o-legal-top"><a href="#main">${esc(t.top)}</a></p>
    </div>
  </section>`;
  }).join('\n');

  const out = `${head}<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}" />
<link rel="canonical" href="${t.canon}" />
<link rel="alternate" hreflang="en" href="${L.en.canon}" />
<link rel="alternate" hreflang="fr" href="${L.fr.canon}" />
<link rel="icon" type="image/png" href="../../assets/img/favicon.png" />
<link rel="shortcut icon" href="../../assets/img/favicon.ico" />
<link rel="apple-touch-icon" href="../../assets/img/apple-touch-icon.png" />

${assets}</head>

${chrome}<!-- Generated by _tools/build_legal.mjs from assets/js/policies.${lang}.js. Edit there, not here. -->
<div class="o-bg" aria-hidden="true">
  <img src="../../assets/media/hero-radcliffe.webp" srcset="../../assets/media/hero-radcliffe-1200.webp 1200w, ../../assets/media/hero-radcliffe.webp 2400w" sizes="100vw" alt="" width="2400" height="1336" decoding="async" />
</div>

<main id="main" class="o-panels" tabindex="-1">

  <section class="o-pnl o-legal-intro" aria-labelledby="legalTitle">
    <div class="wrap o-legal-wrap">
      <h1 id="legalTitle" class="o-h o-h--big">${esc(t.h1)}</h1>
      <p class="o-lede">${esc(t.lede)}</p>
      <nav class="o-legal-toc" aria-label="${esc(t.toc)}"><ul>${toc}</ul></nav>
    </div>
  </section>
${docs}
${cancel}

  <section class="o-pnl o-legal-doc" id="choices" aria-labelledby="choices-t">
    <div class="wrap o-legal-wrap">
      <h2 id="choices-t" class="o-legal-h">${esc(t.choices)}</h2>
      <div class="doc-body o-legal-body">
        <p><button type="button" class="btn" data-cookie-settings>${esc(t.choicesBtn)}</button></p>
        <h3>${esc(t.reqH)}</h3>
        <p>${t.req}</p>
      </div>
    </div>
  </section>

</main>

${footer}${tail}`;
  fs.mkdirSync(t.dir, { recursive: true });
  fs.writeFileSync(`${t.dir}/index.html`, out);
  console.log('wrote', `${t.dir}/index.html`);
}
