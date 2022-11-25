<script lang="ts">
	import type { Cliente, Orden } from '$lib/models';
	import EditClientModal from '$lib/components/modals/EditClientModal.svelte';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';
	import { goto } from '$app/navigation';

	let clientes: Cliente[] = [];
	let ordenes: Orden[] = [];
	onMount(async () => {
		clientes = await fetchClientes();
		ordenes = await fetchOrdenes();
		clientes.forEach((cliente, i) => {
			clientes[i].cantidad_ordenes = ordenes.filter((orden) => orden.telefono === cliente.telefono).length;
		});
	});

	async function fetchClientes(): Promise<Cliente[]> {
		const { data, error } = await supabase.from<Cliente>('clientes').select('*');
		if (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Algo salió mal al cargar los clientes'
			});
			return [] as Cliente[];
		}
		return data;
	}

	async function fetchOrdenes(): Promise<Orden[]> {
		const { data, error } = await supabase.from<Orden>('ordenes').select('*');
		if (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Algo salió mal al cargar las ordenes'
			});
			return [] as Orden[];
		}
		return data;
	}
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
						<th class="fit">Cantidad de ordenes</th>
						<th class="fit" />
					</tr>
				</thead>
				<tbody>
					{#each clientes as cliente}
						<tr>
							<td class="fit">{cliente.nombre}</td>
							<td class="fit">{cliente.telefono}</td>
							<td class="fit">{cliente.correo.length !== 0 ? cliente.correo : 'n/a'}</td>
							<td class="fit"
								>{new Date(cliente.created_at ?? '')
									.toLocaleString('es-MX', { dateStyle: 'long' })
									.split(',')[0]}</td
							>
							<td class="fit">{cliente.cantidad_ordenes}</td>
							<td class="fit">
								<button
									class="btn btn-primary btn-sm"
									type="button"
									data-bs-toggle="modal"
									data-bs-target="#editClientModal{cliente.id}"
								>
									<i class="fa-solid fa-pencil" />
								</button>
								<button class="btn btn-primary btn-sm" type="button"
									on:click={() => {goto(`clientes/${cliente.id}`)}}>
									<i class="fa-solid fa-cart-shopping" /></button
								>
								<button class="btn btn-danger btn-sm" type="button"
									><i class="fa-solid fa-trash" /></button
								>
							</td>
						</tr>
						<EditClientModal {cliente} />
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
