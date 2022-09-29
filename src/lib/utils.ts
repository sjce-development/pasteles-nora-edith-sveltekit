export function formatCurrency(amount: number) {
  const options = { style: 'currency', currency: 'MXN' };
  const numberFormat = new Intl.NumberFormat('es-MX', options);
  return numberFormat.format(amount);
}
