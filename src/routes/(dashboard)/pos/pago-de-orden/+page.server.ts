import type { Cliente, Orden } from '$lib/models';
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const ordenes = await getOrdenes();
	const clientes = await getClientes();
	return {
		ordenes,
        clientes,
	};
};

async function getClientes(): Promise<Cliente[]> {
	const { data, error } = await supabase
		.from<Cliente>('clientes')
		.select('*')
		.order('id', { ascending: false });
	if (error) {
		console.error(error);
		return [];
	}
	if (!data) return [];
	return data;
}

async function getOrdenes(): Promise<Orden[]> {
	const { data, error } = await supabase
		.from('ordenes')
		.select('*')
		.order('id', { ascending: false });
	if (error) {
		console.error(error);
		return [];
	}
	if (!data) return [];
	return data;
}
