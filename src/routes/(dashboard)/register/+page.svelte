<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';

	let email: string;
	let password: string;
	let confirmPassword: string;

	async function register() {
		if (password !== confirmPassword) {
			alert('Las contraseñas no coinciden');
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
</script>

<!-- Register bootstral form -->
<div class="container">
	<h3>Register</h3>
	<form>
		<div class="form-group">
			<label for="email">Correo</label>
			<input
				type="email"
				class="form-control"
				id="email"
				placeholder="Ingrese el correo electrónico"
				bind:value={email}
			/>
		</div>
		<div class="form-group">
			<label for="password">Contraseña</label>
			<input
				type="password"
				class="form-control"
				id="password"
				placeholder="Contraseña"
				bind:value={password}
			/>
		</div>
		<div class="form-group">
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
		<div class="my-3">
			<button class="btn btn-primary" on:click|preventDefault={register}>Registrar</button>
		</div>
	</form>
</div>
