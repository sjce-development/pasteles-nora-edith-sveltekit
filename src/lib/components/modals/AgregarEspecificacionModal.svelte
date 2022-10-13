<script lang="ts">
	import Swal from 'sweetalert2';
	import type { Pastel } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import BaseModal from './BaseModal.svelte';

	let errors: Array<string> = [];

	async function agregarPastel(event: any) {
		const nombre = event.target.nombre.value;
		const precio = Number.parseFloat(event.target.precio.value);
		const categoria = event.target.cantidad.value;

		const nombreError = 'El nombre es requerido';
		const precioError = 'El precio es requerido';
		const categoriaError = 'La categoria es requerida';

		if (nombre === '' && !errors.includes(nombreError)) {
			errors = [...errors, nombreError];
		} else {
			errors = errors.filter((error) => error !== nombreError);
		}

		if (precio <= 0 && !errors.includes(precioError)) {
			errors = [...errors, precioError];
		} else {
			errors = errors.filter((error) => error !== precioError);
		}

		if (categoria === '' && !errors.includes(categoriaError)) {
			errors = [...errors, categoriaError];
		} else {
			errors = errors.filter((error) => error !== categoriaError);
		}

		if (errors.length > 0) {
			return;
		}

		const { data, error } = await supabase.from('especificacion').insert([
			{
				categoria,
				nombre,
				precio
			}
		]);
		if (error) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Algo salió mal, intente de nuevo'
			});
			return;
		}
		await Swal.fire(
			'Especificacion agregada',
			'La especificacion ha sido agregada correctamente',
			'success'
		);
		window.location.reload();
	}

	function dismissError(error: string) {
		errors = errors.filter((e) => e !== error);
	}

	async function cta() {}
</script>

<BaseModal {cta} title="Agregar pastel" successButtonString="Guardar" id="agregar-pastel-modal">
	{#if errors.length > 0}
		{#each errors as error}
			<div class="alert alert-danger d-flex" style="justify-content: space-between;" role="alert">
				{error}
				<i
					class="fa-solid fa-x"
					on:click={() => {
						dismissError(error);
					}}
				/>
			</div>
		{/each}
	{/if}
	<form on:submit|preventDefault={agregarPastel}>
		<div class="mb-3">
			<label for="nombre" class="form-label">Nombre *</label>
			<input
				type="text"
				class="form-control"
				name="nombre"
				id="nombre"
				placeholder="Nombre del pastel"
			/>
		</div>
		<div class="mb-3">
			<label for="precio" class="form-label">Precio *</label>
			<input type="number" class="form-control" name="precio" id="precio" placeholder="$200.00" />
		</div>
		<div class="mb-3">
			<label for="cantidad" class="form-label">Cantidad</label>
			<input
				type="number"
				class="form-control"
				aria-describedby="cantidadHelpId"
				placeholder="3"
				name="cantidad"
				id="cantidad"
			/>
		</div>
		<button type="submit" class="btn btn-primary">Button</button>
	</form>
</BaseModal>
