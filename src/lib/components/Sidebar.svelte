<script lang="ts">
	import { goto } from '$app/navigation';
	import { Roles } from '$lib/constants';
	import type { UserProfile } from '$lib/models';
	import { routes } from '$lib/routes';
	import { supabase } from '$lib/supabase';
	import type { User } from '@supabase/supabase-js';
	import { onMount } from 'svelte';

	let user: User | null;
	let profile: UserProfile | null;
	onMount(async () => {
		user = supabase.auth.user();
		if (user === null) {
			goto('/login');
			return;
		}
		profile = await getProfile();
	})

	async function getProfile(): Promise<UserProfile> {
		if (user === null) {
			goto('/login');
			return {} as UserProfile;
		}
		const { data, error } = await supabase
			.from<UserProfile>('profile')
			.select('*')
			.eq('user_id', user.id)
			.single();
		if (error) {
			return {} as UserProfile;
		}
		if (data) {
			return data;
		} else {
			goto('/login');
			return {} as UserProfile;
		}
	}
</script>

<nav
	class="navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0"
>
	<div class="container-fluid d-flex flex-column p-0">
		<a
			class="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
			href="#!"
		>
			<div class="sidebar-brand-icon rotate-n-15">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="-32 0 512 512"
					width="1em"
					height="1em"
					fill="currentColor"
					style="font-size: 29px;"
				>
					<!--! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. -->
					<path
						d="M352 111.1c22.09 0 40-17.88 40-39.97S352 0 352 0s-40 49.91-40 72S329.9 111.1 352 111.1zM224 111.1c22.09 0 40-17.88 40-39.97S224 0 224 0S184 49.91 184 72S201.9 111.1 224 111.1zM383.1 223.1L384 160c0-8.836-7.164-16-16-16h-32C327.2 144 320 151.2 320 160v64h-64V160c0-8.836-7.164-16-16-16h-32C199.2 144 192 151.2 192 160v64H128V160c0-8.836-7.164-16-16-16h-32C71.16 144 64 151.2 64 160v63.97c-35.35 0-64 28.65-64 63.1v68.7c9.814 6.102 21.39 11.33 32 11.33c20.64 0 45.05-19.73 52.7-27.33c6.25-6.219 16.34-6.219 22.59 0C114.1 348.3 139.4 367.1 160 367.1s45.05-19.73 52.7-27.33c6.25-6.219 16.34-6.219 22.59 0C242.1 348.3 267.4 367.1 288 367.1s45.05-19.73 52.7-27.33c6.25-6.219 16.34-6.219 22.59 0C370.1 348.3 395.4 367.1 416 367.1c10.61 0 22.19-5.227 32-11.33V287.1C448 252.6 419.3 223.1 383.1 223.1zM352 373.3c-13.75 10.95-38.03 26.66-64 26.66s-50.25-15.7-64-26.66c-13.75 10.95-38.03 26.66-64 26.66s-50.25-15.7-64-26.66c-13.75 10.95-38.03 26.66-64 26.66c-11.27 0-22.09-3.121-32-7.377v87.38C0 497.7 14.33 512 32 512h384c17.67 0 32-14.33 32-32v-87.38c-9.91 4.256-20.73 7.377-32 7.377C390 399.1 365.8 384.3 352 373.3zM96 111.1c22.09 0 40-17.88 40-39.97S96 0 96 0S56 49.91 56 72S73.91 111.1 96 111.1z"
					/>
				</svg>
			</div>
			<div class="sidebar-brand-text mx-3"><span>Nora Edith</span></div>
		</a>
		<hr class="sidebar-divider my-0" />
		<ul class="navbar-nav text-light" id="accordionSidebar">
			{#each routes as route}
				{#if profile?.role === Roles.recepcionista && route.name === 'Dashboard'}
					 <!-- content here -->
				{:else}
					<li class="nav-item">
						<a class="nav-link" href={route.path}>
							<i class={route.icon} />
							<span>{route.name}</span>
						</a>
					</li>
				{/if}
			{/each}
		</ul>
		<div class="text-center d-none d-md-inline">
			<button class="btn rounded-circle border-0" id="sidebarToggle" type="button" />
		</div>
	</div>
</nav>
