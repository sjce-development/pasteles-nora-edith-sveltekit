import { supabase } from "$lib/supabase";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const PUT: RequestHandler = async ({
	request,
}: { request: RequestHandler }) => {
	const { ordenesIds, estado } = await request.json();
	const { data, error } = await supabase
		.from("ordenes")
		.update({ estado })
		.in("id", ordenesIds);
	return json({ data, error });
};
