<script lang="ts">
	import { Estados, type Orden } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import Utils from '$lib/utils';
	import { onMount } from 'svelte';
	import Especificacion from '$lib/components/alerts/Especificacion.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import Swal from 'sweetalert2';

	export let page: number;
	export let pageSize: number;

	let ordenes: Orden[] = [];

	let pagination = {
		page,
		pageSize,
		total: 0
	};

	onMount(async () => {
		const { from, to } = Utils.getPagination({ page, pageSize });
		console.log({from, to});
		const { data, error } = await supabase.from<Orden>('ordenes').select('*').range(from, to);
		if (error) {
			return;
		}
		ordenes = data;
	});

	function goToPdf() {
		const ordenesIds = ordenes.map((orden) => orden.id);
		const url = `/pdf?ordenes=${ordenesIds.join(',')}`;
		if (browser) {
			window.open(url, '_blank')?.focus();
		}
	}

	async function goToOrden(id: number): Promise<void> {
		if (id === -1) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'No se pudo encontrar la orden'
			}).then(() => {
				return;
			});
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

<div class="card shadow">
	<div class="card-header py-3">
		<span class="text-primary m-0 fw-bold">Ordenes</span>
		<span>
			<button class="btn btn-primary btn-sm" type="button" on:click={goToPdf}>
				<i class="fa-solid fa-print" /> Imprimir ordenes
			</button>
		</span>
	</div>
	<div class="card-body">
		<div class="row">
			<div class="col-md-6 text-nowrap">
				<div id="dataTable_length" class="dataTables_length" aria-controls="dataTable">
					<label class="form-label"
						>Show <select class="d-inline-block form-select form-select-sm" bind:value={pagination.pageSize}>
							<option value="10" selected>10</option>
							<option value="25">25</option>
							<option value="50">50</option>
							<option value="100">100</option>
						</select>
					</label>
				</div>
			</div>
			<div class="col-md-6">
				<div class="text-md-end dataTables_filter" id="dataTable_filter">
					<label class="form-label"
						><input
							type="search"
							class="form-control form-control-sm"
							aria-controls="dataTable"
							placeholder="Search"
						/></label
					>
				</div>
			</div>
		</div>
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
									<i style="color: green" class="fa-solid fa-print" data-bs-toggle="tooltip" data-bs-title="Default tooltip"/>
								{:else}
									<i style="color: orange" class="fa-solid fa-clock" />
								{/if}
							</td>
							<td>{orden.telefono}</td>
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
		<div class="row">
			<div class="col-md-6 align-self-center">
				<p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">
					Showing 1 to 10 of 27
				</p>
			</div>
			<div class="col-md-6">
				<nav class="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
					<ul class="pagination">
						<li class="page-item disabled">
							<a class="page-link" aria-label="Previous" href="#!"
								><span aria-hidden="true">«</span></a
							>
						</li>
						<li class="page-item active"><a class="page-link" href="#!">1</a></li>
						<li class="page-item"><a class="page-link" href="#!">2</a></li>
						<li class="page-item"><a class="page-link" href="#!">3</a></li>
						<li class="page-item">
							<a class="page-link" aria-label="Next" href="#!"><span aria-hidden="true">»</span></a>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	</div>
</div>
