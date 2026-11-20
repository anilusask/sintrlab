/* site-nav.js
   Shared navigation for sintrlab.ca.

   1. Turns every <span data-sim-menu><a ...> into the "Sintrlab Quest" button, which opens the game (simulators.html).
      The simulators are reached through the game; there is no dropdown.
   2. On pages that ask for it, builds the whole header (<div data-site-header>) and footer (<div data-site-footer>).
   3. With ?embed=1 (a simulator running inside the game) hides the header and footer and reports a met mission to the game. */
(function () {
  'use strict';
  var script = document.currentScript;
  var ROOT = script && script.src ? script.src.replace(/[^\/]*$/, '') : location.href.replace(/[^\/]*$/, '');

  var MAIN = [
    ['About', 'index.html#about'], ['Research', 'index.html#research'], ['Capabilities', 'index.html#capabilities'],
    ['People', 'index.html#people'], ['Publications', 'index.html#publications'], 'SIM',
    ['Join the lab', 'index.html#join'], ['Contact', 'index.html#contact']
  ];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function clean(p) { return p.replace(/\/index\.html$/, '/').replace(/\.html$/, ''); }
  var HERE = clean(location.pathname);
  var IN_SIMS = /\/simulators(\/|\.html$|$)/.test(location.pathname) || /\/simulators$/.test(HERE);

  /* ---------- styles for the dropdown (injected so index.html needs no CSS changes) ---------- */
  var css =
    '.quest-btn{display:inline-block!important;font-family:var(--head,"Bricolage Grotesque","Helvetica Neue",Arial,sans-serif)!important;font-weight:600!important;font-size:.95rem!important;line-height:1.2!important;padding:9px 18px!important;margin:0 6px!important;border-radius:5px!important;background:var(--accent,#C0271B)!important;color:#fff!important;text-decoration:none!important;border:0!important;box-shadow:0 3px 0 var(--accent-deep,#9F1F15);transition:background .15s,transform .1s;white-space:nowrap}' +
    '.quest-btn:hover,.quest-btn:focus-visible{background:var(--accent-deep,#9F1F15)!important;color:#fff!important}' +
    '.quest-btn:active{transform:translateY(2px);box-shadow:none}' +
    '.quest-btn[aria-current="page"]{background:var(--ink,#14222B)!important;box-shadow:0 3px 0 #000}';
  var st = document.createElement('style'); st.setAttribute('data-site-nav', ''); st.textContent = css; document.head.appendChild(st);

  /* ---------- embed mode: a simulator opened inside the Factory floor game ----------
     With ?embed=1 the site header and footer are hidden, the page reports back to the game when the student has met the
     mission (a .verdict element with class "ok" after at least one change of their own), and Esc closes the overlay. */
  if (/[?&]embed=1/.test(location.search)) {
    var es = document.createElement('style'); es.textContent = '.site-header,.site-footer,.skip{display:none!important}.top{padding-top:14px!important}'; document.head.appendChild(es);
    var touched = false, sent = false, slug = location.pathname.replace(/^.*\//, '').replace(/\.html$/, '');
    ['input', 'change', 'click'].forEach(function (ev) { document.addEventListener(ev, function () { touched = true; }, true); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { try { parent.postMessage({ type: 'sintr-close' }, location.origin); } catch (x) {} } });
    setInterval(function () {
      var v = document.querySelector('.verdict'), ok = !!(v && /(^|\s)ok(\s|$)/.test(v.className));
      if (ok && touched && !sent) { sent = true; var vt = ''; try { vt = (v.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80); } catch (x) {} try { parent.postMessage({ type: 'sintr-stamp', slug: slug, evidence: vt }, location.origin); } catch (x) {} }
      if (!ok) sent = false;
    }, 400);
  }

  /* ---------- header and footer for pages that ask for them ---------- */
  function headerHTML() {
    var nav = MAIN.map(function (it) {
      if (it === 'SIM') return '<span data-sim-menu><a href="' + ROOT + 'simulators.html">Sintrlab Quest</a></span>';
      return '<a href="' + ROOT + it[1] + '">' + it[0] + '</a>';
    }).join('');
    return '<header class="site-header"><div class="wrap"><a class="brand" href="' + ROOT + 'index.html" aria-label="Sintering Materials Research Lab, home">' +
      '<img class="brand-symbol" src="' + ROOT + 'sintrlab_symbol.svg" alt="" width="380" height="414">' +
      '<img class="brand-word" src="' + ROOT + 'sintrlab_wordmark.svg" alt="Sintr lab" width="442" height="116"></a>' +
      '<nav class="nav" aria-label="Main">' + nav + '</nav></div></header>';
  }
  function footerHTML() {
    return '<footer class="site-footer"><div class="wrap">' +
      '<p>The University of Saskatchewan\'s main campus is on Treaty 6 Territory and the Homeland of the M\u00e9tis. We acknowledge the land we work on and the people whose home it is. </p>' +
      '<p class="small">&copy; 2026 Sintering Materials Research Lab, University of Saskatchewan. sintrlab.ca</p></div></footer>';
  }
  var h = document.querySelector('[data-site-header]'); if (h) h.innerHTML = headerHTML();
  var f = document.querySelector('[data-site-footer]'); if (f) f.innerHTML = footerHTML();

  /* ---------- the Sintrlab Quest button ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-sim-menu] a'), function (a) {
    a.classList.add('quest-btn');
    if (IN_SIMS) a.setAttribute('aria-current', 'page');
    a.setAttribute('title', 'Sintrlab Quest: walk an ornament through the factory');
  });
})();
