<script lang="ts">
	import Swal from 'sweetalert2';
	import type { Categoria, Especificacion } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import BaseModal from './BaseModal.svelte';
	export let title: string;
	export let id: string;
	export let categoria: Categoria;

	let errors: Array<string> = [];

	function dismissError(error: string) {
		errors = errors.filter((e) => e !== error);
	}

	async function cta(event: any) {
		const nombre = event.target.nombre.value;
		const precio = Number.parseFloat(event.target.precio.value);
		let peso: number = 0;
		let numeroPanes: string;

		if (categoria.nombre === 'tamano') {
			peso = Number.parseInt(event.target.peso.value);
			numeroPanes = event.target.numeroPanes.value;
		} else {
			peso = -1;
			numeroPanes = '';
		}

		// Nombre, precio, cantidad e imagen
		const nombreError = 'El nombre es requerido';
		const precioError = 'El precio es requerido';
		const pesoError = 'El peso es requerido';
		const numeroPanesError = 'El número de panes es requerido';

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

		if (categoria.nombre === 'tamano' && peso <= 0 && !errors.includes(pesoError)) {
			errors = [...errors, pesoError];
		} else {
			errors = errors.filter((error) => error !== pesoError);
		}

		if (categoria.nombre === 'tamano' && numeroPanes === '' && !errors.includes(numeroPanesError)) {
			errors = [...errors, numeroPanesError];
		} else {
			errors = errors.filter((error) => error !== numeroPanesError);
		}

		if (errors.length > 0) {
			return;
		}

		const { data, error } = await supabase.from<Especificacion>('especificaciones').insert([
			{
				nombre,
				precio,
				categoria: categoria.nombre,
				peso: peso ? peso : undefined,
				numero_de_panes: numeroPanes ? numeroPanes : undefined
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

		await Swal.fire({
			title: 'Especificación agregada',
			text: 'La especificación se agregó correctamente',
			icon: 'success',
			showCancelButton: false,
			timer: 1000
		});
		window.location.reload();
	}
</script>

<BaseModal {cta} {id} {title}>
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
	<div class="mb-3">
		<label for="nombre" class="form-label">Cantidad de personas *</label>
		<input
			type="text"
			class="form-control"
			name="nombre"
			id="nombre"
			placeholder="Ej. 10-15 personas"
		/>
	</div>
	<div class="mb-3">
		<label for="precio" class="form-label">Precio *</label>
		<input type="number" class="form-control" name="precio" id="precio" placeholder="$200.00" />
	</div>
	{#if categoria.nombre === 'tamano'}
		<div class="mb-3">
			<label for="peso" class="form-label">Peso *</label>
			<input type="number" class="form-control" name="peso" id="peso" placeholder="500g" />
			<small>El peso tiene que estar en gramos</small>
		</div>
		<!-- Número de panes -->
		<div class="mb-3">
			<label for="numeroPanes" class="form-label">Número de panes *</label>
			<input type="number" class="form-control" name="numeroPanes" id="numeroPanes" value="1" />
			<small>1 pan y plancha son equivalentes</small>
		</div>
	{/if}
</BaseModal>
