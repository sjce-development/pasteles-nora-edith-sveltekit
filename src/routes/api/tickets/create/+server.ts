import { supabase } from '$lib/supabase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    const { productos } = await request.json();
    const { data, error } = await supabase.from('tickets').insert(productos);
    if (error) {
        return json({
            status: 500,
            body: {
                error: error.message
            }
        });
    }
	return json({
		status: 200,
        data: data,
	});
};
