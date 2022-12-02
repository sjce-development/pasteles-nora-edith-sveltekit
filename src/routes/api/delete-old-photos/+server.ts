import { supabase } from '$lib/supabase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	const { data, error } = await supabase.storage.from('photos-ordenes').list('', {
		limit: 100,
		offset: 0,
		sortBy: { column: 'name', order: 'asc' }
	});
	if (error) {
		return json({ error: error.message }, { status: 500 });
	}
	if (data === null) {
		return json({ error: 'No hay fotos' }, { status: 500 });
	}

	const fotos = data;
	const twoMonthsAgo = new Date();
	twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

	const fotosToDelete = fotos.filter((foto) => foto.created_at < twoMonthsAgo.toISOString());

	const fotoNamesToDelete = fotosToDelete.map((foto) => foto.name);

	return await deletePhotos(fotoNamesToDelete);
};

async function deletePhotos(photos: string[]) {
	if (photos.length === 0) {
		return json({ error: 'No hay fotos' }, { status: 500 });
	}
	const { data, error } = await supabase.storage.from('photos-ordenes').remove(photos);
	if (error) {
		return json({ error: error.message }, { status: 500 });
	}
	if (data === null) {
		return json({ error: 'No hay fotos' }, { status: 500 });
	}
	if (data.length > 0) {
		return json(
			{
				fotos: data
			},
			{ status: 200 }
		);
	} else {
		return json({ error: 'No se eliminaron fotos.' }, { status: 500 });
	}
}
