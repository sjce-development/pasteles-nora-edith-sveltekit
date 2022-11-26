<script lang="ts">
	import AgregarEspecificacionModal from '$lib/components/modals/AgregarEspecificacionModal.svelte';
	import EditarEspecificacionModal from '$lib/components/modals/EditarEspecificacionModal.svelte';
	import ModalButton from '$lib/components/modals/ModalButton.svelte';
	import type { Categoria, Especificacion, ModalField } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import Utils from '$lib/utils';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';
	import type { PageData } from './$types';

	export let data: PageData;

	const categorias: Categoria[] = data.categorias;
	const especificaciones: Especificacion[] = data.especificaciones;

	function getEspecificacion(categoria: Categoria) {
		return especificaciones.filter(
			(especificacion) => especificacion.categoria === categoria.nombre
		);
	}

	async function deleteEspecificacion(id: number) {
		// confirm if user wants to delete the specificacion
		const { isConfirmed } = await Swal.fire({
			title: '¿Estás seguro?',
			text: 'No podrás revertir esta acción',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar'
		});

		if (!isConfirmed) {
			return;
		}

		const { error } = await supabase.from('especificaciones').delete().eq('id', id);
		if (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'No se pudo eliminar la especificación'
			});
			return;
		}
		await Swal.fire({
			icon: 'success',
			title: 'Éxito',
			text: 'Especificación eliminada'
		});
		window.location.reload();
	}
</script>

<h3 class="text-dark mb-4">Configuración</h3>
<!-- Tarjetas -->
<div class="row">
	<div class="col-md-6 col-xl-3 mb-4">
		<div class="card shadow border-left-primary py-2">
			<div class="card-body">
				<div class="row align-items-center no-gutters">
					<div class="col mr-2">
						<div class="text-uppercase text-primary font-weight-bold text-xs mb-1">
							<span>Categorías</span>
						</div>
						<div class="text-dark font-weight-bold h5 mb-0">
							<span>{categorias.length}</span>
						</div>
					</div>
					<div class="col-auto">
						<i class="fas fa-clipboard-list fa-2x text-gray-300" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="col-md-6 col-xl-3 mb-4">
		<div class="card shadow border-left-success py-2">
			<div class="card-body">
				<div class="row align-items-center no-gutters">
					<div class="col mr-2">
						<div class="text-uppercase text-success font-weight-bold text-xs mb-1">
							<span>Especificaciones</span>
						</div>
						<div class="text-dark font-weight-bold h5 mb-0">
							<span>{especificaciones.length}</span>
						</div>
					</div>
					<div class="col-auto">
						<i class="fas fa-clipboard-list fa-2x text-gray-300" />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- Tarjetas -->

<!-- Tablas -->
<div class="row">
	{#each categorias as categoria}
		<div class="col-sm-12 col-md-6 col- col-lg-4 mb-3">
			<div class="card">
				<div class="card-body">
					<div class="d-flex justify-content-between align-content-end mb-1">
						<h5 class="card-title">
							{Utils.capitalize(categoria.nombre)}
						</h5>
						<button
							type="button"
							class="btn btn-primary"
							data-bs-toggle="modal"
							data-bs-target="#{`agregar${categoria.nombre}`}"
						>
							<i class="fas fa-plus" />
						</button>
					</div>
					<div class="table-responsive table-overflow">
						<table class="table">
							<thead class="header bg-body">
								<tr>
									{#if categoria.nombre !== 'tamano'}
										<th>Nombre</th>
									{:else}
										<th>Cantidad de personas</th>
									{/if}
									<th>Precio</th>
									{#if categoria.nombre === 'tamano'}
										<th>Peso</th>
										<th># de panes</th>
									{/if}
									<th class="fit">
										<i class="fas fa-cog" />
									</th>
								</tr>
							</thead>
							<tbody>
								{#each getEspecificacion(categoria) as especificacion}
									<tr>
										<td>{especificacion.nombre}</td>
										<td>{Utils.formatCurrency(especificacion.precio)}</td>
										{#if categoria.nombre === 'tamano'}
											<td>{especificacion.peso}</td>
											<td>{especificacion.numero_de_panes}</td>
										{/if}
										<td class="fit">
											<ModalButton
												modalId={`editar${especificacion.nombre}`}
												hasIcon={true}
												title=""
											>
												<i class="fa-solid fa-pen-to-square" />
											</ModalButton>
											<button
												type="button"
												class="btn btn-danger btn-sm"
												on:click={() => deleteEspecificacion(especificacion.id)}
											>
												<i class="fa-solid fa-trash" />
											</button>
										</td>
									</tr>
									<EditarEspecificacionModal
										title={`Editar especificación: ${especificacion.nombre}`}
										id={`editar${especificacion.nombre}`}
										{categoria}
										{especificacion}
									/>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<AgregarEspecificacionModal
			title={`Agregar ${categoria.nombre}`}
			id={`agregar${categoria.nombre}`}
			{categoria}
		/>
	{/each}
</div>

<style>
	.table-overflow {
		height: 40vh;
		overflow-x: auto;
		overflow-y: scroll;
	}

	.header {
		position: sticky;
		top: 0;
	}
</style>
