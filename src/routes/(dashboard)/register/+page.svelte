<script lang="ts">
	import { Roles } from '$lib/constants';
	import type { UserProfile } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import Utils from '$lib/utils';
	import Swal from 'sweetalert2';

	let email: string;
	let password: string;
	let confirmPassword: string;
	let selectedRole: string;
	let nombre: string;
	let telefono: string;

	async function register() {
		if (password !== confirmPassword) {
			alert('Las contraseñas no coinciden');
			return;
		}

		if (!nombre) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Debes ingresar un nombre'
			});
			return;
		}

		if (!telefono) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Debes ingresar un teléfono'
			});
			return;
		}

		if (!email) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Debes ingresar un correo electrónico'
			});
			return;
		}

		let { user, error } = await supabase.auth.signUp({ email, password });

		if (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: error.message
			});
		} else {
			await Swal.fire({
				title: '¡Registro exitoso!',
				text: 'Ahora puedes iniciar sesión',
				icon: 'success',
				confirmButtonText: 'Aceptar'
			});
		}
	}

	// async function checkIfUserExists(): Promise<boolean> {
		
	// }

	async function createUserProfile() {
		const user = supabase.auth.user();
		if (user === null) {
			alert('user is null');
			return;
		}
		let { data, error } = await supabase.from<UserProfile>('profile').insert([
			{
				user_id: user.id,
				nombre,
				telefono,
				role: selectedRole
			}
		]);

		if (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: error.message
			});
		} else {
			await Swal.fire({
				title: '¡Registro exitoso!',
				text: 'Ahora puedes iniciar sesión',
				icon: 'success',
				confirmButtonText: 'Aceptar'
			});
		}
	}
</script>

<!-- Register bootstral form -->
<div class="container">
	<h3>Register</h3>
	<form>
		<div class="form-group mb-3">
			<label for="email">Correo</label>
			<input
				type="email"
				class="form-control"
				id="email"
				placeholder="Ingrese el correo electrónico"
				bind:value={email}
			/>
		</div>
		<!-- Nombre -->
		<div class="form-group mb-3">
			<label for="nombre">Nombre</label>
			<input
				type="text"
				class="form-control"
				id="nombre"
				placeholder="Ingrese el nombre"
				bind:value={nombre}
			/>
		</div>
		<!-- Telefono -->
		<div class="form-group mb-3">
			<label for="telefono">Telefono</label>
			<input
				type="text"
				class="form-control"
				id="telefono"
				placeholder="Ingrese el telefono"
				bind:value={telefono}
			/>
		</div>
		<div class="form-group mb-3">
			<label for="password">Contraseña</label>
			<input
				type="password"
				class="form-control"
				id="password"
				placeholder="Contraseña"
				bind:value={password}
			/>
		</div>
		<div class="form-group mb-3">
			<!-- confirm password -->
			<label for="confirm-password">Confirmar contraseña</label>
			<input
				type="password"
				class="form-control"
				id="confirm-password"
				placeholder="Repetir contraseña"
				bind:value={confirmPassword}
			/>
		</div>
		<div class="form-group mb-3">
			<label for="select-role">Selecciona un rol</label>
			<select class="form-select" id="select-role" bind:value={selectedRole}>
				{#each Object.values(Roles) as role}
					<option value={role}>{Utils.capitalize(role)}</option>
				{/each}
			</select>
		</div>
		<button class="btn btn-primary" on:click|preventDefault={register}>Registrar</button>
	</form>
</div>
