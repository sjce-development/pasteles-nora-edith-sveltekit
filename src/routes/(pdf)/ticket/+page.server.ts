import type { Ticket } from '$lib/models';
import type { PageServerLoad } from '.svelte-kit/types/src/routes/(pdf)/ticket/$types';

export const load: PageServerLoad = async ({ url }: { url: URL }) => {
	const ticketString: string = url.searchParams.get('ticket') ?? '';
	const parsedTicket = JSON.parse(ticketString);
	if (parsedTicket?.length) {
		return {
			ticket: parsedTicket
		};
	}
	const ticket: Ticket = JSON.parse(ticketString);
	return {
		ticket
	};
};
