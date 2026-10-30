// tarjetas.js — Distribución y render de tarjetas.

function aleatorioEntre(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function barajar(array) {
  const copia = array.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = aleatorioEntre(0, i);
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function distribuirTextos(textos) {
  if (!Array.isArray(textos) || textos.length < 1 || textos.length > 4) {
    throw new Error("distribuirTextos espera 1 a 4 textos.");
  }
  const n = textos.length;
  if (n === 1) return [textos[0], textos[0], textos[0], textos[0]];
  if (n === 2) return [textos[0], textos[0], textos[1], textos[1]];
  if (n === 3) {
    const repetido = textos[aleatorioEntre(0, 2)];
    return [textos[0], textos[1], textos[2], repetido];
  }
  return barajar(textos);
}

function ajustarTextoAlContenedor(contenedorTexto, tamanoInicialPx, tamanoMinimoPx) {
  let tamano = tamanoInicialPx;
  contenedorTexto.style.fontSize = tamano + "px";
  let intentos = 0;
  const maxIntentos = 200;
  while (
    contenedorTexto.scrollHeight > contenedorTexto.clientHeight &&
    tamano > tamanoMinimoPx &&
    intentos < maxIntentos
  ) {
    tamano -= 1;
    contenedorTexto.style.fontSize = tamano + "px";
    intentos++;
  }
}

/**
 * @param {{texto:string,cita:string}} datos
 * @param {{estilo:string, varianteIlustrada:string, paleta:object, fondo:string}} opciones
 */
function crearTarjeta(datos, opciones) {
  if (opciones === undefined) opciones = {};
  const estilo = opciones.estilo || "abstracto";
  const paleta = opciones.paleta || PALETA_DEFECTO;
  const fondo = opciones.fondo || "#FFFFFF";
  const varianteIlustrada = opciones.varianteIlustrada || "rama";

  const tarjeta = document.createElement("div");
  tarjeta.className = "tarjeta";
  tarjeta.style.backgroundColor = fondo;

  const decoraciones = crearDecoraciones(estilo, paleta, varianteIlustrada);
  tarjeta.appendChild(decoraciones);

  const zonaTexto = document.createElement("div");
  zonaTexto.className = "tarjeta-texto";

  const parrafo = document.createElement("p");
  parrafo.className = "tarjeta-versiculo";
  parrafo.textContent = datos.texto;

  const cita = document.createElement("p");
  cita.className = "tarjeta-cita";
  cita.textContent = datos.cita;

  zonaTexto.appendChild(parrafo);
  zonaTexto.appendChild(cita);
  tarjeta.appendChild(zonaTexto);

  tarjeta._ajustarTexto = () => {
    ajustarTextoAlContenedor(zonaTexto, 20, 11);
  };

  return tarjeta;
}

/**
 * Crea la hoja con las 4 tarjetas.
 * @param {Array} distribucion - 4 datos.
 * @param {object|Array<object>} opciones - un objeto (modo iguales) o
 *                                          un array de 4 (modo diferentes).
 */
function crearHojaConTarjetas(distribucion, opciones) {
  const hoja = document.createElement("div");
  hoja.className = "hoja-carta";

  distribucion.forEach((datos, i) => {
    let opcionesTarjeta;
    if (Array.isArray(opciones)) {
      opcionesTarjeta = opciones[i];
    } else {
      opcionesTarjeta = opciones;
    }
    hoja.appendChild(crearTarjeta(datos, opcionesTarjeta));
  });

  hoja._ajustarTodas = () => {
    hoja.querySelectorAll(".tarjeta").forEach((t) => {
      if (typeof t._ajustarTexto === "function") t._ajustarTexto();
    });
  };

  return hoja;
}

window.distribuirTextos = distribuirTextos;
window.crearTarjeta = crearTarjeta;
window.crearHojaConTarjetas = crearHojaConTarjetas;