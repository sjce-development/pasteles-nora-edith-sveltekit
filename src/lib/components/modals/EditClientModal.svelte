<script lang="ts">
	import Swal from 'sweetalert2';
	import type { Cliente } from '$lib/models';
	import { supabase } from '$lib/supabase';

	let cliente: Cliente = {
		nombre: '',
		telefono: '',
		correo: ''
	};

	let errors: Array<string> = [];

	async function editarCliente() {
		const nombreError = 'El nombre es requerido';
		const telefonoError = 'El telefono es requerido y debe tener 10 digitos';
		const correoError = 'El correo es requerido y debe ser valido';

		if (cliente.nombre === '' && !errors.includes(nombreError)) {
			errors = [...errors, nombreError];
		} else {
			errors = errors.filter((error) => error !== nombreError);
		}

		if (
			(cliente.telefono === undefined || cliente.telefono.toString().length !== 10) &&
			!errors.includes(telefonoError)
		) {
			errors = [...errors, telefonoError];
		} else {
			errors = errors.filter((error) => error !== telefonoError);
		}

		if (cliente.correo !== '' && !cliente.correo.includes('@') && !errors.includes(correoError)) {
			errors = [...errors, correoError];
		} else {
			errors = errors.filter((error) => error !== correoError);
		}
		if (errors.length > 0) {
			return;
		}

		const { data, error } = await supabase.from('clientes').update([
			{
				nombre: cliente.nombre,
				telefono: cliente.telefono,
				correo: cliente.correo
			}
		]);
		if (error) {
			alert(JSON.stringify(error, null, 2));
			return;
		}

		await Swal.fire('Cliente agregado', 'El cliente ha sido agregado correctamente', 'success');
		cliente = {
			nombre: '',
			telefono: '',
			correo: ''
		};
		window.location.reload();
	}

	function dismissError(error: string) {
		errors = errors.filter((e) => e !== error);
	}
</script>

<!-- Modal Body -->
<!-- if you want to close by clicking outside the modal, delete the last endpoint:data-bs-backdrop and data-bs-keyboard -->
<div class="modal fade" id="editClientModalId" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-md" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Editar cliente</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				{#if errors.length > 0}
					{#each errors as error}
						<div
							class="alert alert-danger d-flex"
							style="justify-content: space-between;"
							role="alert"
						>
							{error}
							<i
								class="fa-solid fa-x"
								on:click={() => {
									dismissError(error);
								}}
							/>
						</div>
					{/each}
				{/if}
				<div class="mb-3">
					<label for="nombre" class="form-label">Nombre *</label>
					<input
						type="text"
						class="form-control"
						name="nombre"
						id="nombre"
						placeholder="Nombre Apellido"
						bind:value={cliente.nombre}
					/>
				</div>
				<div class="mb-3">
					<label for="telefono" class="form-label">Telefono *</label>
					<input
						type="number"
						class="form-control"
						name="telefono"
						id="telefono"
						placeholder="644 123 4567"
						bind:value={cliente.telefono}
					/>
				</div>
				<div class="mb-3">
					<label for="email" class="form-label">Email</label>
					<input
						type="email"
						class="form-control"
						aria-describedby="emailHelpId"
						placeholder="example@gmail.com"
						bind:value={cliente.correo}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
				<button type="submit	" class="btn btn-primary" on:click={editarCliente}>Actualizar</button>
			</div>
		</div>
	</div>
</div>
