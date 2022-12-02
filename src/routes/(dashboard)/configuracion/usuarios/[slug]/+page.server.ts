import type { UserProfile } from '$lib/models';
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	// Get profile from user_id from url params
	const user_id: string | null = params.slug;
	if (user_id == null) {
		return { profile: {} as UserProfile };
	}
	const { data, error } = await supabase
		.from<UserProfile>('profile')
		.select('*')
		.eq('user_id', user_id)
		.single();
	if (error) {
		return { profile: {} as UserProfile };
	}
	return { profile: data };
};
