<script lang="ts">
	import { goto } from '$app/navigation';
	import { Roles } from '$lib/constants';
	import type { UserProfile } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import Utils from '$lib/utils';
	import type { User } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';

	let user: User | null;
	let profile: UserProfile;
	onMount(async () => {
		// check if user is logged in
		user = supabase.auth.user();
		if (!user) {
			goto('/login');
			return;
		}
		const res = await fetch(`/api/users?user_id=${user.id}`);
		profile = await res.json();
		console.log(profile);
	});

	async function logout() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: error.message
			});
		}
		window.location.reload();
	}
</script>

<nav class="navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top">
	<div class="container-fluid">
		<!-- Burger menu -->
		<!-- <button class="btn btn-link d-md-none rounded-circle me-3" id="sidebarToggleTop" type="button"
			><i class="fas fa-bars" />
		</button> -->
		<!-- Search bar -->
		<!-- <form class="d-none d-sm-inline-block me-auto ms-md-3 my-2 my-md-0 mw-100 navbar-search">
			<div class="input-group">
				<input
					class="bg-light form-control border-0 small"
					type="text"
					placeholder="Buscar por..."
				/><button class="btn btn-primary py-0" type="button"><i class="fas fa-search" /></button>
			</div>
		</form> -->
		<ul class="navbar-nav flex-nowrap ms-auto">
			<!-- <li class="nav-item dropdown d-sm-none no-arrow">
				<a
					class="dropdown-toggle nav-link"
					aria-expanded="false"
					data-bs-toggle="dropdown"
					href="#!"><i class="fas fa-search" /></a
				>
				<div
					class="dropdown-menu dropdown-menu-end p-3 animated--grow-in"
					aria-labelledby="searchDropdown"
				>
					<form class="me-auto navbar-search w-100">
						<div class="input-group">
							<input
								class="bg-light form-control border-0 small"
								type="text"
								placeholder="Search for ..."
							/>
							<div class="input-group-append">
								<button class="btn btn-primary py-0" type="button"
									><i class="fas fa-search" /></button
								>
							</div>
						</div>
					</form>
				</div>
			</li> -->
			<!-- Configuracion -->
			<li class="nav-item dropdown no-arrow mx-1">
				<div class="nav-item dropdown no-arrow">
					<a class="nav-link" href="/configuracion"><i class="fa-solid fa-gear" /></a>
				</div>
			</li>
			<!-- Notificaciones -->
			<!-- <li class="nav-item dropdown no-arrow mx-1">
				<div class="nav-item dropdown no-arrow">
					<a
						class="dropdown-toggle nav-link"
						aria-expanded="false"
						data-bs-toggle="dropdown"
						href="#!"
						><span class="badge bg-danger badge-counter">7</span><i
							class="fas fa-envelope fa-fw"
						/></a
					>
					<div class="dropdown-menu dropdown-menu-end dropdown-list animated--grow-in">
						<h6 class="dropdown-header">alerts center</h6>
						<a class="dropdown-item d-flex align-items-center" href="#!">
							<div class="dropdown-list-image me-3">
								<img class="rounded-circle" src="assets/img/avatars/avatar4.jpeg" alt="asd" />
								<div class="bg-success status-indicator" />
							</div>
							<div class="fw-bold">
								<div class="text-truncate">
									<span
										>Hi there! I am wondering if you can help me with a problem I've been having.</span
									>
								</div>
								<p class="small text-gray-500 mb-0">Emily Fowler - 58m</p>
							</div>
						</a><a class="dropdown-item d-flex align-items-center" href="#!">
							<div class="dropdown-list-image me-3">
								<img class="rounded-circle" src="assets/img/avatars/avatar2.jpeg" alt="" />
								<div class="status-indicator" />
							</div>
							<div class="fw-bold">
								<div class="text-truncate">
									<span>I have the photos that you ordered last month!</span>
								</div>
								<p class="small text-gray-500 mb-0">Jae Chun - 1d</p>
							</div>
						</a><a class="dropdown-item d-flex align-items-center" href="#!">
							<div class="dropdown-list-image me-3">
								<img class="rounded-circle" src="assets/img/avatars/avatar3.jpeg" alt="" />
								<div class="bg-warning status-indicator" />
							</div>
							<div class="fw-bold">
								<div class="text-truncate">
									<span
										>Last month's report looks great, I am very happy with the progress so far, keep
										up the good work!</span
									>
								</div>
								<p class="small text-gray-500 mb-0">Morgan Alvarez - 2d</p>
							</div>
						</a><a class="dropdown-item d-flex align-items-center" href="#!">
							<div class="dropdown-list-image me-3">
								<img class="rounded-circle" src="assets/img/avatars/avatar5.jpeg" alt="" />
								<div class="bg-success status-indicator" />
							</div>
							<div class="fw-bold">
								<div class="text-truncate">
									<span
										>Am I a good boy? The reason I ask is because someone told me that people say
										this to all dogs, even if they aren't good...</span
									>
								</div>
								<p class="small text-gray-500 mb-0">Chicken the Dog · 2w</p>
							</div>
						</a><a class="dropdown-item text-center small text-gray-500" href="#!"
							>Show All Alerts</a
						>
					</div>
				</div>
				<div
					class="shadow dropdown-list dropdown-menu dropdown-menu-end"
					aria-labelledby="alertsDropdown"
				/>
			</li> -->
			<div class="d-none d-sm-block topbar-divider" />
			<li class="nav-item dropdown no-arrow">
				<div class="nav-item dropdown no-arrow">
					<a
						class="dropdown-toggle nav-link"
						aria-expanded="false"
						data-bs-toggle="dropdown"
						href="/profile"
						><span class="d-none d-lg-inline me-2 text-gray-600 small"
							>{#if profile}
								{Utils.capitalize(profile.nombre)} | {Utils.capitalize(profile.role)}
							{/if}</span
						><img class="border rounded-circle img-profile" src="/assets/img/logo.png" alt="" /></a
					>
					<div class="dropdown-menu shadow dropdown-menu-end animated--grow-in">
						<a class="dropdown-item" href="/configuracion/usuarios/{user?.id ?? 0}"
							><i class="fas fa-user fa-sm fa-fw me-2 text-gray-400" />&nbsp;Profile</a
						>
						{#if profile && profile.role === Roles.admin}
							<a class="dropdown-item" href="/configuracion"
								><i class="fas fa-cogs fa-sm fa-fw me-2 text-gray-400" />&nbsp;Configuración</a
							>
							<a class="dropdown-item" href="/configuracion/usuarios"
								><i class="fas fa-list fa-sm fa-fw me-2 text-gray-400" />&nbsp;Manejar Usuarios</a
							>
						{/if}
						<div class="dropdown-divider" />
						<span class="dropdown-item pointer" on:click={logout}
							><i class="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400" />&nbsp;Logout</span
						>
					</div>
				</div>
			</li>
		</ul>
	</div>
</nav>

<style>
	.pointer {
		cursor: pointer;
	}
</style>
