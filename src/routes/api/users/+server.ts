import type { UserProfile } from '$lib/models';
import { supabase } from '$lib/supabase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }: { url: URL }) => {
	const user_id = url.searchParams.get('user_id') ?? '';
	if (user_id === '') {
		return new Response(JSON.stringify({ error: 'No user_id provided' }), { status: 400 });
	}
	const { data, error } = await supabase
		.from<UserProfile>('profile')
		.select('*')
		.eq('user_id', user_id)
		.single();
	if (error) {
		return json({ status: 500, body: { error: error.message } });
	}
	return new Response(JSON.stringify(data), { status: 200 });
};
