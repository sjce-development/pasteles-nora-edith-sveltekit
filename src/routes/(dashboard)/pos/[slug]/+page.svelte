<script lang="ts">
	import Loader from '$lib/components/Loader.svelte';
	import { onMount } from 'svelte';
	import type { Pastel } from '$lib/models';
	import type { PageData } from '.svelte-kit/types/src/routes/(dashboard)/pos/[slug]/$types';
	import { supabase } from '$lib/supabase';
	import Swal from 'sweetalert2';
	import { goto } from '$app/navigation';

	export let data: PageData;
	let pastel: Pastel;

	let nombreOriginal: string;

	onMount(() => {
		pastel = data.pastel;
		nombreOriginal = pastel.nombre;
	});

	async function editarPastel(event: any) {
		if (nombreOriginal !== pastel.nombre && pastel.hasImage) {
			renameImage();
		}

		const { data, error } = await supabase
			.from('pasteles')
			.update({
				nombre: pastel.nombre,
				precio: pastel.precio,
				cantidad: pastel.cantidad
			})
			.eq('id', pastel.id);
		if (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Algo salió mal, intente de nuevo'
			});
			return;
		}
		await Swal.fire('Pastel editado', 'El pastel ha sido editado correctamente', 'success');
		goto('/pos')
	}

	async function renameImage() {
		const { data, error } = await supabase
			.storage
			.from('pasteles')
			.move(nombreOriginal, pastel.nombre)
	}
</script>

<div class="d-sm-flex justify-content-between align-items-center mb-4">
	<h3 class="text-dark mb-0">Editar pastel</h3>
</div>

<!-- Editar pastel form -->
{#if pastel}
	<form on:submit|preventDefault={editarPastel}>
		<div class="form-group">
			<label for="nombre">Nombre</label>
			<input type="text" class="form-control" id="nombre" bind:value={pastel.nombre}/>
		</div>
		<div class="form-group">
			<label for="precio">Precio</label>
			<input type="number" class="form-control" id="precio" bind:value={pastel.precio} />
		</div>
		<div class="form-group">
			<label for="cantidad">Cantidad</label>
			<input type="number" class="form-control" id="cantidad" bind:value={pastel.cantidad} />
		</div>
		<button type="submit" class="btn btn-primary">Editar</button>
	</form>
{:else}
	<Loader />
{/if}
