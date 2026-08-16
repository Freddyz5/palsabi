/**
 * La selección que Palsabi recomienda. Los tres primeros son los títulos que ya
 * salieron en el material propio de la librería (brand/ref-4.png); el resto son
 * títulos reales del catálogo cristiano en español que cualquier librería del
 * ramo maneja.
 *
 * Todo lo que hay aquí se lee en la portada. No hay precios ni stock porque
 * todavía no existe ese dato: se preguntan por WhatsApp.
 *
 * Las portadas son enlaces externos verificados uno por uno (imagen real del
 * título, no un genérico). Se sirven desde el CDN de imágenes de Amazon
 * —`m.media-amazon.com/images/P/<ISBN-10>...`, el patrón estable que usan las
 * librerías para ilustrar fichas— y una desde el CDN de CLC Ecuador. Si algún
 * día una cae, basta cambiar el ISBN de la URL; y si se quiere control total
 * conviene bajarlas a `public/libros/`.
 */

export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  /** Lo que dice la propia portada, palabra por palabra. */
  bajada: string;
  /** Para quién es, en la voz de la librería. */
  para: string;
  /** URL absoluta de la portada. Ver la nota de arriba. */
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
    portada: 'https://m.media-amazon.com/images/P/164691239X.01._SCLZZZZZZZ_.jpg',
    tinta: 'naranja',
  },
  {
    id: 'mundo-biblia',
    titulo: 'Bienvenidos al Mundo de la Biblia',
    autor: 'Mike Nappa · ilustrado por Emiliano Migliardo',
    bajada: 'Explora los 66 libros de la Biblia',
    para: 'Para buscar y encontrar juntos, en el piso de la sala.',
    portada: 'https://static.clcecuador.com/_CLCEcuador/images/products/original/22342.jpg',
    tinta: 'azul',
  },
  {
    id: 'parabolas',
    titulo: 'Parábolas de Jesús',
    autor: 'Agnes de Bezenac',
    bajada: 'Libro rompecabezas',
    para: 'Para manos pequeñas que todavía no leen.',
    portada: 'https://static.clcecuador.com/_CLCEcuador/images/products/original/19760.jpg',
    tinta: 'amarillo',
  },
  {
    id: 'jesus-te-llama',
    titulo: 'Jesús te llama',
    autor: 'Sarah Young',
    bajada: 'Devocionales para cada día del año',
    para: 'Para empezar el día en silencio, dos minutos antes que el resto de la casa.',
    portada: 'https://m.media-amazon.com/images/P/1602559171.01._SCLZZZZZZZ_.jpg',
    tinta: 'naranja',
  },
  {
    id: 'caso-cristo',
    titulo: 'El caso de Cristo',
    autor: 'Lee Strobel',
    bajada: 'Una investigación personal de un periodista de la evidencia de Jesús',
    para: 'Para el que pregunta en serio y no se conforma con «créelo y ya».',
    portada: 'https://m.media-amazon.com/images/P/0829721924.01._SCLZZZZZZZ_.jpg',
    tinta: 'azul',
  },
  {
    id: 'vida-proposito',
    titulo: 'Una vida con propósito',
    autor: 'Rick Warren',
    bajada: '¿Para qué estoy aquí en la tierra?',
    para: 'Para quien está en una encrucijada y necesita ordenar el mapa.',
    portada: 'https://m.media-amazon.com/images/P/0829760210.01._SCLZZZZZZZ_.jpg',
    tinta: 'azul',
  },
  {
    id: 'salvaje-corazon',
    titulo: 'Salvaje de corazón',
    autor: 'John Eldredge',
    bajada: 'Descubramos el secreto del alma masculina',
    para: 'Para hombres que quieren hablar de lo que casi nunca se habla.',
    portada: 'https://m.media-amazon.com/images/P/1400332834.01._SCLZZZZZZZ_.jpg',
    tinta: 'naranja',
  },
  {
    id: 'cautivante',
    titulo: 'Cautivante',
    autor: 'John y Stasi Eldredge',
    bajada: 'Revelando el misterio del alma de la mujer',
    para: 'Para leerlo entre amigas y terminar conversando hasta tarde.',
    portada: 'https://m.media-amazon.com/images/P/1400332869.01._SCLZZZZZZZ_.jpg',
    tinta: 'azul',
  },
  {
    id: 'cinco-lenguajes',
    titulo: 'Los 5 lenguajes del amor',
    autor: 'Gary Chapman',
    bajada: 'El secreto del amor que perdura',
    para: 'Para parejas que se quieren bien pero no siempre se entienden.',
    portada: 'https://m.media-amazon.com/images/P/0789923734.01._SCLZZZZZZZ_.jpg',
    tinta: 'amarillo',
  },
  {
    id: 'tu-eres-especial',
    titulo: 'Tú eres especial',
    autor: 'Max Lucado · ilustrado por Sergio Martínez',
    bajada: 'Un cuento de los Wemmicks',
    para: 'Para el niño que se está midiendo con los demás —y para el adulto que todavía lo hace.',
    portada: 'https://m.media-amazon.com/images/P/0789907526.01._SCLZZZZZZZ_.jpg',
    tinta: 'amarillo',
  },
];
