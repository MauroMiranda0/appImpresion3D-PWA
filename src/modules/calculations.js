const COSTO_KG = 700;

function calcularDescuento(gramos) {
  if (gramos >= 100) return 25;
  if (gramos >= 50) return 20;
  if (gramos >= 20) return 15;
  return 10;
}

export function calcularCosto({ gramos, horas, minutos, manoObra, ganancia, costoExtra }) {
  const tiempo = horas + minutos / 60;
  const costoReal = (COSTO_KG / 1000) * gramos + tiempo * manoObra;
  const descuento = calcularDescuento(gramos);
  const costoPieza = costoReal - descuento + costoExtra;
  const costoPublico = costoPieza + (costoPieza * ganancia) / 100;

  return {
    costoPieza: Number(costoPieza.toFixed(2)),
    costoPublico: Number(costoPublico.toFixed(2)),
  };
}
