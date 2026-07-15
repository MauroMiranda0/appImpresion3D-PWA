import { calcularCosto } from './modules/calculations.js';
import {
  inicializarStorage,
  obtenerPiezas,
  guardarPieza,
  eliminarPieza,
} from './modules/storage.js';
import {
  obtenerDatosFormulario,
  stepInput,
  abrirModal,
  cerrarModal,
  actualizarPreview,
  mostrarError,
  limpiarError,
  renderizarTabla,
} from './modules/ui.js';

async function init() {
  await inicializarStorage();
  await mostrar();
  configurarPreview();
  registrarServiceWorker();
  configurarOfflineIndicator();
}

function registrarServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function configurarOfflineIndicator() {
  const indicator = document.getElementById('offlineIndicator');
  const update = () => {
    indicator.classList.toggle('visible', !navigator.onLine);
  };
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
}

function configurarPreview() {
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach((input) => {
    input.addEventListener('input', calcularPreview);
  });
}

function calcularPreview() {
  const datos = obtenerDatosFormulario();
  const { costoPieza, costoPublico } = calcularCosto(datos);
  actualizarPreview(costoPieza, costoPublico);
}

async function guardar() {
  limpiarError();
  const datos = obtenerDatosFormulario();

  if (!datos.nombre || !datos.link) {
    mostrarError('Nombre y link son obligatorios');
    return;
  }

  const { costoPieza, costoPublico } = calcularCosto(datos);

  let imagen = '';
  if (datos.imagenFile) {
    imagen = await leerImagen(datos.imagenFile);
  }

  try {
    await guardarPieza({
      nombre: datos.nombre,
      link: datos.link,
      materialExtra: datos.materialExtra,
      cantidadExtra: datos.cantidadExtra,
      costoPieza,
      costoPublico,
      imagen,
    });
    await mostrar();
  } catch (err) {
    mostrarError('Error al guardar: ' + err.message);
  }
}

function leerImagen(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

async function borrar(id) {
  if (confirm('¿Eliminar pieza?')) {
    await eliminarPieza(id);
    await mostrar();
  }
}

async function mostrar() {
  const piezas = await obtenerPiezas();
  renderizarTabla(piezas);
  calcularPreview();
}

window.stepInput = stepInput;
window.guardar = guardar;
window.borrar = borrar;
window.abrir = abrirModal;
window.cerrarModal = cerrarModal;

init();
