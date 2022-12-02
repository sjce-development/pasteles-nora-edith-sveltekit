import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Get all profiles
	const { data, error } = await supabase.from('profile').select('*');
	if (error) {
		return { profiles: [] };
	}
	return { profiles: data };
};
