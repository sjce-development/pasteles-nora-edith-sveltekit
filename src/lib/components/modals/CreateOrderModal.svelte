<script lang="ts">
	import CreateClientModal from '$lib/components/modals/CreateClientModal.svelte';
	import type { Cliente, Orden } from '$lib/models';
	import { pasteles } from '$lib/constants';
	import { supabase } from '$lib/supabase';
	import Select from 'svelte-select';
	import { onMount } from 'svelte';

	let clientes: Cliente[];

	let orden: Orden = {} as Orden;

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
						<div class="row">
							<label for="cliente" class="form-label">Cliente</label>
							<div class="col-sm-10">
								<Select
									items={clientes.map((cliente) => cliente.nombre)}
									placeholder="Selecciona un cliente"
									bind:value={orden.nombre}
								/>
							</div>
							<div class="col-sm-2">
								<button
									class="btn btn-primary"
									type="button"
									data-bs-toggle="modal"
									data-bs-target="#createClientModalId"
								>
									<i class="fa-solid fa-plus" />
								</button>
							</div>
						</div>
					{:else}
						<div class="spinner-border" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					{/if}
				</div>
				<div class="mb-3">
					<label for="tamano" class="form-label">Tamaño</label>
					<Select
						name="tamano"
						items={pasteles.tamanos}
						placeholder={pasteles.tamanos[0].toString()}
						bind:value={orden.tamano}
					/>
				</div>
				<div class="mb-3">
					<label for="" class="form-label">Pan</label>
					<Select
						name="pan"
						items={pasteles.pan}
						placeholder={pasteles.pan[0].toString()}
						bind:value={orden.pan}
					/>
				</div>
				<div class="mb-3">
					<label for="relleno" class="form-label">Relleno</label>
					<Select
						name="relleno"
						items={pasteles.rellenos}
						placeholder={pasteles.rellenos[0].toString()}
						bind:value={orden.relleno}
					/>
				</div>
				<div class="mb-3">
					<!-- TODO: Create store to store especificaciones -->
					<label for="relleno" class="form-label">Especificaciones</label>
					<Select
						name="relleno"
						items={pasteles.rellenos}
						placeholder={pasteles.rellenos[0].toString()}
						bind:value={orden.relleno}
					/>
				</div>
				<div class="mb-3">
					<label for="relleno" class="form-label">Relleno</label>
					<Select
						name="relleno"
						items={pasteles.rellenos}
						placeholder={pasteles.rellenos[0].toString()}
						bind:value={orden.relleno}
					/>
				</div>
				<div class="mb-3">
					<label for="" class="form-label">Name</label>
					<input
						type="text"
						class="form-control"
						name=""
						id=""
						aria-describedby="helpId"
						placeholder=""
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary">Save changes</button>
			</div>
		</div>
	</div>
</div>
<CreateClientModal />
