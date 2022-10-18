import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const id: number = Number.parseInt(url.pathname.split('/')[2]);
    const { data, error } = await supabase
        .from('ordenes')
        .select('*')
        .eq('id', id)
        .single();
    if (error) {
        return {
            status: 500,
            error: error.message
        };
    }
    if (!data) {
        return {
            status: 404,
            error: 'Not found'
        };
    }
    return {
        orden: data
    };
};