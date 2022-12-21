<script lang="ts">
	import Utils from '$lib/utils';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let ventas = data.ventas;
    let date1 = data.date1;
    let date2 = data.date2;

	onMount(() => {
		// If there are multiple ventas with the same nombre, add their values together
        
	});
</script>

<div class="text-center">
	<h1>Pasteles Nora Edith</h1>
	<h2>Fecha: {date1}
        {#if date2}
            - 
            {#if typeof date2 === 'string'}
                {date2}
            {/if}
        {/if}
    </h2>
</div>
<h3>Ingresos</h3>
<ul>
	<li>
		<p>Efectivo: {Utils.formatCurrency(data.efectivo)}</p>
	</li>
	<li>
		<p>Tarjeta: {Utils.formatCurrency(data.tarjeta)}</p>
	</li>
	<li>
		<p>Transferencia: {Utils.formatCurrency(data.transferencia)}</p>
	</li>
</ul>
<hr />
<h3>Ventas en físico</h3>
<table class="table table-bordered">
	<thead>
		<tr>
			<th>Nombre</th>
			<th>Cantidad</th>
			<th>Total</th>
		</tr>
	</thead>
	<tbody>
		{#each ventas as venta}
			{#if venta.nombre !== 'nada'}
				<tr>
					<td>{venta.nombre}</td>
					<td>{venta.cantidad}</td>
					<td>{Utils.formatCurrency(venta.total)}</td>
				</tr>
			{/if}
		{/each}
	</tbody>
</table>
<hr />
<h3>Ordenes</h3>
<table class="table table-bordered">
	<thead>
		<tr>
			<th>Cantidad de ordenes</th>
			<th>Total</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>1</td>
			<td>$1000</td>
		</tr>
	</tbody>
</table>
<hr />
<h3>Total de ingresos</h3>
<ul>
	<li>
		<p>Pagado en efectivo: $1000</p>
	</li>
	<li>
		<p>Pagado con tarjeta: $1000</p>
	</li>
	<li>
		<p>Pagado con transferencia: $1000</p>
	</li>
	<li>
		<p>Total pagado: $1000</p>
	</li>
</ul>
