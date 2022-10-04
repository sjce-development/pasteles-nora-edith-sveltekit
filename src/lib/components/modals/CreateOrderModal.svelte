<script lang="ts">
	import type { Cliente } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	import Select from 'svelte-select';

	let clientes: Cliente[];

	let cliente: string;

	onMount(async () => {
		const { data, error } = await supabase.from<Cliente>('clientes').select('*');
		if (error) {
			alert(JSON.stringify(error, null, 2));
			return;
		}
		clientes = data;
	});
</script>

<div
	class="modal fade"
	id="createOrderModal"
	tabindex="-1"
	aria-labelledby="createOrderModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="createOrderModalLabel">Crear orden</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="mb-3">
					{#if clientes}
						<div>
							<button type="button" class="btn btn-primary">Crear clientes</button>
						</div>
						<label for="cliente" class="form-label">Cliente</label>
						<Select items={clientes.map((cliente) => cliente.nombre)} bind:value={cliente} />
					{:else}
						<div class="spinner-border" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					{/if}
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary">Save changes</button>
			</div>
		</div>
	</div>
</div>
