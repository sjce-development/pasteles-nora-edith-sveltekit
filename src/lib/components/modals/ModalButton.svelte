<script lang="ts">
	export let modalId: string;
	export let title: string;
</script>

<span>
	<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#{modalId}">
		{title}
	</button>
</span>
