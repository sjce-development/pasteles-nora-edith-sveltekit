import type { Venta } from '$lib/models';
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }: { url: URL }) => {
    // toISOString adds 7 hours
	const dateString = url.searchParams.get('date');

	const date = dateString ? new Date(dateString) : new Date();
	const startOfDay = new Date(date);
	startOfDay.setHours(startOfDay.getHours() - 7);
	const endOfDay = new Date(date);
	endOfDay.setHours(23 + 10, 59, 59, 999);
    console.log(startOfDay.toISOString(), endOfDay.toISOString());

	const { data: ventas, error } = await supabase
		.from<Venta>('ventas')
		.select('*')
		.order('created_at', { ascending: true })
		.gt('created_at', startOfDay.toISOString())
		.lt('created_at', endOfDay.toISOString());

    // console.log(ventas?.map(v => new Date(v.created_at).toLocaleString()));

	const response = {
		ventas: [] as Venta[],
		date
	};

	if (error) {
		return response;
	}
	if (ventas === null) {
		return response;
	}

	response.ventas = ventas;

	return response;
};
