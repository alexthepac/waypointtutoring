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
  /* Google and Meta tags exist only after the visitor allowed them in the
     privacy panel (consent.js), so nothing is sent otherwise. Event names
     and parameters never carry personal information. */
  function track(name, params) {
    try {
      var ok = window.mntrConsent && window.mntrConsent.allowed;
      if (ok && ok('google') && typeof window.gtag === 'function') window.gtag('event', name, params || {});
      if (ok && ok('meta') && typeof window.fbq === 'function' && name === 'cta_click') window.fbq('trackCustom', 'CTAClick', params || {});
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
      /* On the legal page itself the document is already there: just go to it. */
      if (document.getElementById(t.getAttribute('data-policy')) && $('.o-legal-doc')) return;
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

  /* Orwell-style homepage intro (after orwell.au): square brackets around
     "LOADING..."; the text fades; the brackets close into the two halves of
     the M, which join; the joined M becomes the M of the word, which slides
     to the middle; then the header and tagline.
     Transform and opacity only, via the Web Animations API, so it stays
     smooth. Waits for the photo and fonts (at least 0.6s, at most 2.5s). */
  var oIntro = $('.o-intro');
  if (oIntro) {
    var oWord = $('.o-word'), oM = $('.o-m'), oRow = $('.o-intro-row'), oPhoto = $('.o-photo'), oHero = $('.o-hero');
    var oL = $('.o-br--l'), oR = $('.o-br--r'), oLoad = $('.o-load');
    var add = function (c) { html.classList.add(c); };
    var finishNow = function () { ['o-swap', 'o-slide', 'o-reveal', 'o-done'].forEach(add); };
    var canAnimate = !reduced.matches && oL && oL.animate;
    if (!canAnimate) finishNow();
    else {
      var IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)', OUT = 'cubic-bezier(0.23, 1, 0.32, 1)', SLIDE = 'cubic-bezier(0.16, 1, 0.3, 1)';
      var started = performance.now(), fired = false;
      var run = function (el, frames, opts) { return el.animate(frames, Object.assign({ fill: 'forwards' }, opts)).finished; };
      var go = function () {
        if (fired) return; fired = true;
        if (typeof fitAll === 'function') fitAll();
        var wait = Math.max(0, 600 - (performance.now() - started));
        setTimeout(function () {
          var hr = oHero.getBoundingClientRect(), mr = oM.getBoundingClientRect(), br = oL.getBoundingClientRect();
          var cap = mr.height, half = mr.width / 2;
          var hL = br.height, wL = br.width;                       /* loader bracket size */
          var g0 = (hr.left + hr.width / 2) - br.right;            /* loader gap from centre */
          var apart = Math.max(4, Math.round(mr.width * 0.09));
          var dy = (mr.top + mr.height / 2) - (hr.top + hr.height / 2);
          var shift = (hr.left + hr.width / 2) - (mr.left + mr.width / 2);
          var from = Math.round(shift);
          var mL = $('.o-m .ml'), mR = $('.o-m .mr');
          /* Render the brackets at their final M-half size, scaled down to
             look exactly like the loader: no visible change, crisp edges. */
          var sx = wL / half, sy = hL / cap;
          oRow.style.setProperty('--bh0', cap + 'px');
          oRow.style.setProperty('--bw0', half + 'px');
          var loadL = 'translateX(' + (-g0) + 'px) scale(' + sx + ',' + sy + ')';
          var loadR = 'translateX(' + g0 + 'px) scale(' + sx + ',' + sy + ')';
          oL.style.transform = loadL; oR.style.transform = loadR;
          oWord.style.setProperty('--shift', from + 'px');
          oWord.style.willChange = 'transform';

          var T_FADE = 120, T_CLOSE = 360, T_SLIDE = 620;
          run(oLoad, [{ opacity: 1 }, { opacity: 0 }], { duration: T_FADE, easing: 'linear' });
          setTimeout(function () {
            run(oRow, [{ transform: 'translateY(0)' }, { transform: 'translateY(' + dy + 'px)' }], { duration: T_CLOSE, easing: IN_OUT });
            run(oL, [{ transform: loadL }, { transform: 'translateX(' + (-apart) + 'px) scale(1,1)' }], { duration: T_CLOSE, easing: IN_OUT });
            run(oR, [{ transform: loadR }, { transform: 'translateX(' + apart + 'px) scale(1,1)' }], { duration: T_CLOSE, easing: IN_OUT });
            $$('.o-br .sq').forEach(function (el) { run(el, [{ opacity: 1 }, { opacity: 0 }], { duration: 220, delay: 80, easing: 'linear' }); });
            var lastRd;
            $$('.o-br .rd').forEach(function (el) { lastRd = run(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 220, delay: 80, easing: 'linear' }); });
            /* The halves have grown to full size in the centre, still apart.
               The word takes over with its M split the same way, then slides
               home while the two halves close up: one movement. */
            setTimeout(function () {
              var join = { duration: Math.round(T_SLIDE * 0.65), easing: SLIDE };
              if (mL && mR) {
                run(mL, [{ transform: 'translateX(' + (-apart) + 'px)' }, { transform: 'translateX(0)' }], join);
                run(mR, [{ transform: 'translateX(' + apart + 'px)' }, { transform: 'translateX(0)' }], join);
              }
              add('o-swap');
              run(oWord, [{ transform: 'translateX(' + from + 'px)' }, { transform: 'translateX(0)' }], { duration: T_SLIDE, easing: SLIDE }).then(function () {
                add('o-slide'); oWord.style.willChange = '';
                [oWord, mL, mR].forEach(function (el) { if (el) el.getAnimations().forEach(function (a) { a.cancel(); }); });
              });
              setTimeout(function () { add('o-reveal'); add('o-done'); }, Math.round(T_SLIDE * 0.55));
            }, T_CLOSE + 40);
          }, T_FADE);
        }, wait);
      };
      var waits = [];
      if (oPhoto && oPhoto.decode) waits.push(oPhoto.decode().catch(function () {}));
      if (document.fonts && document.fonts.ready) waits.push(document.fonts.ready);
      Promise.all(waits).then(go, go);
      setTimeout(go, 2500);
    }
  }

  /* Dot-separated lists (.o-includes): hide the dot on any item that
     starts a new line, so wrapped lines never begin with a dot. */
  function markLineStarts() {
    $$('.o-includes').forEach(function (ul) {
      var prevTop = null;
      $$('li', ul).forEach(function (li) {
        li.classList.remove('is-line-start');
        var top = li.offsetTop;
        if (prevTop !== null && top > prevTop + 2) li.classList.add('is-line-start');
        prevTop = top;
      });
    });
  }
  markLineStarts();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(markLineStarts);
  window.addEventListener('resize', function () { requestAnimationFrame(markLineStarts); });

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
  /* Base URL of the /assets/ folder, taken from this script's own address,
     so media paths work at any page depth and from the file system. */
  var ASSETS = (function () {
    var tag = document.querySelector('script[src*="assets/js/mntr.js"]');
    return tag ? tag.src.replace(/js\/mntr\.js.*$/, '') : '/assets/';
  })();
  /* A media value is either one string or { en, fr }. Never falls back to
     the other language: a French page must not play an English video. */
  function forLang(v) { return (v && typeof v === 'object') ? (v[LANG] || '') : (v || ''); }
  function asset(p) { return /^(https?:)?\/\//.test(p) || p.charAt(0) === '/' ? p : ASSETS + p; }

  function fillSlot(frame) {
    var media = window.MNTR_MEDIA; if (!media) return;
    var slot = frame.getAttribute('data-slot');
    var cfg = null;
    Object.keys(media).forEach(function (k) { var e = media[k]; if (e && e.slot === slot) cfg = e; });
    if (!cfg && media.additionalVideos) cfg = media.additionalVideos[slot] || null;
    if (!cfg) return;
    var src = forLang(cfg.src), embed = forLang(cfg.embed), poster = forLang(cfg.poster);
    if (!src && !embed) return;
    var title = forLang(cfg.title) || 'Video';
    var el;
    if (embed) {
      el = document.createElement('iframe');
      el.src = embed; el.title = title; el.loading = 'lazy';
      el.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      el.setAttribute('allowfullscreen', '');
    } else {
      /* Never autoplays. Only the first frames are fetched until play,
         and nothing at all for videos marked data-preload="none". */
      el = document.createElement('video');
      el.controls = true; el.playsInline = true;
      el.preload = frame.getAttribute('data-preload') || 'metadata';
      if (poster) el.poster = asset(poster);
      el.setAttribute('aria-label', title);
      el.setAttribute('controlslist', 'nodownload');
      var s = document.createElement('source'); s.src = asset(src); s.type = 'video/mp4'; el.appendChild(s);
      var cap = forLang(cfg.captions);
      if (cap) {
        var tr = document.createElement('track');
        tr.kind = 'captions'; tr.srclang = LANG; tr.src = asset(cap);
        tr.label = LANG === 'fr' ? 'Français' : 'English';
        el.appendChild(tr);
      }
      el.addEventListener('play', function () {
        track('video_play', { slot: slot, lang: LANG });
        /* One video at a time: pause any other playing on the page. */
        $$('video').forEach(function (v) { if (v !== el && !v.paused) v.pause(); });
      });
    }
    frame.classList.add('has-media');
    frame.appendChild(el);
  }
  $$('.video-frame[data-slot]').forEach(fillSlot);

  /* ------------------------------------------ 8. booking iframe states */
  /* The Acuity calendar is for adults only: a student aged 18+ or a parent /
     legal guardian. Nothing from Acuity (iframe or script) loads until the
     visitor ticks the confirmation; unticking unloads it again, so a
     half-filled booking is not kept in the page. The same confirmation is a
     required question in Acuity's own intake form, which is what actually
     enforces it on Acuity's side. */
  var embedLoaded = false;
  function loadAcuityEmbed() {
    if (embedLoaded) return; embedLoaded = true;
    var sc = document.createElement('script');
    sc.async = true; sc.src = 'https://embed.acuityscheduling.com/js/embed.js';
    document.body.appendChild(sc);
  }
  function startFrame(bf) {
    var iframe = $('iframe', bf), status = $('.book-status', bf);
    if (!iframe || !iframe.getAttribute('data-src')) return;
    var done = false;
    bf.classList.remove('is-loaded', 'is-failed');
    if (status) status.textContent = T.loading;
    var loaded = function () {
      if (done) return; done = true;
      bf.classList.add('is-loaded');
      track('booking_widget_loaded', { lang: LANG });
    };
    iframe.addEventListener('load', loaded, { once: true });
    /* Acuity's embed script posts a "load" message as well; treat it as loaded. */
    var onMsg = function (e) {
      if (typeof e.data === 'string' && e.data.indexOf('load') === 0 && e.source === iframe.contentWindow) loaded();
    };
    window.addEventListener('message', onMsg);
    iframe.src = iframe.getAttribute('data-src');
    loadAcuityEmbed();
    bf._stop = function () { done = true; window.removeEventListener('message', onMsg); };
    setTimeout(function () {
      if (done) return;
      bf.classList.add('is-failed');
      if (status) status.textContent = T.failed;
    }, 12000);
  }
  $$('[data-adult-gate]').forEach(function (gate) {
    var box = $('[data-adult-confirm]', gate), body = $('[data-gate-body]', gate);
    var minorBtn = $('[data-minor]', gate), minorMsg = $('[data-minor-msg]', gate);
    var frames = $$('.book-frame', gate), links = $$('a[data-href]', gate);
    if (!box || !body) return;
    var sync = function () {
      if (box.checked) {
        if (minorMsg) minorMsg.hidden = true;
        body.hidden = false;
        links.forEach(function (l) { l.href = l.getAttribute('data-href'); });
        frames.forEach(startFrame);
      } else {
        body.hidden = true;
        links.forEach(function (l) { l.removeAttribute('href'); });
        /* Swap in a fresh, empty frame rather than navigating the old one:
           Acuity's embed script scrolls the page to the calendar on every
           frame load, which threw visitors back to the top of the page. */
        frames.forEach(function (bf) {
          if (bf._stop) bf._stop();
          var f = $('iframe', bf);
          if (f && f.getAttribute('src')) {
            var fresh = f.cloneNode(false); fresh.removeAttribute('src');
            f.parentNode.replaceChild(fresh, f);
          }
        });
      }
    };
    box.addEventListener('change', sync);
    if (minorBtn && minorMsg) minorBtn.addEventListener('click', function () {
      box.checked = false; sync();
      minorMsg.hidden = false;
      minorMsg.setAttribute('tabindex', '-1'); minorMsg.focus();
    });
    sync();
  });

  /* Purchases (post-booking page): adults only. Until the confirmation is
     ticked, a buy link only points the visitor back to the box. */
  $$('[data-buy-gate]').forEach(function (gate) {
    var box = $('[data-buy-confirm]', gate), msg = $('[data-buy-msg]', gate);
    var scope = gate.closest('section') || document;
    var links = $$('a[data-buy]', scope);
    var sync = function () {
      links.forEach(function (a) { a.setAttribute('aria-disabled', box.checked ? 'false' : 'true'); });
      if (box.checked && msg) msg.hidden = true;
    };
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (box.checked) return;
        e.preventDefault();
        if (msg) msg.hidden = false;
        gate.scrollIntoView({ block: 'center', behavior: reduced.matches ? 'auto' : 'smooth' });
        box.focus({ preventScroll: true });
      });
    });
    box.addEventListener('change', sync);
    sync();
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
  /* Website forms (contact on the post-booking page, cancellation notice on
     the legal page). JSON to the MNTR form Worker, which validates,
     rate-limits and forwards to the inbox. Bots (honeypot filled, or sent
     within 3 s of load) see the success message and nothing is sent.
     Nothing typed here is stored in the browser. */
  var MAIL = '<a href="mailto:mntrtutoring.info@gmail.com">mntrtutoring.info@gmail.com</a>';
  var FORM_MSG = {
    contact: LANG === 'fr'
      ? { sending: 'Envoi…', ok: 'Message envoyé. Nous vous répondrons par courriel.', err: 'L\u2019envoi n\u2019a pas fonctionné. Écrivez-nous directement à ' + MAIL + '.' }
      : { sending: 'Sending…', ok: 'Message sent. We\u2019ll reply by email.', err: 'That didn\u2019t go through. Please email us directly at ' + MAIL + '.' },
    cancel: LANG === 'fr'
      ? { sending: 'Envoi de l\u2019avis…', ok: 'Avis d\u2019annulation envoyé ({when}). Conservez ce message comme preuve de la date d\u2019envoi.', err: 'L\u2019envoi n\u2019a pas fonctionné, et votre avis n\u2019a donc pas été transmis. Envoyez-le par courriel à ' + MAIL + ' : la date de votre courriel fera foi.' }
      : { sending: 'Sending your notice…', ok: 'Cancellation notice sent ({when}). Keep this message as a record of the date it was sent.', err: 'That didn\u2019t go through, so your notice was not sent. Please email it to ' + MAIL + '; the date of your email counts as the date of notice.' }
  };
  function wireForm(form, kind) {
    var loadedAt = Date.now(), msg = FORM_MSG[kind];
    var status = $('.o-form-status', form), btn = $('button[type=submit]', form), sending = false;
    var say = function (tone, text, asHtml) { status.setAttribute('data-tone', tone); if (asHtml) status.innerHTML = text; else status.textContent = text; };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;
      var el = form.elements, v = function (n) { return el[n] ? el[n].value : ''; };
      var honey = v('_honey');
      var when = new Date().toLocaleString(LANG === 'fr' ? 'fr-CA' : 'en-CA', { dateStyle: 'long', timeStyle: 'short' });
      if (honey.trim() !== '' || Date.now() - loadedAt < 3000) { form.reset(); say('ok', msg.ok.replace('{when}', when)); return; }
      var body = { name: v('name'), email: v('email'), lang: LANG, website: honey, t: Date.now() - loadedAt };
      if (kind === 'contact') {
        /* Adults only, checked here and again by the server. */
        if (!el['adult'] || !el['adult'].checked) { if (el['adult']) el['adult'].focus(); return; }
        body.topic = v('topic'); body.message = v('message'); body.adult = true;
      } else {
        body.student = v('student'); body.program = v('program'); body.message = v('message');
      }
      sending = true; btn.disabled = true; say('', msg.sending);
      fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      }).then(function (res) {
        return res.json().then(function (data) { return res.ok && data && data.success === true; }, function () { return false; });
      }).then(function (ok) {
        if (ok) { form.reset(); say('ok', msg.ok.replace('{when}', when)); if (kind === 'contact') track('contact_sent', { lang: LANG }); }
        else say('err', msg.err, true);
      }, function () { say('err', msg.err, true); }).then(function () { sending = false; btn.disabled = false; });
    });
  }
  $$('[data-contact-form]').forEach(function (f) { wireForm(f, 'contact'); });
  $$('[data-cancel-form]').forEach(function (f) { wireForm(f, 'cancel'); });
})();
