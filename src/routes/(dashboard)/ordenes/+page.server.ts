import type {
	Cliente,
	Especificacion,
	Orden,
	PastelesConfig,
	SelectItem,
} from "$lib/models";
import { supabase } from "$lib/supabase";
import Utils from "$lib/utils";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }: { url: URL }) => {
	// Get page number from query string
	const page = parseInt(url.searchParams.get("page") || "1");
	const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
	const { from, to } = Utils.getPagination({ page, pageSize });
    console.log({from, to});
	const pasteles: PastelesConfig = await setPastelesConfig();
	const clientes: Cliente[] = await getClientes();
    const ordenes: Orden[] = await getOrdenes(from, to);
    console.log({ordenes});
	const count = await getCount();
	return {
		pasteles,
		clientes,
		ordenes,
		count,
		pagination: {
			page,
			pageSize,
			from,
			to,
		},
	};
};

async function getClientes(): Promise<Cliente[]> {
	const { data, error } = await supabase.from<Cliente>("clientes").select("*");
	if (error) {
		alert(JSON.stringify(error, null, 2));
		return [];
	}
	return data;
}

async function setPastelesConfig(): Promise<PastelesConfig> {
	const tamanos: SelectItem[] = Utils.formatEspecificacion(
		await getEspecificacion("tamano"),
	);
	const harinas: SelectItem[] = Utils.formatEspecificacion(
		await getEspecificacion("harina"),
	);
	const rellenos: SelectItem[] = Utils.formatEspecificacion(
		await getEspecificacion("relleno"),
	);
	const especificaciones: SelectItem[] = Utils.formatEspecificacion(
		await getEspecificacion("decorado"),
	);
	return { tamanos, harinas, rellenos, especificaciones };
}

async function getEspecificacion(categoria: string): Promise<Especificacion[]> {
	const { data, error } = await supabase
		.from<Especificacion>("especificaciones")
		.select("*")
		.eq("categoria", categoria);
	if (error) {
		alert(JSON.stringify(error, null, 2));
		return [];
	}
	return data;
}

async function getOrdenes( from: number, to: number): Promise<Orden[]> {
	const { data, error } = await supabase
		.from<Orden>("ordenes")
		.select("*")
		.range(from, to);
	if (error) {
		return [] as Orden[];
	}
    return data;
}

async function getCount(): Promise<number> {
    const { error, count } = await supabase
        .from<Orden>("ordenes")
        .select("*", { count: "exact" });
    if (error) {
        return 0;
    }
    return count || 0;
}
