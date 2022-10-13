import type { Cliente, Especificacion, PastelesConfig, SelectItem } from '$lib/models';
import { supabase } from '$lib/supabase';
import { formatEspecificacion } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const pasteles: PastelesConfig = await setPastelesConfig();    
    const clientes: Cliente[] = await getClientes();
    return {
        pasteles,
        clientes
    };
};

async function getClientes(): Promise<Cliente[]> {
    const { data, error } = await supabase.from<Cliente>('clientes').select('*');
    if (error) {
        alert(JSON.stringify(error, null, 2));
        return [];
    }
    return data;
}

async function setPastelesConfig(): Promise<PastelesConfig> {
    const tamanos: SelectItem[] = formatEspecificacion(await getEspecificacion('tamano'));
    const pan: SelectItem[] = formatEspecificacion(await getEspecificacion('pan'));
    const rellenos: SelectItem[] = formatEspecificacion(await getEspecificacion('relleno'));
    const especificaciones: SelectItem[] = formatEspecificacion(await getEspecificacion('especificacion'));
    return { tamanos, pan, rellenos, especificaciones };
}

async function getEspecificacion(categoria: string): Promise<Especificacion[]> {
    const { data, error } = await supabase
        .from<Especificacion>('especificaciones')
        .select('*')
        .eq('categoria', categoria);
    if (error) {
        alert(JSON.stringify(error, null, 2));
        return [];
    }
    return data;
}