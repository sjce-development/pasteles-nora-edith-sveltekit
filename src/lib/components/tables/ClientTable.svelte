<script lang="ts">
	import type { Cliente } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	let clientes: Cliente[] = [];

	onMount(async () => {
		const { data, error } = await supabase.from('clientes').select('*');
		if (error) {
			alert(JSON.stringify(error, null, 2));
			return;
		}
		clientes = data;
	});
</script>

<div class="card shadow">
	<div class="card-header py-3">
		<p class="text-primary m-0 fw-bold">Clientes</p>
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
						<th class="fit">Nombre</th>
						<th class="fit">Telefono</th>
						<th class="fit">Correo</th>
						<th class="fit">Cliente desde</th>
						<th class="fit" />
					</tr>
				</thead>
				<tbody>
					{#each clientes as { nombre, telefono, correo, created_at }}
						<tr>
							<td class="fit">{nombre}</td>
							<td class="fit">{telefono}</td>
							<td class="fit">{correo.length !== 0 ? correo : 'n/a'}</td>
							<td class="fit"
								>{new Date(created_at ?? '')
									.toLocaleString('es-MX', { dateStyle: 'long' })
									.split(',')[0]}</td
							>
							<td class="fit">
								<button class="btn btn-primary btn-sm" type="button">
									<i class="fa-solid fa-pencil" />
								</button>
								<button class="btn btn-primary btn-sm" type="button"
									><i class="fa-solid fa-cart-shopping" /></button
								>
								<button class="btn btn-danger btn-sm" type="button"
									><i class="fa-solid fa-trash" /></button
								>
							</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<td><strong>Nombre</strong></td>
						<td><strong>Telefono</strong></td>
						<td><strong>Correo</strong></td>
						<td><strong>Cliente desde</strong></td>
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

<style>
	.table td.fit,
	.table th.fit {
		white-space: nowrap;
		width: 1%;
	}
</style>
