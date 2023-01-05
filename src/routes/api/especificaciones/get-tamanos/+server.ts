import { supabase } from '$lib/supabase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';

export const GET: RequestHandler = async () => {
    const { data, error: err } = await supabase
        .from('especificaciones')
        .select('*')
        .order('created_at', { ascending: false })
        .eq('categoria', 'tamano');
    if (err) {
        return json({ error: err.message });
    }
    if (!data) {
        return json({ error: 'No se encontraron especificaciones' });
    }
    return json(data);
};