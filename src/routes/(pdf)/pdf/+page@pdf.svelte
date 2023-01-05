<script lang="ts">
	import { Tables } from '$lib/constants';
	import type { Orden } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import Utils from '$lib/utils';
	import type { PageData } from '.svelte-kit/types/src/routes/(dashboard)/$types';
	import { onMount } from 'svelte';

	export let data: PageData;
	const ordenes = data.ordenes;

	onMount(() => {
		ordenes.forEach(async (orden) => {
			const peso = await getPesoFromOrden(orden);
			orden.peso = peso;
			console.log('peso', peso);
			return orden;
		});
	});

	async function getPesoFromOrden(orden: Orden) {
		const { data, error: err } = await supabase
			.from(Tables.especificaciones)
			.select('peso')
			.eq('nombre', orden.tamano)
			.eq('categoria', 'tamano')
			.single();

		if (err) {
			return 0;
		}

		if (data === null) {
			return 0;
		}

		return data.peso;
	}
</script>

<div class="table-responsive">
	<table class="table">
		<thead>
			<tr>
				<th>Nombre</th>
				<th>Tamaño</th>
				<th>Harina</th>
				<th>Peso</th>
				<th># de panes</th>
				<th>Relleno</th>
				<th>Decorado</th>
				<th class="fit w-25">Entrega</th>
			</tr>
		</thead>
		<tbody>
			{#each ordenes as orden}
				<tr>
					<td>{orden.nombre}</td>
					<td>{orden.tamano}</td>
					<td>{orden.harina}</td>
					<td>{orden.peso}g</td>
					<td>{orden.numero_de_panes}</td>
					<td>{orden.relleno}</td>
					<td>{orden.decorado}</td>
					<td>{Utils.formatHoraDeEntrega(orden.hora_de_entrega)}</td>
				</tr>
			{:else}
				<tr>
					<td colspan="8">No hay ordenes</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
