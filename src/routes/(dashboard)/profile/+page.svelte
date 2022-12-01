<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import type { User } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	// export let data: PageData;
	let user: User | null;

	onMount(() => {
		user = supabase.auth.user();
    console.log(user);
		if (!user) {
			goto('/login');
		}
	});
</script>

<h1>Perfil</h1>
<hr />

{#if user}
	<div class="row">
		<div class="col">
			<h3>Información</h3>
			<p>Correo: {user.email}</p>
		</div>
	</div>
{/if}
