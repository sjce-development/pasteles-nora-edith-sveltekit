import { supabase } from '$lib/supabase';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
    const photos = await getPhotosOrdenes();
    
    return json(photos);
};

async function getPhotosOrdenes() {
    const { data, error } = await supabase
        .storage
        .listBuckets()
    if (error) {
        throw Error(error.toString());
    }
    console.log(data);
    return data;
}