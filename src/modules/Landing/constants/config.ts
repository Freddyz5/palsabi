/**
 * Datos reales de Palsabi. Un solo lugar para cambiarlos.
 * Fuente: brand/ref-4.png (volante con el número) y brand/ref-5.png (perfil de Instagram).
 */

/** Número de WhatsApp en formato internacional, solo dígitos. */
export const WHATSAPP = '593999821082';

/** El mismo número, escrito como lo lee un ecuatoriano. */
export const WHATSAPP_LEGIBLE = '099 982 1082';

export const INSTAGRAM = 'palsabi.ec';
export const INSTAGRAM_URL = 'https://instagram.com/palsabi.ec';

/**
 * Texto literal de la bio de Instagram. No lo expandimos: no está confirmado
 * qué significa la sigla ni cuál es la dirección exacta.
 */
export const STAND_DOMINICAL = 'Cdfe Granados';

export const SITIO = {
  nombre: 'Palsabi',
  descriptor: 'Librería Cristiana',
  nombreAnterior: 'Palabra Sabia',
  lema: 'Libros con propósito',
  titulo: 'Palsabi · Librería Cristiana',
  descripcion:
    'Librería cristiana en Ecuador. Biblias, devocionales y literatura con propósito, elegidos uno por uno. Pregunta por WhatsApp y te ayudamos a escoger.',
};

/** Arma el enlace de WhatsApp con el mensaje ya escrito. */
export function whatsapp(mensaje: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}
