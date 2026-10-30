// decoraciones.js — Decoraciones SVG para las tarjetas.

const PALETA_DEFECTO = {
  color1: "#7BA7D9",
  color2: "#F4A59A",
  color3: "#A8D5BA",
  fondo: "#FFFFFF"
};

function svgBase(contenido, tamañoCm) {
  if (tamañoCm === undefined) tamañoCm = 4.5;
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="' +
    tamañoCm + 'cm" height="' + tamañoCm + 'cm" preserveAspectRatio="xMidYMid meet">' +
    contenido + '</svg>';
}

function numAleatorio(min, max) { return Math.random() * (max - min) + min; }
function enteroAleatorio(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function elegirAlAzar(arr) { return arr[enteroAleatorio(0, arr.length - 1)]; }

/* ===== ESTILO A — ABSTRACTO ===== */

function mancha(color, semilla, opacidad) {
  if (opacidad === undefined) opacidad = 0.9;
  const numPuntos = enteroAleatorio(6, 9);
  const puntos = [];
  for (let i = 0; i < numPuntos; i++) {
    const ang = (i / numPuntos) * Math.PI * 2;
    const r = 28 + ((Math.sin(semilla * 10 + i * 1.7) + 1) / 2) * 18;
    puntos.push({ x: 50 + Math.cos(ang) * r, y: 50 + Math.sin(ang) * r });
  }
  let d = 'M ' + puntos[0].x + ' ' + puntos[0].y;
  for (let i = 0; i < puntos.length; i++) {
    const p0 = puntos[i];
    const p1 = puntos[(i + 1) % puntos.length];
    const mx = (p0.x + p1.x) / 2;
    const my = (p0.y + p1.y) / 2;
    d += ' Q ' + p0.x + ' ' + p0.y + ' ' + mx + ' ' + my;
  }
  d += ' Z';
  return '<path d="' + d + '" fill="' + color + '" opacity="' + opacidad + '" />';
}

function composicionAbstracta(paleta) {
  const colores = [paleta.color1, paleta.color2, paleta.color3];
  const numFormas = enteroAleatorio(2, 4);
  let contenido = '';
  for (let i = 0; i < numFormas; i++) {
    const color = elegirAlAzar(colores);
    const semilla = Math.random();
    const rotacion = numAleatorio(-90, 90);
    const escala = numAleatorio(0.55, 1.15);
    const dx = numAleatorio(-22, 22);
    const dy = numAleatorio(-22, 22);
    const opacidad = numAleatorio(0.6, 0.95);
    contenido +=
      '<g transform="translate(' + dx + ' ' + dy + ') rotate(' + rotacion + ' 50 50)">' +
      '<g transform="translate(50 50) scale(' + escala + ') translate(-50 -50)">' +
      mancha(color, semilla, opacidad) +
      '</g></g>';
  }
  const numExtras = enteroAleatorio(0, 3);
  for (let i = 0; i < numExtras; i++) {
    const color = elegirAlAzar(colores);
    const cx = numAleatorio(10, 90);
    const cy = numAleatorio(10, 90);
    const r = numAleatorio(1.5, 4.5);
    if (Math.random() < 0.5) {
      contenido += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + color + '" opacity="0.75" />';
    } else {
      contenido += '<path d="M ' + cx + ' ' + (cy - r * 2) +
        ' Q ' + (cx + r * 1.6) + ' ' + cy + ' ' + cx + ' ' + (cy + r) +
        ' Q ' + (cx - r * 1.6) + ' ' + cy + ' ' + cx + ' ' + (cy - r * 2) + ' Z" fill="' + color + '" opacity="0.7" />';
    }
  }
  return svgBase(contenido, 4.5);
}

/* ===== PIEZAS BASE ===== */

function hojaSVG(colorHoja, colorNervio, escala, rotacion) {
  if (escala === undefined) escala = 1;
  if (rotacion === undefined) rotacion = 0;
  return '<g transform="rotate(' + rotacion + ' 50 50)">' +
    '<g transform="translate(50 50) scale(' + escala + ') translate(-50 -50)">' +
    '<path d="M50 18 C36 34, 36 66, 50 82 C64 66, 64 34, 50 18 Z" fill="' + colorHoja + '" />' +
    '<line x1="50" y1="22" x2="50" y2="78" stroke="' + colorNervio + '" stroke-width="0.8" opacity="0.6" />' +
    '</g></g>';
}

function florSVG(colorPetalo, colorCentro) {
  let petalos = '';
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * 360;
    petalos += '<ellipse cx="50" cy="36" rx="8" ry="13" fill="' + colorPetalo +
      '" transform="rotate(' + ang + ' 50 50)" />';
  }
  return '<g>' + petalos + '<circle cx="50" cy="50" r="5.5" fill="' + colorCentro + '" /></g>';
}

function corazonSVG(color) {
  return '<path d="M50 82 C20 60, 15 32, 32 22 C42 16, 50 24, 50 34 ' +
    'C50 24, 58 16, 68 22 C85 32, 80 60, 50 82 Z" fill="' + color + '" />';
}

/* ===== VARIANTES ILUSTRADAS ===== */

function varianteRama(paleta) {
  const numHojas = enteroAleatorio(4, 5);
  let contenido = '<path d="M50 8 C44 40, 40 72, 48 95" stroke="' + paleta.color3 +
    '" stroke-width="2.2" fill="none" />';
  for (let i = 0; i < numHojas; i++) {
    const t = i / (numHojas - 1);
    const y = 22 + t * 60;
    const lado = i % 2 === 0 ? -1 : 1;
    const x = 48 + lado * numAleatorio(10, 16);
    const rot = lado * numAleatorio(30, 60);
    const esc = numAleatorio(0.65, 0.85);
    contenido += '<g transform="translate(' + (x - 50) + ' ' + (y - 50) + ')">' +
      hojaSVG(paleta.color3, paleta.color1, esc, rot) + '</g>';
  }
  return contenido;
}

function varianteFlores(paleta) {
  const numFlores = enteroAleatorio(2, 3);
  let contenido = '';
  for (let i = 0; i < numFlores; i++) {
    const x = 20 + i * 22 + numAleatorio(-6, 6);
    contenido += '<path d="M' + x + ' 95 Q' + (x + numAleatorio(-8, 8)) + ' 55 ' +
      (x + numAleatorio(-4, 4)) + ' 25" stroke="' + paleta.color3 +
      '" stroke-width="0.9" fill="none" opacity="0.85" />';
  }
  for (let i = 0; i < numFlores; i++) {
    const x = 25 + i * 22 + numAleatorio(-6, 6);
    const y = numAleatorio(20, 45);
    const esc = numAleatorio(0.85, 1.05);
    const rot = numAleatorio(-20, 20);
    contenido += '<g transform="translate(' + (x - 50) + ' ' + (y - 50) + ')">' +
      '<g transform="rotate(' + rot + ' 50 50)">' +
      '<g transform="translate(50 50) scale(' + esc + ') translate(-50 -50)">' +
      florSVG(paleta.color2, paleta.color1) +
      '</g></g></g>';
  }
  return contenido;
}

function varianteLineasBotanicas(paleta) {
  let contenido = '';
  const numLineas = enteroAleatorio(3, 4);
  for (let i = 0; i < numLineas; i++) {
    const offset = numAleatorio(-10, 10);
    const curvatura = numAleatorio(-25, 25);
    const color = i % 2 === 0 ? paleta.color3 : paleta.color1;
    contenido += '<path d="M ' + (12 + offset) + ' 95 Q ' +
      (50 + curvatura) + ' 50 ' + (30 + offset) + ' 8" stroke="' + color +
      '" stroke-width="2" fill="none" opacity="0.9" />';
  }
  const numPuntos = enteroAleatorio(6, 9);
  for (let i = 0; i < numPuntos; i++) {
    contenido += '<circle cx="' + numAleatorio(8, 92) + '" cy="' +
      numAleatorio(8, 92) + '" r="' + numAleatorio(1.5, 3) +
      '" fill="' + paleta.color2 + '" opacity="0.8" />';
  }
  return contenido;
}

function varianteMixta(paleta) {
  let contenido = '';
  contenido += '<path d="M40 95 C42 75, 55 70, 62 55" stroke="' + paleta.color3 +
    '" stroke-width="1.6" fill="none" />';
  contenido += hojaSVG(paleta.color3, paleta.color1, 0.55, -50);
  contenido += hojaSVG(paleta.color3, paleta.color1, 0.5, 50);
  const posiciones = [
    { x: numAleatorio(20, 40), y: numAleatorio(20, 40) },
    { x: numAleatorio(60, 82), y: numAleatorio(20, 40) }
  ];
  for (let i = 0; i < posiciones.length; i++) {
    const p = posiciones[i];
    const esc = numAleatorio(0.55, 0.7);
    contenido += '<g transform="translate(' + (p.x - 50) + ' ' + (p.y - 50) + ')">' +
      '<g transform="translate(50 50) scale(' + esc + ') translate(-50 -50)">' +
      florSVG(paleta.color2, paleta.color1) +
      '</g></g>';
  }
  for (let i = 0; i < 4; i++) {
    contenido += '<circle cx="' + numAleatorio(10, 90) + '" cy="' +
      numAleatorio(10, 90) + '" r="' + numAleatorio(1, 2) +
      '" fill="' + paleta.color1 + '" opacity="0.75" />';
  }
  return contenido;
}

function varianteCorazones(paleta) {
  const numCorazones = enteroAleatorio(2, 3);
  let contenido = '';
  for (let i = 0; i < numCorazones; i++) {
    const x = numAleatorio(20, 80);
    const y = numAleatorio(20, 80);
    const esc = numAleatorio(0.35, 0.55);
    const rot = numAleatorio(-25, 25);
    contenido += '<g transform="translate(' + (x - 50) + ' ' + (y - 50) + ')">' +
      '<g transform="rotate(' + rot + ' 50 50)">' +
      '<g transform="translate(50 50) scale(' + esc + ') translate(-50 -50)">' +
      corazonSVG(paleta.color2) +
      '</g></g></g>';
  }
  for (let i = 0; i < 5; i++) {
    contenido += '<circle cx="' + numAleatorio(10, 90) + '" cy="' +
      numAleatorio(10, 90) + '" r="' + numAleatorio(1, 2.2) +
      '" fill="' + paleta.color1 + '" opacity="0.7" />';
  }
  return contenido;
}

const VARIANTES_ILUSTRADAS = {
  rama: varianteRama,
  flores: varianteFlores,
  lineas: varianteLineasBotanicas,
  mixta: varianteMixta,
  corazones: varianteCorazones
};

/* ===== DISTRIBUCIÓN EN ESQUINAS ===== */

const POSICIONES_ESQUINA = [
  { nombre: "superior-izquierda", estilo: "top: 0.15cm; left: 0.15cm;" },
  { nombre: "superior-derecha",   estilo: "top: 0.15cm; right: 0.15cm; transform: scaleX(-1);" },
  { nombre: "inferior-izquierda", estilo: "bottom: 0.15cm; left: 0.15cm; transform: scaleY(-1);" },
  { nombre: "inferior-derecha",   estilo: "bottom: 0.15cm; right: 0.15cm; transform: scale(-1, -1);" }
];

function crearDecoraciones(estilo, paleta, varianteIlustrada) {
  if (paleta === undefined) paleta = PALETA_DEFECTO;
  if (varianteIlustrada === undefined) varianteIlustrada = "rama";

  const contenedor = document.createElement("div");
  contenedor.className = "tarjeta-decoraciones";

  const varianteFn = VARIANTES_ILUSTRADAS[varianteIlustrada] || varianteRama;

  POSICIONES_ESQUINA.forEach(function (pos) {
    const esquina = document.createElement("div");
    esquina.className = "decoracion-esquina decoracion-" + pos.nombre;
    esquina.setAttribute("style", pos.estilo);

    let svg;
    if (estilo === "ilustrado") {
      svg = svgBase(varianteFn(paleta), 4.5);
    } else {
      svg = composicionAbstracta(paleta);
    }

    esquina.innerHTML = svg;
    contenedor.appendChild(esquina);
  });

  return contenedor;
}

window.crearDecoraciones = crearDecoraciones;
window.PALETA_DEFECTO = PALETA_DEFECTO;