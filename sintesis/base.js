/* ═══════════════════════════════════════════════════════════════════════
   PANNI MARGOT · SÍNTESIS v2 · base.js
   window.PM — cromo (header/nav/carrito/checkout/footer/terminal), carrito,
   pasaporte, vistas, reloj AR, scramble, fotos (LQIP), linterna, reveals,
   utilidades. Vanilla, sin dependencias. Todo storage/Intl en try/catch.
   Orden de carga en cada página: base.css · catalogo.js · base.js · script propio.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var d = document, w = window, H = d.documentElement;
  H.classList.add('js');

  /* ─── utilidades ──────────────────────────────────────────────────── */
  var RM = false, FINE = false;
  try {
    RM = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
    FINE = w.matchMedia('(hover: hover) and (pointer: fine)').matches;
  } catch (e) {}

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function el(html) { var t = d.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function $(sel, root) { return (root || d).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); }
  function store(k, v) {
    try {
      if (v === undefined) { var r = localStorage.getItem(k); return r ? JSON.parse(r) : null; }
      if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v));
    } catch (e) { return null; }
  }
  function emit(nombre, detalle) { try { d.dispatchEvent(new CustomEvent(nombre, { detail: detalle })); } catch (e) {} }
  function qs(nombre) { try { return new URLSearchParams(location.search).get(nombre); } catch (e) { return null; } }

  /* ─── catálogo (window.CATALOGO lo carga catalogo.js) ─────────────── */
  function cat() { return w.CATALOGO || { piezas: [], archivo: [], categorias: [] }; }
  function byId(id) {
    var c = cat();
    if (typeof c.byId === 'function') { var p = c.byId(id); if (p) return p; }
    var i, arr = c.piezas || [];
    for (i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i];
    arr = c.archivo || [];
    for (i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i];
    return null;
  }

  /* ─── formato ARS ─────────────────────────────────────────────────── */
  var NF = null;
  try { NF = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }); } catch (e) {}
  function fmt(n) {
    n = Math.round(Number(n) || 0);
    var s;
    try { s = NF ? NF.format(n) : null; } catch (e) { s = null; }
    if (!s) s = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return '$ ' + s;
  }

  /* ─── lockup vector (una sola vez) ────────────────────────────────── */
  var LOCKUP_PATH = 'M1.333 0.167L102.5 0.167L103.167 0.667L103.333 102L102.833 102.667L1.167 102.833L0.5 102.333L0.333 1.5L1.333 0.333ZM12.167 10.833L11 12.5L11.167 91.5L12 92.167L92.167 92L92.667 91.167L92.5 11.5L91.667 10.833L12.333 10.833ZM519.167 33.833L526.333 34L530.5 35L535 37.167L536.333 39.333L531.167 45.667L524.667 43.333L519.833 43.167L515.833 44.5L513.167 46.667L511 50.5L510.5 56.333L511.833 60.5L514.333 63.5L517.667 65.333L522.5 66L526.833 64.667L529.333 62.167L530.167 60L529.833 58.667L521.667 58.333L520.833 57.667L520.667 51.833L521.333 50.833L539.5 50.667L540.833 51.833L540.5 60.333L537.833 67.5L532.833 72.5L526.333 75L517.333 75L509.833 72.333L504.167 67.167L500.833 59.667L500.333 56.167L500.667 50.167L503.833 42.333L507.5 38.333L510.5 36.333L515.167 34.5L519.167 34ZM571.167 33.833L579 34.167L583.667 35.667L587.333 37.833L592.167 43L594.833 49.667L595 58.167L592.5 65.5L587 71.5L584.167 73.167L578.333 75L569.333 75L561.667 72.167L556.167 67L554.5 64.333L552.833 59.333L552.667 50.667L553.667 46.833L555.833 42.5L558.833 39L562.333 36.5L566.667 34.667L571.167 34ZM20.5 34.5L23 35.167L46 54L47.167 53L47.167 35.5L47.667 34.667L50.333 35L73.667 54L74.667 53.5L74.833 35.167L75.5 34.5L83.5 34.667L84.167 35.833L84 72.833L83.333 73.5L81.167 73L59 54L57.167 53.167L56.667 53.833L56.667 72.167L55.833 73.5L54.5 73.5L31.833 54.333L29.5 53.333L29 72.833L27.667 73.667L20.333 73.5L19.5 70.5L19.5 37.5L19.667 35.333L20.5 34.667ZM132.167 34.667L152.667 34.667L156.5 35.333L160.5 37L164 40L166.5 45.667L166.667 50.333L165.667 54.333L164 57.167L161.333 59.667L154.5 62.5L142 62.833L141.167 63.333L140.833 73.667L139.333 74.5L132.167 74.333L131.167 72.667L131.167 36.167L132.167 34.833ZM222.5 34.667L225 35.333L248.333 54.5L249.167 54.5L249.667 53.167L249.667 35.5L250.167 34.833L251.5 34.667L253.167 35.5L276.5 54.5L277.5 53.5L277.667 35.333L279.167 34.667L286.5 35L287.167 36.333L287 73.667L286.167 74.333L284.333 74L261.167 54.167L259.667 53.833L259.167 55.5L259.167 73.5L258.333 74.333L256.667 74.167L234 54.833L231.667 53.833L231.167 55L231.167 73.5L229.5 74.5L222 74.167L221.5 73.333L221.5 35.667L222.5 34.833ZM303.667 34.667L311.667 34.667L312.5 35.667L312.5 73.167L311 74.5L304.5 74.5L303.333 74.167L302.667 73L302.667 35.833L303.667 34.833ZM344.667 34.667L347.333 35.167L364.333 51L366 50.5L382.167 35.333L383.333 34.667L385.5 35L385.5 74L377.667 74.5L376.167 73.833L376 55.833L375.5 55L374.333 55.333L366.667 63L365.167 63.667L363.333 63.167L357.833 57.5L355.167 55.167L354 55L353.5 73.833L352 74.5L344.333 74.167L343.833 73L343.833 36L344.667 34.833ZM452.667 34.667L474.667 34.833L479.5 36.167L484.167 39.5L486.833 44.5L487.167 51L485.5 55.833L481.167 60.167L481 61.667L489 72.667L488.833 74.167L478.5 74.167L471.667 64.167L469.833 62.833L462.833 62.833L461.833 63.333L461.5 73.5L461 74.167L453.5 74.5L452 73.833L451.833 35.5L452.667 34.833ZM606.333 34.667L639.667 34.833L639.667 42.833L629.833 43L628.333 43.333L627.833 44.167L627.833 73.167L627 74.333L619.833 74.5L618.333 74L618 44.333L617.333 43.333L615.833 43L606 42.833L605.5 42.167L605.5 35.5L606.333 34.833ZM189.5 34.833L191.5 35.5L193.333 38.833L210.667 71.667L211 74.167L201.5 74.333L198 69.833L182.333 69.833L181.167 70.5L178.833 74.333L170.333 74.5L169 73.833L184.5 43.333L189.5 35ZM418.333 34.833L420.167 35.333L422.5 39.5L440 72.667L439.667 74.333L430.167 74.333L427.833 70.5L426.667 69.833L411 69.833L407.5 74.333L399 74.5L398 74L398.333 71.833L417.5 35.5L418.333 35ZM143.167 43L141.667 43.167L141 44L141 54L141.5 54.667L150.333 54.833L153.333 54.167L155.167 53L156.333 50.667L156.5 47.833L154.667 44.5L151.833 43.167L143.333 43ZM463.667 43L462.167 43.333L461.5 44.5L461.5 53.333L462.167 54.667L472.333 54.667L476.167 52.5L477.167 48.333L475.333 44.5L472.333 43.167L463.833 43ZM572.667 43.167L568.167 44.5L564.833 47.333L562.833 51.667L562.667 56.5L564.333 61L567 63.833L571.167 65.667L575.5 65.833L579.833 64.333L583.333 61L584.833 57.5L585 52.5L583.5 48.333L581.167 45.667L576.833 43.5L572.833 43.167ZM189.833 52.5L188.167 54.833L185.167 62.167L186 62.833L194.333 62.833L194.833 61.167L191.167 53.333L190 52.5ZM418.667 52.5L416.833 55.167L414 62.167L414.667 62.833L423 62.833L423.667 61.167L419.667 52.833L418.833 52.5Z';
  var MONO_PATH = 'M1.333 0.167L102.5 0.167L103.167 0.667L103.333 102L102.833 102.667L1.167 102.833L0.5 102.333L0.333 1.5L1.333 0.333ZM12.167 10.833L11 12.5L11.167 91.5L12 92.167L92.167 92L92.667 91.167L92.5 11.5L91.667 10.833L12.333 10.833ZM20.5 34.5L23 35.167L46 54L47.167 53L47.167 35.5L47.667 34.667L50.333 35L73.667 54L74.667 53.5L74.833 35.167L75.5 34.5L83.5 34.667L84.167 35.833L84 72.833L83.333 73.5L81.167 73L59 54L57.167 53.167L56.667 53.833L56.667 72.167L55.833 73.5L54.5 73.5L31.833 54.333L29.5 53.333L29 72.833L27.667 73.667L20.333 73.5L19.5 70.5L19.5 37.5L19.667 35.333L20.5 34.667Z';
  function inyectarSymbol() {
    if (d.getElementById('pm-lockup')) return;
    d.body.insertBefore(el(
      '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
      '<symbol id="pm-lockup" viewBox="0 0 640 103"><path fill-rule="evenodd" d="' + LOCKUP_PATH + '"/></symbol>' +
      '<symbol id="pm-mono" viewBox="0 0 104 103"><path fill-rule="evenodd" d="' + MONO_PATH + '"/></symbol>' +
      '</defs></svg>'), d.body.firstChild);
  }
  function lockupSVG(cls, label) {
    return '<svg class="' + esc(cls || '') + '" viewBox="0 0 640 103" ' + (label ? 'role="img" aria-label="' + esc(label) + '"' : 'aria-hidden="true"') + ' focusable="false"><use href="#pm-lockup"/></svg>';
  }

  /* ─── sellos ──────────────────────────────────────────────────────── */
  var SELLOS = {
    '一点物': { cls: 'uno', ja: '一点物', txt: '1/1', sr: 'Pieza única' },
    '手描き': { cls: 'mano', ja: '手描き', txt: '', sr: 'Pintado a mano' },
    'ÚLTIMA': { cls: 'ultima', ja: '', txt: 'ÚLTIMA', sr: '' },
    '不連続': { cls: 'disc', ja: '不連続', txt: '', sr: 'Discontinous' },
    'MANUK': { cls: 'manuk', ja: '世界', txt: 'MANUK', sr: '' },
    '完売': { cls: 'vendido', ja: '完売', txt: '', sr: 'Vendida' }
  };
  function selloHTML(k) {
    var s = SELLOS[k] || { cls: '', ja: '', txt: k, sr: '' };
    var h = '<span class="sello ' + s.cls + '">';
    if (s.ja) h += '<span lang="ja"' + (s.sr ? ' aria-hidden="true"' : '') + '>' + esc(s.ja) + '</span>';
    if (s.txt) h += '<span>' + esc(s.txt) + '</span>';
    if (s.sr) h += '<span class="sr">' + esc(s.sr) + '</span>';
    return h + '</span>';
  }
  function sellosHTML(lista) {
    if (!lista || !lista.length) return '';
    return '<span class="sellos">' + lista.map(selloHTML).join('') + '</span>';
  }

  /* ─── fotos: <img> con LQIP ───────────────────────────────────────── */
  function pic(p, i, o) {
    o = o || {}; i = i || 0;
    var src = (p.imgs && p.imgs[i]) || p.img || '';
    var lq = o.lq !== undefined ? (o.lq || '') : (p.lq || (p.imgs && p.imgs[0]) || '');   /* o.lq: LQIP propia de ESTA toma (null = sin placeholder) */
    var alt = o.alt != null ? o.alt : (p.nm || '');
    var vt = o.vt ? 'view-transition-name:pz-' + String(p.id).replace(/[^a-z0-9_-]/gi, '') + ';' : '';
    return '<img class="pm-img ' + esc(o.cls || '') + '" src="' + esc(src) + '" alt="' + esc(alt) + '"' +
      (o.eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"') +
      ' decoding="async"' + (o.sizes ? ' sizes="' + esc(o.sizes) + '"' : '') +
      (o.ariaHidden ? ' aria-hidden="true"' : '') +
      ' style="' + (lq ? 'background-image:url(&quot;' + esc(lq) + '&quot;);' : '') + vt + '">';
  }

  /* ─── tarjeta de pieza ────────────────────────────────────────────── */
  function pcardHTML(p, o) {
    o = o || {};
    var href = o.href || ('./ficha.html?id=' + encodeURIComponent(p.id));
    var vend = o.vendida || (p.sellos && p.sellos.indexOf('完売') > -1);
    var sellos = o.sellos === false ? [] : (p.sellos || []);
    var h = '<a class="pcard' + (vend ? ' vendida' : '') + (o.cls ? ' ' + esc(o.cls) : '') + '" href="' + esc(href) + '" data-id="' + esc(p.id) + '" data-cat="' + esc(p.cat || '') + '">';
    h += '<div class="pcard-ph">';
    h += pic(p, 0, { alt: p.nm, eager: !!o.eager, cls: 'pcard-a', vt: o.vt !== false });
    if (p.imgs && p.imgs[1] && o.hover !== false) h += pic(p, 1, { alt: '', cls: 'pcard-b', ariaHidden: true });
    h += sellosHTML(sellos);
    h += '</div>';
    h += '<div class="pcard-meta"><span class="pcard-nm">' + esc(p.nm) + '</span>';
    if (vend || o.sinPrecio) h += '<span class="pcard-pr"><span lang="ja" aria-hidden="true">完売</span><span class="sr">Vendida</span></span>';
    else h += '<span class="pcard-pr">' + fmt(p.pr) + '</span>';
    h += '</div>';
    if (o.cat) h += '<span class="pcard-cat">' + esc(p.cat) + (p.kj ? ' <span lang="ja" aria-hidden="true">' + esc(p.kj) + '</span>' : '') + '</span>';
    return h + '</a>';
  }

  /* ─── scramble (dialecto) ─────────────────────────────────────────── */
  var GLIFOS = '>#/:*.-01ノハマ';
  function scramble(node, txt, o) {
    o = o || {};
    if (!node) return;
    txt = txt == null ? (node.getAttribute('data-txt') || node.textContent) : txt;
    var dur = o.dur || 620;
    node.innerHTML = '<span aria-hidden="true"></span><span class="sr"></span>';
    var vis = node.firstChild, sr = node.lastChild;
    sr.textContent = txt;
    if (RM) { pintarJa(vis, txt); return; }
    var t0 = null;
    function frame(t) {
      if (t0 == null) t0 = t;
      var k = Math.min(1, (t - t0) / dur), out = '', n = txt.length, lim = Math.floor(k * n);
      for (var i = 0; i < n; i++) {
        var c = txt[i];
        if (c === ' ' || i < lim) out += c;
        else out += GLIFOS[Math.floor(Math.random() * GLIFOS.length)];
      }
      if (k < 1) { vis.textContent = out; requestAnimationFrame(frame); }
      else pintarJa(vis, txt);
    }
    requestAnimationFrame(frame);
  }
  /* el texto final del scramble lleva su japonés con lang="ja" (fuente y lectores) */
  var RE_JA = /([぀-ヿ一-鿿　]+)/g;
  function pintarJa(node, txt) {
    if (RE_JA.test(txt)) { RE_JA.lastIndex = 0; node.innerHTML = esc(txt).replace(RE_JA, '<span lang="ja">$1</span>'); }
    else node.textContent = txt;
    RE_JA.lastIndex = 0;
  }

  /* ─── reloj de la boutique (America/Argentina/Buenos_Aires) ───────── */
  var DF = null;
  try { DF = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); } catch (e) {}
  function ahoraBA() {
    var dia = 1, h = 12, m = 0;
    try {
      var parts = DF.formatToParts(new Date()), g = function (t) { var p = parts.filter(function (x) { return x.type === t; })[0]; return p ? p.value : ''; };
      dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday'));
      h = parseInt(g('hour'), 10); m = parseInt(g('minute'), 10);
      if (h === 24) h = 0;
    } catch (e) { var n = new Date(); dia = n.getDay(); h = n.getHours(); m = n.getMinutes(); }
    return { dia: dia, h: h, m: m, hhmm: (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m };
  }
  function estadoBoutique() {
    var t = ahoraBA(), abierto = t.dia >= 1 && t.dia <= 6 && t.h >= 11 && t.h < 19, txt;
    if (abierto) txt = 'ABIERTO · ' + t.hhmm;
    else if (t.dia === 0 || (t.dia === 6 && t.h >= 19)) txt = 'ABRE LUNES 11:00';
    else if (t.h < 11) txt = 'ABRE HOY 11:00';
    else txt = 'ABRE MAÑANA 11:00';
    return { abierto: abierto, txt: txt, hora: t.hhmm };
  }
  var relojes = [];
  function reloj(node) {
    if (!node) return;
    if (relojes.indexOf(node) < 0) relojes.push(node);
    pintarReloj(node);
  }
  function pintarReloj(node) {
    var e = estadoBoutique();
    node.setAttribute('data-estado', e.abierto ? 'abierto' : 'cerrado');
    node.innerHTML = '<span class="dot" aria-hidden="true"></span><span>BOUTIQUE :: <b>' + esc(e.txt) + '</b></span>';
  }
  setInterval(function () { relojes.forEach(pintarReloj); }, 30000);

  /* ─── vistas ──────────────────────────────────────────────────────── */
  var vistas = {
    _get: function () { return store('pm_vistas') || []; },
    marcar: function (id) {
      var v = this._get();
      if (v.indexOf(id) < 0) { v.push(id); store('pm_vistas', v); pintarTerminal(); emit('pm:vistas', { n: v.length }); }
      return v.length;
    },
    n: function () { return this._get().length; },
    lista: function () { return this._get(); }
  };

  /* ─── pasaporte 通行証 ────────────────────────────────────────────── */
  var CLAVES = ['ABRIGOS', 'CAMISAS', 'PANTALONES', 'KIMONOS', 'REMERAS', 'VESTIDOS', 'DISCONTINOUS', 'ARCHIVO', 'CASA', 'MANUK'];
  var KJ = { ABRIGOS: 'コート', CAMISAS: 'シャツ', PANTALONES: 'ズボン', KIMONOS: '着物', REMERAS: 'Tシャツ', VESTIDOS: '衣', DISCONTINOUS: '不連続', ARCHIVO: '記憶', CASA: '家', MANUK: '世界' };
  var pasaporte = {
    claves: CLAVES,
    _get: function () { return store('pm_pasaporte') || { sellos: [], desde: 0 }; },
    sellar: function (clave) {
      clave = String(clave || '').toUpperCase().replace(/ WORLD$/, '');
      if (clave === 'MANUK WORLD') clave = 'MANUK';
      if (CLAVES.indexOf(clave) < 0) return false;
      var p = this._get();
      if (p.sellos.indexOf(clave) > -1) return false;
      p.sellos.push(clave); if (!p.desde) p.desde = Date.now();
      store('pm_pasaporte', p);
      aplicarPasaporte(); pintarTerminal(); cart.render();
      emit('pm:pasaporte', { sellos: p.sellos.slice(), completo: this.completo() });
      return true;
    },
    sellos: function () { return this._get().sellos.slice(); },
    tiene: function (k) { return this._get().sellos.indexOf(k) > -1; },
    completo: function () { return this._get().sellos.length >= CLAVES.length; },
    html: function (cls) {
      var s = this._get().sellos;
      return '<span class="' + (cls || 'term-pas') + '" title="' + CLAVES.map(function (k) { return k + (s.indexOf(k) > -1 ? ' ✓' : ''); }).join(' · ') + '">' +
        '<b>' + s.length + '/' + CLAVES.length + '</b> TERRITORIOS <span lang="ja" aria-hidden="true">通行証</span> ' +
        CLAVES.map(function (k) { return '<i class="' + (s.indexOf(k) > -1 ? 'on' : '') + '" aria-hidden="true"></i>'; }).join('') +
        '<span class="sr">Pasaporte: ' + s.length + ' de ' + CLAVES.length + ' territorios visitados</span></span>';
    }
  };
  function aplicarPasaporte() {
    if (pasaporte.completo()) H.setAttribute('data-pasaporte', 'completo'); else H.removeAttribute('data-pasaporte');
  }

  /* ─── carrito (pieza única: sin cantidades, sin duplicados) ───────── */
  var cart = {
    _ids: function () { var a = store('pm_cart'); return Array.isArray(a) ? a : []; },
    items: function () { return this._ids().map(byId).filter(Boolean); },
    has: function (id) { return this._ids().indexOf(id) > -1; },
    n: function () { return this._ids().length; },
    total: function () { return this.items().reduce(function (s, p) { return s + (Number(p.pr) || 0); }, 0); },
    add: function (id, o) {
      o = o || {};
      var ids = this._ids(), p = byId(id);
      if (!p) return { ok: false, motivo: 'inexistente' };
      if (ids.indexOf(id) > -1) { if (o.abrir !== false) this.open(); return { ok: false, motivo: 'duplicado' }; }
      ids.push(id); store('pm_cart', ids);
      this.render(); emit('pm:cart', { ids: ids.slice(), accion: 'add', id: id });
      var b = $('.pm-carrito'); if (b) { b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); }
      if (o.abrir !== false) this.open();
      return { ok: true };
    },
    remove: function (id) {
      var ids = this._ids().filter(function (x) { return x !== id; });
      store('pm_cart', ids); this.render(); emit('pm:cart', { ids: ids.slice(), accion: 'remove', id: id });
      var st = $('#pm-cart .st'); if (st) st.textContent = 'PIEZA LIBERADA :: VUELVE A LA SALA';
    },
    clear: function () { store('pm_cart', []); this.render(); emit('pm:cart', { ids: [], accion: 'clear' }); },
    render: function () {
      var ids = this._ids(), items = this.items(), n = ids.length;
      $$('.pm-carrito').forEach(function (b) { b.setAttribute('data-n', n); var s = $('.n', b); if (s) s.textContent = n; b.setAttribute('aria-label', 'Carrito: ' + n + (n === 1 ? ' pieza' : ' piezas')); });
      var box = $('#pm-cart'); if (!box) return;
      $('#pm-cart-n').textContent = n ? '(' + n + ')' : '';
      var list = $('#pm-cart-list'), vacio = $('#pm-cart-vacio'), f = $('#pm-cart-f');
      if (!items.length) {
        list.innerHTML = ''; vacio.hidden = false; f.hidden = true;
      } else {
        vacio.hidden = true; f.hidden = false;
        list.innerHTML = items.map(function (p) {
          return '<li class="pm-ci" data-id="' + esc(p.id) + '">' +
            '<a class="ph" href="./ficha.html?id=' + encodeURIComponent(p.id) + '" tabindex="-1" aria-hidden="true">' + pic(p, 0, { alt: '', cls: '' }) + '</a>' +
            '<div><a class="nm" href="./ficha.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.nm) + '</a>' +
            '<span class="sku">' + esc(p.sku || p.cat || '') + '</span>' +
            (p.tl ? '<span class="tl">TALLE ' + esc(p.tl) + ' · ES ÚNICA</span>' : '') +
            sellosHTML(p.sellos) + '</div>' +
            '<div class="der"><span class="pr">' + fmt(p.pr) + '</span>' +
            '<button type="button" class="quitar" data-quitar="' + esc(p.id) + '" aria-label="Quitar ' + esc(p.nm) + ' del carrito">QUITAR</button></div></li>';
        }).join('');
        $('#pm-cart-tot').textContent = fmt(this.total());
      }
      var pas = $('#pm-cart-pas'); if (pas) pas.innerHTML = pasaporte.html('pm-cart-pas');
    },
    open: function () { abrirDialogo('pm-cart'); },
    close: function () { cerrarDialogo('pm-cart'); }
  };
  try { w.addEventListener('storage', function (e) { if (e.key === 'pm_cart' || e.key === 'pm_pasaporte' || e.key === 'pm_vistas') { cart.render(); pintarTerminal(); aplicarPasaporte(); } }); } catch (e) {}

  /* ─── diálogos con inert real ─────────────────────────────────────── */
  var abiertos = [], ultimoFoco = null;
  function fondo(id, on) {
    var dlg = d.getElementById(id);
    Array.prototype.forEach.call(d.body.children, function (c) {
      if (c === dlg || c.id === 'pm-velo' || c.id === 'grain' || c.id === 'cur' || c.id === 'cur-ring') return;
      if (c.tagName === 'SCRIPT' || c.tagName === 'SVG') return;
      if (on) { if (!c.hasAttribute('inert')) { c.setAttribute('inert', ''); c.setAttribute('data-pm-inert', id); } }
      else if (c.getAttribute('data-pm-inert') === id) { c.removeAttribute('inert'); c.removeAttribute('data-pm-inert'); }
    });
  }
  function abrirDialogo(id) {
    var dlg = d.getElementById(id); if (!dlg || dlg.classList.contains('on')) return;
    if (!abiertos.length) ultimoFoco = d.activeElement;
    // el diálogo previo queda inerte debajo (carrito → checkout)
    abiertos.forEach(function (a) { var p = d.getElementById(a); if (p) { p.setAttribute('inert', ''); p.setAttribute('data-pm-inert', id); } });
    abiertos.push(id);
    dlg.hidden = false; dlg.classList.add('on');
    fondo(id, true);
    $('#pm-velo').classList.add('on');
    H.style.overflow = 'hidden';
    var f = $('[data-foco]', dlg) || $('button,[href],input,select,textarea', dlg);
    setTimeout(function () { if (f) f.focus(); }, 30);
    emit('pm:dialogo', { id: id, abierto: true });
  }
  function cerrarDialogo(id) {
    var dlg = d.getElementById(id); if (!dlg || !dlg.classList.contains('on')) return;
    dlg.classList.remove('on');
    abiertos = abiertos.filter(function (a) { return a !== id; });
    fondo(id, false);
    abiertos.forEach(function (a) { var p = d.getElementById(a); if (p && p.getAttribute('data-pm-inert') === id) { p.removeAttribute('inert'); p.removeAttribute('data-pm-inert'); } });
    setTimeout(function () { if (!dlg.classList.contains('on')) dlg.hidden = true; }, RM ? 0 : 460);
    if (!abiertos.length) {
      $('#pm-velo').classList.remove('on'); H.style.overflow = '';
      if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    } else {
      var top = d.getElementById(abiertos[abiertos.length - 1]); var f = top && ($('[data-foco]', top) || $('button', top)); if (f) f.focus();
    }
    emit('pm:dialogo', { id: id, abierto: false });
  }
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && abiertos.length) { e.preventDefault(); cerrarDialogo(abiertos[abiertos.length - 1]); }
    if (e.key === 'Tab' && abiertos.length) {
      var dlg = d.getElementById(abiertos[abiertos.length - 1]);
      var f = $$('button:not([disabled]),[href],input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])', dlg).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ─── checkout boceto · 3 pasos ───────────────────────────────────── */
  var chk = { paso: 1, envio: 'envio', pago: 'mp' };
  function chkHTML() {
    return '<aside id="pm-chk" class="pm-chk" role="dialog" aria-modal="true" aria-labelledby="pm-chk-t" hidden>' +
      '<div class="pm-dlg-h"><h2 id="pm-chk-t">CHECKOUT <span class="n">:: SIN CUENTA</span></h2><button type="button" class="pm-x" data-cerrar="pm-chk" aria-label="Volver al carrito">[ &lt;&lt; ] CARRITO</button></div>' +
      '<div class="pm-dlg-b">' +
      '<ol class="pm-steps" aria-label="Pasos del checkout">' +
      '<li data-paso="1" aria-current="step">01<b>TUS DATOS</b></li><li data-paso="2">02<b>ENVÍO · RETIRO</b></li><li data-paso="3">03<b>PAGO</b></li></ol>' +
      '<form id="pm-chk-form" novalidate>' +
      '<section class="pm-paso on" data-paso="1"><h3>Tus datos</h3>' +
      '<label class="pm-campo"><span>EMAIL</span><input type="email" name="email" autocomplete="email" required placeholder="vos@correo.com" data-foco></label>' +
      '<div class="pm-2col"><label class="pm-campo"><span>NOMBRE</span><input type="text" name="nombre" autocomplete="given-name" required></label>' +
      '<label class="pm-campo"><span>APELLIDO</span><input type="text" name="apellido" autocomplete="family-name" required></label></div>' +
      '<label class="pm-campo"><span>TELÉFONO</span><input type="tel" name="tel" autocomplete="tel" inputmode="tel" placeholder="+54 9 11 …"></label>' +
      '<p class="pm-nota">SIN REGISTRO: EL SEGUIMIENTO DEL PEDIDO TE LLEGA POR LINK AL EMAIL.</p></section>' +
      '<section class="pm-paso" data-paso="2"><h3>Envío o retiro</h3>' +
      '<label class="pm-opt"><input type="radio" name="envio" value="envio" checked><span class="t">ENVÍO A DOMICILIO<span class="d">A todo el país por correo, con seguimiento. Despacho dentro de las 48 h hábiles.</span></span><span class="pr">SE CALCULA</span></label>' +
      '<label class="pm-opt"><input type="radio" name="envio" value="retiro"><span class="t">RETIRO EN HONDURAS 4940<span class="d">Palermo Soho · lunes a sábado de 11 a 19. Te avisamos cuando está lista.</span></span><span class="pr">SIN CARGO</span></label>' +
      '<div id="pm-chk-dir" style="margin-top:var(--s-6)">' +
      '<label class="pm-campo"><span>CALLE Y NÚMERO</span><input type="text" name="calle" autocomplete="address-line1"></label>' +
      '<div class="pm-2col"><label class="pm-campo"><span>PISO · DEPTO</span><input type="text" name="piso" autocomplete="address-line2"></label>' +
      '<label class="pm-campo"><span>CÓDIGO POSTAL</span><input type="text" name="cp" autocomplete="postal-code" inputmode="numeric"></label></div>' +
      '<div class="pm-2col"><label class="pm-campo"><span>LOCALIDAD</span><input type="text" name="loc" autocomplete="address-level2"></label>' +
      '<label class="pm-campo"><span>PROVINCIA</span><input type="text" name="prov" autocomplete="address-level1"></label></div></div></section>' +
      '<section class="pm-paso" data-paso="3"><h3>Pago</h3>' +
      '<label class="pm-opt"><input type="radio" name="pago" value="mp" checked><span class="t">MERCADO PAGO<span class="d">Tarjeta, dinero en cuenta o transferencia. Hasta 6 cuotas.</span></span><span class="pr">6 CUOTAS</span></label>' +
      '<label class="pm-opt"><input type="radio" name="pago" value="nave"><span class="t">NAVE<span class="d">Tarjetas de crédito y débito. Hasta 6 cuotas.</span></span><span class="pr">6 CUOTAS</span></label>' +
      '<p class="pm-nota" style="margin-top:var(--s-4)">PAGÁS EN LA PLATAFORMA QUE ELIJAS. EL PRECIO QUE VISTE ES EL PRECIO QUE PAGÁS.</p>' +
      '<div class="pm-resumen" id="pm-chk-res"></div></section>' +
      '<section class="pm-paso pm-listo" data-paso="4"><h3>Pedido<br>en reserva</h3>' +
      '<span class="code" id="pm-chk-code"></span>' +
      '<p>La pieza quedó reservada a tu nombre. <b>Te enviamos el link de pago y el seguimiento a tu email.</b> Si elegiste retiro, te avisamos cuando esté lista en Honduras 4940.</p></section>' +
      '</form></div>' +
      '<div class="pm-dlg-f"><div class="pm-chk-nav">' +
      '<button type="button" class="btn vol" id="pm-chk-vol">&lt;&lt; VOLVER</button>' +
      '<button type="button" class="btn fill" id="pm-chk-sig">SIGUIENTE &gt;&gt;</button></div></div></aside>';
  }
  function chkPaso(n) {
    chk.paso = n;
    var dlg = $('#pm-chk');
    $$('.pm-paso', dlg).forEach(function (s) { s.classList.toggle('on', +s.getAttribute('data-paso') === n); });
    $$('.pm-steps li', dlg).forEach(function (li) {
      var k = +li.getAttribute('data-paso');
      if (k === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      li.classList.toggle('ok', k < n);
    });
    var vol = $('#pm-chk-vol'), sig = $('#pm-chk-sig');
    vol.hidden = n === 1 || n === 4;
    sig.innerHTML = n === 3 ? 'RESERVAR Y PAGAR &gt;&gt;' : n === 4 ? 'VOLVER A LA SALA &gt;&gt;' : 'SIGUIENTE &gt;&gt;';
    if (n === 3) {
      var items = cart.items(), envio = $('input[name=envio]:checked', dlg).value, pago = $('input[name=pago]:checked', dlg).value;
      $('#pm-chk-res').innerHTML =
        items.map(function (p) { return '<div><span>' + esc(p.nm) + '</span><b>' + fmt(p.pr) + '</b></div>'; }).join('') +
        '<div><span>ENVÍO</span><b>' + (envio === 'retiro' ? 'RETIRO · SIN CARGO' : 'A COTIZAR') + '</b></div>' +
        '<div class="tot"><span>TOTAL</span><b>' + fmt(cart.total()) + '</b></div>';
    }
    var f = $('.pm-paso.on input:not([type=radio]), .pm-paso.on input[type=radio]:checked', dlg) || $('.pm-paso.on h3', dlg);
    if (f) { if (f.tagName === 'H3') f.setAttribute('tabindex', '-1'); f.focus(); }
    var b = $('.pm-dlg-b', dlg); if (b) b.scrollTop = 0;
  }
  function chkBind() {
    var dlg = $('#pm-chk'), form = $('#pm-chk-form');
    form.addEventListener('submit', function (e) { e.preventDefault(); $('#pm-chk-sig').click(); });
    $('#pm-chk-sig').addEventListener('click', function () {
      if (chk.paso === 1) {
        var ok = true; $$('.pm-paso[data-paso="1"] input[required]', dlg).forEach(function (i) { if (!i.checkValidity()) { ok = false; } });
        if (!ok) { var bad = $('.pm-paso[data-paso="1"] input:invalid', dlg); if (bad) { bad.focus(); bad.reportValidity && bad.reportValidity(); } return; }
        chkPaso(2);
      } else if (chk.paso === 2) {
        if ($('input[name=envio]:checked', dlg).value === 'envio') {
          var calle = $('input[name=calle]', dlg), cp = $('input[name=cp]', dlg);
          if (!calle.value.trim()) { calle.setCustomValidity('Falta la dirección'); calle.reportValidity && calle.reportValidity(); calle.focus(); setTimeout(function () { calle.setCustomValidity(''); }, 1500); return; }
          if (!cp.value.trim()) { cp.setCustomValidity('Falta el código postal'); cp.reportValidity && cp.reportValidity(); cp.focus(); setTimeout(function () { cp.setCustomValidity(''); }, 1500); return; }
        }
        chkPaso(3);
      } else if (chk.paso === 3) {
        var code = 'PM-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + String(Date.now()).slice(-4);
        $('#pm-chk-code').textContent = code;
        cart.clear(); chkPaso(4);
        emit('pm:pedido', { code: code });
      } else {
        cerrarDialogo('pm-chk'); cerrarDialogo('pm-cart');
      }
    });
    $('#pm-chk-vol').addEventListener('click', function () { if (chk.paso > 1 && chk.paso < 4) chkPaso(chk.paso - 1); });
    dlg.addEventListener('change', function (e) {
      if (e.target.name === 'envio') { $('#pm-chk-dir').hidden = e.target.value === 'retiro'; }
    });
  }

  /* ─── legal (footer) ──────────────────────────────────────────────── */
  var LEGAL = {
    envios: { t: 'Envíos', ja: '配送', p: ['<b>A todo el país</b> por correo, con seguimiento por link. Despachamos dentro de las 48 h hábiles de acreditado el pago.', 'También podés <b>retirar sin cargo en Honduras 4940</b>, Palermo Soho, de lunes a sábado de 11 a 19. Te avisamos cuando la pieza está lista.'] },
    cambios: { t: 'Cambios y devoluciones', ja: '交換', p: ['Tenés <b>30 días</b> desde que recibís la pieza para cambiarla. Como cada prenda es única, el cambio es por otra pieza o por crédito en la casa; si el textil lo permite, también <b>se ajusta al cuerpo</b> en el taller.', 'Tiene que volver sin uso, con su etiqueta y en el mismo estado en que salió.'] },
    arrepentimiento: { t: 'Botón de arrepentimiento', ja: '撤回', p: ['Si compraste online, podés <b>revocar la compra dentro de los 10 días corridos</b> desde que la recibiste, sin dar motivos y sin costo. Te devolvemos el importe por el mismo medio de pago.', 'Completá el formulario y te respondemos por email con las instrucciones para la devolución.'], ley: 'LEY 24.240 · ART. 34 · RES. 424/2020', form: true },
    terminos: { t: 'Términos y condiciones', ja: '規約', p: ['Los precios están en <b>pesos argentinos</b> e incluyen IVA. Cada pieza publicada está disponible y es única: al sumarla al carrito <b>queda reservada mientras completás la compra</b>.', 'Pagás con Mercado Pago o Nave, hasta 6 cuotas. Las fotos son de la pieza real; el color puede variar según la pantalla.'] },
    talles: { t: 'Guía de talles y cuidados', ja: '寸法', p: ['<b>No hay XS: la prenda se ajusta al cuerpo que la lleva.</b> Cada ficha trae las medidas reales de esa pieza (hombros, pecho, largo). Compará con una prenda tuya que te quede bien.', 'Cuidados: la mayoría se <b>lava a mano en frío</b> y se seca a la sombra. Lo pintado a mano no se plancha sobre la pintura. Si tenés dudas, escribinos por Instagram <b>@pannimargot</b>.'] }
  };
  function legalHTML() {
    return '<div id="pm-legal" class="pm-legal" role="dialog" aria-modal="true" aria-labelledby="pm-legal-t" hidden><div class="in">' +
      '<button type="button" class="pm-x" data-cerrar="pm-legal" aria-label="Cerrar" data-foco>[ × ]</button>' +
      '<h2 id="pm-legal-t"></h2><div id="pm-legal-b"></div></div></div>';
  }
  function legal(tema) {
    var L = LEGAL[tema]; if (!L) return;
    $('#pm-legal-t').innerHTML = esc(L.t) + (L.ja ? ' <span lang="ja" aria-hidden="true">' + L.ja + '</span>' : '');
    var h = L.p.map(function (x) { return '<p>' + x + '</p>'; }).join('');
    if (L.ley) h += '<p class="ley">' + esc(L.ley) + '</p>';
    if (L.form) h += '<form id="pm-arrep" novalidate><label class="pm-campo"><span>NÚMERO DE PEDIDO</span><input type="text" name="pedido" required placeholder="PM-…"></label>' +
      '<label class="pm-campo"><span>EMAIL DE LA COMPRA</span><input type="email" name="email" required autocomplete="email"></label>' +
      '<button class="btn fill" type="submit">REVOCAR LA COMPRA &gt;&gt;</button><span class="st" role="status" aria-live="polite"></span></form>';
    $('#pm-legal-b').innerHTML = h;
    var f = $('#pm-arrep');
    if (f) f.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = $('input:invalid', f); if (bad) { bad.focus(); bad.reportValidity && bad.reportValidity(); return; }
      $('.st', f).textContent = 'RECIBIDO :: TE ESCRIBIMOS DENTRO DE LAS 48 H HÁBILES.';
      $$('input,button', f).forEach(function (i) { i.disabled = true; });
    });
    abrirDialogo('pm-legal');
  }

  /* ─── header / footer / terminal ──────────────────────────────────── */
  var NAV = [
    { k: 'inicio', t: 'INICIO', ja: '', href: './index.html' },
    { k: 'shop', t: 'SHOP', ja: '店', href: './shop.html' },
    { k: 'archivo', t: 'ARCHIVO', ja: '記憶', href: './archivo.html' },
    { k: 'casa', t: 'LA CASA', ja: '家', href: './casa.html' },
    { k: 'manuk', t: 'MANUK', ja: '世界', href: './manuk.html' }
  ];
  var ALIAS = { territorio: 'shop', ficha: 'shop', home: 'inicio', index: 'inicio', 'la casa': 'casa', 'manuk world': 'manuk' };
  function headerHTML(activa) {
    activa = ALIAS[activa] || activa;
    return '<header class="pm-hd"><div class="pm-hd-row">' +
      '<a class="pm-lk" href="./index.html" aria-label="Panni Margot — inicio">' + lockupSVG('pm-lockup-hd') + '</a>' +
      '<nav class="pm-nav" aria-label="Principal">' +
      NAV.map(function (n) {
        return '<a href="' + n.href + '"' + (n.k === activa ? ' aria-current="page"' : '') + '>' + n.t + (n.ja ? ' <span lang="ja" aria-hidden="true">' + n.ja + '</span>' : '') + '</a>';
      }).join('') +
      '<span class="pm-nav-off" aria-disabled="true"><span>PERSONALIZAR <span lang="ja" aria-hidden="true">誂え</span></span><span class="sello sm">PRONTO</span></span>' +
      '</nav>' +
      '<div class="pm-hd-r">' +
      '<form class="pm-buscar" role="search" action="./shop.html" method="get">' +
      '<button type="button" class="pm-buscar-tg" aria-expanded="false" aria-controls="pm-q">BUSCAR</button>' +
      '<label for="pm-q">BUSCAR</label><input id="pm-q" type="search" name="q" autocomplete="off" placeholder="PIEZA, CATEGORÍA…" aria-label="Buscar piezas"></form>' +
      '<button type="button" class="pm-carrito" data-n="0" aria-haspopup="dialog" aria-controls="pm-cart" aria-label="Carrito: 0 piezas"><span class="txt">CARRITO</span><span class="n" aria-hidden="true">0</span></button>' +
      '</div></div></header>';
  }
  function cartHTML() {
    return '<aside id="pm-cart" class="pm-cart" role="dialog" aria-modal="true" aria-labelledby="pm-cart-t" hidden>' +
      '<div class="pm-dlg-h"><h2 id="pm-cart-t">CARRITO <span id="pm-cart-n" class="n"></span> <span lang="ja" aria-hidden="true">器</span></h2><button type="button" class="pm-x" data-cerrar="pm-cart" aria-label="Cerrar carrito" data-foco>[ × ] CERRAR</button></div>' +
      '<div class="pm-dlg-b">' +
      '<div id="pm-cart-vacio" class="pm-cart-vacio">TODAVÍA NADA.<br><b>CADA PIEZA ES ÚNICA</b>: CUANDO LA SUMÁS, QUEDA RESERVADA MIENTRAS COMPRÁS.<br><a class="btn" href="./shop.html">IR AL SHOP <span lang="ja" aria-hidden="true">店</span></a></div>' +
      '<ul id="pm-cart-list" class="pm-cart-list" aria-label="Piezas en el carrito"></ul>' +
      '<div id="pm-cart-pas"></div>' +
      '<span class="st" role="status" aria-live="polite"></span></div>' +
      '<div id="pm-cart-f" class="pm-dlg-f" hidden><div class="pm-tot"><span>TOTAL</span><b id="pm-cart-tot">$ 0</b></div>' +
      '<p class="pm-nota">ENVÍO Y CUOTAS SE DEFINEN EN EL PASO SIGUIENTE · HASTA 6 CUOTAS CON MERCADO PAGO O NAVE</p>' +
      '<button type="button" class="btn fill block lg" id="pm-cart-go">INICIAR COMPRA &gt;&gt;</button></div></aside>';
  }
  function termHTML() {
    return '<div class="term" id="pm-term" aria-label="Estado de la casa">' +
      '<span class="term-hola" id="pm-term-hola" hidden>BIENVENIDO DE VUELTA ::</span>' +
      '<span class="term-dial" aria-hidden="true" id="pm-term-dial"></span>' +
      '<span id="pm-term-pas"></span>' +
      '<span class="term-vistas"><b id="pm-term-vistas">0</b> <span id="pm-term-vistas-t">PIEZAS VISTAS</span></span>' +
      '<span class="term-reloj" id="pm-term-reloj"></span>' +
      '<span class="term-oculta"><span aria-hidden="true">&lt;&lt;GENDERLESS(<span lang="ja">ジェンダーレス</span>)//FASHION#()&gt;&gt; · <span lang="ja">バーニ　マーゴット</span></span><span class="sr">Pasaporte completo: gracias por recorrer toda la casa.</span></span>' +
      '</div>';
  }
  function footerHTML() {
    return '<footer class="pm-ft">' + termHTML() + '<div class="in">' +
      '<div class="pm-ft-grid">' +
      '<div><h2>El sitio</h2><ul>' +
      NAV.map(function (n) { return '<li><a href="' + n.href + '">' + n.t + (n.ja ? '<span lang="ja" aria-hidden="true">' + n.ja + '</span>' : '') + '</a></li>'; }).join('') +
      '</ul></div>' +
      '<div><h2>Ayuda</h2><ul>' +
      '<li><button type="button" data-legal="envios">ENVÍOS</button></li>' +
      '<li><button type="button" data-legal="cambios">CAMBIOS Y DEVOLUCIONES</button></li>' +
      '<li><button type="button" data-legal="talles">GUÍA DE TALLES Y CUIDADOS</button></li>' +
      '<li><button type="button" data-legal="terminos">TÉRMINOS Y CONDICIONES</button></li>' +
      '</ul><div class="arrep"><button type="button" class="btn sm" data-legal="arrepentimiento">BOTÓN DE ARREPENTIMIENTO</button></div></div>' +
      '<div><h2>La boutique <span lang="ja" aria-hidden="true">店</span></h2><address>' +
      '<b>HONDURAS 4940</b><br>PALERMO SOHO · CABA<br>LUN — SÁB · 11:00 — 19:00<br>' +
      '<a href="https://instagram.com/pannimargot" rel="noopener" target="_blank">INSTAGRAM :: @PANNIMARGOT</a>' +
      '<span class="reloj" id="pm-ft-reloj"></span></address></div>' +
      '<div class="pm-news"><h2>Newsletter</h2><p>Una sola lista, sin géneros y sin ruido: piezas nuevas y lo que pasa en el taller.</p>' +
      '<form id="pm-news" novalidate><label class="sr" for="pm-news-e">Tu email</label><input id="pm-news-e" type="email" name="email" required autocomplete="email" placeholder="TU EMAIL"><button type="submit">SUMARME &gt;&gt;</button></form>' +
      '<span class="st" role="status" aria-live="polite"></span></div>' +
      '</div>' +
      '<div class="pm-ft-firma">' + lockupSVG('', 'Panni Margot') +
      '<div class="pm-ft-legal"><span>© 2026 PANNI MARGOT · <span lang="ja">ブエノスアイレスで作られた</span> · MADE IN BUENOS AIRES</span>' +
      '<span class="dial" aria-hidden="true">&lt;&lt;GENDERLESS(<span lang="ja">ジェンダーレス</span>)//FASHION#()&gt;&gt; &gt;&gt;HONDURAS4940##</span></div>' +
      '</div></div></footer>';
  }
  function pintarTerminal() {
    var t = $('#pm-term'); if (!t) return;
    var pas = $('#pm-term-pas'); if (pas) pas.innerHTML = pasaporte.html('term-pas');
    var n = vistas.n(), v = $('#pm-term-vistas'); if (v) v.textContent = n;
    var vt = $('#pm-term-vistas-t'); if (vt) vt.textContent = n === 1 ? 'PIEZA VISTA' : 'PIEZAS VISTAS';
  }

  /* ─── grano / cursor / velo ───────────────────────────────────────── */
  function montarCursor() {
    if (RM || !FINE) return;
    var dot = d.getElementById('cur'), ring = d.getElementById('cur-ring'); if (!dot || !ring) return;
    H.classList.add('has-cur');
    /* nace apagado: hasta el primer movimiento del mouse no hay nada pintado en (0,0) */
    dot.classList.add('off'); ring.classList.add('off');
    var mx = innerWidth / 2, my = innerHeight / 2, dx = mx, dy = my, rx = mx, ry = my, run = false;
    function loop() {
      dx += (mx - dx) * .55; dy += (my - dy) * .55; rx += (mx - rx) * .14; ry += (my - ry) * .14;
      dot.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      if (Math.abs(mx - rx) + Math.abs(my - ry) > .2) requestAnimationFrame(loop); else run = false;
    }
    addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; dot.classList.remove('off'); ring.classList.remove('off'); if (!run) { run = true; requestAnimationFrame(loop); } }, { passive: true });
    d.addEventListener('mouseleave', function () { dot.classList.add('off'); ring.classList.add('off'); });
    d.addEventListener('mouseenter', function () { dot.classList.remove('off'); ring.classList.remove('off'); });
    d.addEventListener('pointerover', function (e) {
      var t = e.target.closest ? e.target.closest('a,button,input,select,textarea,label,[data-cur],summary') : null;
      ring.classList.toggle('big', !!t);
    }, { passive: true });
  }

  /* ─── reveals: fallback IO cuando no hay animation-timeline ───────── */
  var SD = false; try { SD = CSS.supports('animation-timeline: view()'); } catch (e) {}
  var io = null;
  function revelar(root) {
    var nodos = $$('.rv', root);
    if (SD || RM) { if (RM) nodos.forEach(function (n) { n.classList.add('in-view'); }); return; }
    if (!('IntersectionObserver' in w)) { nodos.forEach(function (n) { n.classList.add('in-view'); }); return; }
    if (!io) io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    nodos.forEach(function (n) { if (!n.classList.contains('in-view')) io.observe(n); });
  }

  /* ─── linterna ────────────────────────────────────────────────────── */
  function linterna(c) {
    if (!c) return; c.classList.add('linterna');
    if (!FINE || RM) return;
    var raf = 0, px = 0, py = 0;
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(function () { c.style.setProperty('--lx', px + 'px'); c.style.setProperty('--ly', py + 'px'); raf = 0; });
    }, { passive: true });
  }

  /* ─── marquesina: duplica para loop continuo ──────────────────────── */
  function marquesina(node, items) {
    if (!node) return;
    node.classList.add('marq'); node.setAttribute('aria-hidden', 'true');
    var inner = $('.marq-in', node);
    if (!inner) { inner = el('<div class="marq-in"></div>'); node.appendChild(inner); }
    if (items && items.length) inner.innerHTML = items.map(function (t) { return '<span>' + t + '</span>'; }).join('');
    var base = inner.innerHTML, w0 = inner.scrollWidth || 1, veces = Math.max(2, Math.ceil((node.clientWidth * 2) / w0) + 1);
    var out = ''; for (var i = 0; i < veces; i++) out += base; inner.innerHTML = out;
    node.style.setProperty('--marq-dur', Math.max(24, Math.round(inner.scrollWidth / 60)) + 's');
  }

  /* ─── view transitions entre documentos: si el navegador saltea la transición (pestaña oculta, carga lenta),
         la promesa rechazada no llega a la consola como error ───────────────────────────────────────── */
  ['pagereveal', 'pageswap'].forEach(function (ev) {
    try { w.addEventListener(ev, function (e) { var vt = e.viewTransition; if (!vt) return; ['ready', 'finished', 'updateCallbackDone'].forEach(function (k) { try { vt[k].catch(function () {}); } catch (_) {} }); }); } catch (_) {}
  });

  /* ─── montarCromo ─────────────────────────────────────────────────── */
  var montado = false;
  function montarCromo(o) {
    o = o || {};
    if (montado) return PM;
    montado = true;
    H.setAttribute('data-modulo', o.modulo === 'blanco' ? 'blanco' : 'negro');
    inyectarSymbol();
    if (!$('.skip')) d.body.insertBefore(el('<a class="skip" href="#contenido">SALTAR AL CONTENIDO</a>'), d.body.firstChild);
    var main = $('main');
    if (main && !main.id) main.id = 'contenido';
    var hd = el(headerHTML(o.activa || ''));
    if (main) main.parentNode.insertBefore(hd, main); else d.body.appendChild(hd);
    if (o.marquesina !== false && o.marquesina) { var mq = el('<div class="marq cromo"></div>'); hd.parentNode.insertBefore(mq, hd.nextSibling); marquesina(mq, o.marquesina); }
    var ft = el(footerHTML());
    var ref = main ? main.nextSibling : null;
    if (ref) d.body.insertBefore(ft, ref); else d.body.appendChild(ft);
    d.body.appendChild(el('<div id="pm-velo" aria-hidden="true"></div>'));
    d.body.appendChild(el(cartHTML()));
    d.body.appendChild(el(chkHTML()));
    d.body.appendChild(el(legalHTML()));
    d.body.appendChild(el('<div id="grain" aria-hidden="true"></div>'));
    d.body.appendChild(el('<div id="cur" aria-hidden="true"></div>'));
    d.body.appendChild(el('<div id="cur-ring" aria-hidden="true"></div>'));

    // eventos del cromo
    d.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target : null; if (!t) return;
      var b;
      if ((b = t.closest('.pm-carrito'))) { e.preventDefault(); cart.open(); return; }
      if ((b = t.closest('[data-cerrar]'))) { cerrarDialogo(b.getAttribute('data-cerrar')); return; }
      if ((b = t.closest('[data-quitar]'))) { cart.remove(b.getAttribute('data-quitar')); return; }
      if ((b = t.closest('[data-legal]'))) { legal(b.getAttribute('data-legal')); return; }
      if ((b = t.closest('[data-add]'))) { e.preventDefault(); var r = cart.add(b.getAttribute('data-add')); if (!r.ok && r.motivo === 'duplicado') { var st = $('#pm-cart .st'); if (st) st.textContent = 'YA ESTÁ EN TU CARRITO :: ES UNA SOLA'; } return; }
      if (t.id === 'pm-velo') { if (abiertos.length) cerrarDialogo(abiertos[abiertos.length - 1]); return; }
      if ((b = t.closest('.pm-buscar-tg'))) { var f = b.closest('.pm-buscar'); var open = f.classList.toggle('open'); b.setAttribute('aria-expanded', open); if (open) $('input', f).focus(); return; }
    });
    $('#pm-cart-go').addEventListener('click', function () { if (!cart.n()) return; chkPaso(1); abrirDialogo('pm-chk'); });
    chkBind();
    $('#pm-news').addEventListener('submit', function (e) {
      e.preventDefault(); var i = $('#pm-news-e'), st = $('.pm-news .st');
      if (!i.checkValidity()) { i.focus(); i.reportValidity && i.reportValidity(); return; }
      st.textContent = 'LISTO :: YA ESTÁS EN LA LISTA'; i.value = ''; i.disabled = true; $('#pm-news button').disabled = true;
    });
    $('.pm-buscar').addEventListener('submit', function (e) { var i = $('#pm-q'); if (!i.value.trim()) { e.preventDefault(); i.focus(); } });

    // nav a una fila scrolleable (tablet/teléfono): el ítem activo entra en pantalla y la fila declara hacia dónde sigue (data-sc)
    (function () {
      var nav = $('.pm-nav', hd); if (!nav) return;
      var act = $('[aria-current="page"]', nav);
      function marcar() { if (nav.scrollLeft > 4) nav.setAttribute('data-sc', 'l'); else nav.removeAttribute('data-sc'); }
      function centrar() {
        if (act && nav.scrollWidth > nav.clientWidth + 4 && act.offsetLeft + act.offsetWidth + 40 > nav.clientWidth)
          nav.scrollLeft = Math.max(0, act.offsetLeft - (nav.clientWidth - act.offsetWidth) / 2);
        marcar();
      }
      nav.addEventListener('scroll', marcar, { passive: true });
      centrar(); addEventListener('resize', centrar, { passive: true });
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(centrar);
    })();

    // estado
    cart.render(); aplicarPasaporte();
    reloj($('#pm-term-reloj')); reloj($('#pm-ft-reloj'));
    pintarTerminal();
    scramble($('#pm-term-dial'), 'BUENOS AIRES//デザイナー ..DESIGNER >>HONDURAS4940##');
    try {
      var ses = sessionStorage.getItem('pm_ses');
      if (!ses) { sessionStorage.setItem('pm_ses', '1'); var p = store('pm_pasaporte'); if (p && p.sellos && p.sellos.length) { $('#pm-term-hola').hidden = false; } }
      else { var p2 = store('pm_pasaporte'); if (p2 && p2.sellos && p2.sellos.length) $('#pm-term-hola').hidden = false; }
    } catch (e) {}
    if (o.sello) pasaporte.sellar(o.sello);
    montarCursor();
    revelar();
    emit('pm:cromo', o);
    return PM;
  }

  /* ─── API ─────────────────────────────────────────────────────────── */
  var PM = w.PM = {
    montarCromo: montarCromo,
    cart: cart, pasaporte: pasaporte, vistas: vistas,
    reloj: reloj, estadoBoutique: estadoBoutique, scramble: scramble, fmt: fmt,
    pic: pic, pcardHTML: pcardHTML, selloHTML: selloHTML, sellosHTML: sellosHTML, lockupSVG: lockupSVG,
    linterna: linterna, revelar: revelar, marquesina: marquesina, legal: legal,
    abrir: abrirDialogo, cerrar: cerrarDialogo,
    qs: qs, byId: byId, esc: esc, el: el,
    RM: RM, FINE: FINE, SD: SD, KJ: KJ
  };
})();
