import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }: { url: URL }) => {
    const id = url.searchParams.get('ordenId');
    if (!id) {
        throw error(404, 'Orden no encontrada');
    };
    const orden = await getOrden(parseInt(id));
	return {
        orden
    };
};

async function getOrden(id: number) {
	const { data, error } = await supabase.from('ordenes').select('*').eq('id', id).single();
	if (error) {
		console.error(error);
		return {};
	}
	if (!data) return {};
	return data;
}
