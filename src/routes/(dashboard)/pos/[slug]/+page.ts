import type { Pastel } from '$lib/models';
import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
  // get pastel from supabase
  const { data, error: err } = await supabase
    .from('pasteles')
    .select('*')
    .eq('nombre', params.slug)
    .single();

  if (err) {
    console.error(err);
    throw error(404, 'Not found');
  }

  const pastel: Pastel = data;
  return {
    pastel
  };
}