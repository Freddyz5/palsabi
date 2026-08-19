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
    nota: 'El cliente entrega los textos y las imágenes. Se realizan dos rondas de revisión por sección.',
    items: [
      {
        tipo: 'toggle',
        id: 'landing-base',
        nombre: 'Landing de presentación',
        dias: 2,
        marcada: true,
        descripcion:
          'Incluye 5 secciones: portada, quiénes somos, selección destacada, catálogo y sección de cierre con redireccion a whatsapp — más cabecera y pie. El texto final se define con el cliente, ajustes finales y publicación en la web.',
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
          'carga-panel': 'Los libros los cargan y actualizan ustedes desde el panel.',
          'carga-planilla': 'Los libros salen de una planilla que ustedes editan.',
          'carga-inicial': 'Los libros los dejo cargados yo una vez; después el catálogo queda fijo.',
        },
      },
      {
        tipo: 'opcion',
        id: 'carga',
        pregunta: '¿Cómo entran y se actualizan los libros?',
        inicial: 'carga-panel',
        requiere: 'catalogo-base',
        opciones: [
          {
            id: 'carga-panel',
            nombre: 'Panel de administración',
            dias: 7,
            recomendada: true,
            descripcion:
              'Cuentas para 2 administradores, formulario de ingreso de libros (foto, título, autor, categoría, precio, stock) y vista de inventario. Autonomía total: ingreso, edición y eliminación sin depender del desarrollador.',
          },
          {
            id: 'carga-planilla',
            nombre: 'Planilla de Google Sheets',
            dias: 3,
            descripcion:
              'Documento compartido en google sheets en el cual los administradores pueden editar los datos. La planilla se sincroniza con el catálogo automáticamente, sin intervención del desarrollador. No incluye subida de fotos: las imágenes se cargan a la nube aparte y se pegan los enlaces en la planilla.',
          },
          {
            id: 'carga-inicial',
            nombre: 'Catalogo fijo',
            dias: 1,
            descripcion:
              'Carga realizada por el desarrollador (50 libros) una sola vez, con los libros que el cliente proporcione. Después el catálogo queda fijo: no hay panel ni planilla para actualizarlo.',
          },
        ],
      },
      // {
      //   tipo: 'toggle',
      //   id: 'imagenes',
      //   nombre: 'Manejo de imágenes',
      //   dias: 2,
      //   marcada: true,
      //   requiere: 'carga-panel',
      //   descripcion:
      //     'Subida de fotografías desde el panel, con generación automática de las versiones necesarias: cuadrada para el catálogo y el feed, vertical para historias. Las imágenes se optimizan para reducir el tiempo de carga del sitio.',
      // },
      {
        tipo: 'toggle',
        id: 'pdf',
        nombre: 'Catálogo en PDF',
        dias: 2,
        marcada: false,
        requiere: 'catalogo-base',
        descripcion:
          'Generación de un documento PDF descargable con los libros de una categoría o de una colección determinada. El documento se sincroniza automáticamente con el catálogo. El PDF se puede descargar desde el catálogo o enviarse por WhatsApp.',
      },
      {
        tipo: 'toggle',
        id: 'enlaces',
        nombre: 'Enlaces compartibles',
        dias: 2,
        marcada: false,
        requiere: 'catalogo-base',
        descripcion:
          'Enlaces individuales del catalogo clasificado por categoría o por colección.',
      },
      // {
      //   tipo: 'toggle',
      //   id: 'meta-feed',
      //   nombre: 'Feed para WhatsApp / Instagram',
      //   dias: 3,
      //   marcada: false,
      //   requiere: 'carga-panel',
      //   descripcion:
      //     'Integración del catálogo con Meta Commerce Manager, de modo que los libros se publiquen de forma automática en WhatsApp Business e Instagram Shopping. La aprobación de la cuenta comercial ante Meta la gestiona el cliente.',
      // },
      {
        tipo: 'toggle',
        id: 'extras',
        nombre: 'Etiquetas y contador de pedidos',
        dias: 1,
        marcada: false,
        requiere: 'catalogo-base',
        descripcion:
          'Etiquetas «Nuevo» y «Recomendado» para destacar títulos dentro del catálogo, y un registro del número de veces que cada libro fue solicitado por WhatsApp.',
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
        diasPorUnidad: 0.125,
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
  'Posicionamiento en buscadores y campañas de publicidad.',
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
