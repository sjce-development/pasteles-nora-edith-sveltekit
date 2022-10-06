<script lang="ts">
	import Sidebar from '../lib/components/Sidebar.svelte';
	import Navbar from '../lib/components/Navbar.svelte';
	import Footer from '../lib/components/Footer.svelte';

	import 'sweetalert2/src/sweetalert2.scss';
	import { browser } from '$app/environment';
	import type { LayoutData } from '.svelte-kit/types/src/routes/$types';
	import type { User } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';

	let user: User | null;

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
						<slot />
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
