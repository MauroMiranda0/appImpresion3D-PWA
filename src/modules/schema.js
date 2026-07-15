const CAMPOS_REQUERIDOS = [
  { key: 'n', label: 'Nombre', tipo: 'string' },
  { key: 'l', label: 'Link', tipo: 'string' },
];

export function crearPieza({
  nombre,
  link,
  materialExtra,
  cantidadExtra,
  costoPieza,
  costoPublico,
  imagen,
}) {
  return {
    n: nombre,
    l: link,
    m: materialExtra,
    c: cantidadExtra,
    cp: costoPieza.toFixed(2),
    cu: costoPublico.toFixed(2),
    i: imagen,
    createdAt: Date.now(),
  };
}

export function validarPieza(pieza) {
  const errores = [];

  for (const campo of CAMPOS_REQUERIDOS) {
    const valor = pieza[campo.key];
    if (!valor || typeof valor !== campo.tipo || valor.trim() === '') {
      errores.push(`${campo.label} es obligatorio`);
    }
  }

  return errores;
}
