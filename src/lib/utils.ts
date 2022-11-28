import type {
	Categoria,
	Especificacion,
	Orden,
	OrdenSelect,
	SelectItem,
} from "$lib/models";
import { supabase } from "$lib/supabase";
import { locale } from "$lib/constants";

export default class Utils {
	static formatCurrency(amount: number, absolute?: boolean) {
		const options = { style: "currency", currency: "MXN" };
		const numberFormat = new Intl.NumberFormat("es-MX", options);
		if (absolute) {
			amount = Math.abs(amount);
		}
		return numberFormat.format(amount);
	}

	static sleep(milliseconds: number) {
		const date = Date.now();
		let currentDate = null;
		do {
			currentDate = Date.now();
		} while (currentDate - date < milliseconds);
	}

	static random_rgba(transparency = 0.2): string[] {
		const r = Math.round(Math.random() * 255);
		const g = Math.round(Math.random() * 255);
		const b = Math.round(Math.random() * 255);
		return [`rgba(${r},${g},${b},${transparency})`, `rgba(${r},${g},${b})`];
	}

	static formatCategory(items: Categoria[]): SelectItem[] {
		if (items.length === 0) {
			return [];
		}
		const group = "categoria";
		return items.map((item: Categoria) => {
			const label: string = item.nombre;
			const value: string = item.nombre.toLowerCase().replace(" ", "-");
			return { value, label, group };
		});
	}

	static capitalize(word: string): string {
		return word.charAt(0).toUpperCase() + word.slice(1);
	}

	static formatEspecificacion(items: Especificacion[]): SelectItem[] {
		if (items.length === 0) {
			return [];
		}
		const group = items[0].categoria;
		return items.map((item: Especificacion) => {
			let value: string | number;
			let label: string;

			try {
				value = eval(item.nombre);
			} catch (e) {
				value = item.nombre.toLowerCase().replace(" ", "-");
			}

			switch (group) {
				case "tamanos": {
					label = `${item.nombre}"`;
					break;
				}
				default:
					label = item.nombre.toString();
					break;
			}
			return { value, label, group };
		});
	}

	static async calcularTotalOrden(orden: Orden): Promise<number> {
		let total = 0;
		const { data, error } = await supabase
			.from<Especificacion>("especificaciones")
			.select("*");
		if (error) {
			throw error;
		}

		// console.log(data);
		data.forEach((especificacion) => {
			const { precio } = especificacion;
			let { nombre } = especificacion;
			nombre = nombre.toLowerCase();
			// console.log({
			// 	tamano: orden.tamano,
			// 	harina: orden.harina,
			// 	relleno: orden.relleno,
			// 	decorado: orden.decorado,
			// 	nombre,
			// 	valid:
			// 		orden.tamano === nombre ||
			// 		orden.harina === nombre ||
			// 		orden.relleno === nombre ||
			// 		orden.decorado.includes(nombre),
			// });
			if (orden.tamano === nombre) {
				total += precio;
			}
			if (orden.harina === nombre) {
				total += precio;
			}
			if (orden.relleno === nombre) {
				total += precio;
			}
			if (orden.decorado.includes(nombre)) {
				total += precio;
			}
		});

		// const tamano: Especificacion | undefined = data.find(
		// 	(especificacion: Especificacion) =>
		// 		especificacion.nombre === orden.tamano.toString(),
		// );
		// if (tamano) {
		// 	total += tamano.precio;
		// }
		console.log({ especificaciones: data, total });

		const harina: Especificacion | undefined = data.find(
			(especificacion: Especificacion) =>
				especificacion.nombre === orden.harina,
		);
		if (harina) {
			total += harina.precio;
		}
		console.log(harina, total);

		const relleno: Especificacion | undefined = data.find(
			(especificacion: Especificacion) =>
				especificacion.nombre === orden.relleno,
		);
		if (relleno) {
			total += relleno.precio;
		}
		console.log(relleno, total);

		if (orden.decorado) {
			orden.decorado.forEach((decorado: string) => {
				const item: Especificacion | undefined = data.find(
					(especificacion: Especificacion) =>
						especificacion.nombre === decorado,
				);
				if (item) {
					total += item.precio;
				}
			});
			console.log(orden.decorado, total);
		}
		return total;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static async convertirOrdenSelect(orden: OrdenSelect): Promise<Orden> {
		const nombre: string = orden.client.value.split("-")[0];
		const telefono: string = orden.client.value.split("-")[1].replace(" ", "");

		const newOrden: Orden = {
			anticipo: orden.anticipo,
			decorado:
				orden.decorado != null
					? orden.decorado.map((especificacion: { value: string }) => {
							return especificacion.value;
					  })
					: [],
			nombre,
			harina: orden.harina.value,
			relleno: orden.relleno.value,
			tamano: orden.tamano.label,
			estado: "pendiente",
			hora_de_entrega: new Date(orden.hora_de_entrega).toISOString(),
			impreso: false,
			pagado: false,
			telefono,
		};
		const total = await this.calcularTotalOrden(newOrden);
		newOrden.total = total;
		return newOrden;
	}

	static formatDate(date: string | Date): string {
		const newDate = new Date(date);
		// Substract 7 hours from newDate
		newDate.setHours(newDate.getHours() - 7);
		return newDate.toLocaleString(locale, {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		});
	}

	static formatHoraDeEntrega(date: string | Date): string {
		// Make date into format yyyy-mm-dd yy:mm:ss
		const newDate = new Date(date).toISOString().split("T");
		const [year, month, day] = newDate[0].split("-");
		const [hour, minute] = newDate[1].split(":");
		return `${year}-${month}-${day} ${hour}:${minute}:00`;
	}

	static getPagination({
		page,
		pageSize,
	}: { page: number; pageSize: number }): {
		from: number;
		to: number;
	} {
		let limit;
		if (pageSize === 1) {
			limit = 1;
			return { from: 0, to: 0 };
		}
		limit = pageSize ?? 10;
		if (page === 1) {
			return { from: 0, to: limit };
		}
		const from = page * limit;
		const to = from + pageSize;
		return { from, to };
	}

	static formatPhoneNumber(phoneNumberString: string) {
		const cleaned = (`${phoneNumberString}`).replace(/\D/g, '');
		const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
		if (match) {
			return `(${match[1]}) ${match[2]}-${match[3]}`;
		}
		return null;
	}

	static getMonthsAgo(months: number) {
		const date = new Date();
		date.setMonth(date.getMonth() - months);
		return date;
	}

	static getWeeksAgo(weeks: number) {
		const date = new Date();
		date.setDate(date.getDate() - weeks);
		return date;
	}

	static getDaysAgo(days: number) {
		const date = new Date();
		date.setDate(date.getDate() - days);
		return date;
	}

	static getStartOfDay(date: Date): Date {
		const newDate = new Date(date);
		newDate.setHours(0, 0, 0, 0);
		return newDate;
	}
}
