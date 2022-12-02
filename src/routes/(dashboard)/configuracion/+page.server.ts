import type { Categoria, Especificacion } from '$lib/models';
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const categorias = await getCategorias();
    const especificaciones = await getEspecificaciones();
    especificaciones.forEach((especificacion) => {
        if (especificacion.nombre.includes('+')) {
            especificacion.nombre = especificacion.nombre.replace('+', '𐊛');
        }
    })
    return { categorias, especificaciones };
};

async function getCategorias(): Promise<Categoria[]> {
    const { data, error } = await supabase.from<Categoria>('categorias').select('*');
    if (error) {
        return [] as Categoria[];
    }
    return data;
}

async function getEspecificaciones(): Promise<Especificacion[]> {
    const { data, error } = await supabase.from<Especificacion>('especificaciones').select('*');
    if (error) {
        return [] as Especificacion[];
    }
    return data;
}