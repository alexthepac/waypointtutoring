/* Language router for the bare domain (index.html): French browsers go to
   /fr/, everyone else to /en/. A remembered choice (set by the language
   switcher) wins. Kept in a file, not inline, so the Content Security Policy
   can forbid inline scripts. */
(function () {
  var saved = null;
  try { saved = localStorage.getItem('mntr-lang'); } catch (e) {}
  var langs = navigator.languages || [navigator.language || 'en'];
  var fr = saved ? saved === 'fr' : /^fr/i.test(langs[0] || '');
  var sfx = location.protocol === 'file:' ? 'index.html' : '';
  location.replace((fr ? 'fr/' : 'en/') + sfx);
})();
