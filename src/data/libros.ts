/**
 * Los tres títulos que Palsabi ya publicó en su propio material (brand/ref-4.png).
 * Todo lo que hay aquí se lee en la portada. No hay precios ni stock porque
 * todavía no existe ese dato: se preguntan por WhatsApp.
 */

export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  /** Lo que dice la propia portada, palabra por palabra. */
  bajada: string;
  /** Para quién es, en la voz de la librería. */
  para: string;
  portada: string;
  /** Color de tinta que suelta este libro en la cuenca. */
  tinta: 'naranja' | 'azul' | 'amarillo';
}

export const LIBROS: Libro[] = [
  {
    id: 'ruge',
    titulo: 'Ruge como un león',
    autor: 'Levi Lusko',
    bajada: '90 devocionales para alentar tu fe',
    para: 'Para quien necesita volver a levantarse cada mañana.',
    portada: '/libros/c1.webp',
    tinta: 'naranja',
  },
  {
    id: 'mundo-biblia',
    titulo: 'Bienvenidos al Mundo de la Biblia',
    autor: 'Mike Nappa · ilustrado por Emiliano Migliardo',
    bajada: 'Explora los 66 libros de la Biblia',
    para: 'Para buscar y encontrar juntos, en el piso de la sala.',
    portada: '/libros/c2.webp',
    tinta: 'azul',
  },
  {
    id: 'parabolas',
    titulo: 'Parábolas de Jesús',
    autor: 'Agnes de Bezenac',
    bajada: 'Libro rompecabezas',
    para: 'Para manos pequeñas que todavía no leen.',
    portada: '/libros/c3.webp',
    tinta: 'amarillo',
  },
];
