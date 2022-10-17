<script lang="ts">
	export let title: string;
	export let data: string | number;
	export let icon: string;
</script>

<div class="card shadow border-start-primary py-2">
	<div class="card-body">
		<div class="row align-items-center no-gutters">
			<div class="col me-2">
				<div class="text-uppercase text-primary fw-bold text-xs mb-1">
					<span>{title}</span>
				</div>
				<div class="text-dark fw-bold h5 mb-0"><span>{data}</span></div>
			</div>
			<div class="col-auto"><i class="{icon} fa-2x text-gray-300" /></div>
		</div>
	</div>
</div>
