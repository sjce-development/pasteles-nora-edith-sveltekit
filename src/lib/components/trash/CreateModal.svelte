<script lang="ts">
	import Swal from 'sweetalert2';
	import { supabase } from '$lib/supabase';
	import BaseModal from '../modals/BaseModal.svelte';
	import type { ModalField } from '$lib/models';

	export let modalId: string;
	export let fields: ModalField[];
	export let category: string;
	export let title: string;

	let object: any = {};
	let data: any = {};
	let errors: string[] = [];

	async function agregar(event: any) {
		setErrors();
		if (errors.length > 0) {
			await Swal.fire('Error', 'Por favor, revisa los campos', 'error');
		}
		await insertData();
		await Swal.fire('Pastel agregado', 'El pastel ha sido agregado correctamente', 'success');
		window.location.reload();
	}

	async function insertData() {
		const { data, error } = await supabase.from(category).insert([object]);
		if (error) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Algo salió mal, intente de nuevo'
			});
			return;
		}
	}

	function setErrors() {
		let modalErrors: any;

		fields.forEach((field: ModalField) => {
			modalErrors[field.name] = {
				content: `El campo '${field.name}' es requerido`
			};
		});

		fields.forEach((field: ModalField) => {
			if (field.type === 'text') {
				if (field.value === '' && !errors.includes(modalErrors[field.name])) {
					errors = [...errors, modalErrors[field.name].content];
				} else {
					errors = errors.filter((error) => error !== modalErrors[field.name].content);
				}
				return;
			}
			if (field.type === 'number') {
				if (field.value === 0 && !errors.includes(modalErrors[field.name])) {
					errors = [...errors, modalErrors[field.name].content];
				} else {
					errors = errors.filter((error) => error !== modalErrors[field.name].content);
				}
				return;
			}
		});
	}

	function dismissError(error: string) {
		errors = errors.filter((e) => e !== error);
	}
</script>

<BaseModal {title} id={modalId} cta={insertData}>
	{#if errors.length > 0}
		{#each errors as error}
			<div class="alert alert-danger d-flex" style="justify-content: space-between;" role="alert">
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
	{#each fields as field}
		<div class="mb-3">
			<label for="nombre" class="form-label">{field.name} {field.required ? '*' : ''}</label>
			{#if field.type === 'text'}
				<input type="text" class="form-control" name="nombre" id="nombre" bind:value={data.field} />
			{:else}
				<input
					type="number"
					class="form-control"
					name="nombre"
					id="nombre"
					bind:value={data.field}
				/>
			{/if}
		</div>
	{/each}
</BaseModal>
