import type { Orden, Venta } from '$lib/models';
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from '.svelte-kit/types/src/routes/(dashboard)/$types';

export const load: PageServerLoad = async () => {
	return {
		ventas: await fetchVentas(),
		ordenes: await fetchOrdenes()
	};
};

async function fetchVentas(): Promise<Venta[]> {
	const { data, error } = await supabase.from<Venta>('ventas').select('*');
	if (error) {
		return [] as Venta[];
	}
	return data;
}

async function fetchOrdenes(): Promise<Orden[]> {
	const { data, error } = await supabase.from<Orden>('ordenes').select('*');
	if (error) {
		return [] as Orden[];
	}
	return data;
}
