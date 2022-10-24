<script lang="ts">
	import CreateClientModal from '$lib/components/modals/CreateClientModal.svelte';
	import type { Cliente, Orden, PastelesConfig } from '$lib/models';
	import Utils from '$lib/utils';
	import { supabase } from '$lib/supabase';
	import Select from 'svelte-select';
	import Swal from 'sweetalert2';

	export let orden: Orden;
	export let clientes: Cliente[];
	export let pasteles: PastelesConfig;

	async function guardarOrden() {
		const newOrden: Orden = await Utils.convertirOrdenSelect(orden);
		const { data, error } = await supabase.from<Orden>('ordenes').insert([newOrden]);
		if (error) {
			alert(JSON.stringify(error, null, 2));
			return;
		}
		await Swal.fire('Orden creada', 'La orden se ha creado correctamente', 'success');
		window.location.reload();
	}
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
				<!-- Tamaño -->
				<div class="mb-3">
					<label for="tamano" class="form-label">Tamaño</label>
					<Select
						name="tamano"
						items={pasteles.tamanos}
						placeholder="Selecciona un tamaño"
						justValue={true}
						bind:value={orden.tamano}
					/>
				</div>
				<!-- harina -->
				<div class="mb-3">
					<label for="" class="form-label">Harina</label>
					<Select
						name="harina"
						items={pasteles.harina}
						placeholder="Selecciona un harina"
						bind:value={orden.harina}
					/>
				</div>
				<!-- Relleno -->
				<div class="mb-3">
					<label for="relleno" class="form-label">Relleno</label>
					<Select
						name="relleno"
						items={pasteles.rellenos}
						placeholder="Selecciona un relleno"
						bind:value={orden.relleno}
					/>
				</div>
				<!-- Especificaciones -->
				<div class="mb-3">
					<label for="especificaciones" class="form-label">Especificaciones</label>
					<Select
						name="especificaciones"
						items={pasteles.especificaciones}
						placeholder="Selecciona la/s especificaciónes"
						multiple={true}
						bind:value={orden.decorado}
					/>
				</div>
				<!-- Anticipo -->
				<div class="mb-3">
					<label for="anticipo" class="form-label">Anticipo</label>
					<input
						type="number"
						class="form-control"
						id="anticipo"
						placeholder="$123.45"
						bind:value={orden.anticipo}
					/>
				</div>
				<!-- Hora de entrega -->
				<div class="mb-3">
					<label for="horaEntrega" class="form-label">Hora de entrega</label>
					<input
						type="datetime-local"
						class="form-control"
						id="horaEntrega"
						bind:value={orden.hora_de_entrega}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary" on:click={guardarOrden}>Guardar Orden</button>
			</div>
		</div>
	</div>
</div>
<CreateClientModal />
