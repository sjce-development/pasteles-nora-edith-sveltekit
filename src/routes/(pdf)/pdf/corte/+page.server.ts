import { MetodosDePago, Tables } from '$lib/constants';
import type { Venta } from '$lib/models';
import { supabase } from '$lib/supabase';
import Utils from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }: { url: URL }) => {
	let ventas: Venta[] = [];
	// Get date or date range from query params
	let date1: string | null | Date = url.searchParams.get('date1');
	let date2: string | null | Date = url.searchParams.get('date2');

	const date1param: string | null = date1;
	const date2param: string | null = date2;

	if (!date1) {
		throw error(400, 'Missing date1 query param');
	}
	date1 = new Date(date1);

	if (date2) {
		date2 = new Date(date2);
		ventas = await getVentasDateRange(date1, date2);
	} else {
		ventas = await getVentasDate(date1);
	}

	ventas = sortVentas(ventas);
    const [efectivo, tarjeta, transferencia] = getTotalOfTipoDePagoFromVentas(ventas);

	return {
		ventas,
        efectivo,
        tarjeta,
        transferencia,
        date1: date1param,
        date2: date2param,
	};
};

/**
 * Sorts ventas by their total, if there are multiple ventas with the same name, add them together
 * @param ventas Array of ventasto sort
 * @returns Sorted ventas
 */
const sortVentas = (ventas: Venta[]) => {
	const ventasMap = new Map();
	ventas.forEach((venta) => {
		if (ventasMap.has(venta.nombre)) {
			const ventaMap = ventasMap.get(venta.nombre);
			ventaMap.cantidad += venta.cantidad;
			ventaMap.total += venta.total;
		} else {
			ventasMap.set(venta.nombre, venta);
		}
	});
	ventas = Array.from(ventasMap.values());
	// Order ventas by their cantidad
	ventas.sort((a, b) => b.total - a.total);
	return ventas;
};

const getTotalOfTipoDePagoFromVentas = (ventas: Venta[]) => {
    let efectivo = 0;
    let tarjeta = 0;
    let transferencia = 0;

    ventas.forEach(venta => {
        if(venta.tipo_de_pago === MetodosDePago.efectivo) {
            efectivo += venta.total;
        }
        if(venta.tipo_de_pago === MetodosDePago.tarjetaCredito || venta.tipo_de_pago === MetodosDePago.tarjetaDebito) {
            tarjeta += venta.total;
        }
        if(venta.tipo_de_pago === MetodosDePago.transferencia) {
            transferencia += venta.total;
        }
    });
    return [efectivo, tarjeta, transferencia];
}
const getVentasDate = async (date1: Date) => {
	const { data, error } = await supabase
		.from<Venta>(Tables.ventas)
		.select('*')
        .lt('created_at', Utils.LocaleToUTC(date1, undefined, true).toISOString())
		.gt('created_at', Utils.LocaleToUTC(date1, true).toISOString());

	if (error) {
		return [];
	}

	if (!data) {
		return [];
	}
	return data;
};

const getVentasDateRange = async (date1: Date, date2: Date) => {
	const { data, error } = await supabase
		.from<Venta>(Tables.ventas)
		.select('*')
        .lt('created_at', Utils.LocaleToUTC(date2, undefined, true).toISOString())
		.gt('created_at', Utils.LocaleToUTC(date1, true).toISOString());

	if (error) {
		return [];
	}

	if (!data) {
		return [];
	}
	return data;
};
