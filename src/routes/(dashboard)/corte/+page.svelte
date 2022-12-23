<script lang="ts">
	// import type { PageData } from './$types';

	// export let data: PageData;

	let date1: string;
	let date2: string;

	const setDates = (label: string) => {
		if (label === 'hoy') {
			date1 = new Date().toISOString().split('T')[0];
		} else if (label === 'ayer') {
			date1 = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
		} else if (label === 'semana') {
			date1 = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
            date2 = new Date(new Date().setDate(new Date().getDate())).toISOString().split('T')[0];
		} else if (label === 'mes') {
			date1 = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
            date2 = new Date(new Date().setDate(new Date().getDate())).toISOString().split('T')[0];
		} else if (label === 'año') {
			date1 = new Date(new Date().setDate(new Date().getDate() - 365)).toISOString().split('T')[0];
            date2 = new Date(new Date().setDate(new Date().getDate())).toISOString().split('T')[0];
		}

        goToCorte();
	};

	const goToCorte = () => {
		let url = '/pdf/corte?';
		const params = new URLSearchParams();
		if (!date1) {
			date1 = new Date().toISOString().split('T')[0];
		}
		if (date2) {
			params.append('date2', new Date(date2).toISOString().split('T')[0]);
		}

		params.append('date1', date1);
		url += params.toString();
		window.open(url.toString(), '_blank');
	};
</script>

<h3>Generar Corte</h3>

<div>
	<button type="button" class="btn btn-primary" on:click={() => setDates('hoy')}>Hoy</button>
	<button type="button" class="btn btn-primary" on:click={() => setDates('ayer')}>Ayer</button>
	<button type="button" class="btn btn-primary" on:click={() => setDates('semana')}>Semana</button>
	<button type="button" class="btn btn-primary" on:click={() => setDates('mes')}>Mes</button>
	<button type="button" class="btn btn-primary" on:click={() => setDates('año')}>Año</button>
</div>

<hr />

<div class="mb-3">
	<label for="" class="form-label">Fecha Inicial</label>
	<input
		type="date"
		name=""
		id=""
		class="form-control"
		placeholder=""
		aria-describedby="helpId"
		bind:value={date1}
	/>
</div>
<div class="mb-3">
	<label for="" class="form-label">Fecha Final</label>
	<input
		type="date"
		name=""
		id=""
		class="form-control"
		placeholder=""
		aria-describedby="helpId"
		bind:value={date2}
	/>
</div>

<button type="button" class="btn btn-primary" on:click={goToCorte}>Generar corte</button>
