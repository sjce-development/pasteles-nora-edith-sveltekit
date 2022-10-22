import type { Cliente, Especificacion, PastelesConfig, SelectItem } from '$lib/models';
import { supabase } from '$lib/supabase';
import Utils from '$lib/utils';
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
    const tamanos: SelectItem[] = Utils.formatEspecificacion(await getEspecificacion('tamano'));
    const pan: SelectItem[] = Utils.formatEspecificacion(await getEspecificacion('pan'));
    const rellenos: SelectItem[] = Utils.formatEspecificacion(await getEspecificacion('relleno'));
    const especificaciones: SelectItem[] = Utils.formatEspecificacion(await getEspecificacion('decorado'));
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