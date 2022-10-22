<script lang="ts">
	import type { ChartConfig, ChartDataset, Orden, Venta } from '$lib/models';
	import { locale, months } from '$lib/constants';
	import { supabase } from '$lib/supabase';
	import { colors } from '$lib/constants';
	import Utils from '$lib/utils';
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';

	let unique = {};

	let title: string = 'Ganancias Mensuales';

	let fechaInicialElement: HTMLInputElement;
	let fechaFinalElement: HTMLInputElement;

	let fechaInicial: Date = new Date();
	let fechaFinal: Date = new Date();

	let config: ChartConfig;

	let dataset: ChartDataset;

	let labels: string[] = [];
	let parsedData: Map<string, number> = new Map<string, number>();

	let ordenes: Orden[] = [];
	let ventas: Venta[] = [];

	onMount(async () => {
		// Initialize correct dates to 1 year ago.
		fechaInicial.setFullYear(fechaInicial.getFullYear() - 1);
		fechaInicialElement.valueAsDate = fechaInicial;
		fechaFinalElement.valueAsDate = fechaFinal;

		// Set all labels for each month in timeframe, ej. Octubre 2021
		setLabels();

		// Get all ordenes from supabase
		await fetchOrdenes();

		// Get all ventas from supabase
		await fetchVentas();

		// Parse data from ordenes and ventas to a map.
		parseData();

		// Create chart config
		setChartConfig();
	});

	function setLabels() {
		function diff(from: string, to: string) {
			var arr = [];
			var datFrom = new Date('1 ' + from);
			var datTo = new Date('1 ' + to);
			var fromYear = datFrom.getFullYear();
			var toYear = datTo.getFullYear();
			var diffYear = 12 * (toYear - fromYear) + datTo.getMonth();

			for (var i = datFrom.getMonth(); i <= diffYear; i++) {
				arr.push(months[i % 12] + ' ' + Math.floor(fromYear + i / 12));
			}

			return arr;
		}

		// Add 7 hours to fechaInicial
		// to account for timezone
		fechaInicial.setHours(fechaInicial.getHours() + 7);
		fechaFinal.setHours(fechaFinal.getHours() + 7);

		let inicio =
			Utils.capitalize(fechaInicial.toLocaleString('default', { month: 'long' })) +
			' ' +
			fechaInicial.toLocaleString('default', { year: 'numeric' });

		let fin =
			Utils.capitalize(fechaFinal.toLocaleString('default', { month: 'long' })) +
			' ' +
			fechaFinal.toLocaleString('default', { year: 'numeric' });

		labels = diff(inicio, fin);
	}

	function parseData() {
		function generateLabel(venta: string) {
			let ventaString: string | string[] = new Date(venta).toLocaleString(locale, {
				month: 'long',
				year: 'numeric'
			});
			ventaString = ventaString
				.replace('de', '')
				.split(' ')
				.filter((venta) => venta !== '');
			return Utils.capitalize(ventaString[0]) + ' ' + ventaString[1];
		}
		// Order ventas by labels order
		labels.forEach((label: string) => {
			if (ventas.length === 0) return;
			ventas.forEach(({ created_at, total }: { created_at: string; total: number }) => {
				let itemLabel: string = generateLabel(created_at);
				if (itemLabel !== label) return;

				if (parsedData.get(itemLabel) === undefined) {
					let ventaValue = total;
					parsedData.set(itemLabel, ventaValue);
					return;
				} else {
					let ventaValue = parsedData.get(itemLabel);
					if (ventaValue === undefined) return;
					parsedData.set(itemLabel, ventaValue + total);
				}
			});

			// let venta = ventas.find((venta) => generateLabel(venta.created_at) === label);
			// if (venta) {
			// 	parsedData.push(venta.total);
			// } else {
			// 	parsedData.push(0);
			// }
			// if (ordenes && ordenes.length > 0) {
			// 	let orden = ordenes.find((orden) => generateLabel(orden.created_at ?? '') === label);
			// 	if (orden) {
			// 		parsedData.push(orden.total);
			// 	} else {
			// 		parsedData.push(0);
			// 	}
			// }
		});
	}

	async function setChartConfig() {
		let info = Array.from(parsedData.values());
		dataset = {
			label: 'Ganancias Mensuales',
			data: info,
			borderColor: colors.primary,
			backgroundColor: colors.primary_transparent,
			borderWidth: 1
		};

		config = {
			type: 'bar',
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
	}

	async function fetchOrdenes() {
		const { data, error } = await supabase
			.from('ordenes')
			.select('*')
			.gte('created_at', fechaInicial.toISOString())
			.lte('created_at', fechaFinal.toISOString())
			.order('created_at', { ascending: true });

		if (error) {
			console.log(error);
		} else {
			ordenes = data;
		}
	}

	async function fetchVentas() {
		const { data, error } = await supabase
			.from('ventas')
			.select('*')
			.gte('created_at', fechaInicial.toISOString())
			.lte('created_at', fechaFinal.toISOString())
			.order('created_at', { ascending: true });

		if (error) {
			console.log(error);
			return;
		}
		ventas = data;
	}

	async function handleDateChange() {
		unique = {};
		if (fechaInicialElement.valueAsDate === null || fechaFinalElement.valueAsDate === null) {
			return;
		}

		fechaInicial.setFullYear(parseInt(fechaInicialElement.value.split('-')[0]));
		fechaInicial.setMonth(parseInt(fechaInicialElement.value.split('-')[1]) - 1);

		fechaFinal.setFullYear(parseInt(fechaFinalElement.value.split('-')[0]));
		fechaFinal.setMonth(parseInt(fechaFinalElement.value.split('-')[1]) - 1);

		setLabels();
		await fetchOrdenes();
		await fetchVentas();
		setChartConfig();
		console.log(parsedData);
	}

	const handleChart = (element: any, config: any) => {
		let chart = new Chart(element, config);

		return {
			update(config: any) {
				chart.destroy();
				chart = new Chart(element, config);
			},
			destroy() {
				chart.destroy();
			}
		};
	};
</script>

<div class="card shadow mb-4">
	<div class="card-header d-flex justify-content-between align-items-center">
		<h6 class="text-primary fw-bold m-0">{title}</h6>
	</div>
	<div class="card-body">
		<div class="row">
			<div class="col">
				<div class="mb-3">
					<label for="fechaInicial" class="form-label">Fecha inicial</label>
					<input
						type="month"
						name="fechaInicial"
						id="fechaInicial"
						class="form-control"
						aria-describedby="fechaInicial"
						bind:this={fechaInicialElement}
						on:change={handleDateChange}
					/>
				</div>
			</div>
			<div class="col">
				<div class="mb-3">
					<label for="fechaFinal" class="form-label">Fecha Final</label>
					<input
						type="month"
						name="fechaFinal"
						id="fechaFinal"
						class="form-control"
						aria-describedby="fechaFinal"
						bind:this={fechaFinalElement}
						on:change={handleDateChange}
					/>
				</div>
			</div>
		</div>
		{#key unique}
			<div class="chart-area">
				<canvas id="gananciasMensualesChart" width="16" height="5" use:handleChart={config} />
			</div>
		{/key}
	</div>
</div>
