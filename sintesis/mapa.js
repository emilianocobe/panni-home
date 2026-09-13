/* ═══════════════════════════════════════════════════════════════════════
   PANNI MARGOT · SÍNTESIS · mapa.js
   El plano de la casa, hecho mapa real con datos abiertos (decisión 13/09):
   MapLibre GL + calles de OpenStreetMap servidas por OpenFreeMap. Sin clave,
   sin Google, con la estética del plano tipográfico: negro, grilla, la calle
   Honduras horizontal y el marcador cuadrado de la casa.

   Uso: <div data-mapa="plano|casa" data-mx=".62" data-my=".44" data-zoom="15.6">
   · data-mx / data-my: dónde cae la casa dentro del recuadro (fracción del ancho/alto).
   · El plano tipográfico queda debajo como respaldo: si no hay WebGL, si la red
     falla o si tarda, se ve el plano de siempre. Nada se carga hasta que el
     recuadro se acerca a la pantalla.
   · Expone el punto de la casa en CSS (--mx / --my, en px) para que la cruz de
     mira, el anillo y el marcador de cada página lo sigan.
   ═══════════════════════════════════════════════════════════════════════ */
(function (w, d) {
  'use strict';
  var ML = 'https://cdn.jsdelivr.net/npm/maplibre-gl@5.24.0/dist/maplibre-gl';
  /* Honduras 4940, Palermo Soho (OpenStreetMap / Nominatim) */
  var CASA = [-58.4296002, -34.5892225];
  /* la calle Honduras corre a 309° (del 4600 al 5300): con el mapa girado a 219° queda horizontal y la numeración crece hacia la derecha, como en el plano */
  var RUMBO = 219;
  var reduce = false;
  try { reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var promesa = null;
  function cargar() {
    if (promesa) return promesa;
    promesa = new Promise(function (ok, ko) {
      if (w.maplibregl) { ok(w.maplibregl); return; }
      var l = d.createElement('link'); l.rel = 'stylesheet'; l.href = ML + '.css'; d.head.appendChild(l);
      var s = d.createElement('script'); s.src = ML + '.js'; s.async = true; s.crossOrigin = 'anonymous';
      s.onload = function () { if (w.maplibregl) ok(w.maplibregl); else ko(new Error('maplibre')); };
      s.onerror = function () { ko(new Error('red')); };
      d.head.appendChild(s);
    });
    return promesa;
  }
  function hayWebGL() {
    try { var c = d.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
  }

  /* estilo de la casa sobre el esquema OpenMapTiles: sin colores, sin comercios, sin barrios; solo el trazado */
  function estilo(sinRotulo) {
    var calle = ['match', ['get', 'class'], ['minor', 'service'], true, false];
    var media = ['match', ['get', 'class'], ['tertiary', 'secondary'], true, false];
    var avenida = ['match', ['get', 'class'], ['primary', 'trunk', 'motorway'], true, false];
    var ancho = function (a, b) { return ['interpolate', ['exponential', 1.6], ['zoom'], 13, a, 18, b]; };
    return {
      version: 8,
      glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
      sources: { osm: { type: 'vector', url: 'https://tiles.openfreemap.org/planet', attribution: '© OpenStreetMap' } },
      layers: [
        { id: 'fondo', type: 'background', paint: { 'background-color': '#000' } },
        { id: 'agua', type: 'fill', source: 'osm', 'source-layer': 'water', paint: { 'fill-color': '#0d0d0d' } },
        { id: 'plazas', type: 'fill', source: 'osm', 'source-layer': 'park', paint: { 'fill-color': '#070707' } },
        { id: 'edificios', type: 'fill', source: 'osm', 'source-layer': 'building', minzoom: 14,
          paint: { 'fill-color': '#090909', 'fill-outline-color': '#1a1a1a' } },
        { id: 'tren', type: 'line', source: 'osm', 'source-layer': 'transportation', filter: ['==', ['get', 'class'], 'rail'],
          paint: { 'line-color': '#2a2a2a', 'line-width': 1, 'line-dasharray': [3, 3] } },
        { id: 'calles', type: 'line', source: 'osm', 'source-layer': 'transportation', filter: calle,
          layout: { 'line-cap': 'butt' }, paint: { 'line-color': '#262626', 'line-width': ancho(.4, 5) } },
        { id: 'calles-medias', type: 'line', source: 'osm', 'source-layer': 'transportation', filter: media,
          paint: { 'line-color': '#3a3a3a', 'line-width': ancho(.8, 8) } },
        { id: 'avenidas', type: 'line', source: 'osm', 'source-layer': 'transportation', filter: avenida,
          paint: { 'line-color': '#5c5c5c', 'line-width': ancho(1.2, 11) } },
        /* la calle de la casa, en el blanco secundario del sistema */
        { id: 'honduras', type: 'line', source: 'osm', 'source-layer': 'transportation_name', filter: ['==', ['get', 'name'], 'Honduras'],
          paint: { 'line-color': '#a8a8a8', 'line-width': ancho(.8, 2.5) } },
        { id: 'nombres', type: 'symbol', source: 'osm', 'source-layer': 'transportation_name', minzoom: 15,
          filter: sinRotulo ? ['!=', ['get', 'name'], sinRotulo] : ['has', 'name'],
          layout: {
            'symbol-placement': 'line', 'text-field': ['upcase', ['get', 'name']], 'text-font': ['Noto Sans Regular'],
            'text-size': 9, 'text-letter-spacing': .32, 'text-max-angle': 20, 'symbol-spacing': 320
          },
          paint: {
            'text-color': ['case', ['==', ['get', 'name'], 'Honduras'], '#ffffff', '#6b6b6b'],
            'text-halo-color': '#000', 'text-halo-width': 1.4
          } }
      ]
    };
  }

  function montar(el) {
    if (el.__mapa) return;
    el.__mapa = true;
    var mx = parseFloat(el.getAttribute('data-mx') || '.5'), my = parseFloat(el.getAttribute('data-my') || '.5');
    var zoom = parseFloat(el.getAttribute('data-zoom') || '16');
    var lienzo = d.createElement('div');
    lienzo.className = 'mapa-lienzo';
    lienzo.setAttribute('aria-hidden', 'true');
    el.insertBefore(lienzo, el.firstChild);

    cargar().then(function (ml) {
      /* la casa se corre del centro con padding (vale para jumpTo, flyTo y el arrastre): el centro útil queda en mx / my */
      var relleno = function () {
        var W = el.clientWidth, H = el.clientHeight;
        return { left: mx > .5 ? (2 * mx - 1) * W : 0, right: mx < .5 ? (1 - 2 * mx) * W : 0, top: my > .5 ? (2 * my - 1) * H : 0, bottom: my < .5 ? (1 - 2 * my) * H : 0 };
      };
      var map = new ml.Map({
        container: lienzo, style: estilo(el.getAttribute('data-sin-rotulo')), center: CASA,
        zoom: reduce ? zoom : zoom - 2.4, bearing: reduce ? RUMBO : RUMBO - 34, pitch: 0,
        interactive: false, attributionControl: false, fadeDuration: 0,
        minZoom: 12, maxZoom: 18.5, renderWorldCopies: false
      });
      el.__map = map;
      map.jumpTo({ center: CASA, padding: relleno() });

      /* el punto de la casa, en px, para la cruz de mira / anillo / marcador de la página */
      var seguir = function () {
        var p = map.project(CASA);
        el.style.setProperty('--mx', p.x.toFixed(1) + 'px');
        el.style.setProperty('--my', p.y.toFixed(1) + 'px');
      };
      map.on('move', seguir);
      map.on('resize', seguir);

      var listo = false;
      var falla = setTimeout(function () { if (!listo) { map.remove(); lienzo.remove(); } }, 15000);
      map.on('load', function () {
        listo = true; clearTimeout(falla);
        map.resize();
        seguir();
        el.classList.add('mapa-vivo');
        try { el.dispatchEvent(new CustomEvent('pm:mapa', { bubbles: true })); } catch (e) {}
        llegar(false);
      });
      map.on('error', function () { /* un tile caído no rompe el plano: el respaldo queda debajo */ });

      /* la llegada: de la ciudad a la cuadra, girando hasta que Honduras queda horizontal. Solo cuando se ve. */
      var llego = false;
      function llegar(forzar) {
        if ((llego && !forzar) || !enPantalla()) return;
        llego = true;
        var destino = { center: CASA, zoom: zoom, bearing: RUMBO, padding: relleno() };
        if (reduce) map.jumpTo(destino);
        else map.flyTo(Object.assign(destino, { duration: 3600, curve: 1.15, essential: false }));
      }
      function enPantalla() {
        var r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < (w.innerHeight || d.documentElement.clientHeight);
      }
      if ('IntersectionObserver' in w) {
        new IntersectionObserver(function (es) { if (es[0].isIntersecting && listo) llegar(false); }, { threshold: .35 }).observe(el);
      }

      /* interacción opcional (La Casa): un botón activa mover y acercar; al volver, la casa regresa a su lugar */
      el.__mapaCtl = {
        mover: function (on) {
          var h = map;
          ['dragPan', 'scrollZoom', 'doubleClickZoom', 'touchZoomRotate', 'keyboard'].forEach(function (k) { if (h[k]) h[k][on ? 'enable' : 'disable'](); });
          if (h.touchZoomRotate && on) h.touchZoomRotate.disableRotation();
          el.classList.toggle('mapa-mueve', on);
          if (!on) llegar(true);
        },
        acercar: function (dz) { map.easeTo({ zoom: map.getZoom() + dz, duration: reduce ? 0 : 300 }); }
      };
      w.addEventListener('resize', function () { if (!el.classList.contains('mapa-mueve')) map.jumpTo({ center: CASA, padding: relleno() }); });
    }).catch(function () { lienzo.remove(); el.__mapa = false; });
  }

  function iniciar() {
    if (!hayWebGL()) return;
    var nodos = Array.prototype.slice.call(d.querySelectorAll('[data-mapa]'));
    if (!nodos.length) return;
    if (!('IntersectionObserver' in w)) { nodos.forEach(montar); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); montar(e.target); } });
    }, { rootMargin: '600px 0px' });
    nodos.forEach(function (n) { io.observe(n); });
  }

  w.PM = w.PM || {};
  w.PM.mapa = { montar: montar };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})(window, document);
