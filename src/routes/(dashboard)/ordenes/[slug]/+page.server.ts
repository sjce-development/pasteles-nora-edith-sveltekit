import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const id: number = Number.parseInt(url.pathname.split('/')[2]);
	const { data, error } = await supabase.from('ordenes').select('*').eq('id', id).single();
	if (error) {
		return {
			status: 500,
			error: error.message
		};
	}
	if (!data) {
		return {
			status: 404,
			error: 'Not found'
		};
	}

	const image = await getOrderImage(id);
	let imageUrl: string;
	if (image) {
		imageUrl = await getImagePublicUrl(id, image.name);
	} else {
		imageUrl = '';
	}
	return {
		orden: data,
		imageUrl
	};
};

async function getOrderImage(id: number) {
	const { data, error } = await supabase.storage
		.from('photos-ordenes')
		.list(id.toString(), { limit: 1 });
	if (error) {
		return null;
	}
	if (!data) {
		return null;
	}
	return data[0];
}

async function getImagePublicUrl(id: number, name: string) {
	const { data } = supabase.storage.from('photos-ordenes').getPublicUrl(`${id}/${name}`);
	if (!data) {
		return '';
	}
	return data.publicURL;
}
