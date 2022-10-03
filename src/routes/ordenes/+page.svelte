<script lang="ts">
	import CreateOrderModal from '$lib/components/CreateOrderModal.svelte';
	import OrderTable from '$lib/components/OrderTable.svelte';
</script>

<h3 class="text-dark mb-4">
	Ordenes <span
		><button
			type="button"
			class="btn btn-primary"
			data-bs-toggle="modal"
			data-bs-target="#createOrderModal"
		>
			Crear una orden
		</button>
	</span>
</h3>
<CreateOrderModal />
<OrderTable />
