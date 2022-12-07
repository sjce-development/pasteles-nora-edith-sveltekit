<script lang="ts">
	import type { Cliente, Pastel, UserProfile, Venta } from '$lib/models';
	import EditClientModal from '$lib/components/modals/EditClientModal.svelte';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import Utils from '$lib/utils';
	import { currentProfile } from '$lib/stores';

	type ParseData = {
		nombre: string;
		cantidad: number;
		total: number;
	};

	let ventas: Venta[] = [];
	let pasteles: Pastel[] = [];

	let parsedData: ParseData[] = [];

	let searchValue: string;
	let filteredParsedData: ParseData[] = [];

	let pageSize: number = 8;
	let pages: number;
	let currentPage: number = 1;

	let from: number;
	let to: number;

	

	onMount(async () => {
		await fetchVentas();
		await fetchPasteles();

		from = 1;
		to = pageSize;

		pasteles.forEach((pastel) => {
			parsedData.push({
				nombre: pastel.nombre,
				cantidad: 0,
				total: 0
			});
		});

		ventas.forEach((venta) => {
			parsedData.forEach((pastel) => {
				if (pastel.nombre === venta.nombre) {
					pastel.total += venta.total;
					pastel.cantidad += venta.cantidad;
				}
			});
		});

		// Sort parsed data by cantidad
		parsedData.sort((a, b) => b.cantidad - a.cantidad);
		filteredParsedData = [...parsedData];
		pages = Math.ceil(filteredParsedData.length / pageSize);
		spliceData();
	});

	async function fetchVentas() {
		const { data, error } = await supabase
			.from<Venta>('ventas')
			.select('*')
			.order('nombre', { ascending: false });
		if (error) throw Error(error.message);
		ventas = data;
	}

	async function fetchPasteles() {
		const { data, error } = await supabase
			.from('pasteles')
			.select('*')
			.order('nombre', { ascending: false });
		if (error) throw Error(error.message);
		pasteles = data;
	}

	async function handleSearch() {
		if (searchValue === '' || searchValue === undefined || searchValue === null) {
			filteredParsedData = [...parsedData];
			return;
		}
		filteredParsedData = parsedData.filter((pastel) =>
			pastel.nombre.toLowerCase().includes(searchValue.toLowerCase())
		);
		filteredParsedData = [...filteredParsedData];
		// spliceData();
	}

	async function handleChangePage(direction: number) {
		switch (direction) {
			case 1: {
				if (currentPage === pages) return;
				currentPage++;
				from = (currentPage - 1) * pageSize;
				to = currentPage * pageSize;
				spliceData();
				break;
			}
			case -1: {
				currentPage--;
				if (currentPage === 1) return;
				if (currentPage === pages - 1) {
					from = (currentPage - 1) * pageSize;
					to = currentPage * pageSize;
					spliceData();
					return;
				}
				from = from - pageSize;
				to = to - pageSize;
				spliceData();
				return;
			}
		}
		if (to > pasteles.length) {
			to = pasteles.length;
		}
		if (from === 0) {
			from = 1;
		}
		spliceData();
	}

	function spliceData() {
		filteredParsedData = parsedData.slice(from, to);
	}
</script>

<div class="card shadow">
	<div class="d-flex card-header pt-3">
		<p class="text-primary m-0 fw-bold">Pasteles Vendidos</p>
		<input
			type="text"
			class="form-control"
			placeholder="Buscar"
			bind:value={searchValue}
			on:keyup={handleSearch}
		/>
	</div>
	<div class="card-body pt-0">
		<div class="table-responsive table mt-2" role="grid">
			<table class="table my-0">
				<thead>
					<tr>
						<th class="fit">Nombre</th>
						<th class="fit">Cantidad</th>
						<th class="fit">Total</th>
					</tr>
				</thead>
				<tbody class="no-overflow">
					{#each filteredParsedData as data}
						<tr>
							<td class="fit">{data.nombre}</td>
							<td class="fit">{data.cantidad}</td>
							<td class="fit">{Utils.formatCurrency(data.total)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div class="row">
			<div class="col-md-6 align-self-center">
				<p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">
					Showing {from} to {to} of {pasteles.length}
				</p>
			</div>
			<div class="col-md-6">
				<nav class="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
					<ul class="pagination">
						{#if currentPage > 1}
							<!-- <li class="page-item" disabled={currentPage === 1}>
								<button
									class="page-link"
									aria-label="Previous"
									on:click={() => {
										handleChangePage(-1);
									}}><span aria-hidden="true">«</span></button
								>
							</li> -->
							<li class="page-item">
								<button
									class="page-link"
									on:click={() => {
										handleChangePage(-1);
									}}>{currentPage - 1}</button
								>
							</li>
						{/if}
						<li class="page-item"><span class="page-link">{currentPage}</span></li>
						{#if currentPage < pages}
							<li class="page-item">
								<button
									class="page-link"
									on:click={() => {
										handleChangePage(1);
									}}>{currentPage + 1}</button
								>
							</li>
							<!-- <li class="page-item">
								<button
									class="page-link"
									aria-label="Next"
									on:click={() => {
										handleChangePage(1);
									}}><span aria-hidden="true">»</span></button
								>
							</li> -->
						{/if}
					</ul>
				</nav>
			</div>
		</div>
	</div>
</div>
