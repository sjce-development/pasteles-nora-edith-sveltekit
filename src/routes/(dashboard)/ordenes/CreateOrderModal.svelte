<script lang="ts">
	import CreateClientModal from '$lib/components/modals/CreateClientModal.svelte';
	import {
		Estados,
		type Cliente,
		type Especificacion,
		type Orden,
		type OrdenSelect,
		type PastelesConfig
	} from '$lib/models';
	import Utils from '$lib/utils';
	import { supabase } from '$lib/supabase';
	import Select from 'svelte-select';
	import Swal from 'sweetalert2';
	import { onMount } from 'svelte';

	export let clientes: Cliente[];
	export let pasteles: PastelesConfig;

	let especificaciones: Especificacion[];
	let orden: OrdenSelect = {} as OrdenSelect;

	let total: number = 0;

	onMount(async () => {
		const { data: especificacionesData } = await supabase
			.from<Especificacion>('especificaciones')
			.select('*');
		if (especificacionesData) {
			especificaciones = especificacionesData;
		}
	});

	async function handleTotal() {
		total = 0;
		especificaciones.forEach((especificacion) => {
			const { precio } = especificacion;
			let { nombre } = especificacion;

			nombre = nombre.toLowerCase();

			if (orden.decorado?.length > 0) {
				orden.decorado.forEach((decorado) => {
					if (decorado.value === nombre) {
						total += precio;
					}
				});
			}
			if (orden.harina?.value === nombre) {
				total += precio;
			}
			if (orden.relleno?.value === nombre) {
				total += precio;
			}
			if (orden.tamano?.label === nombre) {
				total += precio;
			}
		});
	}

	async function guardarOrden() {
		const nombre: string = orden.client.value.split('-')[0];
		const telefono: string = orden.client.value.split('-')[1].replace(' ', '');

		const decorado = orden.decorado;
		let decoradoValues: string[];
		if (decorado != null) {
			decoradoValues = decorado.map((especificacion: { value: string; label: string }) => {
				return especificacion.value;
			});
		} else {
			decoradoValues = [];
		}
		const newOrden: Orden = {
			anticipo: orden.anticipo,
			decorado: decoradoValues,
			nombre,
			harina: orden.harina.value,
			relleno: orden.relleno.value,
			tamano: orden.tamano.label,
			estado: Estados.pendiente,
			hora_de_entrega: new Date(orden.hora_de_entrega).toISOString(),
			impreso: false,
			pagado: orden.anticipo === total,
			telefono,
			total
		};

		const { error } = await supabase.from<Orden>('ordenes').insert(newOrden);

		if (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Algo salió mal, intente de nuevo'
			});
			return;
		}

		await Swal.fire('Orden creada', 'La orden se ha creado correctamente', 'success');

		window.location.reload();
	}

	function encontrarPrecioDeEspecificacion(especificacion: string): number {
		const especificacionEncontrada = especificaciones.find(
			(especificacionEncontrada) => especificacionEncontrada.nombre === especificacion
		);
		if (especificacionEncontrada) {
			return especificacionEncontrada.precio;
		}
		return 0;
	}

	function cambiarPrecioDeEspecificacion(especificacion: string, event: Event) {
		const input = event.target as HTMLInputElement;
		const precio = parseFloat(input.value);
		especificaciones.forEach((esp) => {
			if (esp.nombre === especificacion) {
				esp.precio = precio;
			}
		});
		handleTotal();
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
									items={clientes.map((cliente) => `${cliente.nombre}-${cliente.telefono}`)}
									placeholder="Selecciona un cliente"
									bind:value={orden.client}
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
						on:change={handleTotal}
					/>
				</div>
				<!-- Harina -->
				<div class="mb-3">
					<label for="harina" class="form-label">Harina</label>
					<Select
						name="harina"
						items={pasteles.harinas}
						placeholder="Selecciona un tipo de harina"
						bind:value={orden.harina}
						on:change={handleTotal}
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
						on:change={handleTotal}
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
						on:change={handleTotal}
					/>
				</div>
				{#if orden.decorado?.length}
					{#each orden.decorado as decorado}
						<div class="mb-3">
							<div class="row">
								<div class="col">
									<input
										type="text"
										class="form-control"
										disabled
										value={decorado.label}
										style="overflow: scroll;"
									/>
								</div>
								<div class="col">
									<input
										type="text"
										class="form-control"
										value={encontrarPrecioDeEspecificacion(decorado.label)}
										on:change={(event) => {
											cambiarPrecioDeEspecificacion(decorado.label, event);
										}}
									/>
								</div>
							</div>
						</div>
					{/each}
				{/if}
				<!-- Total -->
				<div class="mb-3">
					<label for="total" class="form-label">Total</label>
					<input
						type="number"
						class="form-control"
						id="total"
						placeholder="Total"
						bind:value={total}
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
