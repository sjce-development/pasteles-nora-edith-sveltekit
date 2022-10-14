import type { Venta } from '$lib/models';
import { supabase } from '$lib/supabase';
import type { RequestHandler } from './$types';


export const GET: RequestHandler = async ({ url }) => {
    const defaultDateInitial = `${new Date().getFullYear()}-01-01`;
    const defaultDateFinal = `${new Date().getFullYear() - 1}-12-31`;

    const fechaInicial = url.searchParams.get('fechaInicial');
    const fechaFinal = url.searchParams.get('fechaFinal');

    const { data, error } = await supabase
        .from<Venta>('ventas')
        .select('*')
        .lt('created_at', fechaFinal ? fechaFinal : defaultDateFinal)
        .gt('created_at', fechaInicial ? fechaInicial : defaultDateInitial);
    if (error) {
        return new Response(error.message, { status: 500 });
    }
    return new Response(JSON.stringify(data), { status: 200 });
};