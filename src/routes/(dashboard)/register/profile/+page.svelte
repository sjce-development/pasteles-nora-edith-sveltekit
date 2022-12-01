<script lang="ts">
	import { Roles } from '$lib/constants';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import type { User } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';
	import type { UserProfile } from '$lib/models';

	// import type { PageData } from './$types';

	// export let data: PageData;
	let user: User | null;
	let profile: UserProfile = {} as UserProfile;
	onMount(async () => {
		user = supabase.auth.user();
		if (user === null) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'No tienes permisos para acceder a esta página'
			});
			goto('/login');
			return;
		}
		profile.user_id = user.id;
		const { data, error } = await supabase
			.from<UserProfile>('profile')
			.select('*')
			.eq('user_id', user.id)
			.single();
		if (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Aun no tiene un perfil, porfavor cree uno.'
			});
			return;
		}
        if (data) {
            profile = data;
        }
	});

	async function guardarPerfil() {
		if (user === null) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'No tienes permisos para acceder a esta página'
			});
			goto('/login');
			return;
		}
		const { data, error } = await supabase.from<UserProfile>('profile').upsert([
			{
				user_id: user.id,
				role: profile.role,
				nombre: profile.nombre,
				telefono: profile.telefono
			}
		]);
		if (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'No se pudo guardar el perfil'
			});
			return;
		}
		await Swal.fire({
			icon: 'success',
			title: 'Perfil guardado',
			text: 'Se guardo el perfil correctamente'
		});
	}
</script>

<h1>Editar perfil</h1>
<!-- Roles, nombre, telefono -->
{#if user}
	<h2>{user.email}</h2>
	<div class="mb-3">
		<label for="" class="form-label">Roles</label>
		<select class="form-select" aria-label="Default select example" bind:value={profile.role}>
			{#each Object.keys(Roles) as role}
				<option value={role}>{role}</option>
			{/each}
		</select>
	</div>
	<div class="mb-3">
		<label for="" class="form-label">Nombre</label>
		<input type="text" class="form-control" bind:value={profile.nombre} />
	</div>
	<div class="mb-3">
		<label for="" class="form-label">Telefono</label>
		<input type="text" class="form-control" bind:value={profile.telefono} />
	</div>
	<button type="button" class="btn btn-primary" on:click={guardarPerfil}>Guardar perfil</button>
{/if}
