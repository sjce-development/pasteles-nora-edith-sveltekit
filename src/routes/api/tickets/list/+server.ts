import type { Ticket } from '$lib/models';
import { supabase } from '$lib/supabase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	const { data, error } = await supabase.from<Ticket>('tickets').select('*');
	if (error) {
		return json({
			status: 500,
			body: {
				error: error.message
			}
		});
	}
	return json(data);
};
