<script context="module">
	import Chart from 'chart.js/auto';
</script>

<script lang="ts">
	export let config: any;
	export let width: any;
	export let height: any;

	const handleChart = (element: any, config: any) => {
		let chart = new Chart(element, config);

		return {
			update(config: any) {
				chart.destroy();
				chart = new Chart(element, config);
			},
			destroy() {
				chart.destroy();
			}
		};
	};
</script>

<canvas {width} {height} use:handleChart={config} />
