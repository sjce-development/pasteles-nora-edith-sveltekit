<script lang="ts">
	import type { ChartConfig, Orden, Venta } from '$lib/models';
	import { locale, months } from '$lib/constants';
	import { supabase } from '$lib/supabase';
	import { colors } from '$lib/constants';
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import Utils from '$lib/utils';

	let unique = {};

	let title: string = 'Ganancias Mensuales';

	let fechaInicialElement: HTMLInputElement;
	let fechaFinalElement: HTMLInputElement;

	let fechaInicial: Date = new Date();
	let fechaFinal: Date = new Date();

	let config: ChartConfig;

	let labels: string[] = [];
	let parsedData: Map<string, number> = new Map<string, number>();

	let ordenes: Orden[] = [];
	let ventas: Venta[] = [];

	onMount(async () => {
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

	function diff(from: string, to: string) {
		let arr = [];
		from = `${Utils.translateMonthName(from.split(' ')[0])} ${from.split(' ')[1]}`;
		to = `${Utils.translateMonthName(to.split(' ')[0])} ${to.split(' ')[1]}`;
		let datFrom = new Date('1 ' + from);
		let datTo = new Date('1 ' + to);

		console.log(datFrom, datTo);

		let fromYear = datFrom.getFullYear();
		let toYear = datTo.getFullYear();
		let diffYear = 12 * (toYear - fromYear) + datTo.getMonth();

		for (let i = datFrom.getMonth(); i <= diffYear; i++) {
			arr.push(months[i % 12] + ' ' + Math.floor(fromYear + i / 12));
		}

		return arr;
	}

	function setLabels() {
		fechaInicial.setHours(0, 0, 0, 0);
		fechaInicial.setDate(1);

		fechaFinal.setHours(23, 59, 59, 999);
		fechaFinal.setDate(0);
		fechaFinal.setMonth(fechaFinal.getMonth() + 1);

		let inicio = `${Utils.capitalize(
			fechaInicial.toLocaleString(locale, { month: 'long' })
		)} ${fechaInicial.toLocaleString(locale, { year: 'numeric' })}`;
		let fin =
			Utils.capitalize(fechaFinal.toLocaleString(locale, { month: 'long' })) +
			' ' +
			fechaFinal.toLocaleString(locale, { year: 'numeric' });
		labels = diff(inicio, fin);
	}

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

	function parseData() {
		parsedData.clear();

		if (labels.length === 1) {
			parsedData.set(labels[0], 0);
		} else {
			labels.forEach((label) => {
				parsedData.set(label, 0);
			});
		}

		const items = [...ordenes, ...ventas];
		const item0 = items[0];
		parsedData.forEach((value: number, key: string) => {
			items.forEach((item: Orden | Venta) => {
				if (item.created_at === undefined || item.total === undefined) {
					return;
				}
				if (generateLabel(item.created_at) !== key) {
					return;
				}
				const pdValue = parsedData.get(key) ?? 0;
				parsedData.set(key, pdValue + item.total);
			});
		});
	}

	async function setChartConfig() {
		let info = Array.from(parsedData.values());
		let dataset = {
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
			console.error(error);
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
			console.error(error);
			return;
		}
		ventas = data;
	}

	async function handleDateChange() {
		if (fechaInicialElement.valueAsDate === null || fechaFinalElement.valueAsDate === null) {
			return;
		}

		if (fechaInicialElement.valueAsDate > fechaFinalElement.valueAsDate) {
			let temp = fechaInicial;
			fechaInicial = fechaFinal;
			fechaFinal = temp;

			fechaInicialElement.valueAsDate = fechaInicial;
			fechaFinalElement.valueAsDate = fechaFinal;
		}

		fechaInicial.setFullYear(parseInt(fechaInicialElement.value.split('-')[0]));
		fechaInicial.setMonth(parseInt(fechaInicialElement.value.split('-')[1]) - 1);

		fechaFinal.setFullYear(parseInt(fechaFinalElement.value.split('-')[0]));
		fechaFinal.setMonth(parseInt(fechaFinalElement.value.split('-')[1]) - 1);

		setLabels();
		await fetchOrdenes();
		await fetchVentas();
		parseData();
		setChartConfig();

		// This resets the component
		unique = {};
	}

	function handleChart(element: any, config: any) {
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
	}
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
