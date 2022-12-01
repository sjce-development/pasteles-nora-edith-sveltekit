<script lang="ts">
	import type { Ticket } from '$lib/models';
	import Utils from '$lib/utils';
	import { onMount } from 'svelte';
	import type { PageData } from '../ticket/$types';

	export let data: PageData;
	let ticket: Ticket | Ticket[] = data.ticket;

	onMount(() => {
		console.log(ticket);
	});
</script>

<div class="ticket text-uppercase">
	<!-- <img
		src="https://yt3.ggpht.com/-3BKTe8YFlbA/AAAAAAAAAAI/AAAAAAAAAAA/ad0jqQ4IkGE/s900-c-k-no-mo-rj-c0xffffff/photo.jpg"
		alt="Logotipo"
	/> -->
	<p class="centrado">
		Pasteleria Nora Edith S.A de C.V.
		<br />
		Ciudad Obregón, Sonora
		<br />
		{new Date().toLocaleString('es-mx', {
			hour12: true
		})}
	</p>
	<table>
		<thead>
			<tr>
				<th class="id">CODIGO</th>
				<th class="cantidad">cant</th>
				<th class="producto">PRODUCTO</th>
				<th class="precio">TOTAL</th>
			</tr>
		</thead>
		<tbody>
			{#if ticket instanceof Array}
				{#each ticket as ticketObj}
					{#each ticketObj.productos as producto}
						<tr>
							<td class="id">{producto.id}</td>
							<td class="cantidad">{producto.cantidad}</td>
							<td class="producto">{producto.nombre}</td>
							<td class="precio">${producto.precio * producto.cantidad}</td>
						</tr>
					{/each}
				{/each}
			{:else}
				{#each ticket.productos as producto}
					<tr>
						<td class="id">{producto.id}</td>
						<td class="cantidad">{producto.cantidad}</td>
						<td class="producto">{producto.nombre}</td>
						<td class="precio">{producto.precio * producto.cantidad}</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
	<p class="centrado">¡GRACIAS POR SU COMPRA!</p>
</div>

<style>
	* {
		font-size: 12px;
		font-family: 'Times New Roman';
		color: black;
	}

	td,
	th,
	tr,
	table {
		text-align: center;
		border-top: 1px solid black;
		border-collapse: collapse;
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
		width: 75px;
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
	}

	.ticket {
		width: 195px;
		max-width: 195px;
	}

	img {
		max-width: inherit;
		width: inherit;
	}
</style>
