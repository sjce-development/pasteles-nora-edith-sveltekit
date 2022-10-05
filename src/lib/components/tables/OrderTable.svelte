<script lang="ts">
	import type { Orden } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import { formatCurrency } from '$lib/utils';
	import { onMount } from 'svelte';

	let ordenes: Orden[] = [];

	onMount(async () => {
		const { data, error } = await supabase.from<Orden>('ordenes').select('*');
		if (error) {
			console.log(error);
			return;
		}
		ordenes = data;
	});
</script>

<div class="card shadow">
	<div class="card-header py-3">
		<p class="text-primary m-0 fw-bold">Ordenes</p>
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
						<th>Nombre</th>
						<th>Tamaño</th>
						<th>Pan</th>
						<th>Relleno</th>
						<th>Especificaciones</th>
						<th>Anticipo</th>
						<th>Restante</th>
						<th>Pagado</th>
					</tr>
				</thead>
				<tbody>
					{#each ordenes as { nombre, tamano, pan, relleno, especificaciones, anticipo, restante, pagado }}
						<td>{nombre}</td>
						<td>{tamano}</td>
						<td>{pan}</td>
						<td>{relleno}</td>
						<td class="fit">
							{#each especificaciones as especificacion}
								<div class="alert alert-primary py-0 px-1 d-inline" role="alert">
									<strong>{especificacion}</strong>
								</div>
							{/each}
						</td>
						<td>{formatCurrency(anticipo)}</td>
						<td>{formatCurrency(restante)}</td>
						<td>{pagado ? '✅' : '❌'}</td>
					{/each}
					<tr>
						<td>Airi Satou</td>
						<td>6</td>
						<td>Chocolate</td>
						<td>Chocolate</td>
						<td class="fit">
							<div class="alert alert-primary py-0 px-1 d-inline" role="alert">
								<strong>Foto</strong>
							</div>
							<div class="alert alert-primary py-0 px-1 d-inline" role="alert">
								<strong>Foto</strong>
							</div>
							<div class="alert alert-primary py-0 px-1 d-inline" role="alert">
								<strong>Foto</strong>
							</div>
							<div class="alert alert-primary py-0 px-1 d-inline" role="alert">
								<strong>Foto</strong>
							</div>
							<div class="alert alert-primary py-0 px-1 d-inline" role="alert">
								<strong>Foto</strong>
							</div>
						</td>
						<td>$200</td>
						<td>$0</td>
						<td>✅</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<td><strong>Name</strong></td>
						<td><strong>Position</strong></td>
						<td><strong>Office</strong></td>
						<td><strong>Age</strong></td>
						<td><strong>Start date</strong></td>
						<td><strong>Salary</strong></td>
					</tr>
				</tfoot>
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
