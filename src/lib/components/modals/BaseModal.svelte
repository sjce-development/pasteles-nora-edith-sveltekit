<script lang="ts">
	export let cta: () => Promise<void> | null;
	export let id: string;
	export let title: string;
	export let successButtonString: string;
</script>

<div class="modal fade" id="{id}" tabindex="-1" data-bs-toggle="modal" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-md" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="{id}">{title}</h5>
			</div>
			<div class="modal-body">
				<form on:submit|preventDefault={cta}>
					<slot />
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
				<button type="submit" class="btn btn-primary">{successButtonString}</button>
			</div>
		</div>
	</div>
</div>
