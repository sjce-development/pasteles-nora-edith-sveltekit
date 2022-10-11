<script lang="ts">
	import Chart from '$lib/components/charts/Chart.svelte';
	import { onMount } from 'svelte';

	import type { ChartConfig, ChartDataset } from '$lib/models';
	import { colors } from '$lib/constants';

	export let title: string;

	export let width: number;
	export let height: number;

	export let type: string;
	export let label: string;
	export let labels: string[];
	export let info: number[];

	let fechaInicial: Date = new Date();
	let fechaFinal: Date = new Date();

	let config: ChartConfig;

	onMount(() => {
		const dataset: ChartDataset = {
			label,
			data: info,
			borderColor: colors.primary,
			backgroundColor: colors.primary_transparent,
			borderWidth: 1
		};
		config = {
			type,
			data: {
				labels,
				datasets: [dataset]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true
					}
				},
				responsive: true
			}
		};
	});
</script>

<div class="card shadow mb-4">
	<div class="card-header d-flex justify-content-between align-items-center">
		<h6 class="text-primary fw-bold m-0">{title}</h6>
		<!-- <div class="dropdown no-arrow">
			<button
				class="btn btn-link btn-sm dropdown-toggle"
				aria-expanded="false"
				data-bs-toggle="dropdown"
				type="button"><i class="fas fa-ellipsis-v text-gray-600" /></button
			>
			<div class="dropdown-menu shadow dropdown-menu-end animated--fade-in">
				<p class="text-center dropdown-header">Actions</p>
				<a class="dropdown-item" href="#!">&nbsp;Action</a><a class="dropdown-item" href="#!"
					>&nbsp;Another action</a
				>
				<div class="dropdown-divider" />
				<a class="dropdown-item" href="#!">&nbsp;Something else here</a>
			</div>
		</div> -->
	</div>
	<div class="card-body">
		<div class="row">
			<div class="col">
				<div class="mb-3">
					<label for="fechaInicial" class="form-label">Fecha inicial</label>
					<input
						type="date"
						name="fechaInicial"
						id="fechaInicial"
						class="form-control"
						aria-describedby="fechaInicial"
						bind:value={fechaInicial}
					/>
				</div>
			</div>
			<div class="col">
				<div class="mb-3">
					<label for="fechaFinal" class="form-label">Fecha Final</label>
					<input
						type="date"
						name="fechaFinal"
						id="fechaFinal"
						class="form-control"
						aria-describedby="fechaFinal"
						bind:value={fechaFinal}
					/>
				</div>
			</div>
		</div>
		<div class="chart-area">
			{#if type === 'bar'}
				<Chart {width} {height} {config} />
			{:else if type === 'line'}
				<!-- <Line
					data={}
				/> -->
			{:else}
				<p>no chart</p>
			{/if}
		</div>
	</div>
</div>
