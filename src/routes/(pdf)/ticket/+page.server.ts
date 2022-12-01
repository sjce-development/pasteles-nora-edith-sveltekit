import type { Ticket } from '$lib/models';
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from '.svelte-kit/types/src/routes/(pdf)/ticket/$types';

export const load: PageServerLoad = async ({ url }: { url: URL }) => {
	const ticketId: string = url.searchParams.get('ticketId') ?? '';
	if (ticketId === '') {
		return {
			status: 400,
			error: new Error('Missing ticketId')
		};
	}
	const { data: ticket, error } = await supabase.from<Ticket>('tickets').select('*').eq('id', ticketId).single();
	
	if (error) {
		return {
			status: 500,
			error
		};
	}

	console.log(ticket);

	return {
		ticket
	};
};
