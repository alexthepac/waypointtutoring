/* =============================================================================
   MNTR — shared behaviour (all pages, both languages)
   -----------------------------------------------------------------------------
   No dependencies. Everything degrades: with JS off the pages are fully
   readable, the policies are reachable via the legacy policy pages linked in
   the footer <noscript>, and the booking iframe still loads.

   Sections:
     1. setup & helpers          6. FAQ accordions
     2. header / navigation      7. video slots (from MNTR_MEDIA)
     3. policy document viewer   8. booking iframe states
     4. language switch          9. confirmation page state
     5. reveals, draws, hero    10. analytics helper
   ========================================================================== */
(function () {
  'use strict';

  /* ----------------------------------------------------------- 1. setup */
  var html = document.documentElement;
  /* Opened straight from the file system (double-click in Finder)? Folder
     links such as "staff/" would show a directory listing, so point them at
     the index file. On the web server the clean URLs stay as they are. */
  if (location.protocol === 'file:') {
    Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (a) {
      var h = a.getAttribute('href');
      if (/^(https?:|mailto:|tel:|#)/.test(h)) return;
      a.setAttribute('href', h.replace(/^([^#?]*\/)(?=#|\?|$)/, '$1index.html'));
    });
    var tw = document.querySelector('[data-twin]');
    if (tw) tw.setAttribute('data-twin', tw.getAttribute('data-twin') + 'index.html');
  }
  html.classList.remove('no-js');
  var LANG = (html.lang || 'en').slice(0, 2) === 'fr' ? 'fr' : 'en';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) html.classList.add('reduced');

  var T = {
    en: { loading: 'Loading the calendar…', failed: 'The calendar is taking a while. You can open it in a new tab below.', closeMenu: 'Close menu', openMenu: 'Open menu' },
    fr: { loading: 'Chargement du calendrier…', failed: 'Le calendrier met du temps à charger. Vous pouvez l’ouvrir dans un nouvel onglet ci-dessous.', closeMenu: 'Fermer le menu', openMenu: 'Ouvrir le menu' }
  }[LANG];

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  /* Focus trap shared by the menu and the policy viewer. */
  function trapFocus(container, e) {
    var items = $$(FOCUSABLE, container).filter(function (el) { return el.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* Everything outside an open layer becomes inert for assistive tech. */
  function setInert(except, on) {
    $$('body > *').forEach(function (el) {
      if (except.indexOf(el) !== -1 || el.tagName === 'SCRIPT') return;
      if (on) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
      else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
    });
  }

  function lockScroll(on) { document.body.classList.toggle('is-locked', !!on); }

  /* ------------------------------------------------- 10. analytics helper */
  /* Google Ads tag is present on every page in consent-denied mode by default
     (see consent.js). Events are sent as plain gtag events; with consent
     declined, Google keeps them cookieless. Meta's pixel only exists after
     consent, so the fbq call is guarded. */
  function track(name, params) {
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
      if (typeof window.fbq === 'function' && name === 'cta_click') window.fbq('trackCustom', 'CTAClick', params || {});
    } catch (e) { /* never break the page for analytics */ }
  }
  window.MNTR = { track: track, lang: LANG };

  /* -------------------------------------------- 2. header / navigation */
  var header = $('.site-header');
  if (header) {
    var scrolled = false;
    var onScroll = function () {
      var want = window.scrollY > 24;
      if (want !== scrolled) { scrolled = want; header.classList.toggle('is-scrolled', want); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var nav = $('#nav'), navScrim = $('#navScrim'), burger = $('#burger');
  var navOpen = false, navReturnFocus = null;
  function openNav() {
    if (!nav || navOpen) return;
    navOpen = true; navReturnFocus = document.activeElement;
    nav.classList.add('is-open'); navScrim.classList.add('is-open');
    nav.removeAttribute('aria-hidden');
    burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', T.closeMenu);
    lockScroll(true); setInert([nav, navScrim, header], true);
    setTimeout(function () { var f = $(FOCUSABLE, nav); if (f) f.focus(); }, 120);
  }
  function closeNav() {
    if (!nav || !navOpen) return;
    navOpen = false;
    nav.classList.remove('is-open'); navScrim.classList.remove('is-open');
    nav.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', T.openMenu);
    lockScroll(false); setInert([nav, navScrim, header], false);
    if (navReturnFocus && navReturnFocus.focus) navReturnFocus.focus();
  }
  if (nav && burger) {
    nav.setAttribute('aria-hidden', 'true');
    burger.addEventListener('click', function () { navOpen ? closeNav() : openNav(); });
    $$('[data-nav-close]', nav).forEach(function (b) { b.addEventListener('click', closeNav); });
    navScrim.addEventListener('click', closeNav);
    nav.addEventListener('keydown', function (e) { if (e.key === 'Tab') trapFocus(nav, e); });
    /* Section links: close first, then let the browser scroll. */
    $$('a[href]', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        var href = a.getAttribute('href') || '';
        if (href.indexOf('#') === 0 || href.indexOf(location.pathname + '#') !== -1) closeNav();
      });
    });
  }

  /* ----------------------------------------- 3. policy document viewer */
  var POLICIES = window.MNTR_POLICIES || null;
  var doc = $('#doc'), docScrim = $('#docScrim');
  var docOpen = false, docReturnFocus = null, docCurrent = null;
  var docTitleEl, docTabsEl, docBodyEl, docKindEl;

  function buildDoc() {
    if (!doc || !POLICIES) return;
    docTitleEl = $('#docTitle', doc); docTabsEl = $('#docTabs', doc); docBodyEl = $('#docBody', doc); docKindEl = $('#docKind', doc);
    docTabsEl.innerHTML = '';
    POLICIES.order.forEach(function (key) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', 'false');
      b.textContent = POLICIES.docs[key].tab; b.dataset.policy = key;
      b.addEventListener('click', function () { showPolicy(key, true); });
      docTabsEl.appendChild(b);
    });
    $$('[data-doc-close]', doc).forEach(function (b) { b.addEventListener('click', closeDoc); });
    docScrim.addEventListener('click', closeDoc);
    doc.addEventListener('keydown', function (e) { if (e.key === 'Tab') trapFocus(doc, e); });
  }

  function showPolicy(key, fromTab) {
    var d = POLICIES.docs[key]; if (!d) return;
    docCurrent = key;
    docKindEl.textContent = d.kind;
    docTitleEl.textContent = d.title;
    docBodyEl.innerHTML = d.html;
    docBodyEl.scrollTop = 0;
    $$('button', docTabsEl).forEach(function (b) { b.setAttribute('aria-selected', b.dataset.policy === key ? 'true' : 'false'); });
    /* Deep link without adding history entries while tabbing. */
    var h = '#policy=' + key;
    if (location.hash !== h) { if (fromTab) history.replaceState(null, '', h); else history.replaceState(null, '', h); }
    track('policy_view', { policy: key });
  }
  function openDoc(key) {
    if (!doc || !POLICIES) return;
    if (navOpen) closeNav();
    if (!docOpen) {
      docOpen = true; docReturnFocus = document.activeElement;
      doc.classList.add('is-open'); docScrim.classList.add('is-open');
      doc.removeAttribute('aria-hidden');
      lockScroll(true); setInert([doc, docScrim], true);
    }
    showPolicy(key, false);
    setTimeout(function () { var c = $('[data-doc-close]', doc); if (c) c.focus(); }, 60);
  }
  function closeDoc() {
    if (!docOpen) return;
    docOpen = false; docCurrent = null;
    doc.classList.remove('is-open'); docScrim.classList.remove('is-open');
    doc.setAttribute('aria-hidden', 'true');
    lockScroll(false); setInert([doc, docScrim], false);
    if (/^#policy=/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
    if (docReturnFocus && docReturnFocus.focus) docReturnFocus.focus();
  }
  function policyFromHash() {
    var m = /^#policy=([a-z-]+)/.exec(location.hash || '');
    if (m && POLICIES && POLICIES.docs[m[1]]) openDoc(m[1]);
  }
  if (doc && POLICIES) {
    doc.setAttribute('aria-hidden', 'true');
    buildDoc();
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-policy]');
      if (!t || t.closest('#docTabs')) return;
      e.preventDefault(); openDoc(t.getAttribute('data-policy'));
    });
    window.addEventListener('hashchange', function () {
      if (/^#policy=/.test(location.hash)) policyFromHash(); else if (docOpen) closeDoc();
    });
    policyFromHash();
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (docOpen) { closeDoc(); return; }
    if (navOpen) closeNav();
  });

  /* ------------------------------------------------- 4. language switch */
  /* Each page declares its twin in <link rel="alternate" hreflang>. The
     switcher keeps query and hash so a policy deep link survives the switch. */
  $$('[data-lang-switch]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('mntr-lang', a.getAttribute('data-lang-switch')); } catch (err) {}
      var base = a.getAttribute('href').split('#')[0].split('?')[0];
      a.setAttribute('href', base + location.search + location.hash);
    });
  });
  try { localStorage.setItem('mntr-lang', LANG); } catch (err) {}

  /* ------------------------------------------ 5. reveals, draws, hero */
  if ('IntersectionObserver' in window && !reduced.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in'); io.unobserve(en.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    $$('.rv, .draw, .journey').forEach(function (el) { io.observe(el); });
  } else {
    $$('.rv, .draw, .journey').forEach(function (el) { el.classList.add('is-in'); });
  }
  /* A page rendered while hidden (background tab, embedded preview) never
     gets IntersectionObserver callbacks; show everything rather than wait. */
  if (document.hidden) { $$('.rv, .draw, .journey').forEach(function (el) { el.classList.add('is-in'); }); }


  /* Hero: release the stop-motion entrance on the first painted frame, and
     only run the sprite loop while the hero is on screen. */
  function ready() {
    requestAnimationFrame(function () { requestAnimationFrame(function () { html.classList.add('is-ready'); }); });
  }
  if (document.readyState !== 'loading') ready(); else document.addEventListener('DOMContentLoaded', ready);
  /* rAF is paused in hidden tabs and some embedded views; never leave the
     hero invisible if it has not fired within a second and a half. */
  setTimeout(function () { html.classList.add('is-ready'); }, 1500);

  var heroWord = $('.hero-word--mntr');
  var frameEl = $('[data-frame]');
  var frameTimer = 0, frameIdx = 0;
  function startFrames() {
    if (frameTimer || !frameEl || reduced.matches) return;
    /* Restart the sprite loop so the counter and the frames agree. */
    heroWord.style.animation = 'none'; void heroWord.offsetWidth; heroWord.style.animation = '';
    frameIdx = 0; frameEl.textContent = '01';
    frameTimer = setInterval(function () {
      frameIdx = (frameIdx + 1) % 12;
      frameEl.textContent = (frameIdx < 9 ? '0' : '') + (frameIdx + 1);
    }, 2000 / 12);
  }
  function stopFrames() { clearInterval(frameTimer); frameTimer = 0; }
  if (heroWord) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          heroWord.classList.toggle('is-live', en.isIntersecting);
          if (en.isIntersecting) startFrames(); else stopFrames();
        });
      }, { threshold: 0.05 }).observe(heroWord);
    } else { heroWord.classList.add('is-live'); startFrames(); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) stopFrames(); else if (heroWord.classList.contains('is-live')) startFrames(); });
  }

  /* Fit-to-width type: the big MNTR in the hero and the footer is sized so
     the four letters span exactly their container. */
  function fitAll() {
    $$('.fit').forEach(function (el) {
      var box = el.parentElement; if (!box) return;
      el.style.fontSize = '100px';
      var w = el.getBoundingClientRect().width; if (!w) return;
      el.style.fontSize = Math.floor(100 * box.clientWidth / w * 0.995) + 'px';
    });
  }
  fitAll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
  window.addEventListener('load', fitAll);
  var fitRaf = 0;
  window.addEventListener('resize', function () { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(fitAll); });

  /* In-page anchors: offset for the sticky header, honour reduced motion. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id || /^policy=/.test(id)) return;
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    if (navOpen) closeNav();
    var y = target.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0) - 8;
    window.scrollTo({ top: y, behavior: reduced.matches ? 'auto' : 'smooth' });
    history.pushState(null, '', '#' + id);
    if (a.hasAttribute('data-track')) track('cta_click', { cta: a.getAttribute('data-track'), lang: LANG });
    setTimeout(function () { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }, reduced.matches ? 0 : 500);
  });
  $$('a[data-track]:not([href^="#"]), button[data-track]').forEach(function (el) {
    el.addEventListener('click', function () { track('cta_click', { cta: el.getAttribute('data-track'), lang: LANG }); });
  });

  /* ------------------------------------------------ 6. FAQ accordions */
  $$('.faq-item').forEach(function (item) {
    var q = $('.faq-q', item), a = $('.faq-a', item);
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var open = item.classList.toggle('is-open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.hidden = false; /* content stays in the DOM; height animates via grid rows */
    });
  });

  /* ------------------------------------- 7. video slots from MNTR_MEDIA */
  function fillSlot(frame) {
    var media = window.MNTR_MEDIA; if (!media) return;
    var slot = frame.getAttribute('data-slot');
    var map = { HOMEPAGE_SALES_VIDEO_PENDING: media.homepageSalesVideo, CONFIRMATION_VIDEO_PENDING: media.confirmationVideo };
    var cfg = map[slot] || (media.additionalVideos && media.additionalVideos[slot]);
    if (!cfg || !(cfg.src || cfg.embed)) return;
    var title = (cfg.title && (cfg.title[LANG] || cfg.title.en)) || 'Video';
    var el;
    if (cfg.src) {
      el = document.createElement('video');
      el.controls = true; el.preload = 'metadata'; el.playsInline = true;
      if (cfg.poster) el.poster = cfg.poster;
      el.setAttribute('aria-label', title);
      var s = document.createElement('source'); s.src = cfg.src; el.appendChild(s);
      el.addEventListener('play', function () { track('video_play', { slot: slot, lang: LANG }); }, { once: true });
    } else {
      el = document.createElement('iframe');
      el.src = cfg.embed; el.title = title; el.loading = 'lazy';
      el.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      el.setAttribute('allowfullscreen', '');
    }
    frame.classList.add('has-media');
    frame.appendChild(el);
  }
  $$('.video-frame[data-slot]').forEach(fillSlot);

  /* ------------------------------------------ 8. booking iframe states */
  $$('.book-frame').forEach(function (bf) {
    var iframe = $('iframe', bf), status = $('.book-status', bf);
    if (!iframe) return;
    var done = false;
    var loaded = function () {
      if (done) return; done = true;
      bf.classList.add('is-loaded');
      track('booking_widget_loaded', { lang: LANG });
    };
    iframe.addEventListener('load', loaded);
    /* Acuity's embed script posts a "load" message as well; treat it as loaded. */
    window.addEventListener('message', function (e) {
      if (typeof e.data === 'string' && e.data.indexOf('load') === 0 && e.source === iframe.contentWindow) loaded();
    });
    setTimeout(function () {
      if (done) return;
      bf.classList.add('is-failed');
      if (status) status.textContent = T.failed;
    }, 12000);
  });

  /* --------------------------------------- 9. confirmation page state */
  var conf = $('[data-confirmation]');
  if (conf) {
    var params = new URLSearchParams(location.search);
    var status = params.get('status');
    /* Acuity's redirect lands on the English route; send French bookers to theirs. */
    var saved = null;
    try { saved = localStorage.getItem('mntr-lang'); } catch (err) {}
    var twin = conf.getAttribute('data-twin');
    if (status && saved && saved !== LANG && twin) {
      location.replace(twin + location.search);
    } else {
      var booked = status === 'booked';
      $$('[data-state]', conf).forEach(function (el) { el.hidden = el.getAttribute('data-state') !== (booked ? 'booked' : 'applied'); });
      var when = params.get('when');
      var card = $('[data-booking-card]', conf);
      if (booked && when && card) {
        /* Only ever shown when the booking system itself passed it. Rendered as
           text, never as HTML. */
        $('[data-booking-when]', card).textContent = when.replace(/[<>]/g, '');
        card.hidden = false;
      }
      track(booked ? 'consultation_booked' : 'confirmation_view', { lang: LANG });
      /* Keep booking details out of the address bar once read. */
      if (status) history.replaceState(null, '', location.pathname + location.hash);
    }
  }
})();
