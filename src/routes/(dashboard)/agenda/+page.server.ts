import type { Orden } from '$lib/models';
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const { data, error } = await supabase
        .from<Orden>('ordenes')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        return [] as Orden[];
    };
    const ordenes = data;
    return {
        ordenes
    };
};