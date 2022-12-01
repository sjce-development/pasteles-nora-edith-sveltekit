<script lang="ts">
	import { goto } from '$app/navigation';
	import AgregarPastelModal from '$lib/components/modals/AgregarPastelModal.svelte';
	import { MetodosDePago, PUBLIC_BUCKET } from '$lib/constants';
	import type { CarritoItem, Pastel, Ticket, Venta } from '$lib/models';
	import { supabase } from '$lib/supabase';
	import Utils from '$lib/utils';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';

	let pasteles: Pastel[] = [];
	let carrito: any[] = [];
	let total: number = 0;

	let title: string = 'Agregar pastel';
	let modalId: string = 'agregar-pastel-modal';

	let filteredPasteles: Pastel[] = [];
	let searchValue: string = '';

	let metodoDePago: string = MetodosDePago.efectivo;

	onMount(async () => {
		const { data, error } = await supabase.from<Pastel>('pasteles').select('*');

		if (error) {
			await Swal.fire({
				title: 'Error',
				text: JSON.stringify(error, null, 2),
				icon: 'error',
				confirmButtonText: 'Ok'
			});
		}
		if (data !== null) {
			pasteles = data;
		}
		filteredPasteles = pasteles;
	});

	async function addToCart(index: number) {
		let pastel = filteredPasteles[index];
		// si no hay pasteles, preguntar si quiere agregar mas
		if (pastel.cantidad == 0) {
			const { isConfirmed } = await Swal.fire({
				title: 'No hay pasteles',
				text: '¿Desea agregar más pasteles?',
				icon: 'question',
				showCancelButton: true,
				confirmButtonText: 'Si',
				cancelButtonText: 'No'
			});
			if (isConfirmed) {
				// agregar mas pasteles
				const result = await Swal.fire({
					title: '¿Cuántos pasteles desea agregar?',
					input: 'number',
					inputValue: 1,
					showCancelButton: true,
					confirmButtonText: 'Agregar',
					showLoaderOnConfirm: true,
					backdrop: true,
					preConfirm: (cantidad) => {
						return supabase
							.from<Pastel>('pasteles')
							.update({ cantidad: pastel.cantidad + cantidad })
							.eq('id', pastel.id);
					},
					allowOutsideClick: () => !Swal.isLoading()
				});
				if (result.isConfirmed) {
					const data = (await result?.value)?.data;
					if (data) {
						pastel.cantidad += data[0].cantidad;
						filteredPasteles = [...filteredPasteles];
						pasteles = [...pasteles];
					}
				}
			}
			return;
		}
		if (carrito.includes(pastel)) {
			let indexOfItem = carrito.indexOf(pastel);
			let carritoItem = carrito[indexOfItem];
			if (carritoItem.cantidadCarrito === carritoItem.cantidad) {
				// Cant add item to cart
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'No hay más pasteles disponibles para agregar al carrito'
				});
				return;
			}
			if (carritoItem.hasOwnProperty('cantidadCarrito')) {
				carritoItem.cantidadCarrito += 1;
			} else {
				carritoItem.cantidadCarrito = 2;
			}
			carrito = [...carrito];
		} else {
			carrito = [...carrito, filteredPasteles[index]];
			carrito[carrito.length - 1].cantidadCarrito = 1;
		}
		getCartTotal();
	}

	function getCartTotal() {
		total = 0;
		carrito.forEach((item) => {
			total += item.cantidadCarrito * item.precio;
		});
	}

	function removeFromCart(item: any): any {
		let indexOfItem = carrito.indexOf(item);
		carrito.splice(indexOfItem, 1);
		carrito = [...carrito];
		getCartTotal();
	}

	async function realizarVenta() {
		if (carrito.length === 0) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'No hay pasteles en el carrito'
			});
			return;
		}
		const result = await Swal.fire({
			title: '¿Estás seguro?',
			text: '¿Estás seguro de realizar la venta?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí, realizar venta'
		});
		if (result.isConfirmed) {
			carrito.forEach(async (item: CarritoItem) => {
				await supabase
					.from<Pastel>('pasteles')
					.update({ cantidad: item.cantidad - item.cantidadCarrito })
					.eq('id', item.id);
				await supabase.from<Venta>('ventas').insert([
					{
						nombre: item.nombre,
						cantidad: item.cantidadCarrito,
						total,
						tipo_de_pago: metodoDePago
					}
				]);
			});
			Swal.fire('Venta realizada', 'La venta se ha realizado correctamente', 'success').then(() => {
				carrito = [];
				total = 0;
				metodoDePago = 'Efectivo';
			});
			// Desea imprimir ticket
			const { isConfirmed } = await Swal.fire({
				title: '¿Desea imprimir el ticket?',
				icon: 'question',
				showCancelButton: true,
				confirmButtonText: 'Si',
				cancelButtonText: 'No'
			});
			if (isConfirmed) {
				crearTicket();
			} else {
				window.location.reload();
			}
		}
	}

	async function crearTicket() {
		let ticket = {} as Ticket;
		ticket.persona_turno = 'Juan';
		ticket.productos = carrito.map((item) => {
			return {
				id: item.id,
				nombre: item.nombre,
				cantidad: item.cantidadCarrito,
				precio: item.precio
			};
		});
		const { data, error } = await supabase.from<Ticket>('tickets').insert([ticket]).single();
		if (error) {
			console.log(error);
			return;
		}
		goto(`ticket?ticket=${data.id}`);
	}

	async function deletePastel(pastelIndex: number) {
		const pastel = pasteles[pastelIndex];

		const { isConfirmed } = await Swal.fire({
			title: '¿Estás seguro?',
			text: '¿Estás seguro de eliminar el pastel?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí, eliminar'
		});

		if (isConfirmed) {
			await supabase.from<Pastel>('pasteles').delete().eq('id', pastel.id);
			await supabase.storage.from('pasteles').remove([pastel.nombre]);
			await Swal.fire('Eliminado', 'El pastel se ha eliminado correctamente', 'success');
			window.location.reload();
		}
	}

	function getImage(pastel: Pastel) {
		return `${PUBLIC_BUCKET}pasteles/${pastel.nombre}`;
	}

	function handleSearch() {
		if (searchValue === '') {
			filteredPasteles = [...pasteles];
			return;
		}
		filteredPasteles = pasteles.filter((pastel: Pastel) =>
			pastel.nombre.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
		);
		filteredPasteles = [...filteredPasteles];
		console.log(filteredPasteles);
	}

	function resetSearch() {
		searchValue = '';
		filteredPasteles = [...pasteles];
	}
</script>

<h3 class="text-dark mb-4">
	Punto de venta
	<span>
		<button
			type="button"
			class="btn btn-primary"
			data-bs-toggle="modal"
			data-bs-target="#{modalId}"
		>
			{title}</button
		>
	</span>
</h3>
<div class="row">
	<div class="col-sm-5">
		<div class="card shadow">
			<div class="card-header py-3">
				<p class="text-primary m-0 fw-bold">Cuenta</p>
				<hr />
				<label for="" class="form-label">Metodo de pago</label>
				<select class="form-select" bind:value={metodoDePago}>
					{#each Object.values(MetodosDePago) as value}
						<option {value}>{value}</option>
					{/each}
				</select>
			</div>
			<div class="card-body">
				<div
					class="table-responsive table mt-2"
					id="dataTable"
					role="grid"
					aria-describedby="dataTable_info"
				>
					<table class="table my-0" id="dataTable">
						<thead>
							<tr>
								<th>Imagen</th>
								<th>Nombre</th>
								<th>Precio</th>
								<th>Cantidad</th>
								<th>Total</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{#each carrito as item}
								<tr>
									{#if item.hasImage}
										<td>
											<img
												class="img-fluid img-thumbnail"
												src={getImage(item)}
												alt={item.nombre}
												width="100"
											/>
										</td>
									{:else}
										<td>
											<img
												class="img-fluid img-thumbnail"
												src="https://via.placeholder.com/150"
												alt={item.nombre}
												width="100"
											/>
										</td>
									{/if}
									<td>
										{item.nombre}
									</td>
									<td>{item.precio}</td>
									<td>{item.cantidadCarrito}</td>
									<td>{Utils.formatCurrency(item.cantidadCarrito * item.precio)}</td>
									<td>
										<button class="btn btn-danger btn-sm" on:click={() => removeFromCart(item)}
											>X</button
										>
									</td>
								</tr>
							{:else}
								<tr>
									<td colspan="5">No hay productos en el carrito</td>
								</tr>
							{/each}
						</tbody>
						<tfoot>
							<tr>
								<td><strong>Total: </strong>{Utils.formatCurrency(total)}</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</div>
		<button type="button" class="btn btn-primary text-light flex w-100" on:click={realizarVenta}
			>Realizar venta</button
		>
	</div>
	<div class="col-sm-7">
		<div class="card shadow">
			<div class="card-header py-3">
				<p class="text-primary m-0 fw-bold">Productos en existencia</p>
			</div>
			<div class="card-body">
				<div class="row">
					<div class="col-md-6 text-nowrap">
						<div class="text-md">
							<label class="form-label"
								><input
									type="search"
									class="form-control form-control-sm"
									placeholder="Busqueda"
									bind:value={searchValue}
									on:change={handleSearch}
								/></label
							>
							<button type="button" class="btn btn-primary" on:click={resetSearch}
								>Reiniciar filtro</button
							>
						</div>
						<!-- <div id="dataTable_length" class="dataTables_length" aria-controls="dataTable">
						</div> -->
					</div>
					<div class="col-md-6" />
				</div>
				<div class="table-responsive table mt-2" role="grid">
					<table class="table my-0 table-hover">
						<thead>
							<tr>
								<th>Nombre</th>
								<th>Precio</th>
								<th>Cantidad</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{#if filteredPasteles}
								{#each filteredPasteles as pastel, i}
									<tr>
										{#if pastel.hasImage}
											<td class="pointer" on:click={() => addToCart(i)}
												><img
													class="rounded-circle me-2"
													width="30"
													height="30"
													src={getImage(pastel)}
													alt={pastel.nombre}
												/>{pastel.nombre}</td
											>
										{:else}
											<td class="pointer" on:click={() => addToCart(i)}
												><img
													class="rounded-circle me-2"
													width="30"
													height="30"
													src="https://via.placeholder.com/150"
													alt={pastel.nombre}
												/>{pastel.nombre}</td
											>
										{/if}
										<td class="pointer" on:click={() => addToCart(i)}>{pastel.precio}</td>
										<td class="pointer" on:click={() => addToCart(i)}>{pastel.cantidad}</td>
										<td>
											<!-- Borrar pastel -->
											<button class="btn btn-danger btn-sm" on:click={() => deletePastel(i)}
												><i class="fa-solid fa-x" /></button
											>
											<!-- Editar pastel -->
											<button
												class="btn btn-warning btn-sm"
												on:click={() => goto(`pos/${pastel.nombre}`)}
												><i class="fa-solid fa-pen" /></button
											>
										</td>
									</tr>
								{/each}
							{:else}
								Loading
							{/if}
						</tbody>
					</table>
				</div>
				<!-- <div class="row">
					<div class="col-md-6 align-self-center">
						<p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">
							Showing 1 to 10 of 27
						</p>
					</div>
					<div class="col-md-6">
						<nav class="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
							<ul class="pagination">
								<li class="page-item disabled">
									<a class="page-link" aria-label="Previous" href="#!"
										><span aria-hidden="true">«</span></a
									>
								</li>
								<li class="page-item active"><a class="page-link" href="#!">1</a></li>
								<li class="page-item"><a class="page-link" href="#!">2</a></li>
								<li class="page-item"><a class="page-link" href="#!">3</a></li>
								<li class="page-item">
									<a class="page-link" aria-label="Next" href="#!"
										><span aria-hidden="true">»</span></a
									>
								</li>
							</ul>
						</nav>
					</div>
				</div> -->
			</div>
		</div>
	</div>
</div>
<AgregarPastelModal {title} {modalId} />
