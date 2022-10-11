export type Pastel = {
  id: number;
  created_at: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
}

export type Venta = {
  id: number;
  created_at: string;
  nombre: string;
  cantidad: number;
  total: number;
}

export type CarritoItem = {
  id: number;
  image: string;
  nombre: string;
  precio: number;
  cantidad: number;
  cantidadCarrito: number;
  total?: number;
}

export type Orden = {
  id: number;
  created_at: string;
  nombre: string;
  tamano: number;
  pan: string;
  relleno: string;
  especificaciones: string[];
  anticipo: number;
  restante: number;
  pagado: boolean;
  estado: string;
}

export type Cliente = {
  id?: number;
  created_at?: string;
  nombre: string;
  telefono: string;
  correo: string;
}

export type ChartConfig = {
  type: string;
  data: ChartData;
  options: any;
};

export type ChartData = {
  labels: string[];
  datasets: ChartDataset[];
}

export type ChartDataset = {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor: string | string[];
  borderWidth: number;
}