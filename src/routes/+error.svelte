<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		if (window.location.pathname === '/') {
			window.location.href = '/ordenes';
		}
	});
</script>

<div class="center">
	<h1>{$page.status} | {$page.error?.message}</h1>
</div>

<style>
	.center {
		margin-top: 10vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
