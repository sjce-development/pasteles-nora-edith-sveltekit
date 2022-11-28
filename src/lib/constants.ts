export const PUBLIC_BUCKET =
	"https://tstelmibhgbqwsqiuagj.supabase.co/storage/v1/object/public/";
export const colors = {
	primary: "rgba(78, 115, 223, 1)",
	primary_transparent: "rgba(78, 115, 223, 0.6)",
};
export const locale = "es-MX";

export const months = [
	"Enero",
	"Febrero",
	"Marzo",
	"Abril",
	"Mayo",
	"Junio",
	"Julio",
	"Agosto",
	"Septiembre",
	"Octubre",
	"Noviembre",
	"Diciembre",
];

export const pageSizes = [10, 20, 50, 100];
export const dateRanges = [
	{ label: "Hoy", value: 0 },
	{
		label: "Ayer",
		value: 1,
	},
	{
		label: "Esta semana",
		value: 7,
	},
	{
		label: "Este mes",
		value: 30,
	},
	{
		label: "Últimos 3 meses",
		value: 30 * 3,
	},
	{
		label: "Últimos 6 meses",
		value: 30 * 6,
	},
	{
		label: "Último año",
		value: 365,
	},
];
