<script lang="ts">
	import { locale } from '$lib/constants';
	import FullCalendar, { EventApi, type CalendarOptions } from 'svelte-fullcalendar';
	import daygridPlugin from '@fullcalendar/daygrid';
	import type { Orden } from '$lib/models';
	import type { PageData } from '.svelte-kit/types/src/routes/(dashboard)/$types';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let options: CalendarOptions = {
		eventClick: goToOrden,
		events: data.ordenes?.map((orden: Orden) => {
			return {
				title: orden.nombre,
				date: orden.hora_de_entrega,
				extendedProps: {
					id: orden.id
				}
			};
		}),
		initialView: 'dayGridMonth',
		plugins: [daygridPlugin]
	};

	async function goToOrden(event: any) {
		const { id } = event.event.extendedProps;
		goto(`/ordenes/${id}`);
	}
</script>

<h3 class="text-dark mb-4">Agenda</h3>
<div class="container">
	<FullCalendar {options} />
</div>
