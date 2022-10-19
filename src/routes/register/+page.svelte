<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	let email: string;
	let password: string;

	async function register() {
		let { user, error } = await supabase.auth.signUp({ email, password });
		if (error) {
			console.log('error', error);
		} else {
			console.log('user', user);
		}
	}
</script>

<!-- Register bootstral form -->
<div class="container">
	<div class="row">
		<div class="col-md-6 offset-md-3">
			<div class="card">
				<div class="card-body">
					<h3 class="card-title">Register</h3>
					<form>
						<div class="form-group">
							<label for="email">Email</label>
							<input
								type="email"
								class="form-control"
								id="email"
								placeholder="Enter email"
								bind:value={email}
							/>
						</div>
						<div class="form-group">
							<label for="password">Password</label>
							<input
								type="password"
								class="form-control"
								id="password"
								placeholder="Password"
								bind:value={password}
							/>
						</div>
						<button class="btn btn-primary" on:click={register}>Submit</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
