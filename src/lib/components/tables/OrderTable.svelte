<script lang="ts">
	import { Estados, type Orden } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import { formatCurrency, formatDate } from '$lib/utils';
	import { onMount } from 'svelte';
	import Especificacion from '$lib/components/alerts/Especificacion.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { locale } from '$lib/constants';
	import Swal from 'sweetalert2';

	let ordenes: Orden[] = [];

	onMount(async () => {
		const { data, error } = await supabase.from<Orden>('ordenes').select('*');
		if (error) {
			return;
		}
		ordenes = data;
	});

	function goToPdf() {
		if (browser) {
			window.open('/pdf', '_blank')?.focus();
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
						>Show&nbsp;<select class="d-inline-block form-select form-select-sm">
							<option value="10" selected>10</option>
							<option value="25">25</option>
							<option value="50">50</option>
							<option value="100">100</option>
						</select>&nbsp;</label
					>
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
						<th>Nombre</th>
						<th>Tamaño</th>
						<th>Pan</th>
						<th>Relleno</th>
						<th>Especificaciones</th>
						<th>Fecha de entrega</th>
						<th>Anticipo</th>
						<th>Restante</th>
						<th class="fit">Pagado</th>
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
							<td>{orden.nombre}</td>
							<td>{orden.tamano}</td>
							<td>{orden.pan}</td>
							<td>{orden.relleno}</td>
							<td class="fit">
								{#each orden.decorado as especificacion}
									<Especificacion {especificacion} />
								{/each}
							</td>
							<td class="fit">{formatDate(orden.hora_de_entrega)}</td>
							<td>{formatCurrency(orden.anticipo)}</td>
							<td>{formatCurrency((orden.total || 0) - orden.anticipo)}</td>
							{#if orden.estado === Estados.terminado}
								<td>✅</td>
							{:else if orden.estado === Estados.en_curso}
								<td>🕛</td>
							{:else}
								<td>❌</td>
							{/if}
							<td class="fit">
								<button
									class="btn btn-primary btn-sm"
									type="button"
									on:click={() => goToOrden(orden.id || -1)}
								>
									<i class="fas fa-edit" />
								</button>
								<button class="btn btn-danger btn-sm" type="button">
									<i class="fas fa-trash" />
								</button>
							</td>
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
