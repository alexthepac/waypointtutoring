/* =============================================================================
   MNTR Tutoring — privacy choices (cookie consent)
   -----------------------------------------------------------------------------
   Loaded in the <head> of every page, before anything else that could track.

   What the site actually uses, and how this file controls it:

     Strictly necessary (always on, no consent needed)
       - localStorage "mntr-lang" (language you chose) and "mntr-privacy"
         (the choices made here). Neither is a cookie; neither leaves the
         browser.
       - The Acuity Scheduling calendar and the contact form, which only
         receive information when the visitor uses them.

     Optional, OFF until the visitor says yes (Quebec P-39.1, s. 8.1):
       - google: Google Ads tag (gtag.js, AW-18318813201), conversion
         measurement. The script is NOT downloaded at all until allowed.
       - meta:   Meta Pixel (1094917539927609). Same: not downloaded until
         allowed.

   There is no analytics tool and no embedded third-party video, so the
   panel shows no such categories.

   Nothing here reacts to scrolling, clicking elsewhere or closing: only the
   three buttons record a choice. Choices are kept 12 months, then asked
   again. Withdrawing consent deletes the Google/Meta first-party cookies and
   reloads the page so their scripts are gone.

   API: window.mntrConsent.open()            opens the preferences panel
        window.mntrConsent.allowed('google') true/false
   Any element with [data-cookie-settings] opens the panel on click.
   ========================================================================== */
(function () {
  var GOOGLE_ID = 'AW-18318813201';
  var PIXEL_ID = '1094917539927609';
  var KEY = 'mntr-privacy';
  var MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
  var html = document.documentElement;
  var lang = (html.lang || 'en').slice(0, 2) === 'fr' ? 'fr' : 'en';
  var loaded = { google: false, meta: false };

  /* The old two-button banner stored 'accepted'/'declined' under another key
     with different wording; that choice is not carried over. */
  try { localStorage.removeItem('mntr-consent'); } catch (e) {}

  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!c || c.v !== 2 || !c.at) return null;
      if (Date.now() - new Date(c.at).getTime() > MAX_AGE_MS) return null;
      return c;
    } catch (e) { return null; }
  }
  function write(google, meta) {
    var c = { v: 2, google: !!google, meta: !!meta, at: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    return c;
  }
  var choice = read();
  function allowed(k) { return !!(choice && choice[k]); }

  /* ---------- optional scripts: loaded only after consent ---------- */
  function loadGoogle() {
    if (loaded.google) return; loaded.google = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'denied' });
    window.gtag('js', new Date());
    window.gtag('config', GOOGLE_ID);
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_ID;
    document.head.appendChild(s);
  }
  function loadMeta() {
    if (loaded.meta) return; loaded.meta = true;
    /* Meta's official base snippet. */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }
  function apply() {
    if (allowed('google')) loadGoogle();
    if (allowed('meta')) loadMeta();
  }

  /* First-party cookies the two tags set on this domain. */
  var COOKIES = { google: ['_gcl_au', '_gcl_aw', '_gcl_dc', '_gcl_gb', '_gcl_gs'], meta: ['_fbp', '_fbc'] };
  function dropCookies(names) {
    var host = location.hostname, parts = host.split('.'), domains = ['', host];
    for (var i = 1; i < parts.length - 1; i++) domains.push('.' + parts.slice(i).join('.'));
    names.forEach(function (n) {
      domains.forEach(function (d) {
        document.cookie = n + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '') + '; SameSite=Lax';
      });
    });
  }

  function save(google, meta) {
    var before = choice;
    choice = write(google, meta);
    var revoked = [];
    ['google', 'meta'].forEach(function (k) {
      if (!choice[k] && ((before && before[k]) || loaded[k])) revoked.push(k);
    });
    revoked.forEach(function (k) { dropCookies(COOKIES[k]); });
    if (revoked.some(function (k) { return loaded[k]; })) {
      /* A loaded tag can't be unloaded; a reload is the only clean stop. */
      location.reload();
      return;
    }
    apply();
    hideBanner(); closePanel();
    html.setAttribute('data-consent', 'set');
  }

  /* ---------- text ---------- */
  var T = {
    en: {
      title: 'Your privacy matters.',
      text: 'We only use what’s needed to keep this site working. With your permission, we’d also use optional advertising cookies from Google and Meta to measure our ads. You’re always in control.',
      policy: 'Privacy policy', policyHref: 'legal/#privacy',
      accept: 'Accept all', reject: 'Reject optional', custom: 'Customize',
      panelTitle: 'Privacy choices', save: 'Save my choices', close: 'Close',
      region: 'Cookie consent',
      cats: [
        { id: 'necessary', name: 'Strictly necessary', always: 'Always on',
          desc: 'Remembers your language and the choices you make here, in your browser only. Also covers the booking calendar (Acuity Scheduling) and the contact form, which receive information only when you use them.' },
        { id: 'google', name: 'Advertising measurement: Google Ads',
          desc: 'Lets Google tell us which of our ads brought you here or led to a booked consultation. Google sets cookies and receives your browser details and the pages you visit here.' },
        { id: 'meta', name: 'Advertising: Meta Pixel',
          desc: 'Lets Meta (Facebook, Instagram) measure our ads and show them to people likely to be interested, including people who visited this site. Meta sets cookies and receives your browser details and the pages you visit here.' }
      ],
      none: 'We don’t use analytics cookies, and our videos are hosted on our own site.',
      on: 'On', off: 'Off'
    },
    fr: {
      title: 'Votre vie privée compte.',
      text: 'Nous utilisons seulement ce qui est nécessaire au fonctionnement du site. Avec votre accord, nous utiliserions aussi des témoins publicitaires facultatifs de Google et de Meta pour mesurer nos publicités. Vous gardez le contrôle de vos choix.',
      policy: 'Politique de confidentialité', policyHref: 'juridique/#privacy',
      accept: 'Tout accepter', reject: 'Refuser les témoins facultatifs', custom: 'Personnaliser',
      panelTitle: 'Vos choix en matière de vie privée', save: 'Enregistrer mes choix', close: 'Fermer',
      region: 'Consentement aux témoins',
      cats: [
        { id: 'necessary', name: 'Strictement nécessaires', always: 'Toujours actifs',
          desc: 'Mémorisent votre langue et les choix faits ici, dans votre navigateur seulement. Comprennent aussi le calendrier de réservation (Acuity Scheduling) et le formulaire de contact, qui ne reçoivent des renseignements que si vous les utilisez.' },
        { id: 'google', name: 'Mesure publicitaire : Google Ads',
          desc: 'Permet à Google de nous indiquer laquelle de nos publicités vous a amené ici ou a mené à une consultation réservée. Google dépose des témoins et reçoit les données de votre navigateur et les pages que vous visitez ici.' },
        { id: 'meta', name: 'Publicité : pixel Meta',
          desc: 'Permet à Meta (Facebook, Instagram) de mesurer nos publicités et de les montrer à des personnes susceptibles d’être intéressées, y compris celles qui ont visité ce site. Meta dépose des témoins et reçoit les données de votre navigateur et les pages que vous visitez ici.' }
      ],
      none: 'Nous n’utilisons aucun témoin d’analyse, et nos vidéos sont hébergées sur notre propre site.',
      on: 'Activé', off: 'Désactivé'
    }
  }[lang];

  /* Link to the legal page from any depth: /xx/, /xx/staff/, /xx/legal/… */
  function legalHref() {
    var m = location.pathname.match(/^(.*?\/)(en|fr)\//);
    var base = m ? m[1] + m[2] + '/' : (lang === 'fr' ? 'fr/' : 'en/');
    return base + T.policyHref;
  }

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text) n.textContent = text;
    return n;
  }
  function btn(label, cls, fn) {
    var b = el('button', { type: 'button', 'class': 'pc-btn ' + (cls || '') }, label);
    b.addEventListener('click', fn); return b;
  }

  /* ---------- banner (non-modal, bottom corner) ---------- */
  var banner = null;
  function showBanner() {
    if (banner) { banner.hidden = false; return; }
    banner = el('section', { id: 'mntr-privacy', 'class': 'pc-banner', 'aria-label': T.region });
    banner.appendChild(el('h2', { 'class': 'pc-title' }, T.title));
    var p = el('p', { 'class': 'pc-text' }, T.text + ' ');
    var a = el('a', { href: legalHref() }, T.policy);
    p.appendChild(a);
    banner.appendChild(p);
    var row = el('div', { 'class': 'pc-row' });
    row.appendChild(btn(T.accept, 'pc-solid', function () { save(true, true); }));
    row.appendChild(btn(T.reject, 'pc-solid', function () { save(false, false); }));
    row.appendChild(btn(T.custom, 'pc-ghost', function () { openPanel(); }));
    banner.appendChild(row);
    document.body.appendChild(banner);
  }
  function hideBanner() { if (banner) banner.hidden = true; }

  /* ---------- preferences panel (modal dialog) ---------- */
  var panel = null, scrim = null, returnFocus = null, toggles = {};
  function buildPanel() {
    scrim = el('div', { 'class': 'pc-scrim', hidden: '' });
    panel = el('div', { 'class': 'pc-panel', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'pcTitle', hidden: '' });
    var head = el('div', { 'class': 'pc-head' });
    head.appendChild(el('h2', { id: 'pcTitle', 'class': 'pc-title' }, T.panelTitle));
    head.appendChild(btn(T.close, 'pc-x', closePanel));
    panel.appendChild(head);
    var list = el('ul', { 'class': 'pc-cats' });
    T.cats.forEach(function (c) {
      var li = el('li');
      var top = el('div', { 'class': 'pc-cat-top' });
      var id = 'pc-' + c.id;
      top.appendChild(el('label', { 'for': id, 'class': 'pc-cat-name' }, c.name));
      if (c.always) {
        top.appendChild(el('span', { 'class': 'pc-always' }, c.always));
      } else {
        var sw = el('input', { type: 'checkbox', id: id, 'class': 'pc-switch', role: 'switch', 'aria-describedby': id + '-d' });
        toggles[c.id] = sw;
        top.appendChild(sw);
      }
      li.appendChild(top);
      li.appendChild(el('p', { id: id + '-d', 'class': 'pc-cat-desc' }, c.desc));
      list.appendChild(li);
    });
    panel.appendChild(list);
    panel.appendChild(el('p', { 'class': 'pc-note' }, T.none));
    var row = el('div', { 'class': 'pc-row' });
    row.appendChild(btn(T.save, 'pc-solid', function () { save(toggles.google.checked, toggles.meta.checked); }));
    row.appendChild(btn(T.accept, 'pc-ghost', function () { save(true, true); }));
    row.appendChild(btn(T.reject, 'pc-ghost', function () { save(false, false); }));
    panel.appendChild(row);
    scrim.addEventListener('click', closePanel);
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closePanel(); return; }
      if (e.key !== 'Tab') return;
      var f = panel.querySelectorAll('button, input, a[href]');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    document.body.appendChild(scrim);
    document.body.appendChild(panel);
  }
  function openPanel() {
    if (!panel) buildPanel();
    /* Unchecked unless the visitor already said yes. */
    toggles.google.checked = allowed('google');
    toggles.meta.checked = allowed('meta');
    returnFocus = document.activeElement;
    scrim.hidden = false; panel.hidden = false;
    var first = panel.querySelector('.pc-switch'); if (first) first.focus();
  }
  function closePanel() {
    if (!panel || panel.hidden) return;
    panel.hidden = true; scrim.hidden = true;
    if (returnFocus && returnFocus.focus && document.contains(returnFocus)) returnFocus.focus();
  }

  window.mntrConsent = { open: function () { whenReady(openPanel); }, allowed: allowed };

  function whenReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
  }

  /* Optional tags start at DOMContentLoaded, after mntr.js has removed any
     booking details from the address bar on the confirmation page. */
  whenReady(function () {
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-cookie-settings]');
      if (!t) return;
      e.preventDefault(); openPanel();
    });
    if (choice) { html.setAttribute('data-consent', 'set'); apply(); }
    else showBanner();
  });
})();
