<script lang="ts">
	import { goto } from '$app/navigation';
	import { Estados, type Orden } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import Utils from '$lib/utils';
	import type { PageData } from '.svelte-kit/types/src/routes/(dashboard)/$types';
	import { onMount } from 'svelte';

	export let data: PageData;

	onMount(async () => {
		await actualizarOrdenAImpresa(data.ordenes);
		print();
	});

	async function actualizarOrdenAImpresa(ordenes: Orden[]): Promise<Orden[]> {
		const { data, error } = await supabase
			.from<Orden>('ordenes')
			.update({ impreso: true, estado: Estados.en_curso })
			.in(
				'id',
				ordenes.map((orden) => orden.id)
			);
		if (error) {
			throw Error('Error al actualizar las ordenes');
		}
		return data;
	}
</script>
<div class="table-responsive">
	<table class="table table-primary">
		<thead>
			<tr>
				<th>Nombre</th>
				<th>Tamaño</th>
				<th>Harina</th>
				<th>Relleno</th>
				<th>Decorado</th>
				<th>Entrega</th>
			</tr>
		</thead>
		<tbody>
			{#each data.ordenes as orden}
				<tr class="">
					<td>{orden.nombre}</td>
					<td>{orden.tamano}</td>
					<td>{orden.harina}</td>
					<td>{orden.relleno}</td>
					<td>{orden.decorado}</td>
					<td
						>{Utils.formatHoraDeEntrega(orden.hora_de_entrega).substring(
							0,
							Utils.formatHoraDeEntrega(orden.hora_de_entrega).length - 3
						)}</td
					>
				</tr>
			{:else}
				<tr>
					<td colspan="8">No hay ordenes</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
