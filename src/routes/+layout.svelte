<script lang="ts">
	import Sidebar from '../lib/components/Sidebar.svelte';
	import Navbar from '../lib/components/Navbar.svelte';
	import Footer from '../lib/components/Footer.svelte';

	import 'sweetalert2/src/sweetalert2.scss';
</script>

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
<a class="border rounded d-inline scroll-to-top" href="#page-top"><i class="fas fa-angle-up" /></a>
