const $ = (id) => document.getElementById(id);

export function obtenerDatosFormulario() {
  return {
    nombre: $('nombre').value.trim(),
    link: $('link').value.trim(),
    horas: Number($('horas').value) || 0,
    minutos: Number($('minutos').value) || 0,
    gramos: Number($('gramos').value),
    manoObra: Number($('manoObra').value),
    ganancia: Number($('ganancia').value),
    materialExtra: $('materialExtra').value.trim(),
    cantidadExtra: $('cantidadExtra').value.trim(),
    costoExtra: Number($('costoExtra').value) || 0,
    imagenFile: $('imagen').files[0],
  };
}

export function stepInput(id, direction) {
  const input = $(id);
  if (!input) return;
  direction > 0 ? input.stepUp() : input.stepDown();
  if (Number(input.value) < 0) input.value = 0;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

export function abrirModal(src) {
  $('modalImg').src = src;
  $('modal').style.display = 'block';
}

export function cerrarModal() {
  $('modal').style.display = 'none';
}

export function actualizarPreview(costoPieza, costoPublico) {
  $('previewCosto').textContent = `$${costoPieza.toFixed(2)}`;
  $('previewPublico').textContent = `$${costoPublico.toFixed(2)}`;
}

export function mostrarError(mensaje) {
  const container = $('validacion');
  container.innerHTML = `<div class="validacion-error">${mensaje}</div>`;
  setTimeout(() => {
    container.innerHTML = '';
  }, 4000);
}

export function limpiarError() {
  $('validacion').innerHTML = '';
}

export function actualizarContador(cantidad) {
  $('tablaCount').textContent = `${cantidad} pieza${cantidad !== 1 ? 's' : ''}`;
}

export function renderizarTabla(piezas) {
  const tabla = $('tabla');
  actualizarContador(piezas.length);

  if (piezas.length === 0) {
    tabla.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:24px;">No hay piezas guardadas</td></tr>`;
    return;
  }

  tabla.innerHTML = piezas
    .map(
      (p) => `
    <tr>
      <td data-label="Img">${p.i ? `<img src="${p.i}" onclick="abrir('${p.i}')">` : '—'}</td>
      <td data-label="Nombre">${p.n}</td>
      <td data-label="Link"><a href="${p.l}" target="_blank">Abrir</a></td>
      <td data-label="Material">${p.m || '—'}</td>
      <td data-label="Cant.">${p.c || '—'}</td>
      <td data-label="Costo" class="price">$${p.cp}</td>
      <td data-label="Público" class="price-public">$${p.cu}</td>
      <td><button class="btn-danger" onclick="borrar(${p.id})">Eliminar</button></td>
    </tr>`,
    )
    .join('');
}
