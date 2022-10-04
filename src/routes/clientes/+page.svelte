<script lang="ts">

	import CreateClientModal from '$lib/components/modals/CreateClientModal.svelte';

	import ClientTable from '$lib/components/tables/ClientTable.svelte';
</script>

<h3 class="text-dark mb-4">
	Clientes <span
		><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalId">
			Agregar un cliente
		</button>
	</span>
</h3>
<ClientTable />
<CreateClientModal />