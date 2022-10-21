<script lang="ts">
	export let modalId: string;
	export let title: string;
	export let hasIcon: boolean | undefined;
</script>

<span>
	<button type="button" class="btn btn-primary" class:btn-sm={hasIcon === true} data-bs-toggle="modal" data-bs-target="#{modalId}">
		{#if hasIcon}
			<slot />
		{:else}
			{title}
		{/if}
	</button>
</span>
