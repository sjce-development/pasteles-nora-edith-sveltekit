import { locale } from "./constants";
import type { Categoria, Especificacion, Orden, SelectItem } from "./models";
import { supabase } from "./supabase";

export function formatCurrency(amount: number, absolute?: boolean) {
  const options = { style: 'currency', currency: 'MXN' };
  const numberFormat = new Intl.NumberFormat('es-MX', options);
  if (absolute) {
    amount = Math.abs(amount);
  }
  return numberFormat.format(amount);
}

export function sleep(milliseconds: number) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

export function random_rgba(transparency = 0.2): string[] {
  const r = Math.round(Math.random() * 255);
  const g = Math.round(Math.random() * 255);
  const b = Math.round(Math.random() * 255);
  return [`rgba(${r},${g},${b},${transparency})`, `rgba(${r},${g},${b})`];
}

export function formatCategory(items: Categoria[]): SelectItem[] {
  if (items.length === 0) return [];
  const group = 'categoria';
  return items.map((item: Categoria) => {
    const label: string = item.nombre;
    const value: string = item.nombre.toLowerCase().replace(' ', '-');
    return { value, label, group }
  });
}

export function formatEspecificacion(items: Especificacion[]): SelectItem[] {
  if (items.length === 0) return [];
  const group = items[0].categoria;
  return items.map((item: Especificacion) => {
    let value: string | number;
    let label: string;

    try {
      value = eval(item.nombre);
    } catch (e) {
      value = item.nombre.toLowerCase().replace(' ', '-');;
    }

    switch (group) {
      case 'tamanos':
        label = `${item.nombre}"`;
        break;
      default:
        label = item.nombre.toString();
        break;
    }
    return { value, label, group }
  });
}

export async function calcularTotalOrden(orden: Orden): Promise<number> {
  let total = 0;
  const { data, error } = await supabase
    .from<Especificacion>('especificaciones')
    .select('*');
  if (error) throw error;

  const tamano: Especificacion | undefined = data.find((especificacion: Especificacion) => especificacion.nombre === orden.tamano.toString());
  if (tamano) total += tamano.precio;

  const pan: Especificacion | undefined = data.find((especificacion: Especificacion) => especificacion.nombre === orden.pan);
  if (pan) total += pan.precio;

  const relleno: Especificacion | undefined = data.find((especificacion: Especificacion) => especificacion.nombre === orden.relleno);
  if (relleno) total += relleno.precio;

  orden.decorado.forEach((decorado: string) => {
    const item: Especificacion | undefined = data.find((especificacion: Especificacion) => especificacion.nombre === decorado);
    if (item) total += item.precio;
  });
  return total;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function convertirOrdenSelect(orden: any): Promise<Orden> {
  const newOrden: Orden = {
    anticipo: orden.anticipo,
    decorado: orden.decorado.map((especificacion: { value: string }) => {
      return especificacion.value;
    }),
    nombre: orden.nombre.value,
    pan: orden.pan.value,
    relleno: orden.relleno.value,
    tamano: orden.tamano.value,
    estado: 'pendiente',
    hora_de_entrega: new Date(orden.hora_de_entrega).toISOString(),
    impreso: false
  };
  const total = await calcularTotalOrden(newOrden);
  newOrden.total = total;
  return newOrden;
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })
}