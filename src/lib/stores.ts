import type { User } from "@supabase/supabase-js";
import { writable } from "svelte/store";
import type { UserProfile } from "./models";

export const gananciasTotales = writable('');
export const ordenTablaPageSize = writable(10);
export const clientesTablaPageSize = writable(10);

export const currentUser = writable({} as User);
export const currentProfile = writable({} as UserProfile);