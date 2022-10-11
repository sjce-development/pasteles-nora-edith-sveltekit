<script lang="ts">
	import ChartCard from '$lib/components/charts/ChartCard.svelte';
	import { locale } from '$lib/constants';
	import type { Orden } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import { formatCurrency, months } from '$lib/utils';
	import { onMount } from 'svelte';

	let ganancias: number;
	let ordenes: Orden[];
	let ordenesCompletas: number;

	let fechaInicial: HTMLInputElement;
	let fechaFinal: HTMLInputElement;

	onMount(async () => {
		setFechas();
		await setData();
	});

	function setFechas() {
		const fechaInicialLS = localStorage.getItem('fechaInicial');
		const fechaFinalLS = localStorage.getItem('fechaFinal');
		if (fechaInicialLS) {
			fechaInicial.valueAsDate = new Date(fechaInicialLS);
			localStorage.setItem('fechaInicial', fechaInicial.value);
		} else {
			fechaInicial.valueAsDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
		}
		if (fechaFinalLS) {
			fechaFinal.valueAsDate = new Date(fechaFinalLS);
			localStorage.setItem('fechaFinal', fechaFinal.value);
		} else {
			fechaFinal.valueAsDate = new Date();
		}
	}

	async function setData() {
		ganancias = await fetchGanancias();
		ordenes = await fetchOrdenes();
		ordenesCompletas = ordenes.filter((orden) => orden.estado === 'terminado').length;
	}

	async function fetchGanancias(): Promise<number> {
		let sum: number = 0;
		const { data, error } = await supabase
			.from('ventas')
			.select('*')
			.lt('created_at', fechaFinal.valueAsDate?.toISOString())
			.gt('created_at', fechaInicial.valueAsDate?.toISOString());
		if (error) {
			return -1;
		}
		console.log(data);
		data.forEach((venta) => {
			sum += venta.total;
		});
		return sum;
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
			on:change={setData}
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
			on:change={setData}
		/>
	</div>
</div>
<div class="row">
	<div class="col-md-6 col-xl-3 mb-4">
		<div class="card shadow border-start-primary py-2">
			<div class="card-body">
				<div class="row align-items-center no-gutters">
					<div class="col me-2">
						<div class="text-uppercase text-primary fw-bold text-xs mb-1">
							<span>Ganancias totales</span>
						</div>
						<div class="text-dark fw-bold h5 mb-0"><span>{formatCurrency(ganancias)}</span></div>
					</div>
					<div class="col-auto"><i class="fas fa-calendar fa-2x text-gray-300" /></div>
				</div>
			</div>
		</div>
	</div>
	<div class="col-md-6 col-xl-3 mb-4">
		<div class="card shadow border-start-success py-2">
			<div class="card-body">
				<div class="row align-items-center no-gutters">
					<div class="col me-2">
						<div class="text-uppercase text-success fw-bold text-xs mb-1">
							<span>Earnings (annual)</span>
						</div>
						<div class="text-dark fw-bold h5 mb-0"><span>$215,000</span></div>
					</div>
					<div class="col-auto"><i class="fas fa-dollar-sign fa-2x text-gray-300" /></div>
				</div>
			</div>
		</div>
	</div>
	<div class="col-md-6 col-xl-3 mb-4">
		<div class="card shadow border-start-info py-2">
			<div class="card-body">
				<div class="row align-items-center no-gutters">
					<div class="col me-2">
						<div class="text-uppercase text-info fw-bold text-xs mb-1">
							<span>Tasks</span>
						</div>
						<div class="row g-0 align-items-center">
							<div class="col-auto">
								<div class="text-dark fw-bold h5 mb-0 me-3"><span>50%</span></div>
							</div>
							<div class="col">
								<div class="progress progress-sm">
									<!-- <div
										class="progress-bar bg-info"
										aria-valuenow="50"
										aria-valuemin="0"
										aria-valuemax="100"
										style="width: 50%;"
									>
										<span class="visually-hidden">50%</span>
									</div> -->
								</div>
							</div>
						</div>
					</div>
					<div class="col-auto"><i class="fas fa-clipboard-list fa-2x text-gray-300" /></div>
				</div>
			</div>
		</div>
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
<!-- Start: Chart -->
<div class="row">
	<div class="col-lg-7 col-xl-8">
		<ChartCard
			title="Ganancias Mensuales"
			width={16}
			height={5}
			type="bar"
			label="Ganancias"
			labels={months}
			info={[0, 10, 5, 2, 20, 30, 45, 50, 60, 70, 80, 90]}
		/>
	</div>
	<div class="col-lg-5 col-xl-4">
		<div class="card shadow mb-4">
			<div class="card-header d-flex justify-content-between align-items-center">
				<h6 class="text-primary fw-bold m-0">Revenue Sources</h6>
				<div class="dropdown no-arrow">
					<button
						class="btn btn-link btn-sm dropdown-toggle"
						aria-expanded="false"
						data-bs-toggle="dropdown"
						type="button"><i class="fas fa-ellipsis-v text-gray-400" /></button
					>
					<div class="dropdown-menu shadow dropdown-menu-end animated--fade-in">
						<p class="text-center dropdown-header">Actions</p>
						<a class="dropdown-item" href="#!">&nbsp;Action</a><a class="dropdown-item" href="#!"
							>&nbsp;Another action</a
						>
						<div class="dropdown-divider" />
						<a class="dropdown-item" href="#!">&nbsp;Something else here</a>
					</div>
				</div>
			</div>
			<div class="card-body">
				<div class="chart-area">
					<!-- <canvas data-bss-chart="{&quot;type&quot;:&quot;doughnut&quot;,&quot;data&quot;:{&quot;labels&quot;:[&quot;Direct&quot;,&quot;Social&quot;,&quot;Referral&quot;],&quot;datasets&quot;:[{&quot;label&quot;:&quot;&quot;,&quot;backgroundColor&quot;:[&quot;#4e73df&quot;,&quot;#1cc88a&quot;,&quot;#36b9cc&quot;],&quot;borderColor&quot;:[&quot;#ffffff&quot;,&quot;#ffffff&quot;,&quot;#ffffff&quot;],&quot;data&quot;:[&quot;50&quot;,&quot;30&quot;,&quot;15&quot;]}]},&quot;options&quot;:{&quot;maintainAspectRatio&quot;:false,&quot;legend&quot;:{&quot;display&quot;:false,&quot;labels&quot;:{&quot;fontStyle&quot;:&quot;normal&quot;}},&quot;title&quot;:{&quot;fontStyle&quot;:&quot;normal&quot;}}}"></canvas> -->
				</div>
				<div class="text-center small mt-4">
					<span class="me-2"><i class="fas fa-circle text-primary" />&nbsp;Direct</span><span
						class="me-2"><i class="fas fa-circle text-success" />&nbsp;Social</span
					><span class="me-2"><i class="fas fa-circle text-info" />&nbsp;Refferal</span>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- End: Chart -->
<div class="row">
	<div class="col-lg-6 mb-4">
		<div class="card shadow mb-4">
			<div class="card-header py-3">
				<h6 class="text-primary fw-bold m-0">Projects</h6>
			</div>
			<div class="card-body">
				<h4 class="small fw-bold">Server migration<span class="float-end">20%</span></h4>
				<div class="progress mb-4">
					<!-- <div
						class="progress-bar bg-danger"
						aria-valuenow="20"
						aria-valuemin="0"
						aria-valuemax="100"
						style="width: 20%;"
					>
						<span class="visually-hidden">20%</span>
					</div> -->
				</div>
				<h4 class="small fw-bold">Sales tracking<span class="float-end">40%</span></h4>
				<div class="progress mb-4">
					<!-- <div
						class="progress-bar bg-warning"
						aria-valuenow="40"
						aria-valuemin="0"
						aria-valuemax="100"
						style="width: 40%;"
					>
						<span class="visually-hidden">40%</span>
					</div> -->
				</div>
				<h4 class="small fw-bold">Customer Database<span class="float-end">60%</span></h4>
				<div class="progress mb-4">
					<!-- <div
						class="progress-bar bg-primary"
						aria-valuenow="60"
						aria-valuemin="0"
						aria-valuemax="100"
						style="width: 60%;"
					>
						<span class="visually-hidden">60%</span>
					</div> -->
				</div>
				<h4 class="small fw-bold">Payout Details<span class="float-end">80%</span></h4>
				<div class="progress mb-4">
					<!-- <div
						class="progress-bar bg-info"
						aria-valuenow="80"
						aria-valuemin="0"
						aria-valuemax="100"
						style="width: 80%;"
					>
						<span class="visually-hidden">80%</span>
					</div> -->
				</div>
				<h4 class="small fw-bold">Account setup<span class="float-end">Complete!</span></h4>
				<div class="progress mb-4">
					<!-- <div
						class="progress-bar bg-success"
						aria-valuenow="100"
						aria-valuemin="0"
						aria-valuemax="100"
						style="width: 100%;"
					>
						<span class="visually-hidden">100%</span>
					</div> -->
				</div>
			</div>
		</div>
		<div class="card shadow mb-4">
			<div class="card-header py-3">
				<h6 class="text-primary fw-bold m-0">Todo List</h6>
			</div>
			<ul class="list-group list-group-flush">
				<li class="list-group-item">
					<div class="row align-items-center no-gutters">
						<div class="col me-2">
							<h6 class="mb-0"><strong>Lunch meeting</strong></h6>
							<span class="text-xs">10:30 AM</span>
						</div>
						<div class="col-auto">
							<div class="form-check">
								<input class="form-check-input" type="checkbox" id="formCheck-1" /><label
									class="form-check-label"
									for="formCheck-1"
								/>
							</div>
						</div>
					</div>
				</li>
				<li class="list-group-item">
					<div class="row align-items-center no-gutters">
						<div class="col me-2">
							<h6 class="mb-0"><strong>Lunch meeting</strong></h6>
							<span class="text-xs">11:30 AM</span>
						</div>
						<div class="col-auto">
							<div class="form-check">
								<input class="form-check-input" type="checkbox" id="formCheck-2" /><label
									class="form-check-label"
									for="formCheck-2"
								/>
							</div>
						</div>
					</div>
				</li>
				<li class="list-group-item">
					<div class="row align-items-center no-gutters">
						<div class="col me-2">
							<h6 class="mb-0"><strong>Lunch meeting</strong></h6>
							<span class="text-xs">12:30 AM</span>
						</div>
						<div class="col-auto">
							<div class="form-check">
								<input class="form-check-input" type="checkbox" id="formCheck-3" /><label
									class="form-check-label"
									for="formCheck-3"
								/>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
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
