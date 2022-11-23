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

		const tamano: Especificacion | undefined = data.find(
			(especificacion: Especificacion) =>
				especificacion.nombre === orden.tamano.toString(),
		);
		if (tamano) {
			total += tamano.precio;
		}

		const harina: Especificacion | undefined = data.find(
			(especificacion: Especificacion) =>
				especificacion.nombre === orden.harina,
		);
		if (harina) {
			total += harina.precio;
		}

		const relleno: Especificacion | undefined = data.find(
			(especificacion: Especificacion) =>
				especificacion.nombre === orden.relleno,
		);
		if (relleno) {
			total += relleno.precio;
		}

		orden.decorado.forEach((decorado: string) => {
			const item: Especificacion | undefined = data.find(
				(especificacion: Especificacion) => especificacion.nombre === decorado,
			);
			if (item) {
				total += item.precio;
			}
		});
		return total;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static async convertirOrdenSelect(orden: OrdenSelect): Promise<Orden> {
		const nombre: string = orden.client.value.split("-")[0];
		const telefono: string = orden.client.value.split("-")[1].replace(" ", "");

		const newOrden: Orden = {
			anticipo: orden.anticipo,
			decorado: orden.decorado.map((especificacion: { value: string }) => {
				return especificacion.value;
			}),
			nombre,
			harina: orden.harina.value,
			relleno: orden.relleno.value,
			tamano: orden.tamano.value,
			estado: "pendiente",
			hora_de_entrega: new Date(orden.hora_de_entrega).toISOString(),
			impreso: false,
			pagado: false,
			telefono,
			numero_de_panes: 1,
		};
		const total = await this.calcularTotalOrden(newOrden);
		newOrden.total = total;
		return newOrden;
	}

	static formatDate(date: string | Date): string {
		return new Date(date).toLocaleString(locale, {
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

	static getPagination({ page, pageSize }: { page: number; pageSize: number }): {
		from: number;
		to: number;
	} {
		const limit = pageSize ?? 10;
		if (page === 1) {
			return { from: 0, to: limit };
		}
		const from = page * limit;
		const to = from + pageSize;
		return { from, to };
	}
}
