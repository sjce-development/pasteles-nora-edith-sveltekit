import { Tables } from '$lib/constants';
import type { Especificacion, Orden } from '$lib/models';
import { supabase } from '$lib/supabase';
import Utils from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const id: number = Number.parseInt(url.pathname.split('/')[2]);
	
	const orden = await getOrden(id);
	const especificaciones = Utils.formatEspecificacion(await getEspecificaciones());

	const image = await getOrderImage(id);
	let imageUrl: string;
	if (image) {
		imageUrl = await getImagePublicUrl(id, image.name);
	} else {
		imageUrl = '';
	}

	return {
		orden,
		especificaciones,
		imageUrl
	};
};

async function getEspecificaciones() {
	const { data, error } = await supabase
		.from<Especificacion>(Tables.especificaciones)
		.select('*')
		.eq('categoria', 'decorado');
	if (error) {
		return [] as Especificacion[];
	}
	if (!data) {
		return [] as Especificacion[];
	}
	return data;
}

async function getOrden(id: number): Promise<Orden> {
	const { data, error: err } = await supabase.from('ordenes').select('*').eq('id', id).single();
	if (err) {
		return {} as Orden;
	}
	if (!data) {
		return {} as Orden;
	}
	return data;
}

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
