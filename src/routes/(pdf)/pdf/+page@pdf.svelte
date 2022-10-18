<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/utils';
	import type { PageData } from '.svelte-kit/types/src/routes/(dashboard)/$types';
	import { onMount } from 'svelte';

	export let data: PageData;

	onMount(() => {
		print();
	});
</script>

<div class="table-responsive">
	<table class="table table-primary">
		<thead>
			<tr>
				<th>Nombre</th>
				<th>Tamaño</th>
				<th>Pan</th>
				<th>Relleno</th>
				<th>Decorado</th>
				<th>Anticipo</th>
				<th>Restante</th>
				<th>Pagado</th>
				<th>Entrega</th>
			</tr>
		</thead>
		<tbody>
			{#each data.ordenes as orden}
				<tr class="">
					<td>{orden.nombre}</td>
					<td>{orden.tamano}</td>
					<td>{orden.pan}</td>
					<td>{orden.relleno}</td>
					<td>{orden.decorado}</td>
					<td>{orden.anticipo}</td>
					<td>{orden.total || 0 - orden.anticipo}</td>
					<td>{orden.pagado ? "Sí" : "No"}</td>
					<td>{formatDate(orden.hora_de_entrega)}</td>
				</tr>
			{:else}
				<tr>
					<td colspan="8">No hay ordenes</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
