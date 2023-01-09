<script lang="ts">
	import { Estados, type Orden, type Ticket, type UserProfile } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import Utils from '$lib/utils';
	import Especificacion from '$lib/components/alerts/Especificacion.svelte';
	import { goto } from '$app/navigation';
	import Swal from 'sweetalert2';
	import { dateRanges, pageSizes } from '$lib/constants';
	import { onMount } from 'svelte';
	import type { User } from '@supabase/supabase-js';

	export let ordenes: Orden[] = [];

	export let pagination: {
		page: number;
		pageSize: number;
		from: number;
		to: number;
	};
	export let count: number;
	export let selectedDateRange: number;

	let searchValue: string;

	let filteredOrdenes: Orden[] = [];

	let user: User | null;

	onMount(() => {
		searchValue = '';
		filteredOrdenes = ordenes;
		user = supabase.auth.user();
	});

	function goToPdf() {
		const ordenesIds = ordenes
			.filter((orden: Orden) => orden.impreso === false)
			.map((orden: Orden) => orden.id);
		if (ordenesIds.length === 0) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'No hay ordenes por imprimir',
				showCancelButton: true,
				confirmButtonText: 'Save'
			});
			return;
		}
		const url = `/pdf?ordenes=${ordenesIds.join(',')}`;
		window.open(url, '_blank');
		window.location.reload();
	}

	async function goToOrden(id: number): Promise<void> {
		if (id === -1) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'No se pudo encontrar la orden'
			}).then(() => {
				return;
			});
		}
		goto(`/ordenes/${id}`);
	}

	async function deleteOrden(id: number): Promise<void> {
		// Ask for confirmation
		const { isConfirmed } = await Swal.fire({
			title: '¿Estás seguro?',
			text: 'No podrás revertir esta acción',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar'
		});

		if (isConfirmed == false) {
			return;
		}

		const { error } = await supabase.from<Orden>('ordenes').delete().match({ id });
		if (error) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'No se pudo eliminar la orden'
			}).then(() => {
				return;
			});
		}
		Swal.fire({
			icon: 'success',
			title: 'Orden eliminada',
			text: 'La orden se ha eliminado correctamente'
		});
		window.location.reload();
	}

	async function marcarOrdenComoPagada(id: number): Promise<void> {
		const { isConfirmed } = await Swal.fire({
			title: '¿Estás seguro?',
			text: 'Podrás revertir esta acción',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí, marcar como pagado'
		});
		if (isConfirmed) {
			await supabase.from('ordenes').update({ pagado: true }).eq('id', id);
			window.location.reload();
		}
	}

	async function actualizarEstadoDeImpresion(orden: Orden) {
		const { isConfirmed } = await Swal.fire({
			title: `¿Estás seguro de cambiar la orden a ${orden.impreso ? 'no impreso' : 'impreso'}?`,
			text: 'Podrás revertir esta acción',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: `Sí, marcar como ${orden.impreso ? 'no impreso' : 'impreso'}`
		});
		if (isConfirmed) {
			if (orden.id === undefined) {
				return;
			}
			await supabase.from('ordenes').update({ impreso: !orden.impreso }).eq('id', orden.id);
			window.location.reload();
		}
	}

	async function cambiarEstadoDeOrden(id: number): Promise<void> {
		const { value: estado } = await Swal.fire({
			title: 'Cambiar estado de orden',
			input: 'select',
			inputOptions: {
				[Estados.pendiente]: 'Pendiente',
				[Estados.en_curso]: 'En curso',
				[Estados.terminado]: 'Terminado'
			},
			inputPlaceholder: 'Selecciona un estado',
			showCancelButton: true,
			inputValidator: (value) => {
				return value ? null : 'Debes seleccionar un estado';
			}
		});
		if (estado) {
			await supabase.from('ordenes').update({ estado }).eq('id', id);
			window.location.reload();
		}
	}

	function changeDateRange() {
		const url = new URL(window.location.href);
		url.searchParams.set('page', '1');
		url.searchParams.set('pageSize', pagination.pageSize.toString());
		url.searchParams.set('dateRange', selectedDateRange.toString());
		goto(url);
	}

	const handleSearch = () => {
		filteredOrdenes = ordenes.filter((orden: Orden) => {
			return (
				orden.telefono.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
				orden.nombre.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
				orden.tamano.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
				orden.harina.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
				orden.relleno.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
				(orden?.created_at ?? '').toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
				orden.anticipo.toString().includes(searchValue.toLocaleLowerCase()) ||
				orden.estado.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
				(orden?.total ?? 0).toString().includes(searchValue.toLocaleLowerCase()) ||
				orden.decorado.find((decorado) =>
					decorado.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
				)
			);
		});
	};

	const imprimirTicket = async (orden: Orden) => {
		const { isConfirmed } = await Swal.fire({
			title: '¿Quieres imprimir el ticket?',
			showDenyButton: true,
			confirmButtonText: 'Imprimir',
			denyButtonText: 'Cancelar'
		});

		if (isConfirmed) {
			const { data: profile } = await supabase
				.from<UserProfile>('profile')
				.select('*')
				.eq('user_id', user?.id)
				.single();

			if (!profile) {
				await Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: `No se pudo imprimir el ticket. ${user?.email} no tiene un perfil asociado`
				});
				return;
			}

			const { data: ticket, error } = await supabase.from<Ticket>('tickets').insert({
				persona_turno: profile.nombre,
				productos: [
					{
						id: orden.id?.toString() ?? '0',
						nombre: `Pastel de ${orden.nombre}`,
						cantidad: 1,
						precio: orden.total ?? 0
					}
				]
			});
			if (error) {
				await Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: `No se pudo imprimir el ticket. ${error.message}`
				});
				return;
			}
			window.open(`ticket?ticketId=${ticket[0].id}`, '_blank');
		}
	};
</script>

<div class="card shadow">
	<div class="card-header py-3">
		<span class="text-primary m-0 fw-bold">Ordenes</span>
		<span>
			<button class="btn btn-primary btn-sm" type="button" on:click={goToPdf}>
				<i class="fa-solid fa-print" /> Imprimir ordenes
			</button>
		</span>
	</div>
	<div class="card-body">
		<div class="row">
			<div class="col-md-6 text-nowrap">
				<label class="form-label"
					>Mostrar
					<select
						class="d-inline-block form-select form-select-sm"
						bind:value={pagination.pageSize}
					>
						{#each pageSizes as pageSize}
							<option value={pageSize} selected={pagination.pageSize === pageSize}
								>{pageSize}</option
							>
						{/each}
					</select>
					<select
						class="d-inline-block form-select form-select-sm"
						bind:value={selectedDateRange}
						on:change={changeDateRange}
					>
						{#each dateRanges as dateRange}
							{#if selectedDateRange === dateRange.value}
								<option selected value={dateRange.value}>{dateRange.label}</option>
							{:else}
								<option value={dateRange.value}>{dateRange.label}</option>
							{/if}
						{/each}
					</select>
					<a
						class="btn btn-primary"
						href="/ordenes?page={pagination.page}&pageSize={pagination.pageSize}"
						role="button">Cambiar</a
					>
				</label>
			</div>
			<div class="col-md-6">
				<div class="text-md-end dataTables_filter" id="dataTable_filter">
					<label class="form-label"
						><input
							type="search"
							class="form-control form-control-sm"
							aria-controls="dataTable"
							placeholder="Search"
							bind:value={searchValue}
							on:keyup={handleSearch}
						/></label
					>
				</div>
			</div>
		</div>
		<div
			class="table-responsive table mt-2"
			id="dataTable"
			role="grid"
			aria-describedby="dataTable_info"
		>
			<table class="table my-0" id="dataTable">
				<thead>
					<tr>
						<th class="fit">Impreso</th>
						<th>ID</th>
						<th>Telefono</th>
						<th>Nombre</th>
						<th>Tamaño</th>
						<th>Harina</th>
						<th>Relleno</th>
						<th class="fit">Especificaciones</th>
						<th>Fecha de entrega</th>
						<th>Anticipo</th>
						<th>Restante</th>
						<th class="fit">Estado</th>
						<th class="fit">Pagado</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{#each filteredOrdenes as orden}
						<tr>
							<td
								class="fit"
								on:click={() => {
									actualizarEstadoDeImpresion(orden);
								}}
							>
								{#if orden.impreso}
									<i title="Impreso" style="color: green" class="fa-solid fa-print" />
								{:else}
									<i title="Impresión pendiente" style="color: orange" class="fa-solid fa-clock" />
								{/if}
							</td>
							<td>{orden.id}</td>
							<td>{Utils.formatPhoneNumber(orden.telefono)}</td>
							<td>{Utils.capitalize(orden.nombre)}</td>
							<td>{orden.tamano}</td>
							<td>{orden.harina}</td>
							<td>{orden.relleno}</td>
							<td class="fit">
								{#each orden.decorado as especificacion}
									<Especificacion {especificacion} />
								{/each}
							</td>
							<td class="fit">{Utils.formatHoraDeEntrega(orden.hora_de_entrega)}</td>
							<td>{Utils.formatCurrency(orden.anticipo)}</td>
							<td>{Utils.formatCurrency((orden.total || 0) - orden.anticipo)}</td>

							<td
								class="pointer"
								on:click={() => {
									cambiarEstadoDeOrden(orden.id ?? -1);
								}}
							>
								{#if orden.estado === Estados.terminado}
									<span title="Terminado">✅</span>
								{:else if orden.estado === Estados.en_curso}
									<span title="En curso">🕛</span>
								{:else}
									<span title="Pendiente">❌</span>
								{/if}
							</td>
							<td
								class="pointer"
								on:click={() => {
									marcarOrdenComoPagada(orden.id || -1);
								}}
							>
								{#if orden.pagado}
									<span title="Pagado">✅</span>
								{:else}
									<span title="Pago pendiente">❌</span>
								{/if}
							</td>
							<td class="fit">
								<button
									class="btn btn-primary btn-sm"
									type="button"
									on:click={() => goToOrden(orden.id || -1)}
									title="Editar orden"
								>
									<i class="fas fa-edit" />
								</button>
								<button
									class="btn btn-danger btn-sm"
									type="button"
									on:click={() => deleteOrden(orden.id || -1)}
									title="Eliminar orden"
								>
									<i class="fas fa-trash" />
								</button>
								<button
									class="btn btn-primary btn-sm"
									type="button"
									on:click={() => imprimirTicket(orden)}
									title="Imprimir ticket"
								>
									<i class="fa-solid fa-receipt" />
								</button>
								<button
									class="btn btn-primary btn-sm"
									type="button"
									title="Pago de orden"
									on:click={() => goto(`/ordenes/pagar?ordenId=${orden.id}`)}
								>
									<i class="fa-regular fa-money-bill-1" />
								</button>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="12" class="text-center"> No hay ordenes </td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div class="row">
			<div class="col-md-6 align-self-center">
				<p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">
					Mostrando {pagination.from === 0 ? 1 : pagination.from} a {pagination.to === 0
						? 1
						: pagination.to} de {count}
				</p>
			</div>
			<div class="col-md-6">
				<nav class="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
					<ul class="pagination">
						{#if pagination.page > 1}
							<li class="page-item">
								<a
									class="page-link"
									aria-label="Previous"
									href="/ordenes?page={pagination.page - 1}&pageSize={pagination.pageSize}"
								>
									<span aria-hidden="true">«</span>
								</a>
							</li>
							<li class="page-item">
								<a
									class="page-link"
									aria-label="Next"
									href="/ordenes?page={pagination.page - 1}&pageSize={pagination.pageSize}"
								>
									<span aria-hidden="true">{pagination.page - 1}</span>
								</a>
							</li>
						{/if}
						<li class="page-item">
							<a class="page-link active" href="/ordenes?page=${pagination.page}"
								>{pagination.page}</a
							>
						</li>
						{#if pagination.page * pagination.pageSize < count}
							<li class="page-item">
								<a
									class="page-link"
									aria-label="Next"
									href="/ordenes?page={pagination.page + 1}&pageSize={pagination.pageSize}"
									><span aria-hidden="true">{pagination.page + 1}</span></a
								>
							</li>
							<li class="page-item">
								<a
									class="page-link"
									aria-label="Next"
									href="/ordenes?page={pagination.page + 1}&pageSize={pagination.pageSize}"
									><span aria-hidden="true">»</span></a
								>
							</li>
						{/if}
					</ul>
				</nav>
			</div>
		</div>
	</div>
</div>
