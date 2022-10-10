<script lang="ts">
	import Chart from '$lib/components/charts/Chart.svelte';
	import type { ChartConfig, ChartDataset } from '$lib/models';
	import { onMount } from 'svelte';
	import { Line } from 'svelte-chartjs';

	export let title: string;

	export let width: number;
	export let height: number;

	export let type: string;
	export let labels: string[];
	export let info: number[] | number[][];

	let fechaInicial: string = new Date().toLocaleDateString('es-MX');
	let fechaFinal: string = new Date().toLocaleDateString('es-MX');

	let config: ChartConfig;

	onMount(() => {
		const datasets: ChartDataset[] = info.map((iData, index) => {
				return {
					labels: labels[index],
					data: iData,
					borderColor: `hsl(${index * 360}, 70%, 50%)`,
					backgroundColor: `hsl(${index * 360}, 70%, 50%)`
				};
			}),
			config = {
				type,
				data: {
					labels,
					datasets
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
		<div class="dropdown no-arrow">
			<button
				class="btn btn-link btn-sm dropdown-toggle"
				aria-expanded="false"
				data-bs-toggle="dropdown"
				type="button"><i class="fas fa-ellipsis-v text-gray-600" /></button
			>
			<div class="dropdown-menu shadow dropdown-menu-end animated--fade-in">
				<p class="text-center dropdown-header">dropdown header:</p>
				<a class="dropdown-item" href="#!">&nbsp;Action</a><a class="dropdown-item" href="#!"
					>&nbsp;Another action</a
				>
				<div class="dropdown-divider" />
				<a class="dropdown-item" href="#!">&nbsp;Something else here</a>
			</div>
		</div>
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
					<small id="fechaInicial" class="text-muted">Fecha Inicial</small>
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
					<small id="fechaFinal" class="text-muted">Fecha Final</small>
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
