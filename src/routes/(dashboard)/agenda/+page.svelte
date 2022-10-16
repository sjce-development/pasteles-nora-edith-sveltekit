<script lang="ts">
	import FullCalendar, { type CalendarOptions } from 'svelte-fullcalendar';
	import daygridPlugin from '@fullcalendar/daygrid';
	import type { Orden } from '$lib/models';
	import type { PageData } from '.svelte-kit/types/src/routes/(dashboard)/$types';

	export let data: PageData;

	let options: CalendarOptions = {
		eventClick: alerta,
		events: data.ordenes?.map((orden: Orden) => {
			return {
				title: orden.nombre,
				date: orden.created_at,
			};
		}),
		initialView: 'dayGridMonth',
		plugins: [daygridPlugin]
	};

	function alerta(event: any) {
		alert(JSON.stringify(event.event, null, 2));
	}
</script>

<h3 class="text-dark mb-4">Agenda</h3>
<div class="container w-">
	<FullCalendar {options} />
</div>
