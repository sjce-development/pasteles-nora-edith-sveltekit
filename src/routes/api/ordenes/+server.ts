import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import type { Orden } from '$lib/models';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async () => {
    const { data, error } = await supabase
        .from<Orden>('ordenes')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) { throw Error('Error al cargar las ordenes'); }

    return json(data);
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        const orden: Orden = await request.json();
        const { data, error } = await supabase.from('ordenes').insert([
            orden
        ]);
        if (error) {
            return json({ error, orden }, { status: 500 });
        }
        return json(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return new Response(error, { status: 500 });
    }
}
