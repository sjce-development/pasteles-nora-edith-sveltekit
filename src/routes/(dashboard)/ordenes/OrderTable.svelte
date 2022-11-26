<script lang="ts">
	import { Estados, EstadosPago, type Orden } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import Utils from '$lib/utils';
	import Especificacion from '$lib/components/alerts/Especificacion.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import Swal from 'sweetalert2';
	import { pageSizes } from '$lib/constants';

	export let ordenes: Orden[] = [];
	export let pagination: {
		page: number;
		pageSize: number;
		from: number;
		to: number;
	};
	export let count: number;

	let selectedPageSize: number;

	function goToPdf() {
		const ordenesIds = ordenes.map((orden) => {
			if (orden.impreso === false) {
				return orden.id;
			}
		});
		if (ordenesIds[0] === undefined) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'No hay ordenes por imprimir',
			});
			return;
		}
		const url = `/pdf?ordenes=${ordenesIds.join(',')}`;
		if (browser) {
			// window.open(url, '_blank')?.focus();
			window.open(url, '_blank');
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

	async function marcarOrdenComoPagada(id: number): Promise<void> {
		const { isConfirmed } = await Swal.fire({
			title: '¿Estás seguro?',
			text: 'No podrás revertir esta acción',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí, marcar como pagado'
		});
		if (isConfirmed) {
			await supabase.from('ordenes').update({ estado: EstadosPago.pagado }).eq('id', id);
			window.location.reload();
		}
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
						>Mostrar <select
							class="d-inline-block form-select form-select-sm"
							bind:value={selectedPageSize}
						>
							{#each pageSizes as pageSize}
								<option value={pageSize} selected={pagination.pageSize === pageSize}
									>{pageSize}</option
								>
							{/each}
						</select>
						<a
							class="btn btn-primary"
							href="/ordenes?page={pagination.page}&pageSize={selectedPageSize}"
							role="button">Cambiar paginación</a
						>
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
						<th>Nombre</th>
						<th>Tamaño</th>
						<th>Harina</th>
						<th>Relleno</th>
						<th class="fit">Especificaciones</th>
						<th>Fecha de entrega</th>
						<th>Anticipo</th>
						<th>Restante</th>
						<th class="fit">Estado</th>
						<th class="fit">Pagado</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{#each ordenes as orden}
						<tr>
							<td class="fit">
								{#if orden.impreso}
									<i style="color: green" class="fa-solid fa-print" />
								{:else}
									<i style="color: orange" class="fa-solid fa-clock" />
								{/if}
							</td>
							<td>{Utils.formatPhoneNumber(orden.telefono)}</td>
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
									<span>✅</span>
								{:else if orden.estado === Estados.en_curso}
									<span>🕛</span>
								{:else}
									<span>❌</span>
								{/if}
							</td>
							<td>
								{#if orden.pagado}
									✅
								{:else}
									<span
										class="pointer"
										on:click={() => {
											marcarOrdenComoPagada(orden.id || -1);
										}}>❌</span
									>
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
					Mostrando {pagination.from === 0 ? 1 : pagination.from} a {pagination.to === 0
						? 1
						: pagination.to} de {count}
				</p>
			</div>
			<div class="col-md-6">
				<nav class="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
					<ul class="pagination">
						{#if pagination.page > 1}
							<li class="page-item">
								<a
									class="page-link"
									aria-label="Previous"
									href="/ordenes?page={pagination.page - 1}&pageSize={pagination.pageSize}"
								>
									<span aria-hidden="true">«</span>
								</a>
							</li>
							<li class="page-item">
								<a
									class="page-link"
									aria-label="Next"
									href="/ordenes?page={pagination.page - 1}&pageSize={pagination.pageSize}"
								>
									<span aria-hidden="true">{pagination.page - 1}</span>
								</a>
							</li>
						{/if}
						<li class="page-item">
							<a class="page-link active" href="/ordenes?page=${pagination.page}"
								>{pagination.page}</a
							>
						</li>
						{#if pagination.page * pagination.pageSize < count}
							<li class="page-item">
								<a
									class="page-link"
									aria-label="Next"
									href="/ordenes?page={pagination.page + 1}&pageSize={pagination.pageSize}"
									><span aria-hidden="true">{pagination.page + 1}</span></a
								>
							</li>
							<li class="page-item">
								<a
									class="page-link"
									aria-label="Next"
									href="/ordenes?page={pagination.page + 1}&pageSize={pagination.pageSize}"
									><span aria-hidden="true">»</span></a
								>
							</li>
						{/if}
					</ul>
				</nav>
			</div>
		</div>
	</div>
</div>
