<script lang="ts">
	import type { Cliente, Orden, SelectItem } from '$lib/models';
	import Utils from '$lib/utils';
	import Select from 'svelte-select/Select.svelte';
	import OrderTable from '../../ordenes/OrderTable.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const ordenes = data.ordenes;
	const clientes = data.clientes;

	let ordenesCliente: Orden[];

	let search: SelectItem;

	const buscarOrdenesDeCliente = () => {
        let clienteString: string;
		const cliente = clientes.find((cliente) => {
            clienteString = `${cliente.telefono} - ${cliente.nombre}`;
			return clienteString === search.value;
		});
		ordenesCliente = ordenes.filter(
			(orden) => clienteString === `${orden.telefono} - ${orden.nombre}`
		);
	};

    const formatClienteString = (cliente: Cliente | Orden) => {
        return `${cliente.telefono} - ${cliente.nombre}`;
    }
</script>

<h2>Crear pago de orden</h2>

<div class="mb-3">
	<label for="" class="form-label">Numero de cliente</label>
	<Select
		bind:value={search}
		items={clientes.map((cliente) => `${cliente.telefono} - ${cliente.nombre}`)}
		placeholder="Buscar cliente"
        on:select={buscarOrdenesDeCliente}
	/>
</div>

<div class="table-responsive">
	<table class="table table-light">
		<thead>
			<tr>
				<th scope="col">Telefono & Nombre</th>
				<th scope="col">Restante</th>
				<th scope="col">Pagado</th>
                <th scope="col">Acciones</th>
			</tr>
		</thead>
		<tbody>
			{#if search !== null}
				{#if ordenesCliente}
					{#each ordenesCliente as orden}
						<tr class="">
							<td>{formatClienteString(orden)}</td>
							<td>{Utils.formatCurrency((orden.total ?? 0) - orden.anticipo)}</td>
							<td>{orden.pagado}</td>
                            <td>
                                <a href="/pos/pago-de-orden/pagar?ordenId={orden.id}" class="btn btn-primary">Pagar</a>
                            </td>
						</tr>
					{:else}
						<tr>
							<td colspan="4">No hay ordenes</td>
						</tr>
					{/each}
				{/if}
			{:else}
				<tr class="text-center">
					<td colspan="4">Ingrese un número de cliente para empezar a buscar ordenes.</td>
				</tr>
			{/if}
		</tbody>
	</table>
</div>
