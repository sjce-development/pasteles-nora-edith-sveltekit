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