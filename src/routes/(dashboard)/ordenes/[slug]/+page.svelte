<script lang="ts">
	import type { Orden } from '$lib/models';
	import { formatHoraDeEntrega } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	const orden: Orden = data.orden;

	function onDateChange(e: any) {
		const date = new Date(e.target.value);
		orden.hora_de_entrega = formatHoraDeEntrega(date);
	}
</script>

<h3 class="text-dark mb-4">Orden</h3>

<form>
	<div class="row">
		<div class="col-sm-12 col-md-6 col-lg-4">
			<div class="mb-3">
				<label for="ordenNombre" class="form-label">Nombre</label>
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
		<div class="col-sm-12 col-md-6 col-lg-4">
			<div class="mb-3">
				<label for="ordenFecha" class="form-label">Fecha</label>
				<input
					type="datetime-local"
					class="form-control"
					name="ordenFecha"
					id="ordenFecha"
					aria-describedby="ordenHelpId"
					value={orden.hora_de_entrega}
					on:change={onDateChange}
				/>
			</div>
		</div>
		<div class="col-sm-12 col-md-6 col-lg-4">
			<div class="mb-3">
				<label for="ordenEstado" class="form-label">Estado</label>
				<select class="form-select" aria-label="Default select example" bind:value={orden.estado}>
					<option value="pendiente">Pendiente</option>
					<option value="en_proceso">En proceso</option>
					<option value="entregado">Entregado</option>
				</select>
			</div>
		</div>
		<div class="col-sm-12 col-md-6 col-lg-4">
			<div class="mb-3">
				<label for="ordenCliente" class="form-label">Cliente</label>
				<input
					type="text"
					class="form-control"
					name="ordenCliente"
					id="ordenCliente"
					aria-describedby="ordenHelpId"
					bind:value={orden.nombre}
				/>
			</div>
		</div>
	</div>
</form>
