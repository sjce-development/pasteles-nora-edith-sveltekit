<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';

	let email: string = '';
	let password: string = '';

	onMount(async () => {
		const user = supabase.auth.user();
		if (user) {
			window.location.href = '/';
		}
	});

	async function login() {
		const { user, error } = await supabase.auth.signIn({
			email,
			password
		});
		if (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: error.message
			});
		}
		window.location.href = '/';
	}
</script>

<body class="bg-gradient-primary">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-md-9 col-lg-12 col-xl-10">
				<div class="card shadow-lg o-hidden border-0 my-5">
					<div class="card-body p-0">
						<div class="row">
							<div class="col-lg-6 d-none d-lg-flex">
								<div
									class="flex-grow-1 bg-login-image"
									style="background-image: url(&quot;assets/img/dogs/image3.jpeg&quot;);"
								/>
							</div>
							<div class="col-lg-6">
								<div class="p-5">
									<div class="text-center">
										<h4 class="text-dark mb-4">Bienvenido de vuelta!</h4>
									</div>
									<form class="user" on:submit|preventDefault={login}>
										<div class="mb-3">
											<input
												class="form-control form-control-user"
												type="email"
												id="exampleInputEmail"
												aria-describedby="emailHelp"
												placeholder="Enter Email Address..."
												name="email"
												bind:value={email}
											/>
										</div>
										<div class="mb-3">
											<input
												class="form-control form-control-user"
												type="password"
												id="exampleInputPassword"
												placeholder="Password"
												name="password"
												bind:value={password}
											/>
										</div>
										<div class="mb-3">
											<div class="custom-control custom-checkbox small">
												<div class="form-check">
													<input
														class="form-check-input custom-control-input"
														type="checkbox"
														id="formCheck-1"
													/><label class="form-check-label custom-control-label" for="formCheck-1"
														>Remember Me</label
													>
												</div>
											</div>
										</div>
										<button class="btn btn-primary d-block btn-user w-100" type="submit"
											>Login</button
										>
									</form>
									<div class="text-center">
										<a class="small" href="forgot-password.html">Forgot Password?</a>
									</div>
									<br /><br /><br /><br /><br /><br /><br />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
