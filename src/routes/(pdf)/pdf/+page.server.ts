import type { Orden } from "$lib/models";
import { supabase } from "$lib/supabase";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }: { url: URL }) => {
	let ids: number[] = [];

	if (url.searchParams.get("ordenes") !== undefined) {
		ids =
			url.searchParams
				.get("ordenes")
				?.split(",")
				.map((id) => {
					return parseInt(id);
				}) || [];
	}

	const { data, error } = await supabase
		.from<Orden>("ordenes")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		throw Error("Error al cargar las ordenes");
	}

	if (ids.length > 0) {
		return {
			ordenes:
				data.filter((orden: Orden) => ids.includes(orden.id || -1)) || [],
		};
	}
	const ordenes: Orden[] = data;
	// Get estados from database
	await fetch("/api/ordenes/update", {
		method: "PUT",
		body: JSON.stringify(ordenes.map((orden) => orden.id)),
	});
	return { ordenes };
};
