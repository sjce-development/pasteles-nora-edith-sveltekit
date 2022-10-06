<script lang="ts">
	import Swal from 'sweetalert2';
	import type { Pastel } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import BaseModal from './BaseModal.svelte';

	let errors: Array<string> = [];

	async function agregarPastel(event: any) {
		const nombre = event.target.nombre.value;
		const precio = Number.parseFloat(event.target.precio.value);
		const cantidad = Number.parseInt(event.target.cantidad.value);
		const imagen = event.target[3].files[0];

		// Nombre, precio, cantidad e imagen
		const nombreError = 'El nombre es requerido';
		const precioError = 'El precio es requerido';
		const cantidadError = 'La cantidad es requerida';
		const imagenError = 'La imagen es requerida';

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

		if (cantidad <= 0 && !errors.includes(cantidadError)) {
			errors = [...errors, cantidadError];
		} else {
			errors = errors.filter((error) => error !== cantidadError);
		}

		if (imagen === undefined && !errors.includes(imagenError)) {
			errors = [...errors, imagenError];
		} else {
			errors = errors.filter((error) => error !== imagenError);
		}

		if (errors.length > 0) {
			return;
		}

		const { data: dataPastel, error: errorPastel } = await supabase.from('pasteles').insert([
			{
				nombre: nombre,
				precio: precio,
				cantidad: cantidad
			}
		]);
		if (errorPastel) {
			console.log({
				nombre,
				precio,
				cantidad
			});
			console.log(`Error pastel: ${JSON.stringify(errorPastel, null, 2)}`);
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Algo salió mal, intente de nuevo'
			});
			return;
		}

		const { data: dataImagen, error: errorImagen } = await supabase.storage
			.from('pasteles')
			.upload(`${dataPastel[0].nombre}`, imagen, {
				cacheControl: '3600',
				upsert: false
			});

		if (errorImagen) {
			console.log(`Error imagen: ${JSON.stringify(errorImagen, null, 2)}`);
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Algo salió mal, intente de nuevo'
			});
      await supabase.from('pasteles').delete().eq('id', dataPastel[0].id);
			return;
		}
		await Swal.fire('Pastel agregado', 'El pastel ha sido agregado correctamente', 'success');
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
		<div class="mb-3">
			<label for="imagen" class="form-label">Imagen *</label>
			<input
				type="file"
				class="form-control"
				aria-describedby="imagenHelpId"
				placeholder="pastel.jpg"
				name="imagen"
				id="imagen"
			/>
			<small id="imagenHelpId" class="form-text text-muted">La imagen debe ser de máximo 50mb</small
			>
		</div>
		<button type="submit" class="btn btn-primary">Button</button>
	</form>
</BaseModal>
