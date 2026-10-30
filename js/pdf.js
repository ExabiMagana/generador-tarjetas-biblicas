// pdf.js — Lógica de impresión y exportación a PDF usando impresión nativa.

/**
 * Abre el diálogo de impresión del navegador.
 * El CSS @media print oculta la interfaz y deja solo la hoja.
 * El navegador respeta el tamaño de página declarado en @page.
 *
 * @param {string} destinoSugerido - solo informativo; no controlable desde JS.
 */
function imprimirDocumento() {
  // Aseguramos que se haya terminado cualquier animación de ajuste
  // antes de abrir el diálogo de impresión.
  window.requestAnimationFrame(() => {
    window.print();
  });
}

window.imprimirDocumento = imprimirDocumento;