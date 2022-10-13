<script lang="ts">
	import Sidebar from '../../lib/components/Sidebar.svelte';
	import Navbar from '../../lib/components/Navbar.svelte';
	import Footer from '../../lib/components/Footer.svelte';

	import type { User } from '@supabase/supabase-js';

	import 'sweetalert2/src/sweetalert2.scss';

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';
	import { loading } from '$lib/loading';
	import { navigating } from '$app/stores';
	import Loader from '$lib/components/Loader.svelte';

	let user: User | null;
	$: $loading = !!$navigating;

	onMount(async () => {
		user = supabase.auth.user();
		if (user === null && window.location.pathname !== '/login') {
			browser && (window.location.href = '/login');
		}
	});
</script>

{#if user === null}
	<slot />
{:else}
	<div id="page-top">
		<div id="wrapper">
			<Sidebar />
			<div class="d-flex flex-column" id="content-wrapper">
				<div id="content">
					<Navbar />
					<div class="container-fluid">
						{#if $loading}
							<div class="d-flex justify-content-center align-items-center" style="height: 80vh">
								<Loader />
							</div>
						{:else}
							<slot />
						{/if}
					</div>
				</div>
				<Footer />
			</div>
			<a class="border rounded d-inline scroll-to-top" href="#page-top"
				><i class="fas fa-angle-up" /></a
			>
		</div>
	</div>
{/if}
