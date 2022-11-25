<script lang="ts">
	import { Estados, type Cliente, type Orden } from '$lib/models';
	import Utils from '$lib/utils';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Especificacion from '$lib/components/alerts/Especificacion.svelte';
	import Swal from 'sweetalert2';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	export let data: PageData;

	let cliente: Cliente = {} as Cliente;
	let ordenes: Orden[] = [] as Orden[];

	onMount(async () => {
		cliente = data.cliente;
	});

	async function goToOrden(id: number): Promise<void> {
		if (id === -1) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'No se pudo encontrar la orden'
			});
			return;
		}
		goto(`/ordenes/${id}`);
	}

	async function deleteOrden(id: number): Promise<void> {
		// Ask for confirmation
		const { isConfirmed } = await Swal.fire({
			title: '¿Estás seguro?',
			text: 'No podrás revertir esta acción',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar'
		});

		if (isConfirmed == false) {
			return;
		}

		const { error } = await supabase.from<Orden>('ordenes').delete().match({ id });
		if (error) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'No se pudo eliminar la orden'
			}).then(() => {
				return;
			});
		}
		Swal.fire({
			icon: 'success',
			title: 'Orden eliminada',
			text: 'La orden se ha eliminado correctamente'
		}).then(() => {
			goto('/ordenes');
		});
	}
</script>

<h1>Cliente: {cliente.nombre}</h1>
<h3><i class="fa-solid fa-phone" />:{cliente.telefono}</h3>

<div class="card shadow">
	<div class="card-header py-3">
		<span class="text-primary m-0 fw-bold">Ordenes</span>
	</div>
	<div class="card-body">
		<div
			class="table-responsive table mt-2"
			id="dataTable"
			role="grid"
			aria-describedby="dataTable_info"
		>
			<table class="table my-0" id="dataTable">
				<thead>
					<tr>
						<th class="fit">Impreso</th>
						<th>Telefono</th>
						<th>Nombre</th>
						<th>Tamaño</th>
						<th>Harina</th>
						<th>Relleno</th>
						<th>Especificaciones</th>
						<th>Fecha de entrega</th>
						<th>Anticipo</th>
						<th>Restante</th>
						<th class="fit">Pagado</th>
						<th class="fit">Estado</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{#each ordenes as orden}
						<tr>
							<td class="fit">
								{#if orden.impreso}
									<i
										style="color: green"
										class="fa-solid fa-print"
										data-bs-toggle="tooltip"
										data-bs-title="Default tooltip"
									/>
								{:else}
									<i style="color: orange" class="fa-solid fa-clock" />
								{/if}
							</td>
							<td>{orden.telefono}</td>
							<td>{orden.nombre}</td>
							<td>{orden.tamano}</td>
							<td>{orden.harina}</td>
							<td>{orden.relleno}</td>
							<td class="fit">
								{#each orden.decorado as especificacion}
									<Especificacion {especificacion} />
								{/each}
							</td>
							<td class="fit">{Utils.formatDate(orden.hora_de_entrega)}</td>
							<td>{Utils.formatCurrency(orden.anticipo)}</td>
							<td>{Utils.formatCurrency((orden.total || 0) - orden.anticipo)}</td>

							<td>
								{#if orden.estado === Estados.terminado}
									✅
								{:else if orden.estado === Estados.en_curso}
									🕛
								{:else}
									❌
								{/if}
							</td>
							<td>
								{#if orden.pagado}
									✅
								{:else}
									❌
								{/if}
							</td>
							<td class="fit">
								<button
									class="btn btn-primary btn-sm"
									type="button"
									on:click={() => goToOrden(orden.id || -1)}
								>
									<i class="fas fa-edit" />
								</button>
								<button
									class="btn btn-danger btn-sm"
									type="button"
									on:click={() => deleteOrden(orden.id || -1)}
								>
									<i class="fas fa-trash" />
								</button>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="12" class="text-center"> No hay ordenes </td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
