<script lang="ts">
	import type { PageData } from '.svelte-kit/types/src/routes/(dashboard)/$types';
	import ClientesFrecuentesTable from './ClientesFrecuentesTable.svelte';
	import PastelesVendidosTable from './PastelesVendidosTable.svelte';
	import GananciasMensuales from './GananciasMensuales.svelte';
	import { Estados, type Orden, type Venta } from '$lib/models';
	import DashboardCard from './DashboardCard.svelte';
	import { gananciasTotales } from '$lib/stores';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import Utils from '$lib/utils';

	export let data: PageData;

	let ordenes: Orden[] = [];
	let ventas: Venta[] = [];

	let ordenesCompletas: number = 0;
	let ganancias: number = 0;

	let fechaInicial: HTMLInputElement;
	let fechaFinal: HTMLInputElement;

	onMount(async () => {
		ventas = data.ventas;
		ordenes = data.ordenes;
		setData();
	});

	function setFechas() {
		const date = new Date();
		date.setFullYear(date.getFullYear() - 1);
		const yearAgo = date.toISOString().split('T')[0];

		const now = new Date().toISOString().split('T')[0];
		fechaFinal.value = now;
		fechaInicial.value = yearAgo;
	}

	function setData() {
		setFechas();
		ganancias = 0;

		getGanancias();

		if (ordenes && ordenes.length > 0) {
			ordenesCompletas = ordenes.filter((orden) => orden.estado === Estados.terminado).length;
		}

		gananciasTotales.update((n) => {
			return Utils.formatCurrency(ganancias);
		});
	}

	function getGanancias() {
		const items = [...ventas, ...ordenes];

		items.forEach((item: Venta | Orden) => {
			const total = item.total || 0;
			ganancias += total;
		});
	}

	async function fetchData() {
		ventas = await fetchVentas();
		ordenes = await fetchOrdenes();
		setData();
	}

	async function fetchVentas(): Promise<Venta[]> {
		// console.log(`Fecha Inicial: ${fechaInicial.value} | Fecha Final: ${fechaFinal.value}`);
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

<main>
	<section class="d-sm-flex justify-content-between align-items-center mb-4">
		<h3 class="text-dark mb-0">Dashboard</h3>
		<!-- <a class="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="#!">
			<i class="fas fa-download fa-sm text-white-50" />&nbsp;Generate Report
		</a> -->
	</section>
	<section class="row">
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
	</section>
	<!-- Tarjetas -->
	<section class="row">
		<div class="col-md-6 col-xl-3 mb-4">
			<DashboardCard
				title="Ganancias totales"
				data={Utils.formatCurrency(ganancias)}
				icon="fas fa-calendar"
			/>
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
			<DashboardCard title="Ordenes completas" data={ordenesCompletas} icon="fas fa-dollar-sign" />
		</div>
		<div class="col-md-6 col-xl-3 mb-4">
			<DashboardCard title="Ordenes totales" data={ordenes.length} icon="fas fa-dollar-sign" />
		</div>
	</section>
	<!-- Ganancias Diarias -->
	<section class="row">
		<div class="col-lg-7 col-xl-8">
			<GananciasMensuales />
		</div>
		<div class="col-lg-5 col-xl-4">
			<PastelesVendidosTable />
		</div>
	</section>
	<!-- End: Chart -->
	<section class="row">
		<div class="col">
			<ClientesFrecuentesTable />
		</div>
	</section>
</main>
