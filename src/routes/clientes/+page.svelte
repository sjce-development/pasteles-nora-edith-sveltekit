<script lang="ts">
	import CreateClientModal from '$lib/components/modals/CreateClientModal.svelte';
	import EditClientModal from '$lib/components/modals/EditClientModal.svelte';

	import ClientTable from '$lib/components/tables/ClientTable.svelte';
</script>

<h3 class="text-dark mb-4">
	Clientes <span
		><button
			class="btn btn-primary"
			type="button"
			data-bs-toggle="modal"
			data-bs-target="#createClientModalId"
		>
			Agregar un cliente
		</button>
	</span>
</h3>
<ClientTable />
<CreateClientModal />
<EditClientModal />
