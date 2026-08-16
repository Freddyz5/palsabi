# Palsabi

Librería Cristiana · Ecuador · [@palsabi.ec](https://instagram.com/palsabi.ec)

Landing page de Palsabi (antes Palabra Sabia). Astro + Tailwind, sitio estático.

## Correr el proyecto

Con [Bun](https://bun.sh):

```bash
bun install
bun run dev      # http://localhost:4321
bun run build    # genera dist/
bun run preview  # revisa dist/ antes de publicar
```

## Cómo está armado

```
src/
  config.ts            Número de WhatsApp, Instagram, textos fijos. Empieza aquí.
  data/libros.ts       Los libros que se muestran en «La selección».
  scripts/basin.ts     La cuenca: el suminagashi en WebGL2.
  components/          Una pieza por sección de la página.
  styles/global.css    Colores de marca y tipografías.
brand/                 Los archivos de marca originales (capturas).
public/libros/         Portadas recortadas del volante de Palsabi.
```

**Para cambiar el número de WhatsApp o el Instagram:** `src/config.ts`, arriba de todo.
Los botones arman solos el mensaje; no hay que tocarlos.

**Para cambiar o agregar libros:** `src/data/libros.ts`. Cada libro necesita título,
autor, la bajada que dice su portada, para quién es, la imagen y qué tinta suelta en
la cuenca (`naranja`, `azul` o `amarillo`).

## La cuenca

El fondo de la página es una simulación de fluidos de verdad corriendo en la tarjeta
gráfica: tinta flotando sobre agua, como en el suminagashi japonés. Cada gota nueva
empuja hacia afuera la que ya estaba, y de ahí salen los anillos.

- Se puede tocar: pasa el dedo o el mouse y el agua responde.
- Cada sección suelta su propia tinta al entrar, así que la página se va tiñendo
  conforme bajas.
- Elegir un libro suelta su color en el agua.

Cuida el teléfono de quien la mira: baja la resolución de cálculo en equipos modestos,
se apaga sola a los 14 segundos sin actividad y se detiene si cambias de pestaña.

- `?quieto=1` en la URL congela la cuenca ya asentada. Sirve para capturas.
- Si el visitante pidió menos movimiento en su sistema, ve esa misma versión quieta.
- Si el equipo no soporta WebGL2, queda un marmoleado estático en CSS.

## Lo que falta poner (datos reales)

Nada de esto se inventó. Cuando lo tengas, va aquí:

| Qué | Dónde | Estado |
|---|---|---|
| Precios y disponibilidad | `src/data/libros.ts` | Hoy se preguntan por WhatsApp, a propósito |
| Más títulos del catálogo | `src/data/libros.ts` | Solo hay 3, los del volante |
| Logo en vector (SVG/AI) | `src/components/Logo.astro` | Está redibujado desde una captura |
| Dirección y horario del stand | `src/config.ts` → `STAND_DOMINICAL` | Dice «Cdfe Granados», literal de tu bio |
| Política de envíos | `src/components/Pedir.astro`, paso 3 | Dice «coordinamos la entrega», sin prometer plazos |
| Dominio | `astro.config.mjs` → `site` | Puesto `palsabi.ec` como supuesto |
| Imagen para compartir (Open Graph) | `src/layouts/Base.astro` | Falta; hoy comparte sin imagen |

## Marca

Colores muestreados de los archivos reales en `brand/`:

| | |
|---|---|
| Naranja Palsabi | `#F8831D` |
| Amarillo | `#FADA57` |
| Azul profundo | `#213D53` |
| Grafito | `#4F4F4F` |
| Agua (fondo) | `#F4F2EE` |

Tipografías: **Gabarito** para títulos (es la que más se parece al logotipo),
**Asap** para texto. Las dos van servidas desde el proyecto, sin pedirlas a Google.

Ver `PRODUCT.md` para el registro de producto y `DESIGN.md` para el sistema visual.
