import type { Orden } from '$lib/models';
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const { data, error } = await supabase
        .from<Orden>('ordenes')
        .select('*')
        .eq('impreso', false)
        .order('created_at', { ascending: false });
    if (error) throw Error('Error al cargar las ordenes');
    const ordenes: Orden[] = data;
    return { ordenes };
};