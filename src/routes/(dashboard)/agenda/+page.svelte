<script lang="ts">
	import FullCalendar, { type CalendarOptions } from 'svelte-fullcalendar';
	import daygridPlugin from '@fullcalendar/daygrid';

	let options: CalendarOptions = {
		dateClick: (event) => {
			alert('date click! ' + event.dateStr);
		},
		events: [
			{ title: 'event 1', date: '2022-10-01' },
			{ title: 'event 2', date: '2022-10-02' }
		],
		initialView: 'dayGridMonth',
		plugins: [daygridPlugin]
	};
</script>

<h3 class="text-dark mb-4">Agenda</h3>
<div class="container w-">
	<FullCalendar {options} />
</div>
