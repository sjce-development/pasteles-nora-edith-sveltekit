<script lang="ts">
	import CreateOrderModal from './CreateOrderModal.svelte';
	import OrderTable from './OrderTable.svelte';
	export let data: any;
</script>

<h3 class="text-dark mb-4">
	Ordenes
	<span>
		<button
			type="button"
			class="btn btn-primary"
			data-bs-toggle="modal"
			data-bs-target="#createOrderModal"
		>
			Crear una orden
		</button>
	</span>
</h3>
<CreateOrderModal pasteles={data.pasteles} clientes={data.clientes} />
<OrderTable
	ordenes={data.ordenes}
	pagination={data.pagination}
	count={data.count}
	selectedDateRange={data.selectedDateRange}
/>
