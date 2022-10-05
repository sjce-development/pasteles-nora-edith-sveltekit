export type Pastel = {
  id: number;
  created_at: string;
  nombre: string;
  precio: number;
  cantidad: number;
  image?: string;
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
  quantity: number;
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
}

export type Cliente = {
  id?: number;
  created_at?: string;
  nombre: string;
  telefono: string;
  correo: string;
}