<script lang="ts">
	import Swal from 'sweetalert2';
	import { Estados, type Especificacion, type Orden } from '$lib/models';
	import Utils from '$lib/utils';
	import type { PageData } from './$types';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import AnadirImagen from './AnadirImagen.svelte';
	import Select from 'svelte-select';

	export let data: PageData;

	const orden: Orden = data.orden;
	const especificaciones: Especificacion[] = data.especificaciones;
	const imageUrl: string = data.imageUrl ?? '';

	let decorado: any;

	function onDateChange(e: any) {
		const date = new Date(e.target.value);
		orden.hora_de_entrega = Utils.formatHoraDeEntrega(date);
	}

	async function handleEditOrden() {
		// Ask for confirmation
		const { isConfirmed } = await Swal.fire({
			title: '¿Estás seguro?',
			text: 'Podrás revertir esta acción',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí, editar',
			cancelButtonText: 'Cancelar'
		});
		if (isConfirmed) {
			// Update the order
			const { error } = await supabase.from('ordenes').update(orden).eq('id', orden.id);
			if (error) {
				Swal.fire('Error', error.message, 'error');
			} else {
				Swal.fire('¡Listo!', 'La orden ha sido editada', 'success');
			}
		}
		goto('/ordenes');
	}
</script>

<h3 class="text-dark mb-4">Orden</h3>
<div class="row">
	<div class="col-sm-4">
			<h5>Imagen de la orden</h5>
			{#if imageUrl !== ''}
				<img src={imageUrl} alt={imageUrl} class="img-thumbnail" />
			{/if}
	</div>
	<div class="col-sm-8">
		<form>
			<div class="row">
				<!-- Telefono -->
				<div class="col-sm-12 col-md-6 col-lg-4">
					<div class="mb-3">
						<label for="ordenCliente" class="form-label">Cliente</label>
						<input
							type="text"
							class="form-control"
							name="ordenCliente"
							id="ordenCliente"
							aria-describedby="ordenHelpId"
							disabled
							bind:value={orden.telefono}
						/>
					</div>
				</div>
				<!-- Nombre del cliente -->
				<div class="col-sm-12 col-md-6 col-lg-4">
					<div class="mb-3">
						<label for="ordenNombre" class="form-label">Nombre del cliente</label>
						<input
							type="text"
							class="form-control"
							name="ordenNombre"
							id="ordenNombre"
							aria-describedby="ordenHelpId"
							bind:value={orden.nombre}
						/>
					</div>
				</div>
				<!-- Tamano -->
				<div class="col-sm-12 col-md-6 col-lg-4">
					<div class="mb-3">
						<label for="ordenTamano" class="form-label">Tamaño</label>
						<input
							type="text"
							class="form-control"
							name="ordenTamano"
							id="ordenTamano"
							aria-describedby="ordenHelpId"
							bind:value={orden.tamano}
						/>
					</div>
				</div>
				<!-- Anticipo -->
				<div class="col-sm-12 col-md-6 col-lg-4">
					<div class="mb-3">
						<label for="" class="form-label">Anticipo</label>
						<input
							type="number"
							class="form-control"
							name="ordenAnticipo"
							id="ordenAnticipo"
							min="0"
							aria-describedby="ordenHelpId"
							bind:value={orden.anticipo}
						/>
					</div>
				</div>
				<!-- Pagado -->
				<div class="col-sm-12 col-md-6 col-lg-4">
					<div class="mb-3">
						<label for="" class="form-label">Pagado</label>
						<select
							class="form-select"
							aria-label="Default select example"
							bind:value={orden.pagado}
						>
							<option value={true} selected={orden.pagado}>Si</option>
							<option value={false} selected={!orden.pagado}>No</option>
						</select>
					</div>
				</div>
				<!-- Fecha de entrega -->
				<div class="col-sm-12 col-md-6 col-lg-4">
					<div class="mb-3">
						<label for="ordenFecha" class="form-label">Fecha de entrega</label>
						<input
							type="datetime-local"
							class="form-control"
							name="ordenFecha"
							id="ordenFecha"
							aria-describedby="ordenHelpId"
							value={Utils.formatHoraDeEntrega(orden.hora_de_entrega)}
							on:change={onDateChange}
						/>
					</div>
				</div>
				<!-- Estado de entrega-->
				<div class="col-sm-12 col-md-6 col-lg-4">
					<div class="mb-3">
						<label for="ordenEstado" class="form-label">Estado de entrega</label>
						<select
							class="form-select"
							name="ordenEstado"
							id="ordenEstado"
							aria-describedby="ordenHelpId"
							bind:value={orden.estado}
						>
							{#each Object.values(Estados) as value}
								<option {value}>{Utils.capitalize(Utils.unSlug(value))}</option>
							{/each}
						</select>
					</div>
				</div>
				<!-- Total -->
				<div class="col-sm-12 col-md-6 col-lg-4">
					<div class="mb-3">
						<label for="ordenTotal" class="form-label">Total</label>
						<input
							type="number"
							class="form-control"
							name="ordenTotal"
							min="0"
							step="any"
							id="ordenTotal"
							aria-describedby="ordenHelpId"
							bind:value={orden.total}
						/>
					</div>
				</div>
				<!-- Impreso -->
				<div class="col-sm-12 col-md-6 col-lg-4">
					<div class="mb-3">
						<label for="ordenCliente" class="form-label">Impreso</label>
						<select class="form-select" bind:value={orden.impreso}>
							<option selected={orden.impreso === true} value={true}>Si</option>
							<option selected={orden.impreso === false} value={false}>No</option>
						</select>
					</div>
				</div>
				<!-- Decorado -->
				<div class="col-sm-12 col-md-6 col-lg-4">
					<div class="mb-3">
						<label for="ordenDecorado" class="form-label">Decorado</label>
						<select class="form-select" bind:value={decorado}>
							<Select
								items={especificaciones}
								placeholder="Selecciona un cliente"
								bind:value={decorado}
							/>
						</select>
					</div>
				</div>
			</div>
			<!-- Edit orden button -->
			<div class="col-sm-12 col-md-6 col-lg-4">
				<div class="mb-3">
					<button type="button" class="btn btn-primary" on:click={handleEditOrden}>
						Editar orden
					</button>
				</div>
			</div>
		</form>
	</div>
</div>
{#if orden.id !== undefined}
	<AnadirImagen ordenId={orden.id} />
{/if}

<style>
	.image-wrapper {
		max-height: 300px;
		position: static;
	}
</style>
