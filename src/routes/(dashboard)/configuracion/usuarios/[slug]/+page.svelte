<script lang="ts">
	import { goto } from '$app/navigation';
	import { Roles } from '$lib/constants';
	import type { UserProfile } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import Utils from '$lib/utils';
	import Swal from 'sweetalert2';
	import type { PageData } from './$types';

	export let data: PageData;
	let profile: UserProfile = data.profile;
	let profileName = profile.nombre;

	async function handleGuardarPerfil() {
		const { isConfirmed } = await Swal.fire({
			title: '¿Estás seguro?',
			text: 'Se actualizarán los datos del perfil',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí, guardar',
			cancelButtonText: 'Cancelar'
		});

		if (!isConfirmed) {
			return;
		}

		const { data, error } = await supabase
			.from<UserProfile>('profile')
			.update({
				nombre: profile.nombre,
				telefono: profile.telefono,
				role: profile.role
			})
			.eq('user_id', profile.user_id);
		if (error) {
			Swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'error'
			});
			return;
		}

		Swal.fire({
			title: 'Éxito',
			text: 'Se han guardado los cambios',
			icon: 'success'
		});
		window.location.reload();
	}

	async function handleBorrarUsuario() {
		const { isConfirmed } = await Swal.fire({
			title: '¿Estás seguro?',
			text: 'Se eliminará el usuario',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar'
		});
		if (!isConfirmed) {
			return;
		}
		const { data: user, error } = await supabase.auth.api.deleteUser(profile.user_id);
		if (error) {
			Swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'error'
			});
			return;
		}
		Swal.fire({
			title: 'Éxito',
			text: 'Se ha eliminado el usuario',
			icon: 'success'
		});
		goto('/dashboard/configuracion/usuarios');
	}
</script>

<h1>Perfil de {profileName}</h1>

<div class="mb-3">
	<label for="" class="form-label">Nombre</label>
	<input
		type="text"
		name=""
		id=""
		class="form-control"
		placeholder=""
		bind:value={profile.nombre}
	/>
	<small id="helpId" class="text-muted">Nombre del usuario</small>
</div>
<div class="mb-3">
	<label for="user_role" class="form-label">Rol</label>
	<select
		class="form-select form-select-md"
		name="user_role"
		id="user_role"
		bind:value={profile.role}
	>
		{#each Object.values(Roles) as role}
			<option value={role} selected={role === profile.role}>{Utils.capitalize(role)}</option>
		{/each}
	</select>
	<small id="user_role" class="text-muted">Rol del usuario</small>
</div>
<div class="mb-3">
	<label for="" class="form-label">Telefono</label>
	<input
		type="text"
		name=""
		id=""
		class="form-control"
		placeholder=""
		bind:value={profile.telefono}
	/>
	<small id="helpId" class="text-muted">Telefono del usuario</small>
</div>
<button type="button" class="btn btn-primary" on:click={handleGuardarPerfil}>Guardar</button>
<button type="button" class="btn btn-danger">Eliminar usuario</button>
