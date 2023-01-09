import type { Orden } from '$lib/models';
import { supabase } from '$lib/supabase';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }: { url: URL }) => {
	const ordenId: string | null = url.searchParams.get('ordenId');
	if (ordenId === null) {
		throw redirect(300, 'ordenes');
	}
	const { data, error: err } = await supabase
		.from<Orden>('ordenes')
		.select('*')
		.eq('id', ordenId)
		.single();
	if (err) {
		throw redirect(300, 'ordenes');
	}
	if (data === null) {
		throw redirect(300, 'ordenes');
	}
	return {
		orden: data
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		console.log(formData);
	}
};
