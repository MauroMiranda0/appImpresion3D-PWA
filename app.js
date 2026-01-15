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

  const controles = [
    { valor: g, campo: "Gramos usados", permiteCero: false },
    { valor: mo, campo: "Mano de obra", permiteCero: false },
    { valor: ga, campo: "Ganancia (%)", permiteCero: true },
    { valor: h, campo: "Horas", permiteCero: true },
    { valor: m, campo: "Minutos", permiteCero: true },
    { valor: ce, campo: "Costo material extra", permiteCero: true }
  ];

  const invalido = controles.find(c =>
    Number.isNaN(c.valor) ||
    c.valor < 0 ||
    (!c.permiteCero && c.valor === 0)
  );

  if (invalido) {
    alert(`Revisa el campo: ${invalido.campo}`);
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
  tabla.innerHTML = piezas.map((p, x) => `
    <tr>
      <td>${p.i ? `<img src="${p.i}" onclick="abrir('${p.i}')">` : "-"}</td>
      <td>${p.n}</td>
      <td><a href="${p.l}" target="_blank">Abrir</a></td>
      <td>${p.m}</td>
      <td>${p.c}</td>
      <td>$${p.cp}</td>
      <td>$${p.cu}</td>
      <td><button onclick="borrar(${x})">X</button></td>
    </tr>`).join("");
}

function borrar(i) {
  let d = JSON.parse(localStorage.getItem("piezas3D")) || [];
  d.splice(i, 1);
  localStorage.setItem("piezas3D", JSON.stringify(d));
  mostrar();
}

function stepInput(id, direction) {
  const input = document.getElementById(id);
  if (!input) return;
  if (direction > 0) input.stepUp();
  else input.stepDown();
  const min = input.min !== "" ? Number(input.min) : null;
  const max = input.max !== "" ? Number(input.max) : null;
  let value = Number(input.value);
  if (min !== null && value < min) value = min;
  if (max !== null && value > max) value = max;
  input.value = Number.isNaN(value) ? (min ?? 0) : value;
}

function abrir(s) { modalImg.src = s; modal.style.display = "block"; }
function cerrarModal() { modal.style.display = "none"; }

mostrar();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(err => {
      console.error("Service worker registration failed:", err);
    });
  });
}
