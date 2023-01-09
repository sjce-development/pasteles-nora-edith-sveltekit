<script lang="ts">
	import { goto } from '$app/navigation';
	import { MetodosDePago, Tables } from '$lib/constants';
	import type { Orden, Venta } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';
	import type { PageData } from './$types';

	export let data: PageData;

	const orden: Orden = data.orden;

	let metodoDePago: string = MetodosDePago.efectivo;
	let facturado: boolean = false;
	let cantidad: number = 0;
	let total: number;
	let restante: number;

	onMount(() => {
		total = orden.total ?? 0;
		restante = total - orden.anticipo;
	});

	async function realizarPago() {
		if (cantidad <= 0) {
			await Swal.fire({
				title: 'Cantidad no valida',
				text: 'La cantidad tiene que ser mayor que 0',
				timer: 2000,
				icon: 'error'
			});
		}
		await actualizarOrden();
		await registrarVenta();
		goto('/ordenes');
	}

	async function actualizarOrden() {
		if (cantidad === restante) {
			orden.pagado = true;
		}
		const { data, error } = await supabase.from<Orden>(Tables.ordenes).update({
			...orden
		});
		if (error) {
			await Swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'error'
			});
		}
	}

	async function registrarVenta() {
		const { data, error } = await supabase
			.from<Venta>(Tables.ventas)
			.insert({
				nombre: orden.nombre,
				cantidad: 1,
				total: cantidad,
				tipo_de_pago: metodoDePago,
				facturado: facturado
			})
			.single();

		if (error) {
			await Swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'error'
			});
		}
		if (!data) {
			await Swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'error'
			});
		}
		await Swal.fire({
			title: 'Pago realizado',
			text: 'El pago se ha realizado correctamente',
			icon: 'success'
		});
	}
</script>

<h1 class="text-dark mb-4">Pagar orden</h1>
<h3>Cliente: {orden.nombre}</h3>

<ul>
	<li>Anticipo: {orden.anticipo}</li>
	<li>Restante: {total - orden.anticipo}</li>
	<li>Total: {orden.total}</li>
</ul>

<form method="POST">
	<div class="w-50">
		<div class="mb-3">
			<label for="" class="form-label">Metodo de pago</label>
			<select class="form-select" bind:value={metodoDePago} name="metodoDePago">
				{#each Object.values(MetodosDePago) as value}
					<option {value}>{value}</option>
				{/each}
			</select>
		</div>
		<label for="" class="form-label">Facturado</label>
		<select class="form-select mb-3" bind:value={facturado} name="facturado">
			<option value={false} selected>No</option>
			<option value={true}>Sí</option>
		</select>
		<div class="mb-3">
			<label for="cantidadDePago" class="form-label">Cantidad</label>
			<input
				type="number"
				class="form-control"
				name="cantidadDePago"
				id="cantidadDePago"
				aria-describedby="cantidadDePago"
				placeholder="0.0"
				min="0"
				bind:value={cantidad}
			/>
			<small id="cantidadDePago" class="form-text text-muted">Ingresa la cantidad de pago</small>
		</div>
		<button type="button" class="btn btn-primary" on:click={realizarPago}>Realizar Pago</button>
	</div>
</form>
