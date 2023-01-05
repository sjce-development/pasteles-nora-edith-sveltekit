import { Tables } from '$lib/constants';
import type { Especificacion, Orden } from '$lib/models';
import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }: { url: URL }) => {
	const ids: string | null = url.searchParams.get('ordenes');

	if (ids === null || ids?.length === 0) {
		throw error(404, 'No se encontraron ordenes');
	}

	const idsArray = ids.split(',');

	const ordenes = await getOrdenes(idsArray);
	await actualizarOrdenesAImpresas(ordenes);
	// Add peso from tamanos to orden
	for (const orden of ordenes) {
		const { peso, numero_de_panes } = await getPesoFromOrden(orden);
		orden.peso = peso ?? 0;
		orden.numero_de_panes = numero_de_panes ?? 0;
	}

	return { ordenes };
};
async function getOrdenes(ids: string[]) {
	const { data: ordenes, error: err } = await supabase
		.from<Orden>('ordenes')
		.select('*')
		.order('created_at', { ascending: false })
		.in('id', ids);

	if (err) {
		throw error(404, `Error al cargar las ordenes. ${err.message}`);
	}
	return ordenes;
}

async function actualizarOrdenesAImpresas(ordenes: Orden[]) {
	const { error: err } = await supabase
		.from<Orden>('ordenes')
		.update({ impreso: true })
		.in('id', ordenes.map((o) => o.id));

	if (err) {
		throw error(404, `Error al actualizar las ordenes. ${err.message}`);
	}
}

async function getPesoFromOrden(orden: Orden) {
	const { data, error: err } = await supabase
		.from(Tables.especificaciones)
		.select('peso, numero_de_panes')
		.eq('nombre', orden.tamano)
		.eq('categoria', 'tamano')
		.single();

	if (err) {
		return 0;
	}

	if (data === null) {
		return 0;
	}

	return data;

}