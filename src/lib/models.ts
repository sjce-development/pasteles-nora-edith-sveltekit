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
  anticipo: number;
  hora_de_entrega: string;
  estado: string;
  tamano: number;
  total?: number;
  pan: string;
  relleno: string;
  decorado: string[];
  impreso: boolean;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export type ModalField = {
  name: string;
  value: string | number;
  type: string;
  required: string;
};