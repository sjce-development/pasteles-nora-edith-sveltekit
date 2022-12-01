export const PUBLIC_BUCKET = 'https://tstelmibhgbqwsqiuagj.supabase.co/storage/v1/object/public/';
export const colors = {
	primary: 'rgba(78, 115, 223, 1)',
	primary_transparent: 'rgba(78, 115, 223, 0.6)'
};
export const locale = 'es-MX';

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
];

export const pageSizes = [10, 20, 50, 100];
export const dateRanges = [
	{ label: 'Un día', value: 1 },
	{ label: 'Una semana', value: 7 },
	{ label: 'Un mes', value: 30 },
	{ label: '3 meses', value: 30 * 3 },
	{ label: '6 meses', value: 30 * 6 },
	{ label: 'Un año', value: 365 }
];

export const MetodosDePago = {
	efectivo: 'Efectivo',
	transferencia: 'Transferencia',
	cheque: 'Cheque',
	tarjetaCredito: 'Tarjeta de crédito',
	tarjetaDebito: 'Tarjeta de débito'
};

export const Roles = {
	admin: 'admin',
	recepcionista: 'recepcionista',
}
