<script lang="ts">
	import { supabase } from '$lib/supabase';
	import Swal from 'sweetalert2';

	export let ordenId: number;

	async function handleSubirImagen(event: any) {
		const imagen: File = event.target[0].files[0] as File;
		const { data, error } = await supabase.storage
			.from('photos-ordenes')
			.upload(`${ordenId}/${imagen.name}`, imagen);
		await Swal.fire({
			title: 'Imagen subida',
			text: 'La imagen se ha subido correctamente',
			icon: 'success',
			confirmButtonText: 'Ok',
		});
	}
</script>

<div
	class="modal fade"
	id="añadirImagen"
	tabindex="-1"
	aria-labelledby="añadirImagen"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h1 class="modal-title fs-5" id="exampleModalLabel">Agregar imagen a orden</h1>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<form on:submit|preventDefault={handleSubirImagen}>
				<div class="modal-body">
					<!-- Form to add an image -->
					<div class="mb-3">
						<label for="formFile" class="form-label">Selecciona una imagen</label>
						<input class="form-control" type="file" id="formFile" name="imagen" />
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
					<button type="submit" class="btn btn-primary">Save changes</button>
				</div>
			</form>
		</div>
	</div>
</div>
