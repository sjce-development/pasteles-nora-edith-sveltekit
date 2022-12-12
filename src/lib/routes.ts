export type Route = {
	name: string;
	path: string;
	icon: string;
};

export const routes: Route[] = [
	{
		name: 'Dashboard',
		path: '/',
		icon: 'fas fa-tachometer-alt'
	},
	{
		name: 'Agenda',
		path: '/agenda',
		icon: 'fas fa-calendar-alt'
	},
	{
		name: 'Ordenes',
		path: '/ordenes',
		icon: 'fas fa-file-invoice-dollar'
	},
	{
		name: 'Venta en físico',
		path: '/pos',
		icon: 'fas fa-cash-register'
	},
	{
		name: 'Clientes',
		path: '/clientes',
		icon: 'fas fa-users'
	},
	{
		name: 'Registrar',
		path: '/register',
		icon: 'fa-solid fa-address-book'
	}
];
