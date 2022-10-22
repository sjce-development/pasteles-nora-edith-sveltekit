<script lang="ts">
	import type { PageData } from '.svelte-kit/types/src/routes/(dashboard)/$types';
	import FullCalendar, { Calendar, type CalendarOptions } from 'svelte-fullcalendar';
	import bootstrap5Plugin from '@fullcalendar/bootstrap5';
	import daygridPlugin from '@fullcalendar/daygrid';
	import interactionPlugin from '@fullcalendar/interaction';
	import type { Orden } from '$lib/models';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';
	import Utils from '$lib/utils';

	export let data: PageData;

	let options: CalendarOptions = {
		eventClick: goToOrden,
		events: data.ordenes.map((orden: Orden) => {
			return {
				title: orden.nombre,
				date: orden.hora_de_entrega,
				extendedProps: {
					id: orden.id
				}
			};
		}),
		initialView: 'dayGridMonth',
		plugins: [daygridPlugin, bootstrap5Plugin, interactionPlugin],
		themeSystem: 'bootstrap5',
		locale: 'es',
		timeZone: 'America/Phoenix',
		selectable: true,
		select: selectedDates
	};

	onMount(() => {
		window.addEventListener('resize', () => {});
	});

	async function selectedDates(selectInfo: any) {
		const start: Date = selectInfo.start;
		const end: Date = selectInfo.end;

		// Filter orden hora_de_entrega by start and end
		const ordenes = data.ordenes.filter((orden: Orden) => {
			const hora_de_entrega = new Date(orden.hora_de_entrega);
			return hora_de_entrega >= start && hora_de_entrega <= end;
		});

		// Alert with Swal if we want to print those ordenes, add order nombre and orden hora de entrega to the swal
		if (ordenes.length > 0) {
			const { value: accept } = await Swal.fire({
				title: '¿Desea imprimir las ordenes?',
				html: `
					${ordenes.map((orden: Orden) => {
						return `
							<div class="d-flex justify-content-between">
								<div>${orden.nombre}</div>
								<div>${Utils.formatDate(orden.hora_de_entrega)}</div>
							</div>
						`;
					})}
				`,
				icon: 'question',
				showCancelButton: true,
				confirmButtonText: 'Imprimir',
				cancelButtonText: 'Cancelar'
			});

			if (accept) {
				goto('/pdf?ordenes=' + ordenes.map((orden: Orden) => orden.id).join(','));
			}
		}
	}

	async function goToOrden(event: any) {
		const { id } = event.event.extendedProps;
		// window.location.href = `/ordenes/${id}`;
		await goto(`/ordenes/${id}`);
	}
</script>

<h3 class="text-dark mb-4">Agenda</h3>
<div class="container">
	<FullCalendar {options} />
</div>
