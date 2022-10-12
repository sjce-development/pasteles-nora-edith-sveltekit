import type { Especificacion, Orden, SelectItem } from "./models";

export function formatCurrency(amount: number) {
  const options = { style: 'currency', currency: 'MXN' };
  const numberFormat = new Intl.NumberFormat('es-MX', options);
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

export const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]

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

export function calcularTotalOrden(orden: { anticipo?: any; especificaciones: any; nombre?: { value: any; }; pan: any; relleno: any; tamano: any; hora_de_entrega?: any; }): number {
  // Calculate total of orden
  let total = 0;
  orden.tamano.forEach((t: { precio: number }) => {
    total += t.precio;
  });
  orden.pan.forEach((p: { precio: number }) => {
    total += p.precio;
  });
  orden.relleno.forEach((r: { precio: number }) => {
    total += r.precio;
  });
  orden.especificaciones.forEach((e: { precio: number }) => {
    total += e.precio;
  });
  return total;
}

export function convertirOrdenSelect(orden: { anticipo: any; especificaciones: { value: any; }[]; nombre: { value: any; }; pan: { value: any; }; relleno: { value: any; }; tamano: { value: any; }; hora_de_entrega: any; }): Orden {
  const total = calcularTotalOrden(orden);
  return {
    anticipo: orden.anticipo,
    especificaciones: orden.especificaciones.map((especificacion: { value: any }) => {
      return especificacion.value;
    }),
    nombre: orden.nombre.value,
    pan: orden.pan.value,
    relleno: orden.relleno.value,
    tamano: orden.tamano.value,
    estado: 'pendiente',
    hora_de_entrega: orden.hora_de_entrega,
    total: total
  };
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}