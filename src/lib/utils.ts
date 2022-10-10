export function formatCurrency(amount: number) {
  const options = { style: 'currency', currency: 'MXN' };
  const numberFormat = new Intl.NumberFormat('es-MX', options);
  return numberFormat.format(amount);
}


export function sleep(milliseconds: number) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

export function random_rgba(transparency = 0.2): string[] {
  const r = Math.round(Math.random() * 255);
  const g = Math.round(Math.random() * 255);
  const b = Math.round(Math.random() * 255);
  return [`rgba(${r},${g},${b},${transparency})`, `rgba(${r},${g},${b})`];
}

export const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]