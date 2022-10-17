<script lang="ts">
	import { gananciasTotales } from '$lib/stores';
	import DashboardCard from '$lib/components/card/DashboardCard.svelte';
	import ChartCard from '$lib/components/charts/ChartCard.svelte';
	import ClientesFrecuentesTable from '$lib/components/tables/ClientesFrecuentesTable.svelte';
	import PastelesVendidosTable from '$lib/components/tables/PastelesVendidosTable.svelte';
	import { months } from '$lib/constants';
	import { Estados, type Orden, type Venta } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import { formatCurrency } from '$lib/utils';
	import type { PageData } from '.svelte-kit/types/src/routes/(dashboard)/$types';
	import { onMount } from 'svelte';

	export let data: PageData;

	let ordenes: Orden[];
	let ventas: Venta[];

	let ordenesCompletas: number = 0;
	let ganancias: number = 0;

	let fechaInicial: HTMLInputElement;
	let fechaFinal: HTMLInputElement;

	let ventasChart: { data: number[]; labels: string[] } = {
		data: [],
		labels: []
	};

	onMount(async () => {
		ventas = data.ventas ? data.ventas : [];
		ordenes = data.ordenes ? data.ordenes : [];
		setFechas();
		setData();
		setChartData();
	});

	function setChartData() {
		// ventas por mes
		ventasChart.data = new Array(12).fill(0);
		ventas.forEach((venta) => {
			ventasChart.data[new Date(venta.created_at).getMonth()] += venta.total;
		});
	}

	function setFechas() {
		// Generate date 1 year ago
		const date = new Date();
		date.setFullYear(date.getFullYear() - 1);
		const yearAgo = date.toISOString().split('T')[0];

		const now = new Date().toISOString().split('T')[0];
		fechaFinal.value = now;
		fechaInicial.value = yearAgo;
	}

	function setData() {
		ganancias = 0;
		if (ventas && ventas.length > 0) {
			ventas.forEach((venta) => {
				ganancias += venta.total;
			});
		}

		if (ordenes && ordenes.length > 0) {
			ordenesCompletas = ordenes.filter((orden) => orden.estado === Estados.terminado).length;
		}

		gananciasTotales.update((n) => formatCurrency(ganancias));
	}

	async function fetchData() {
		ventas = await fetchVentas();
		ordenes = await fetchOrdenes();
		setData();
	}

	async function fetchVentas(): Promise<Venta[]> {
		const data = await fetch(
			'/api/ventas?fechaInicial=' + fechaInicial.value + '&fechaFinal=' + fechaFinal.value
		);
		const ventas: Venta[] = await data.json();
		return ventas;
	}

	async function fetchOrdenes(): Promise<Orden[]> {
		// If dates are not set
		if (fechaInicial.valueAsDate === null || fechaFinal.valueAsDate === null) {
			return [] as Orden[];
		}
		// Get ordenes from supabase
		const { data, error } = await supabase
			.from<Orden>('ordenes')
			.select('*')
			.lt('created_at', fechaFinal.valueAsDate?.toISOString())
			.gt('created_at', fechaInicial.valueAsDate?.toISOString());
		if (error) {
			return [] as Orden[];
		}
		return data;
	}
</script>

<div class="d-sm-flex justify-content-between align-items-center mb-4">
	<h3 class="text-dark mb-0">Dashboard</h3>
	<a class="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="#!"
		><i class="fas fa-download fa-sm text-white-50" />&nbsp;Generate Report</a
	>
</div>
<div class="row">
	<div class="col mb-3">
		<label for="fechaInicial" class="form-label">Fecha Inicial</label>
		<input
			type="date"
			class="form-control"
			name="fechaInicial"
			id="fechaInicial"
			aria-describedby="helpId"
			bind:this={fechaInicial}
			on:change={fetchData}
		/>
	</div>
	<div class="col mb-3">
		<label for="fechaFinal" class="form-label">Fecha Final</label>
		<input
			type="date"
			class="form-control"
			name="fechaFinal"
			id="fechaFinal"
			aria-describedby="helpId"
			placeholder=""
			bind:this={fechaFinal}
			on:change={fetchData}
		/>
	</div>
</div>
<div class="row">
	<div class="col-md-6 col-xl-3 mb-4">
		<DashboardCard
			title="Ganancias totales"
			data={formatCurrency(ganancias)}
			icon="fas fa-calendar"
		/>
	</div>
	<div class="col-md-6 col-xl-3 mb-4">
		<DashboardCard title="Ordenes completas" data={ordenesCompletas} icon="fas fa-dollar-sign" />
	</div>
	<div class="col-md-6 col-xl-3 mb-4">
		{#if ordenes && ventas}
			<DashboardCard
				title="Ventas totales"
				data={ordenes.length + ventas.length}
				icon="fas fa-dollar-sign"
			/>
		{:else}
			<DashboardCard title="Ventas totales" data={0} icon="fas fa-dollar-sign" />
		{/if}
	</div>
	<div class="col-md-6 col-xl-3 mb-4">
		<div class="card shadow border-start-warning py-2">
			<div class="card-body">
				<div class="row align-items-center no-gutters">
					<div class="col me-2">
						<div class="text-uppercase text-warning fw-bold text-xs mb-1">
							<span>Ordenes Completas</span>
						</div>
						<div class="text-dark fw-bold h5 mb-0"><span>{ordenesCompletas}</span></div>
					</div>
					<div class="col-auto"><i class="fas fa-comments fa-2x text-gray-300" /></div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- Ganancias Diarias -->
<div class="row">
	<div class="col-lg-7 col-xl-8">
		<ChartCard
			title="Ganancias Diarias"
			width={16}
			height={5}
			type="bar"
			label="Ganancias"
			labels={months}
			info={ventasChart.data}
		/>
	</div>
	<div class="col-lg-5 col-xl-4">
		<PastelesVendidosTable />
	</div>
</div>
<!-- End: Chart -->
<div class="row">
	<div class="col-lg-6 mb-4">
		<ClientesFrecuentesTable />
	</div>
	<div class="col">
		<div class="row">
			<div class="col-lg-6 mb-4">
				<div class="card text-white bg-primary shadow">
					<div class="card-body">
						<p class="m-0">Primary</p>
						<p class="text-white-50 small m-0">#4e73df</p>
					</div>
				</div>
			</div>
			<div class="col-lg-6 mb-4">
				<div class="card text-white bg-success shadow">
					<div class="card-body">
						<p class="m-0">Success</p>
						<p class="text-white-50 small m-0">#1cc88a</p>
					</div>
				</div>
			</div>
			<div class="col-lg-6 mb-4">
				<div class="card text-white bg-info shadow">
					<div class="card-body">
						<p class="m-0">Info</p>
						<p class="text-white-50 small m-0">#36b9cc</p>
					</div>
				</div>
			</div>
			<div class="col-lg-6 mb-4">
				<div class="card text-white bg-warning shadow">
					<div class="card-body">
						<p class="m-0">Warning</p>
						<p class="text-white-50 small m-0">#f6c23e</p>
					</div>
				</div>
			</div>
			<div class="col-lg-6 mb-4">
				<div class="card text-white bg-danger shadow">
					<div class="card-body">
						<p class="m-0">Danger</p>
						<p class="text-white-50 small m-0">#e74a3b</p>
					</div>
				</div>
			</div>
			<div class="col-lg-6 mb-4">
				<div class="card text-white bg-secondary shadow">
					<div class="card-body">
						<p class="m-0">Secondary</p>
						<p class="text-white-50 small m-0">#858796</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
