export enum Estados {
  pendiente = 'pendiente',
  en_curso = 'en_curso',
  terminado = 'terminado',
}

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
  id?: number;
  created_at?: string;
  nombre: string;
  tamano: number;
  pan: string;
  relleno: string;
  especificaciones: string[];
  anticipo: number;
  estado: string;
  hora_de_entrega: string;
  total: number;
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

export type SelectItem = {
  value: string | number;
  label: string;
  group: string;
}

export type PastelesConfig = {
  tamanos: SelectItem[];
  pan: SelectItem[];
  rellenos: SelectItem[];
  especificaciones: SelectItem[];
}

export type Categoria = {
  id: number;
  created_at: string;
  nombre: string;
}

export type Especificacion = {
  nombre: string;
  precio: number;
  categoria: string;
}
