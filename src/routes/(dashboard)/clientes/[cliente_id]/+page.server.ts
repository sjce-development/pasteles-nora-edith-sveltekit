import type { Cliente, Orden } from "$lib/models";
import { supabase } from "$lib/supabase";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const { cliente_id } = params;
	// fetch user from supabase
	const cliente = await fetchCliente(cliente_id);
    const ordenes = await fetchOrdenes(cliente.telefono);
	return {
		cliente,
        ordenes
	};
};

async function fetchOrdenes(telefono: string): Promise<Orden[]> {
    const { data: ordenes, error } = await supabase
        .from("ordenes")
        .select("*")
        .eq("telefono", telefono)
        .order("created_at", { ascending: false });
    if (error) {
        throw error;
    }
    return ordenes;
}

async function fetchCliente(cliente_id: string): Promise<Cliente> {
    const { data: cliente, error } = await supabase
		.from("clientes")
		.select("*")
		.eq("id", cliente_id)
		.single();
	if (error) {
		throw error;
	}
    return cliente;
}
