<script lang="ts">
	import type { Cliente, Pastel, Venta } from '$lib/models';
	import EditClientModal from '$lib/components/modals/EditClientModal.svelte';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import Utils from '$lib/utils';

	let ventas: Venta[] = [];
	let pasteles: Pastel[] = [];

	let parsedData: any[] = [];

	onMount(async () => {
		await fetchVentas();
		await fetchPasteles();

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

		parsedData = [...parsedData];
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
</script>

<div class="card shadow">
	<div class="card-header pt-3">
		<p class="text-primary m-0 fw-bold">Pasteles Vendidos</p>
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
						<th class="fit">Cantidad</th>
						<th class="fit">Total</th>
					</tr>
				</thead>
				<tbody>
					{#each parsedData as data}
						<tr>
							<td class="fit">{data.nombre}</td>
							<td class="fit">{data.cantidad}</td>
							<td class="fit">{Utils.formatCurrency(data.total)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
