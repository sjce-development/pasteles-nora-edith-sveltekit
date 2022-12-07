<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Ticket } from '$lib/models';
	import Utils from '$lib/utils';
	import { onMount } from 'svelte';
	import type { PageData } from '../ticket/$types';

	export let data: PageData;

	let ticket: Ticket | null = data.ticket ? data.ticket : null;

	onMount(() => {
		if (ticket) {
			print();
		} else {
			goto('/pos');
		}
	});
</script>

<div class="ticket text-uppercase">
	<img src="assets/img/logo.png" alt="Logotipo" />
	<p class="centrado">
		Pasteles Nora Edith S.A de C.V.
		<br />
		Calle Aureliano Anaya 272 ÷ California y Tabasco, Ciudad Obregón, Sonora
		<br />
		{new Date().toLocaleString('es-mx', {
			hour12: true
		})}
		<br />
		R.F.C: MEMN710204JS4
		<br />
		turno: {ticket?.persona_turno}
		<br />
		<!-- operacion: {ticket[0].id} -->
	</p>
	<table>
		<thead>
			<tr>
				<th class="id fit">id</th>
				<th class="cantidad fit">cant</th>
				<th class="producto fit">producto</th>
				<th class="precio fit">total</th>
			</tr>
		</thead>
		<tbody>
			{#if ticket}
				{#each ticket.productos as producto}
					<tr>
						<td class="id">{producto.id}</td>
						<td class="cantidad">{producto.cantidad}</td>
						<td class="producto">{producto.nombre}</td>
						<td class="precio">${producto.precio * producto.cantidad}</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
	<p class="centrado">¡GRACIAS POR SU COMPRA!</p>
</div>

<style>
	.fit {
		white-space: nowrap;
		width: 1%;
	}
	* {
		font-size: 12px;
		font-family: 'Arial';
		color: black;
	}

	p {
		margin-bottom: 0;
	}

	td,
	th,
	tr,
	table {
		text-align: center;
		border-top: 1px solid black;
		border-collapse: collapse;
		border-bottom: 1px solid black;
	}

	td.id,
	td.id {
		width: 20px;
		max-width: 20px;
	}

	td.producto,
	th.producto {
		width: 75px;
		max-width: 75px;
	}

	td.cantidad,
	th.cantidad {
		width: 40px;
		max-width: 40px;
		word-break: break-all;
	}

	td.precio,
	th.precio {
		width: 40px;
		max-width: 40px;
		word-break: break-all;
	}

	.centrado {
		text-align: center;
		align-content: center;
		padding-bottom: 0;
	}

	.ticket {
		width: 195px;
		max-width: 195px;
	}

	img {
		max-width: inherit;
		width: inherit;
		filter: grayscale(100%);
	}
</style>
