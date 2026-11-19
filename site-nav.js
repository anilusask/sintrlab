/* site-nav.js
   Shared navigation for sintrlab.ca.

   1. Fills every <span data-sim-menu> with the "Manufacturing Simulator" dropdown, built from simulators.json.
   2. On pages that ask for it, builds the whole header (<div data-site-header>) and footer (<div data-site-footer>).
   3. Fills <ul data-sim-cards> with one card per simulator (used by simulators.html).

   To add a simulator: put its page in /simulators and add one entry to simulators.json. Nothing else changes. */
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
    '.sim-menu{position:relative;display:inline-block}' +
    '.sim-menu__btn{font-family:var(--head,"Bricolage Grotesque","Helvetica Neue",Arial,sans-serif);font-weight:500;font-size:.98rem;line-height:inherit;color:var(--ink,#14222B);background:none;border:0;border-bottom:2px solid transparent;padding:4px 0;cursor:pointer;display:inline-flex;align-items:center;gap:6px}' +
    '.sim-menu__btn:hover,.sim-menu__btn[aria-expanded="true"],.sim-menu__btn.is-current{border-bottom-color:var(--accent,#C0271B)}' +
    '.sim-menu__caret{width:10px;height:10px;flex:none;transition:transform .15s}' +
    '.sim-menu__btn[aria-expanded="true"] .sim-menu__caret{transform:rotate(180deg)}' +
    '.sim-menu__panel{position:absolute;top:100%;left:0;z-index:60;padding-top:10px;min-width:min(340px,calc(100vw - 32px));max-width:min(400px,calc(100vw - 32px))}' +
    '.sim-menu__panel[hidden]{display:none}' +
    '.sim-menu__box{background:#fff;border:1px solid var(--line,#CBD2D6);box-shadow:0 10px 28px rgba(20,34,43,.14);padding:6px}' +
    '.sim-menu__box ul{list-style:none;margin:0;padding:0}' +
    '.sim-menu__box a{display:block;padding:10px 12px;border:0!important;border-radius:2px;text-decoration:none;color:var(--ink,#14222B)}' +
    '.sim-menu__box a:hover,.sim-menu__box a:focus-visible{background:rgba(20,34,43,.07)}' +
    '.sim-menu__box a[aria-current="page"]{background:var(--accent-soft,#F7E1DE)}' +
    '.sim-menu__name{display:flex;align-items:center;gap:8px;font-family:var(--head,"Bricolage Grotesque","Helvetica Neue",Arial,sans-serif);font-weight:700;font-size:1rem;padding:0!important}' +
    '.sim-menu__tag{font-weight:500;font-size:.72rem;color:var(--accent,#C0271B);border:1px solid var(--accent,#C0271B);border-radius:2px;padding:0 6px}' +
    '.sim-menu__desc{display:block;font-family:var(--body,"Source Serif 4",Georgia,serif);font-weight:400;font-size:.88rem;line-height:1.4;color:var(--ink-soft,#4A5B66);margin-top:2px;padding:0!important}' +
    '.sim-menu__all{border-top:1px solid var(--line,#CBD2D6)!important;border-radius:0!important;margin-top:4px;font-family:var(--head,"Bricolage Grotesque","Helvetica Neue",Arial,sans-serif);font-weight:500;font-size:.92rem}';
  var st = document.createElement('style'); st.setAttribute('data-site-nav', ''); st.textContent = css; document.head.appendChild(st);

  /* ---------- header and footer for pages that ask for them ---------- */
  function headerHTML() {
    var nav = MAIN.map(function (it) {
      if (it === 'SIM') return '<span data-sim-menu><a href="' + ROOT + 'simulators.html">Manufacturing Simulator</a></span>';
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

  /* ---------- the dropdown ---------- */
  var uid = 0;
  function buildMenu(host, sims) {
    var live = sims.filter(function (s) { return s.file && !s.hidden; });
    if (!live.length) return;                                   // keep the plain link if there is nothing to list
    var id = 'simPanel' + (++uid);
    var items = live.map(function (s) {
      var path = clean(new URL(s.file, ROOT).pathname), cur = path === HERE ? ' aria-current="page"' : '';
      return '<li><a href="' + esc(ROOT + s.file) + '"' + cur + '><span class="sim-menu__name">' + esc(s.title) +
        (s.status ? '<span class="sim-menu__tag">' + esc(s.status) + '</span>' : '') + '</span>' +
        '<span class="sim-menu__desc">' + esc(s.short || s.summary || '') + '</span></a></li>';
    }).join('');
    host.innerHTML =
      '<div class="sim-menu"><button type="button" class="sim-menu__btn' + (IN_SIMS ? ' is-current' : '') + '" aria-expanded="false" aria-haspopup="true" aria-controls="' + id + '">Manufacturing Simulator' +
      '<svg class="sim-menu__caret" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>' +
      '<div class="sim-menu__panel" id="' + id + '" hidden><div class="sim-menu__box"><ul>' + items + '</ul>' +
      '<a class="sim-menu__all" href="' + ROOT + 'simulators.html">All simulators</a></div></div></div>';
    wireMenu(host.querySelector('.sim-menu'));
  }
  function wireMenu(root) {
    var btn = root.querySelector('.sim-menu__btn'), panel = root.querySelector('.sim-menu__panel'), pinned = false, timer = null;
    var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    function open(pin) {
      clearTimeout(timer); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); pinned = !!pin;
      panel.style.marginLeft = '0px';
      var r = panel.getBoundingClientRect(), vw = document.documentElement.clientWidth, shift = 0;
      if (r.right > vw - 12) shift = r.right - (vw - 12);
      if (r.left - shift < 12) shift = r.left - 12;
      if (shift) panel.style.marginLeft = (-shift) + 'px';
    }
    function close() { clearTimeout(timer); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); pinned = false; }
    btn.addEventListener('click', function () {
      if (panel.hidden) open(true); else if (pinned) close(); else pinned = true;
    });
    if (canHover) {
      root.addEventListener('mouseenter', function () { if (panel.hidden) open(false); else clearTimeout(timer); });
      root.addEventListener('mouseleave', function () { if (!pinned) timer = setTimeout(close, 180); });
    }
    root.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { close(); btn.focus(); } });
    root.addEventListener('focusout', function (e) { if (e.relatedTarget && !root.contains(e.relatedTarget)) close(); });
    document.addEventListener('click', function (e) { if (!root.contains(e.target)) close(); });
  }

  /* ---------- cards for simulators.html ---------- */
  function buildCards(list, sims) {
    list.innerHTML = sims.filter(function (s) { return !s.hidden; }).map(function (s) {
      var tag = s.status ? '<span class="sim-card__tag">' + esc(s.status) + '</span>' : '';
      var act = s.file ? '<a class="btn" href="' + esc(ROOT + s.file) + '">Open ' + esc(s.title.toLowerCase()) + ' simulator</a>' : '<span class="sim-card__soon">Coming soon</span>';
      return '<li class="sim-card"><div class="sim-card__top"><h2>' + esc(s.title) + '</h2>' + tag + '</div><p>' + esc(s.summary || s.short || '') + '</p>' + act + '</li>';
    }).join('');
  }

  /* ---------- load the list ---------- */
  var hosts = document.querySelectorAll('[data-sim-menu]'), cards = document.querySelector('[data-sim-cards]');
  if (!hosts.length && !cards) return;
  fetch(ROOT + 'simulators.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      var sims = (data && data.simulators) || [];
      Array.prototype.forEach.call(document.querySelectorAll('[data-sim-menu]'), function (el) { buildMenu(el, sims); });
      if (cards) buildCards(cards, sims);
    })
    .catch(function () {
      if (cards) cards.innerHTML = '<li class="sim-card"><p>The list of simulators could not be loaded. Please reload the page. If you are opening this file straight from your computer, use a local web server instead.</p></li>';
    });
})();
