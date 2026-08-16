/**
 * El catálogo digital de la landing. Ya no repite los libros: los saca de
 * `libros.ts`, que es donde vive el catálogo de verdad. Aquí solo se añade lo
 * que una ficha de tienda necesita y una recomendación no —categoría, precio y
 * unidades—, y se añade en una tabla aparte para que un título no tenga que
 * escribirse dos veces.
 *
 * Consecuencia de que todos los títulos sean reales: ya no hace falta la marca
 * `ejemplo`, que estaba para no insinuar libros que Palsabi no tiene.
 *
 * Sigue sin haber backend. Los números de abajo son de muestra; el panel del
 * dueño los mueve en el navegador y al recargar vuelven a estos.
 */

import { LIBROS, type Libro } from './libros';

export const CATEGORIAS = [
  'Devocionales',
  'Estudio bíblico',
  'Vida cristiana',
  'Matrimonio y familia',
  'Infantil',
] as const;

export type Categoria = (typeof CATEGORIAS)[number];
export type Estado = 'disponible' | 'ultimas' | 'agotado';
export type Tinta = 'naranja' | 'azul' | 'amarillo';

export interface ProductoDemo {
  id: string;
  titulo: string;
  autor: string;
  categoria: Categoria;
  precio: number;
  /**
   * Las unidades que hay. El estado —Disponible / Últimas / Agotado— no se
   * escribe: sale de aquí (ver `estadoDe`). Tenerlos como dos campos separados
   * era pedirle al dueño que mantuviera dos cosas de acuerdo entre sí, y la
   * primera vez que se olvidara el catálogo diría «Disponible» sobre cero.
   */
  stock: number;
  descripcion: string;
  /** URL real de portada (ver `libros.ts`), o null si usa el marcador de posición. */
  portada: string | null;
  tinta: Tinta;
  etiqueta?: 'nuevo' | 'recomendado';
}

/** El umbral de «quedan pocas». Un número, en un solo lugar. */
export const POCAS_UNIDADES = 3;

export function estadoDe(stock: number): Estado {
  if (stock <= 0) return 'agotado';
  if (stock <= POCAS_UNIDADES) return 'ultimas';
  return 'disponible';
}

/** Cómo se dice y de qué color se ve cada estado, para las tres vistas. */
export const ESTADO_LABEL: Record<Estado, string> = {
  disponible: 'Disponible',
  ultimas: 'Últimas unidades',
  agotado: 'Agotado',
};

export const ESTADO_CLASE: Record<Estado, string> = {
  disponible: 'text-azul-suave',
  ultimas: 'text-naranja-texto',
  agotado: 'text-grafito',
};

/** Lo que la tienda le pone encima al libro. Todo lo demás sale de `libros.ts`. */
interface DatosDeTienda {
  categoria: Categoria;
  precio: number;
  stock: number;
  etiqueta?: 'nuevo' | 'recomendado';
}

/**
 * Las existencias están repartidas a propósito para que la demo enseñe los tres
 * estados sin que haya que tocar nada: hay agotados, hay últimas unidades y hay
 * disponibles.
 */
const TIENDA: Record<string, DatosDeTienda> = {
  ruge: { categoria: 'Devocionales', precio: 16.5, stock: 14, etiqueta: 'recomendado' },
  'mundo-biblia': { categoria: 'Infantil', precio: 19.9, stock: 2 },
  parabolas: { categoria: 'Infantil', precio: 14.0, stock: 9 },
  'jesus-te-llama': { categoria: 'Devocionales', precio: 18.5, stock: 11 },
  'caso-cristo': { categoria: 'Estudio bíblico', precio: 15.9, stock: 6 },
  'vida-proposito': { categoria: 'Vida cristiana', precio: 17.5, stock: 3 },
  'salvaje-corazon': { categoria: 'Vida cristiana', precio: 16.9, stock: 7 },
  cautivante: { categoria: 'Vida cristiana', precio: 16.9, stock: 0 },
  'cinco-lenguajes': { categoria: 'Matrimonio y familia', precio: 13.5, stock: 12 },
  'tu-eres-especial': { categoria: 'Infantil', precio: 12.9, stock: 5, etiqueta: 'nuevo' },
};

/** Lo que se pone si un libro nuevo de `libros.ts` todavía no pasó por aquí. */
const SIN_DATOS: DatosDeTienda = { categoria: 'Vida cristiana', precio: 0, stock: 0 };

function aProducto(libro: Libro): ProductoDemo {
  const tienda = TIENDA[libro.id] ?? SIN_DATOS;
  return {
    id: libro.id,
    titulo: libro.titulo,
    autor: libro.autor,
    portada: libro.portada,
    tinta: libro.tinta,
    // La ficha se escribe sola con las dos frases que ya existen: lo que dice la
    // portada y para quién es. Nadie tiene que redactar una descripción aparte.
    descripcion: `${libro.bajada}. ${libro.para}`,
    ...tienda,
  };
}

export const PRODUCTOS_DEMO: ProductoDemo[] = LIBROS.map(aProducto);

/** "Estudio bíblico" -> "estudio-biblico". Sin acentos, sin barras, en kebab-case. */
export function slugificar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\//g, ' ')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
}

export interface ColeccionCurada {
  slug: string;
  titulo: string;
  descripcion: string;
  /** ids de PRODUCTOS_DEMO que arma esta colección, elegidos a mano. */
  productoIds: string[];
}

/**
 * Colecciones que cruzan categorías — la parte que un enlace "por categoría"
 * no cubre solo. En la versión real esto lo arma el dueño desde el panel;
 * aquí es una lista fija, uno de los enlaces que se puede compartir ya.
 */
export const COLECCIONES_CURADAS: ColeccionCurada[] = [
  {
    slug: 'navidad-ninos',
    titulo: 'Navidad para niños',
    descripcion: 'Ideas de regalo para las fiestas, elegidas para los más pequeños de la casa.',
    productoIds: ['mundo-biblia', 'parabolas', 'tu-eres-especial'],
  },
];
