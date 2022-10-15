<script lang="ts">
	import AgregarEspecificacionModal from '$lib/components/modals/AgregarEspecificacionModal.svelte';
	import ModalButton from '$lib/components/modals/ModalButton.svelte';
	import type { Categoria, Especificacion, ModalField } from '$lib/models';
	import { capitalize, formatCurrency } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	const categorias: Categoria[] = data.categorias;
	const especificaciones: Especificacion[] = data.especificaciones;

	const fields: ModalField[] = [
		{
			name: 'Categoria',
			value: 'categoria',
			type: 'text',
			required: 'true'
		},
		{
			name: 'Nombre',
			value: 'nombre',
			type: 'text',
			required: 'true'
		},
		{
			name: 'Precio',
			value: 'precio',
			type: 'number',
			required: 'true'
		}
	];

	function getEspecificacion(categoria: Categoria) {
		return especificaciones.filter(
			(especificacion) => especificacion.categoria === categoria.nombre
		);
	}
</script>

<h3 class="text-dark mb-4">Configuración</h3>
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

<div class="row">
	{#each categorias as categoria}
		<div class="col">
			<div class="card">
				<div class="card-body">
					<div class="d-flex justify-content-between align-content-end">
						<h5 class="card-title">
							{capitalize(categoria.nombre)}
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
					<div class="table-responsive">
						<table class="table">
							<thead>
								<tr>
									<th>Nombre</th>
									<th>Precio</th>
									<th class="fit" />
								</tr>
							</thead>
							<tbody>
								{#each getEspecificacion(categoria) as especificacion}
									<tr>
										<td>{especificacion.nombre}</td>
										<td>{formatCurrency(especificacion.precio)}</td>
										<td class="fit">
											<button type="button" class="btn btn-primary btn-sm">
												<i class="fa-solid fa-pen-to-square" />
											</button>
											<button type="button" class="btn btn-danger btn-sm">
												<i class="fa-solid fa-trash" />
											</button>
										</td>
									</tr>
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
