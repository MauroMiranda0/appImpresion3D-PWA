import * as db from './database.js';
import { crearPieza, validarPieza } from './schema.js';

const LEGACY_KEY = 'piezas3D';

export async function inicializarStorage() {
  await migrarDatosLegacy();
}

export async function obtenerPiezas() {
  return db.obtenerPiezas();
}

export async function guardarPieza(datos) {
  const errores = validarPieza(datos);
  if (errores.length > 0) {
    throw new Error(errores.join(', '));
  }

  const pieza = crearPieza(datos);
  return db.guardarPieza(pieza);
}

export async function eliminarPieza(id) {
  return db.eliminarPieza(id);
}

async function migrarDatosLegacy() {
  const raw = localStorage.getItem(LEGACY_KEY);
  if (!raw) return;

  const piezasLegacy = JSON.parse(raw);
  if (!Array.isArray(piezasLegacy) || piezasLegacy.length === 0) {
    localStorage.removeItem(LEGACY_KEY);
    return;
  }

  for (const p of piezasLegacy) {
    const pieza = {
      n: p.n || '',
      l: p.l || '',
      m: p.m || '',
      c: p.c || '',
      cp: p.cp || '0',
      cu: p.cu || '0',
      i: p.i || '',
      createdAt: Date.now(),
    };
    await db.guardarPieza(pieza);
  }

  localStorage.removeItem(LEGACY_KEY);
}
