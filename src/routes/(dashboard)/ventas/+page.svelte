<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Venta } from '$lib/models';
	import Utils from '$lib/utils';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let ventas: Venta[] = data.ventas;
	let fecha: Date = data.date;
	let fechaElement: HTMLInputElement;

	onMount(function () {
		fechaElement.value = Utils.formatDate(fecha);
		fechaElement.valueAsDate = fecha;
	});

	function handleOnFechaChange() {
		const url = new URL(window.location.href);
		url.searchParams.set('date', fechaElement.value);
		window.open(url, '_blank');
		window.location.reload();
	}
</script>

<h1>Ventas de hoy</h1>

<div class="card shadow">
	<div class="card-header pt-3 row">
		<div class="col">
			<input type="text" class="form-control" placeholder="Buscar" />
		</div>
		<div class="col">
			<button type="button" class="btn btn-primary">Limpiar busqueda</button>
		</div>
		<div class="col">
			<input
				type="date"
				class="form-control"
				bind:this={fechaElement}
				on:change={handleOnFechaChange}
			/>
		</div>
	</div>
	<div class="card-body pt-0">
		<div
			class="table-responsive table mt-2"
			id="dataTable"
			role="grid"
			aria-describedby="dataTable_info"
		>
			<table class="table my-0" id="dataTable">
				<thead>
					<tr>
						<th class="fit">Fecha</th>
						<th class="fit">Nombre</th>
						<th class="fit">Cantidad</th>
						<th class="fit">Total</th>
					</tr>
				</thead>
				<tbody>
					{#each ventas as venta}
						<tr>
							<td class="fit">{Utils.formatDate(venta.created_at)}</td>
							<td class="fit">{venta.nombre}</td>
							<td class="fit">{venta.cantidad}</td>
							<td class="fit">{Utils.formatCurrency(venta.total)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
