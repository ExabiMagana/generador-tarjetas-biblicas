// app.js — Interfaz, captura de textos, configuración y render adaptativo.

const MAX_TEXTOS = 4;

const PALETAS = {
  azulCoral:        { color1: "#7BA7D9", color2: "#F4A59A", color3: "#A8D5BA" },
  verdeBeige:       { color1: "#B8C9A9", color2: "#E8D6B3", color3: "#7FA98F" },
  lilaRosa:         { color1: "#C2A9D9", color2: "#F4C2D7", color3: "#9C7FB5" },
  celesteTerracota: { color1: "#9EC5E0", color2: "#E0A183", color3: "#6D9DC5" },
  azulOscuroClaro:  { color1: "#3F5B8C", color2: "#A8C0E0", color3: "#5F7BB0" }
};
const CLAVES_PALETAS = Object.keys(PALETAS);

const FONDOS = {
  blanco:       "#FFFFFF",
  crema:        "#FBF6E9",
  celesteClaro: "#E8F2FB",
  rosaSuave:    "#FBEAEF"
};
const CLAVES_FONDOS = Object.keys(FONDOS);

const VARIANTES_CLAVES = ["rama", "flores", "lineas", "mixta", "corazones"];

let bloques = [];
let textosValidos = null;

document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("lista-textos");
  const btnAgregar = document.getElementById("btn-agregar");
  const btnValidar = document.getElementById("btn-validar");
  const btnRegenerar = document.getElementById("btn-regenerar");
  const btnImprimir = document.getElementById("btn-imprimir");
  const btnPDF = document.getElementById("btn-pdf");
  const contador = document.getElementById("contador-textos");
  const mensaje = document.getElementById("mensaje-validacion");
  const vistaPrevia = document.getElementById("vista-previa");
  const envoltorio = document.querySelector(".vista-previa-envoltorio");

  const selEstilo = document.getElementById("sel-estilo");
  const selVariante = document.getElementById("sel-variante");
  const selPaleta = document.getElementById("sel-paleta");
  const selFondo = document.getElementById("sel-fondo");
  const filaVariante = document.getElementById("fila-variante");

  /* ========= BLOQUES ========= */

  function crearBloque() {
    const contenedor = document.createElement("div");
    contenedor.className = "bloque-texto";
    const numero = bloques.length + 1;

    contenedor.innerHTML = `
      <div class="bloque-encabezado">
        <span class="bloque-numero">Texto ${numero}</span>
        <button type="button" class="boton-eliminar" title="Eliminar este texto">✕</button>
      </div>
      <label class="campo">
        <span class="campo-etiqueta">Texto bíblico</span>
        <textarea class="campo-texto" rows="3" placeholder="Ej. Gustad y ved que es bueno el Señor..."></textarea>
      </label>
      <label class="campo">
        <span class="campo-etiqueta">Cita bíblica</span>
        <input type="text" class="campo-cita" placeholder="Ej. Salmos 34:8">
      </label>
    `;

    const inputTexto = contenedor.querySelector(".campo-texto");
    const inputCita = contenedor.querySelector(".campo-cita");
    const botonEliminar = contenedor.querySelector(".boton-eliminar");

    botonEliminar.addEventListener("click", () => eliminarBloque(contenedor));

    lista.appendChild(contenedor);
    bloques.push({ contenedor, inputTexto, inputCita, botonEliminar });
    actualizarEstado();
    return inputTexto;
  }

  function eliminarBloque(contenedor) {
    const indice = bloques.findIndex(b => b.contenedor === contenedor);
    if (indice <= 0) return; // El primer bloque no se puede eliminar
    contenedor.remove();
    bloques.splice(indice, 1);
    renumerar();
    actualizarEstado();
  }

  function renumerar() {
    bloques.forEach((b, i) => {
      b.contenedor.querySelector(".bloque-numero").textContent = `Texto ${i + 1}`;
    });
  }

  function actualizarEstado() {
    const cantidad = bloques.length;
    contador.textContent = `${cantidad} de ${MAX_TEXTOS}`;
    btnAgregar.disabled = cantidad >= MAX_TEXTOS;
    bloques.forEach((b, i) => {
      b.botonEliminar.style.display = i === 0 ? "none" : "inline-block";
    });
  }

  function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = "mensaje" + (tipo ? ` mensaje-${tipo}` : "");
  }

  function validarTextos() {
    const errores = [];
    const datos = [];

    bloques.forEach((b, i) => {
      const texto = b.inputTexto.value.trim();
      const cita = b.inputCita.value.trim();

      b.contenedor.classList.remove("bloque-error");
      b.inputTexto.classList.remove("campo-error");
      b.inputCita.classList.remove("campo-error");

      if (texto === "" || cita === "") {
        b.contenedor.classList.add("bloque-error");
        if (texto === "") b.inputTexto.classList.add("campo-error");
        if (cita === "") b.inputCita.classList.add("campo-error");
        errores.push(i + 1);
      } else {
        datos.push({ texto, cita });
      }
    });

    if (errores.length > 0) {
      mostrarMensaje(
        `Completa el texto y la cita en: ${errores.map(n => "Texto " + n).join(", ")}.`,
        "error"
      );
      return null;
    }

    mostrarMensaje(`${datos.length} texto(s) válido(s).`, "ok");
    return datos;
  }

  /* ========= CONFIGURACIÓN ========= */

  function elegirAlAzar(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function leerConfiguracion() {
    return {
      estilo: selEstilo.value,
      varianteSel: selVariante.value,
      paletaSel: selPaleta.value,
      fondoSel: selFondo.value,
      modoColor: (document.querySelector('input[name="modo-color"]:checked') || {}).value || "iguales"
    };
  }

  function resolverPaletaYFondo(config) {
    const clavePaleta = config.paletaSel === "aleatoria"
      ? elegirAlAzar(CLAVES_PALETAS)
      : config.paletaSel;
    const claveFondo = config.fondoSel === "aleatorio"
      ? elegirAlAzar(CLAVES_FONDOS)
      : config.fondoSel;
    return { paleta: PALETAS[clavePaleta], fondo: FONDOS[claveFondo] };
  }

  function resolverEstilo(config) {
    if (config.estilo === "aleatorio") {
      return Math.random() < 0.5 ? "abstracto" : "ilustrado";
    }
    return config.estilo;
  }

  function resolverVariante(config, estiloResuelto) {
    if (estiloResuelto !== "ilustrado") return "rama";
    if (config.varianteSel === "aleatoria") return elegirAlAzar(VARIANTES_CLAVES);
    return config.varianteSel;
  }

  function construirOpciones(config) {
    const modoDiferentes = config.modoColor === "diferentes";
    const opcionesPorTarjeta = [];
    
    for (let i = 0; i < 4; i++) {
      const estiloResuelto = resolverEstilo(config);
      const varianteResuelta = resolverVariante(config, estiloResuelto);
      const { paleta, fondo } = resolverPaletaYFondo(config);
      opcionesPorTarjeta.push({
        estilo: estiloResuelto,
        varianteIlustrada: varianteResuelta,
        paleta, fondo
      });
    }
    
    if (modoDiferentes) return opcionesPorTarjeta;
    return opcionesPorTarjeta[0]; // Modo iguales: todas usan los valores de la primera
  }

  /* ========= ESCALADO ========= */

  function ajustarEscalaHoja() {
    const hoja = vistaPrevia.querySelector(".hoja-carta");
    if (!hoja) return;

    hoja.style.transform = "none";
    hoja.style.marginBottom = "0";

    const anchoNatural = hoja.offsetWidth;
    const altoNatural = hoja.offsetHeight;
    const anchoDisponible = envoltorio.clientWidth - 32;

    let factor = anchoDisponible / anchoNatural;
    if (factor > 1) factor = 1; // No agrandar más allá de su tamaño real

    if (factor < 1) {
      hoja.style.transform = `scale(${factor})`;
      hoja.style.transformOrigin = "top center";
      const altoEscalado = altoNatural * factor;
      hoja.style.marginBottom = `${altoEscalado - altoNatural}px`;
      hoja.style.marginLeft = "auto";
      hoja.style.marginRight = "auto";
    }
  }

  /* ========= RENDER ========= */

  function renderizarHoja(datos) {
    const config = leerConfiguracion();
    const distribucion = distribuirTextos(datos);
    const opciones = construirOpciones(config);

    vistaPrevia.innerHTML = "";
    const hoja = crearHojaConTarjetas(distribucion, opciones);
    vistaPrevia.appendChild(hoja);

    requestAnimationFrame(() => {
      hoja._ajustarTodas();
      ajustarEscalaHoja();
    });

    btnImprimir.disabled = false;
    btnPDF.disabled = false;
  }

  function actualizarVisibilidadVariante() {
    filaVariante.style.display = selEstilo.value === "abstracto" ? "none" : "flex";
  }

  /* ========= EVENTOS ========= */

  btnAgregar.addEventListener("click", () => {
    if (bloques.length >= MAX_TEXTOS) return;
    const ultimo = crearBloque();
    ultimo.focus();
  });

  btnValidar.addEventListener("click", () => {
    const datos = validarTextos();
    if (datos) {
      textosValidos = datos;
      renderizarHoja(textosValidos);
      btnRegenerar.disabled = false;
    } else {
      textosValidos = null;
      btnRegenerar.disabled = true;
    }
  });

  btnRegenerar.addEventListener("click", () => {
    if (!textosValidos) return;
    renderizarHoja(textosValidos);
  });

  btnImprimir.addEventListener("click", () => {
    if (typeof imprimirDocumento === "function") imprimirDocumento();
  });

  btnPDF.addEventListener("click", () => {
    if (typeof imprimirDocumento === "function") imprimirDocumento();
  });

  selEstilo.addEventListener("change", () => {
    actualizarVisibilidadVariante();
    if (textosValidos) renderizarHoja(textosValidos);
  });
  selVariante.addEventListener("change", () => {
    if (textosValidos) renderizarHoja(textosValidos);
  });
  selPaleta.addEventListener("change", () => {
    if (textosValidos) renderizarHoja(textosValidos);
  });
  selFondo.addEventListener("change", () => {
    if (textosValidos) renderizarHoja(textosValidos);
  });
  document.querySelectorAll('input[name="modo-color"]').forEach((r) => {
    r.addEventListener("change", () => {
      if (textosValidos) renderizarHoja(textosValidos);
    });
  });

  window.addEventListener("resize", ajustarEscalaHoja);

  crearBloque();
  actualizarVisibilidadVariante();
});