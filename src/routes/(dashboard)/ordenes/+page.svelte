<script lang="ts">
	import CreateOrderModal from '$lib/components/modals/CreateOrderModal.svelte';
	import OrderTable from '$lib/components/tables/OrderTable.svelte';
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
<OrderTable />
