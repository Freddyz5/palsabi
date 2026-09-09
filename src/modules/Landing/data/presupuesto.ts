/**
 * Piezas del presupuesto — landing + catálogo digital. El precio se calcula
 * como días × tarifa, y la tarifa se ajusta acá abajo. Hay tres tipos de pieza:
 *
 *   toggle    — se marca o no (lo de siempre).
 *   contador  — cantidad variable: secciones extra, páginas nuevas.
 *   opcion    — grupo excluyente: hay que elegir una de las alternativas.
 *
 * El grupo excluyente existe por un motivo concreto: si el catálogo va sin
 * panel, alguien tiene que cargar los libros igual. Obligar a elegir cómo
 * cierra ese agujero en la reunión, en vez de descubrirlo después.
 *
 * `requiere` apunta al id de un toggle o de una opción, y se hace cumplir de
 * verdad: si el requisito no está activo, la pieza se bloquea y no suma.
 *
 * La tienda con pagos no vive aquí a propósito: todavía no hay pasarela
 * decidida, así que no tiene sentido ponerle días.
 */

/** Tarifa por jornada de trabajo. Se cambia acá, no desde la página. */
export const TARIFA_POR_DIA = 20;

/**
 * Datos de la carátula del documento impreso. La página se usa en la reunión;
 * el PDF es lo que se lleva el cliente, y ahí sí hacen falta las formalidades:
 * quién lo emite, para quién y hasta cuándo sostiene el precio.
 */
export const PROPUESTA = {
  cliente: 'Palsabi · Librería Cristiana',
  preparadoPor: 'Freddy Tacuri',
  /** Días que se sostiene el precio desde la emisión. */
  validezDias: 15,
};

export interface PiezaToggle {
  tipo: 'toggle';
  id: string;
  nombre: string;
  dias: number;
  marcada: boolean;
  descripcion: string;
  /** Frase que se agrega a la descripción según la opción elegida en un grupo. */
  variantes?: Record<string, string>;
  requiere?: string;
}

export interface PiezaContador {
  tipo: 'contador';
  id: string;
  nombre: string;
  diasPorUnidad: number;
  inicial: number;
  min: number;
  max: number;
  descripcion: string;
  unidad: { singular: string; plural: string };
  requiere?: string;
}

export interface Opcion {
  id: string;
  nombre: string;
  dias: number;
  descripcion: string;
  recomendada?: boolean;
}

export interface GrupoOpcion {
  tipo: 'opcion';
  id: string;
  pregunta: string;
  opciones: Opcion[];
  inicial: string;
  requiere?: string;
}

export type ItemPresupuesto = PiezaToggle | PiezaContador | GrupoOpcion;

export interface FasePresupuesto {
  nombre: string;
  nota?: string;
  items: ItemPresupuesto[];
}

export const FASES_PRESUPUESTO: FasePresupuesto[] = [
  {
    nombre: 'Fase 1 · Landing',
    nota: 'El cliente entrega los textos y las imágenes. Las rondas de revisión se detallan en «Información adicional» y aplican a la propuesta completa, no por sección.',
    items: [
      {
        tipo: 'toggle',
        id: 'landing-base',
        nombre: 'Landing de presentación',
        dias: 2,
        marcada: true,
        descripcion:
          'Incluye 5 secciones: portada, quiénes somos, selección destacada, catálogo y sección de cierre con redireccion a whatsapp — más cabecera y pie de página. El texto final se define con el cliente, ajustes finales y publicación en la web.',
      },
      {
        tipo: 'contador',
        id: 'paginas-extra',
        nombre: 'Subpágina',
        diasPorUnidad: 1.5,
        inicial: 0,
        min: 0,
        max: 4,
        unidad: { singular: 'página', plural: 'páginas' },
        requiere: 'landing-base',
        descripcion:
          'Una página adicional accesible desde el menú. Incluye hasta 3 secciones. En caso de requierir más secciones, seleccionar en el siguiente item.',
      },
      {
        tipo: 'contador',
        id: 'secciones-extra',
        nombre: 'Sección informativa adicional',
        diasPorUnidad: 0.75,
        inicial: 0,
        min: 0,
        max: 6,
        unidad: { singular: 'sección', plural: 'secciones' },
        requiere: 'landing-base',
        descripcion:
          'Una sección con texto, imágenes y diseño propio.',
      },
    ],
  },
  {
    nombre: 'Fase 2 · Catálogo digital',
    items: [
      {
        tipo: 'toggle',
        id: 'catalogo-base',
        nombre: 'Catálogo público',
        dias: 8,
        marcada: true,
        descripcion:
          'Buscador, filtros por categoría, ficha de cada libro, estados de stock y pedido por WhatsApp — con datos reales en base de datos, no de muestra.',
        variantes: {
          'carga-panel': 'La actualización y carga de libros al panel, lo realiza el cliente.',
          'carga-planilla': 'Los libros salen de una planilla que ustedes editan.',
          'carga-inicial': 'Los libros los dejo cargados yo una vez; después el catálogo queda fijo.',
        },
      },
      {
        tipo: 'opcion',
        id: 'carga',
        pregunta: '¿Cómo acceder al panel y actualizar los libros?',
        inicial: 'carga-panel',
        requiere: 'catalogo-base',
        opciones: [
          {
            id: 'carga-panel',
            nombre: 'Panel de administración',
            dias: 7,
            recomendada: true,
            descripcion:
              'Contiene 2 cuentas para los administradores, formulario de ingreso de libros (foto, título, autor, categoría, precio, stock) y vista de inventario. Autonomía total: ingreso, edición y eliminación sin depender del desarrollador.',
          },
          {
            id: 'carga-planilla',
            nombre: 'Plantilla en Google Sheets',
            dias: 3,
            descripcion:
              'Documento compartido en google sheets en el cual los administradores editan los datos de los libros. La actualización de la información es manual, sin intervención del desarrollador. No incluye, carga de fotos: las imágenes se alojan en la nube y los links se colocaran manualmente en la plantilla.',
          },
          {
            id: 'carga-inicial',
            nombre: 'Catalogo fijo',
            dias: 1,
            descripcion:
              'Intervención del desarrollador con la carga inicial de hasta 50 libros y una sola vez. La información es estática, el cliente no podra modificarlo.',
          },
        ],
      },
      {
        tipo: 'toggle',
        id: 'pdf',
        nombre: 'Catálogo en PDF',
        dias: 2,
        marcada: false,
        requiere: 'catalogo-base',
        descripcion:
          'Generación de un documento PDF descargable con los libros de una categoría o colección específica previamente seleccionada por el cliente, con sincronozacipon automática al catálogo. El objetivo es enviar por whatsapp.',
      },
      {
        tipo: 'toggle',
        id: 'enlaces',
        nombre: 'Enlaces compartibles',
        dias: 2,
        marcada: false,
        requiere: 'catalogo-base',
        descripcion:
          'Generación de links del catalogo, permite clasificar por categoría o colección.',
      },
      {
        tipo: 'toggle',
        id: 'extras',
        nombre: 'Etiquetas y contador de pedidos',
        dias: 1,
        marcada: false,
        requiere: 'catalogo-base',
        descripcion:
          'Etiquetas «Nuevo» y «Recomendado» para destacar títulos dentro del catálogo, y un contador en la que un libro fue solicitado por whatsapp',
      },
    ],
  },
  {
    nombre: 'SEO y posicionamiento',
    nota: 'SEO Técnico: corresponde únicamentea al código del sitio para que el motor de busqueda de Google pueda encontrarlo por el nombre de negocio. No incluye SEO de contenido (redacción, investigación de palabras clave, estrategia editorial). Esta sección le corresponde al administrador.',
    items: [
      {
        tipo: 'toggle',
        id: 'seo-tecnico',
        nombre: 'SEO Técnico',
        dias: 2,
        marcada: false,
        descripcion:
          'Configuración técnica con el fin de que Google indexe: título y descripción optimizados en cada página, datos del negocio: nombre, tipo, ubicación.',
      },
      {
        tipo: 'toggle',
        id: 'seo-perfil-google',
        nombre: 'Perfil de Google y Search Console',
        dias: 1,
        marcada: false,
        requiere: 'seo-tecnico',
        descripcion:
          'Registro en Google Search Console (herramienta de Google que confirma y rastrea el sitio) y configuración inicial del Perfil de Negocio: nombre, dirección, horario y categoría.',
      },
    ],
  },
  {
    nombre: 'Post-venta',
    items: [
      {
        tipo: 'contador',
        id: 'bolsa-soporte',
        nombre: 'Servicio de soporte por hora',
        // Una hora es un octavo de jornada: así el soporte sigue midiéndose
        // con la misma vara que el resto del presupuesto.
        diasPorUnidad: 0.25,
        inicial: 0,
        min: 0,
        max: 40,
        unidad: { singular: 'hora', plural: 'horas' },
        descripcion:
          'Cambios de texto y ajustes menores posteriores a la publicación. Se acuerda una reunión para programar el trabajo y se descuenta según las horas efectivamente utilizadas.',
      },
    ],
  },
];

/** Costos que corren por cuenta del cliente: no son días de trabajo del desarrollador. */
export const COSTOS_RECURRENTES = [
  'Dominio: aproximadamente $25 al año, contratado a nombre del cliente.',
  'Hosting y base de datos: el catálogo con panel de administración requiere un servidor activo. Se contrata a nombre del cliente y se factura mensualmente. El valor depende del mercado.',
];

/** Lo que el presupuesto no cubre. Los presupuestos se pelean por lo que no dicen. */
export const NO_INCLUYE = [
  'Redacción de textos y sesión fotográfica.',
  'Carga de contenido, salvo que se contrate la carga inicial realizada por el desarrollador.',
  'Pasarela de pagos y funcionalidades de tienda en línea.',
  'SEO de contenido: redacción, investigación de palabras clave y estrategia editorial.',
  'Posicionamiento por palabras clave genéricas y campañas de publicidad paga.',
];

/**
 * Condiciones comerciales y legales del acuerdo. Se numeran solas (a, b, c…)
 * en la plantilla; el orden de este arreglo es el orden que se firma.
 */
export const INFORMACION_ADICIONAL: (
  | string
  | { texto: string; subpuntos: string[] }
)[] = [
  'Los precios indicados en este documento son promocionales, incluye servicio de mantenimiento del sitio web por $5 la hora durante un año contando desde la fecha de entrega; posterior el valor es de $20,00 la hora. Los valores de la cotización no incluyen IVA. El mantenimiento incluye corrección de errores del desarrollo, actualización de contenido ya existente (textos, imágenes, precios, disponibilidad de libros) y ajustes menores de estilo. No incluye el desarrollo de funcionalidades nuevas, secciones adicionales, integraciones o cambios estructurales no contemplados en esta cotización; estos se cotizan aparte, a la tarifa de proyecto vigente.',
  'Autorizo, al desarrollador a hacer uso del código fuente de este sitio web como base, plantilla o referencia técnica para el desarrollo de futuros proyectos de otros clientes.',
  'Esta autorización se limita exclusivamente a la estructura, lógica y componentes técnicos del código. No incluye nombre comercial, marca, logotipo, contenidos, textos, imágenes, base de datos, ni ningún elemento de identidad propia de PALSABI, los cuales permanecen de su uso exclusivo y confidencial. El desarrollador se compromete a no divulgar información comercial y sensible del cliente.',
  'El catálogo está diseñado y estructurado para escalar según la necesidad del cliente a una tienda en línea; se requiere realizar una nueva cotización.',
  'Si en el futuro se contratan nuevos módulos o funcionalidades mediante una cotización adicional, el mantenimiento de esos módulos se define en esa nueva cotización y no hereda automáticamente las condiciones de este documento.',
  {
    texto: 'Métodos de pago:',
    subpuntos: [
      'Efectivo o transferencia: 50% primer pago, y 50% contra entrega.',
      'Efectivo o transferencia por acuerdo: 40% primer pago inicial, 30% segundo pago, 30% tercer pago.',
      'T/C: Payphone, un solo pago y difiérelo en tu banco.',
    ],
  },
  'Se incluyen 2 rondas de revisión: la propuesta inicial, un primer cambio solicitado sobre esa propuesta, y un segundo ajuste. Cambios adicionales fuera de estas rondas se cobran por hora según la tarifa vigente.',
  'Se ofrece una garantía de 15 días posteriores a la entrega para la corrección de errores técnicos del desarrollo, sin costo adicional. No cubre cambios de contenido, diseño o solicitudes de nuevas funcionalidades.',
  'En caso de cancelación del proyecto una vez iniciado el desarrollo, el cliente pagará como mínimo el 50% del valor total cotizado (primer pago, no reembolsable). Si el avance supera ese porcentaje, se cobra el valor proporcional al trabajo realizado.',
];

/** Nombre legible de cada id — para el cartel «Necesita: …» de las piezas bloqueadas. */
export const NOMBRE_POR_ID: Record<string, string> = Object.fromEntries(
  FASES_PRESUPUESTO.flatMap((fase) =>
    fase.items.flatMap((item) =>
      item.tipo === 'opcion'
        ? item.opciones.map((opcion) => [opcion.id, opcion.nombre] as const)
        : [[item.id, item.nombre] as const],
    ),
  ),
);
