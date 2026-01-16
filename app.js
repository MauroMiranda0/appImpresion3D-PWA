const COSTO_KG = 700;

function guardar() {
  let n = nombre.value.trim(), l = link.value.trim();
  let h = Number(horas.value) || 0, m = Number(minutos.value) || 0;
  let g = Number(gramos.value), mo = Number(manoObra.value), ga = Number(ganancia.value);
  let mat = materialExtra.value.trim(), can = cantidadExtra.value.trim();
  let ce = Number(costoExtra.value) || 0;
  let img = imagen.files[0];

  if (!n || !l) {
    alert("Nombre y link son obligatorios");
    return;
  }

  let tiempo = h + m / 60;
  let costoReal = (COSTO_KG / 1000) * g + tiempo * mo;
  let d = g >= 100 ? 25 : g >= 50 ? 20 : g >= 20 ? 15 : 10;
  let costoP = (costoReal - d) + ce;
  let costoPub = costoP + (costoP * ga / 100);

  if (img) {
    let r = new FileReader();
    r.onload = e => guardarR(n, l, mat, can, costoP, costoPub, e.target.result);
    r.readAsDataURL(img);
  } else guardarR(n, l, mat, can, costoP, costoPub, "");
}

function guardarR(n, l, m, c, cp, cu, i) {
  let d = JSON.parse(localStorage.getItem("piezas3D")) || [];
  d.push({ n, l, m, c, cp: cp.toFixed(2), cu: cu.toFixed(2), i });
  localStorage.setItem("piezas3D", JSON.stringify(d));
  mostrar();
}

function mostrar() {
  const piezas = JSON.parse(localStorage.getItem("piezas3D")) || [];
  const tabla = document.getElementById("tabla");
  tabla.innerHTML = piezas.map((p, x) => `
    <tr>
      <td data-label="Imagen">${p.i ? `<img src="${p.i}" onclick="abrir('${p.i}')">` : "-"}</td>
      <td data-label="Nombre">${p.n}</td>
      <td data-label="Link"><a href="${p.l}" target="_blank">Abrir</a></td>
      <td data-label="Material">${p.m || "-"}</td>
      <td data-label="Cant.">${p.c || "-"}</td>
      <td data-label="Costo pieza">$${p.cp}</td>
      <td data-label="Público">$${p.cu}</td>
      <td><button onclick="borrar(${x})" style="width: auto; padding: 5px 12px; margin: 0; background: #333;">X</button></td>
    </tr>`).join("");
}

function borrar(i) {
  if(confirm("¿Eliminar?")) {
    let d = JSON.parse(localStorage.getItem("piezas3D")) || [];
    d.splice(i, 1);
    localStorage.setItem("piezas3D", JSON.stringify(d));
    mostrar();
  }
}

function stepInput(id, direction) {
  const input = document.getElementById(id);
  if (!input) return;
  direction > 0 ? input.stepUp() : input.stepDown();
  if (Number(input.value) < 0) input.value = 0;
}

function abrir(s) { modalImg.src = s; modal.style.display = "block"; }
function cerrarModal() { modal.style.display = "none"; }

mostrar();