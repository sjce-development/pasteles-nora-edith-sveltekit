<script lang="ts">
	import { goto } from '$app/navigation';
	import type { UserProfile } from '$lib/models';
	import type { PageData } from './$types';

	export let data: PageData;
	let profiles: UserProfile[] = data.profiles;
</script>

<p class="text-lg pointer" on:click={() => {goto('/configuracion/')}} > ⬅️ Regresar </p>
<h1>Usuarios</h1>
<div class="table-responsive">
	<table
		class="table table-striped
    table-hover	
    table-borderless
    table-primary
    align-middle"
	>
		<thead class="table-dark">
			<tr>
				<th>Nombre</th>
				<th>Rol</th>
				<th>Telefono</th>
				<th>Acciones</th>
			</tr>
		</thead>
		<tbody class="table-group-divider">
			{#each profiles as profile}
				<tr class="table-primary pointer">
					<td>{profile.nombre}</td>
					<td>{profile.role}</td>
					<td>{profile.telefono ?? 'n/a'}</td>
					<td>
						<a class="btn btn-primary" href="/configuracion/usuarios/{profile.user_id}">
							<i class="fa-solid fa-pen-to-square" />
						</a>
					</td>
				</tr>
			{/each}
		</tbody>
		<tfoot />
	</table>
</div>
