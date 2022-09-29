<script lang="ts">
	import { FILES_URL } from '$lib/constants';
	import { pocketbase } from '$lib/pocketbase';
	import { formatCurrency } from '$lib/utils';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';

	let pasteles: any[] = [];
	let pageSize: number = 200;
	let carrito: any[] = [];
	let total: number = 0;

	onMount(async () => {
		const records = await pocketbase.records.getFullList('pasteles', pageSize, {
			sort: 'nombre'
		});
		pasteles = records;
	});

	async function addToCart(index: number) {
		let item = pasteles[index];
		// si no hay pasteles, preguntar si quiere agregar mas
		if (item.cantidad == 0) {
			const result = await Swal.fire({
				title: 'No hay pasteles',
				text: '¿Desea agregar más pasteles?',
				icon: 'question',
				showCancelButton: true,
				confirmButtonText: 'Si',
				cancelButtonText: 'No'
			});
			if (result.isConfirmed) {
				// agregar mas pasteles
				const result = await Swal.fire({
					title: '¿Cuántos pasteles desea agregar?',
					input: 'number',
					inputValue: 1,
					showCancelButton: true,
					confirmButtonText: 'Agregar',
					showLoaderOnConfirm: true,
					preConfirm: (cantidad) => {
						return pocketbase.records.update('pasteles', item.id, {
							cantidad: cantidad
						});
					},
					allowOutsideClick: () => !Swal.isLoading()
				});
				if (result.isConfirmed) {
					item.cantidad = result.value?.cantidad;
					pasteles = [...pasteles];
				}
			} else {
				return;
			}
		} else {
			// si hay pasteles, agregar al carrito
			let itemIndex = carrito.findIndex((i) => i.id == item.id);
			if (itemIndex == -1) {
				carrito.push({
					...item,
					cantidad: 1
				});
			} else {
				carrito[itemIndex].cantidad++;
			}
			total += item.precio;
			pasteles[index].cantidad--;
		}
		if (carrito.includes(item)) {
			let indexOfItem = carrito.indexOf(item);
			let carritoItem = carrito[indexOfItem];
			console.log(carritoItem.cantidad, carritoItem.quantity);
			if (carritoItem.quantity === carritoItem.cantidad) {
				// Cant add item to cart
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'No puedes agregar más pasteles de este tipo al carrito'
				});
				return;
			}
			if (carritoItem.hasOwnProperty('quantity')) {
				carritoItem.quantity += 1;
			} else {
				carritoItem.quantity = 2;
			}
			carrito = [...carrito];
		} else {
			carrito = [...carrito, pasteles[index]];
			carrito[carrito.length - 1].quantity = 1;
		}

		getCartTotal();
	}

	function getCartTotal() {
		total = 0;
		carrito.forEach((item) => {
			total += item.quantity * item.precio;
		});
	}

	function removeFromCart(item: any): any {
		let indexOfItem = carrito.indexOf(item);
		carrito.splice(indexOfItem, 1);
		carrito = [...carrito];
		getCartTotal();
	}

	async function realizarVenta() {
		Swal.fire({
			title: '¿Estás seguro?',
			text: '¿Estás seguro de realizar la venta?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí, realizar venta'
		}).then((result) => {
			if (result.isConfirmed) {
				carrito.forEach(async (item) => {
					await pocketbase.records.update('pasteles', item.id, {
						cantidad: item.cantidad - item.quantity
					});
				});
				Swal.fire('Venta realizada', 'La venta se ha realizado correctamente', 'success');
			}
		});
	}
</script>

<h3 class="text-dark mb-4">Punto de venta</h3>
<div class="row">
	<div class="col-sm-4">
		<div class="card shadow">
			<div class="card-header py-3">
				<p class="text-primary m-0 fw-bold">Cuenta</p>
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
									<td>
										<img
											class="img-fluid img-thumbnail"
											src="{FILES_URL}{item.id}/{item.imagen}"
											alt={item.nombre}
											width="100"
										/></td
									>
									<td>
										{item.nombre}
									</td>
									<td>{item.precio}</td>
									<td>{item.quantity}</td>
									<td>{formatCurrency(item.quantity * item.precio)}</td>
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
								<td><strong>Total: </strong>{formatCurrency(total)}</td>
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
	<div class="col-sm-8">
		<div class="card shadow">
			<div class="card-header py-3">
				<p class="text-primary m-0 fw-bold">Productos en existencia</p>
			</div>
			<div class="card-body">
				<div class="row">
					<div class="col-md-6 text-nowrap">
						<div id="dataTable_length" class="dataTables_length" aria-controls="dataTable">
							<label class="form-label"
								>Show&nbsp;<select class="d-inline-block form-select form-select-sm">
									<option value="10" selected>10</option>
									<option value="25">25</option>
									<option value="50">50</option>
									<option value="100">100</option>
								</select>&nbsp;</label
							>
						</div>
					</div>
					<div class="col-md-6">
						<div class="text-md-end dataTables_filter" id="dataTable_filter">
							<label class="form-label"
								><input
									type="search"
									class="form-control form-control-sm"
									aria-controls="dataTable"
									placeholder="Search"
								/></label
							>
						</div>
					</div>
				</div>
				<div class="table-responsive table mt-2" role="grid">
					<table class="table my-0 table-hover">
						<thead>
							<tr>
								<th>Nombre</th>
								<th>Precio</th>
								<th>Cantidad</th>
							</tr>
						</thead>
						<tbody>
							{#if pasteles}
								{#each pasteles as pastel, i}
									<tr on:click={() => addToCart(i)}>
										<td
											><img
												class="rounded-circle me-2"
												width="30"
												height="30"
												src="{FILES_URL}{pastel.id}/{pastel.imagen}"
												alt={pastel.nombre}
											/>{pastel.nombre}</td
										>
										<td>{pastel.precio}</td>
										<td>{pastel.cantidad}</td>
									</tr>
								{/each}
							{:else}
								Loading
							{/if}
						</tbody>
						<tfoot>
							<tr>
								<td><strong>Nombre</strong></td>
								<td><strong>Precio</strong></td>
								<td><strong>Cantidad</strong></td>
							</tr>
						</tfoot>
					</table>
				</div>
				<div class="row">
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
				</div>
			</div>
		</div>
	</div>
</div>
