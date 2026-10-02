/* =============================================================================
   MNTR Tutoring — cookie consent + Meta Pixel + Google Consent Mode
   -----------------------------------------------------------------------------
   Loaded on every page (see the <head> of each HTML file).

     1. Shows a small consent banner (EN or FR, based on <html lang>) until the
        visitor accepts or declines. The choice is remembered in localStorage.
     2. On ACCEPT: tells Google (Consent Mode) that ad cookies are allowed, and
        loads the Meta Pixel, which fires PageView on every page.
     3. On DECLINE: nothing from Meta loads. Google's tag stays in its
        cookieless "denied" mode (set as the default in each page's <head>).
     4. Bookings are NOT tracked here on purpose: all booking happens on
        Acuity, where the same pixel is configured and fires the booking
        event itself. Tracking it here too would double count.
     5. window.mntrConsent.open() re-opens the banner (linked from the privacy
        page so people can change their mind, as Quebec's Law 25 requires).

   Change the pixel ID here only; nothing else references it.
   ========================================================================== */
(function () {
  var PIXEL_ID = '1094917539927609';
  var STORAGE_KEY = 'mntr-consent';           // 'accepted' | 'declined'
  var lang = (document.documentElement.lang || 'en').slice(0, 2) === 'fr' ? 'fr' : 'en';
  var pixelLoaded = false;

  function status() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function remember(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
  }

  /* ---------- Meta Pixel (official base snippet, loaded only after consent) ---------- */
  function loadPixel() {
    if (pixelLoaded) return;
    pixelLoaded = true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  /* ---------- Google Consent Mode ---------- */
  function googleConsent(granted) {
    if (typeof window.gtag !== 'function') return;
    var v = granted ? 'granted' : 'denied';
    window.gtag('consent', 'update', {
      ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v
    });
  }

  function accept() { remember('accepted'); googleConsent(true); loadPixel(); hide(); }
  function decline() { remember('declined'); googleConsent(false); hide(); }

  /* ---------- banner ---------- */
  var T = {
    en: {
      text: 'We use cookies from Google and Meta to measure our ads and show you relevant ones. You can change your choice any time on our ',
      link: 'privacy page', href: 'privacy.html', accept: 'Accept', decline: 'Decline'
    },
    fr: {
      text: 'Nous utilisons des témoins (cookies) de Google et de Meta pour mesurer nos publicités et vous en montrer de pertinentes. Vous pouvez changer votre choix à tout moment sur notre ',
      link: 'page de confidentialité', href: 'privacy-fr.html', accept: 'Accepter', decline: 'Refuser'
    }
  }[lang];

  var banner = null;
  function show() {
    if (banner) { banner.style.display = ''; return; }
    var css = document.createElement('style');
    css.textContent =
      '#mntr-consent{position:fixed;left:0;right:0;bottom:0;z-index:9999;' +
      'background:#111;color:#fff;padding:16px 24px;padding-bottom:calc(16px + env(safe-area-inset-bottom));' +
      'box-shadow:0 -8px 30px rgba(0,0,0,.25);' +
      'font:14px/1.5 Inter,system-ui,sans-serif;display:flex;flex-wrap:wrap;gap:12px 24px;align-items:center;justify-content:center}' +
      '#mntr-consent p{margin:0;flex:1 1 320px;max-width:900px}' +
      '#mntr-consent a{color:#fff;text-decoration:underline;text-underline-offset:3px}' +
      '#mntr-consent .btns{display:flex;gap:8px;flex:0 0 auto}' +
      '#mntr-consent button{font:inherit;font-weight:600;border-radius:999px;padding:8px 16px;cursor:pointer;border:1px solid rgba(255,255,255,.35);background:transparent;color:#fff}' +
      '#mntr-consent button.primary{background:#fff;color:#111;border-color:#fff}' +
      '#mntr-consent button:hover{opacity:.85}';
    document.head.appendChild(css);

    banner = document.createElement('div');
    banner.id = 'mntr-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    var p = document.createElement('p');
    p.appendChild(document.createTextNode(T.text));
    var a = document.createElement('a'); a.href = T.href; a.textContent = T.link;
    p.appendChild(a); p.appendChild(document.createTextNode('.'));
    var btns = document.createElement('div'); btns.className = 'btns';
    var dec = document.createElement('button'); dec.type = 'button'; dec.textContent = T.decline; dec.onclick = decline;
    var acc = document.createElement('button'); acc.type = 'button'; acc.className = 'primary'; acc.textContent = T.accept; acc.onclick = accept;
    btns.appendChild(dec); btns.appendChild(acc);
    banner.appendChild(p); banner.appendChild(btns);
    document.body.appendChild(banner);
  }
  function hide() { if (banner) banner.style.display = 'none'; }

  window.mntrConsent = { open: show, status: status };

  /* ---------- boot ---------- */
  function init() {
    var s = status();
    if (s === 'accepted') { googleConsent(true); loadPixel(); }
    else if (s !== 'declined') { show(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
