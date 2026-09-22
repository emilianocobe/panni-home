/* ═══════════════════════════════════════════════════════════════════
   PANNI MARGOT · SÍNTESIS · joyeria.js
   JOYERÍA — Saga Jwls, la marca de joyería de Sofía dentro del shop de la casa (weekly 17/09 + Slack 21–22/09).
   VISTA PREVIA: las ocho piezas y sus precios salen de la tienda de Saga tal como estaba publicada el 17/09
   (captura enviada por Sofía). Los datos oficiales llegan con la planilla de carga; hasta entonces todo es provisorio.
   Se carga DESPUÉS de catalogo.js y ANTES de base.js, en todas las páginas (el carrito resuelve piezas por id).

   Lo que ya está decidido y este archivo respeta:
   · todo se hace a pedido: no hay stock ni reserva, no se agota;
   · plazo único: 10 a 15 días hábiles;
   · los anillos se hacen en todos los talles de la guía (AR 6 a 29); el cliente elige en talle argentino
     y ve al lado el USA y los milímetros (data/marca/saga-jewels/talles-anillos.csv);
   · factura Panni; condiciones comerciales de Panni; fotos en blanco y negro, a color al pasar el cursor.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var C = window.CATALOGO; if (!C) return;

  /* guía de talles unificada: talle AR → diámetro interno, desarrollo y equivalente USA (por diámetro) */
  var GUIA = [
    ['6', '14,1', '46', '3'], ['8', '14,7', '48', '4'], ['10', '15,6', '50', '5'], ['12', '16,3', '52', '5½'],
    ['14', '16,9', '54', '6½'], ['16', '17,6', '56', '7½'], ['18', '18,2', '58', '8'], ['20', '18,9', '60', '9'],
    ['22', '19,6', '62', '10'], ['24', '20,3', '64', '10½'], ['26', '21,0', '66', '11½'], ['28', '21,6', '68', '12½'],
    ['29', '22,1', '69', '13']
  ];
  var TALLES = GUIA.map(function (g) { return g[0]; });
  var MED = {}, USA = {};
  GUIA.forEach(function (g) {
    MED[g[0]] = [['Diámetro interno', g[1] + ' mm'], ['Desarrollo', g[2] + ' mm'], ['Equivale a USA', g[3]]];
    USA[g[0]] = g[3];
  });

  var PLAZO = '10 A 15 DÍAS HÁBILES';
  /* texto general de la casa Saga (lo publica en todas sus piezas); la descripción propia de cada una llega con la planilla */
  var OFICIO = 'Diseñada y hecha a mano en Buenos Aires, en plata 925. Cada pieza se funde a pedido, en tu talle: puede presentar ' +
    'particularidades que la hacen única.';
  var F = './fotos/saga/';

  /* [id, nombre, precio de su tienda al 17/09, fotos, colección, lleva talle, descripción propia] */
  var JOYAS = [
    ['flora-ring', 'Flora Ring', 190000, ['flora-ring'], 'Biomórfica', true,
      'Diseñado como parte de la colección Biomórfica: modelado a mano con la técnica de cera perdida y fundido en plata 925. ' +
      'El diseño como síntesis de las formas de la naturaleza.'],
    ['free-hand-ring', 'Free Hand Ring', 140000, ['free-hand-ring'], '', true, ''],
    ['bones-ring', 'Bones Ring', 135900, ['bones-ring'], '', true, ''],
    ['freedom-ring', 'Freedom Ring', 180750, ['freedom-ring'], '', true, ''],
    ['celula-ring', 'Célula Ring', 196507, ['celula-ring'], '', true, ''],
    ['victory-ring', 'Victory Ring', 229090, ['victory-ring'], '', true, ''],
    ['spy-ring', 'Spy Ring', 179090, ['spy-ring'], '', true, ''],
    ['oda-a-la-luna-candelabro', 'Oda a la luna', 346900, ['oda-a-la-luna-candelabro', 'oda-a-la-luna-encendido'], '', false,
      'Candelabro de plata. Objeto de la casa Saga, hecho a mano y a pedido.']
  ];

  var piezas = JOYAS.map(function (j, i) {
    var imgs = j[3].map(function (f) { return F + f + '.webp'; });
    return {
      id: 'saga-' + j[0], nm: j[1], sku: 'SAGA.' + j[0].toUpperCase().replace(/-/g, '.'),
      cat: 'JOYERIA', kj: '宝飾', pr: j[2],
      tls: j[5] ? TALLES.slice() : ['U'], tl: j[5] ? null : 'U',
      stockPorTalle: {}, stock: null, unicaDeclarada: false, unica: false, ultima: false,
      imgs: imgs, lq: imgs[0], hero: imgs[0],
      desc: j[6] || OFICIO, descCompleta: true, mat: ['Plata 925'],
      med: null, medPorTalle: j[5] ? MED : null, medTalle: null,
      sellos: [], fam: 'JOYA', comp: [], ts: 1789000000 - i, pos: 900 + i, mod: '2026-09-17', verificado: false, url: '',
      /* lo propio de la joyería */
      marca: 'saga', aPedido: true, plazo: PLAZO, coleccion: j[4] || '', usa: j[5] ? USA : null, provisorio: true
    };
  });

  C.piezas = C.piezas.concat(piezas);
  /* Joyería va con las tipologías de la casa, justo antes de DISCONTINOUS (que sigue aparte) */
  var cat = { key: 'JOYERIA', nombre: 'Joyería', kj: '宝飾', n: piezas.length, nTienda: piezas.length, nArchivo: 0, marca: 'saga' };
  var iDisc = -1;
  C.categorias.forEach(function (c, i) { if (c.key === 'DISCONTINOUS') iDisc = i; });
  if (iDisc > -1) C.categorias.splice(iDisc, 0, cat); else C.categorias.push(cat);

  /* byId de catalogo.js indexa en su cierre: se envuelve para que también encuentre las joyas */
  var idx = {}; piezas.forEach(function (p) { idx[p.id] = p; });
  var byId = C.byId;
  C.byId = function (id) { return idx[id] || byId(id); };

  C.saga = { guia: GUIA, plazo: PLAZO, talles: TALLES, usa: USA };
})();
