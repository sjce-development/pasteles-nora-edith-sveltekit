<script lang="ts">
	export let cta: () => Promise<void> | null;
  export let id: string;
	export let title: string;
	export let successButtonString: string;
</script>

<div class="modal fade" id="{id}" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-md" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">{title}</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<slot />
			</div>
			<div class="modal-footer">
        {#if cta}
				  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
				  <button type="submit	" class="btn btn-primary" on:click={cta}>{successButtonString}</button>
        {/if}
			</div>
		</div>
	</div>
</div>
