<script lang="ts">
	import type { Cliente, Orden } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	let ordenes: Orden[] = [];
	let clientes: Cliente[] = [];

	let parsedData: any[] = [];

	onMount(async () => {
		await fetchOrdenes();
		await fetchClientes();


		// Add name of client to parsed data
		clientes.forEach((cliente) => {
			parsedData.push({
				nombre: cliente.nombre,
				total: 0
			});
		});

		if (ordenes.length === 0) {
			return;
		}

		ordenes.forEach((orden: Orden) => {
			parsedData.forEach((cliente) => {
				if (cliente.nombre === orden.nombre) {
					cliente.total += 1;
				}
			});
		});

		// Sort parsed data by cantidad
		parsedData.sort((a, b) => b.total - a.total);

		// parsedData maximum length is 10
		parsedData = parsedData.slice(0, 10);

		parsedData = [...parsedData];
	});

	async function fetchOrdenes() {
		const { data, error } = await supabase
			.from<Orden>('ordenes')
			.select('*')
			.order('nombre', { ascending: false });
		if (error) throw Error(error.message);
		ordenes = data;
	}

	async function fetchClientes() {
		const { data, error } = await supabase
			.from('clientes')
			.select('*')
			.order('nombre', { ascending: false });
		if (error) throw Error(error.message);
		clientes = data;
	}
</script>

<div class="card shadow">
	<div class="card-header pt-3">
		<p class="text-primary m-0 fw-bold">Clientes frecuentes</p>
	</div>
	<div class="card-body pt-0">
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
						<th class="fit">Total</th>
					</tr>
				</thead>
				<tbody>
					{#each parsedData as data}
						<tr>
							<td class="fit">{data.nombre}</td>
							<td class="fit">{data.total}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
