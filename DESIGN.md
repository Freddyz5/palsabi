---
name: Palsabi
description: Librería cristiana cuya página es una cuenca de tinta flotando sobre agua.
colors:
  agua: "#f4f2ee"
  agua-honda: "#e7e3dc"
  naranja: "#f8831d"
  naranja-hondo: "#c25e0a"
  naranja-texto: "#a34e06"
  amarillo: "#fada57"
  azul: "#213d53"
  azul-hondo: "#16293a"
  azul-suave: "#4f6172"
  grafito: "#4f4f4f"
typography:
  display:
    fontFamily: "Gabarito, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.6vw, 4.4rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Gabarito, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.85rem, 3.6vw, 2.9rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  rubro:
    fontFamily: "Gabarito, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  entrada:
    fontFamily: "Asap Variable, Asap, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 2.1vw, 1.4rem)"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  guia:
    fontFamily: "Asap Variable, Asap, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  body:
    fontFamily: "Asap Variable, Asap, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  menudo:
    fontFamily: "Asap Variable, Asap, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Asap Variable, Asap, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.22em"
rounded:
  tira: "2px"
  etiqueta: "10px"
  hoja: "20px"
  hoja-tinta: "24px"
  pastilla: "9999px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.75rem"
  lg: "3.5rem"
  xl: "5rem"
components:
  boton-tinta:
    backgroundColor: "{colors.naranja}"
    textColor: "{colors.azul-hondo}"
    rounded: "{rounded.pastilla}"
    padding: "1rem 1.5rem"
  boton-tinta-hover:
    backgroundColor: "#ff9836"
    textColor: "{colors.azul-hondo}"
  boton-contorno:
    textColor: "{colors.azul}"
    rounded: "{rounded.pastilla}"
    padding: "1rem 1.5rem"
  boton-quieto:
    backgroundColor: "{colors.azul}"
    textColor: "{colors.agua}"
    rounded: "{rounded.pastilla}"
    padding: "1rem 1.5rem"
  hoja:
    backgroundColor: "{colors.agua}"
    textColor: "{colors.azul}"
    rounded: "{rounded.hoja}"
    padding: "3.5rem"
  hoja-tinta-honda:
    backgroundColor: "{colors.azul}"
    textColor: "{colors.agua}"
    rounded: "{rounded.hoja-tinta}"
    padding: "5rem 3.5rem"
  hoja-tinta-clara:
    backgroundColor: "{colors.naranja}"
    textColor: "{colors.azul-hondo}"
    rounded: "{rounded.hoja-tinta}"
    padding: "6rem 3.5rem"
---

# Design System: Palsabi

## Overview

**Creative North Star: "La cuenca"**

Una gota de tinta que se abre en agua quieta. Toda la página descansa sobre una
cuenca de suminagashi calculada en vivo por la tarjeta gráfica: tinta de verdad
flotando, respondiendo al dedo, tiñéndose más conforme el visitante baja. Encima
de esa agua se apoyan hojas de papel. Nada más. El sistema entero es esa relación
de dos materiales — **agua entintada y papel** — y casi todas sus reglas salen de
mantenerla honesta.

La consecuencia práctica es una división estricta del trabajo: **el agua lleva el
color y el movimiento; el papel lleva las palabras.** El naranja de Palsabi es
intenso y por eso vive donde puede ser intenso — en la tinta, en los botones, en
las hojas entintadas — y nunca en una letra. El texto vive siempre sobre una
superficie opaca, y esa superficie tiene la misma fibra que el papel de la cuenca,
porque si no, se nota que es una pantalla imitando papel.

Este mundo rechaza dos cosas por nombre: la vitrina de librería en crema con
serif, y la parrilla de portadas tipo streaming. Palsabi no es un catálogo
infinito; es una selección con mano humana, y la página tiene que verse así.

**Key Characteristics:**
- Agua blanco papel generosa; la tinta es una isla, no un fondo
- Naranja de marca saturado, siempre como superficie, jamás como letra
- Cuatro registros de papel con jerarquía real, no un panel repetido
- Fibra de washi en todas las superficies, con su dosis por tinta
- Un solo momento de movimiento autoral: la cuenca

## Colors

Tres tintas de marca sobre agua de papel. La paleta es la de Palsabi sin retocar
—muestreada de sus propios archivos— más las versiones oscurecidas que hicieron
falta para que el texto se leyera.

### Primary
- **Naranja Palsabi** (`#F8831D`): el color de la marca. Campo de tinta, relleno
  de botón, hoja entintada del cierre, realce sobre palabras clave. Es color de
  superficie: mide 2,3:1 sobre el agua y no pasa AA en ningún tamaño.
- **Naranja hondo** (`#C25E0A`): solo para titular grande sobre papel (4,2:1).
- **Naranja de texto** (`#A34E06`): la versión que sí sirve en texto corrido
  (5,2:1). Es la que lleva la línea de «para quién es» cada libro.

### Secondary
- **Azul profundo** (`#213D53`): la corriente honda. Texto de cuerpo sobre papel,
  hoja entintada del stand, y la tinta que se suelta en la sección del nombre.
- **Azul tinta** (`#16293A`): lo que se escribe encima del naranja. Da 5,8:1 sobre
  `#F8831D`, y además es lo que hace el mundo — tinta encima de un fondo saturado.
- **Azul suave** (`#4F6172`): secundario sobre papel (5,0:1 ya con la fibra).

### Tertiary
- **Amarillo** (`#FADA57`): la tinta que aparece donde el tinte se adelgaza. Vive
  casi solo dentro de la cuenca; en la interfaz es un acento raro a propósito.

### Neutral
- **Agua** (`#F4F2EE`): el fondo de todo. Papel mojado, apenas cálido. Nunca crema.
- **Agua honda** (`#E7E3DC`): borde y separación cuando hacen falta.
- **Grafito** (`#4F4F4F`): la placa «Librería Cristiana» del logotipo, y nada más.

### Named Rules

**La regla de la tinta que no es letra.** `#F8831D` nunca lleva texto y nunca es
texto. Sobre el agua da 2,3:1. Si hace falta naranja en una palabra, se usa
`#A34E06` en cuerpo o `#C25E0A` en titular grande; si hace falta texto sobre
naranja, va en `#16293A`.

**La regla de la gota nueva.** Dentro de la cuenca, la gota más reciente es
siempre la más saturada, y el tinte se aclara a medida que se extiende. Nunca al
revés: rompe la lectura de profundidad del agua.

## Typography

**Display Font:** Gabarito (con `ui-sans-serif`, `system-ui`)
**Body Font:** Asap Variable (con `Asap`, `ui-sans-serif`)

**Character:** Gabarito es geométrica y redondeada, de la misma familia de formas
que el logotipo de Palsabi, así que el titular y la marca se ven parientes sin
tener que imitar el archivo. Asap es humanista y tranquila, y aguanta bien las
tildes y las eñes en texto corrido, que en español no es un detalle menor. Las dos
van servidas desde el proyecto; nada se le pide a Google.

### Hierarchy
- **Display** (700, `clamp(2.5rem, 5.6vw, 4.4rem)`, 0.98, `-0.035em`): un solo
  titular por página, el de la portada.
- **Headline** (700, `clamp(1.85rem, 3.6vw, 2.9rem)`, 1.04, `-0.025em`): título de
  sección.
- **Rubro** (600, 1.4rem, 1.15, `-0.02em`): nombre de un libro, título de paso.
- **Entrada** (400, `clamp(1.125rem, 2.1vw, 1.4rem)`, 1.55): la bajada de la
  portada, y solo esa.
- **Guía** (400, 1.1rem, 1.65): el párrafo que abre una sección.
- **Cuerpo** (400, 1rem, 1.6): texto corrido y etiqueta de control. Medida 44–52ch.
- **Menudo** (400, 0.9rem, 1.5): autoría, notas al pie, acciones secundarias.
- **Rótulo** (600, 0.6875rem, `0.22em`, versalitas): etiquetas funcionales — el rol
  de cada paso, la nota de precio, la firma del pie.

### Named Rules

**La regla de las tres voces.** El sistema tiene exactamente tres registros de
letra: Gabarito para lo que se anuncia, Asap para lo que se lee, y el rótulo en
versalitas espaciadas para lo que se etiqueta. Si una pieza necesita una cuarta,
el problema es de jerarquía, no de tipografía.

**La regla de los cuatro escalones.** Por debajo del rubro solo existen cuatro
tamaños de texto —entrada, guía, cuerpo, menudo— y cada uno tiene un trabajo. Un
tamaño nuevo entre dos existentes no es un matiz: es la escala deshaciéndose. Esta
página llegó a tener trece tamaños literales, nueve de ellos entre 0,9 y 1,1rem,
y ninguno de esos nueve significaba nada distinto.

**La regla del rótulo que no encabeza.** Los rótulos etiquetan (un rol, una
condición, una firma). Nunca van encima de un titular haciendo de antetítulo.

## Layout

Una sola medida manda: **1240px**. La cabecera, la portada, la selección, los
pasos, las dos hojas entintadas y el pie se alinean todos a ella. Salirse de esa
medida produce escalones visibles entre secciones contiguas.

Los márgenes laterales son `1.25rem` en móvil y `2rem` desde `sm`. El ritmo
vertical de sección va de `4rem` (móvil) a `7rem` (escritorio), siempre con más
aire encima de un titular que debajo.

La selección usa una rejilla de 12 columnas desde `lg` con las portadas a tres
escalas distintas (22 / 17 / 15rem) y arranques de columna escalonados; no es una
cuadrícula de fichas iguales, y no debe volver a serlo. En móvil todo se apila a
una columna.

**Comportamiento de la cuenca según el ancho:** por debajo de 900px el contenido
ocupa todo el ancho, así que las islas de tinta se siembran arriba y abajo del
encuadre y dejan limpia la banda central. En ancho, la isla principal vive a la
derecha, donde el papel no llega.

## Elevation & Depth

Sistema **de láminas**: todo es una hoja apoyada sobre agua, y la profundidad se
cuenta con sombras suaves, desplazadas y difusas —nunca con un halo sin offset—
más el hecho de que el agua se ve correr alrededor. Cuatro alturas, y cada una
significa algo distinto.

### Shadow Vocabulary
- **Tira** (`0 0 0 1px oklch(0.35 0.05 250 / 0.09), 0 2px 0 oklch(0.35 0.05 250 / 0.04)`):
  una hoja suelta que se sostiene por el canto, no por elevarse.
- **Etiqueta** (`0 6px 18px -12px oklch(0.35 0.05 250 / 0.4)`): pie de una portada,
  chip de cabecera. Casi no pesa.
- **Hoja** (`0 1px 2px oklch(0.35 0.05 250 / 0.06), 0 18px 44px -20px oklch(0.35 0.05 250 / 0.34)`):
  el papel principal, el que sostiene el argumento.
- **Hoja entintada** (`0 2px 4px oklch(0.25 0.04 250 / 0.14), 0 30px 64px -28px oklch(0.25 0.04 250 / 0.55)`):
  la lámina que ya levantó la tinta. La más alta del sistema.

### Named Rules

**La regla del margen quieto.** El texto nunca flota sobre la corriente. Todo
bloque de texto se apoya en una superficie opaca. Es la regla más dura del sistema
y la que más veces se intentó romper: cada vez que se rompió, hubo que volver.

**La regla del papel único.** Toda superficie lleva la misma fibra de washi. El
papel usa la trama clara multiplicada; las hojas entintadas usan una trama propia
centrada en gris medio, aplicada con `overlay` y con su dosis por color (0,5 sobre
azul, 0,3 sobre naranja). Multiplicar una trama clara sobre azul profundo no mueve
el color: queda declarada y no se ve, que es peor que no ponerla.

## Shapes

Cuatro radios, y cada uno nombra un registro: **2px** la tira, **10px** la
etiqueta, **20px** la hoja, **24px** la hoja entintada. Los controles son
pastillas completas (`9999px`) sin excepción — botones, chips, la pista de la
cuenca, la cabecera.

No hay bordes de color. La única línea del sistema es el filo de un pelo de la
tira, y existe justamente para que esa hoja no necesite sombra.

## Components

### Buttons
- **Shape:** pastilla completa (`9999px`).
- **Tinta (principal):** fondo naranja de marca, texto en azul tinta `#16293A`
  (5,8:1), padding `1rem 1.5rem` (`1.125rem 2rem` en grande). Icono dibujado a la
  izquierda, flecha a la derecha.
- **Hover / Focus:** el fondo aclara a `#FF9836` y la pieza sube 2px con
  `--ease-gota`. El foco es un contorno naranja de 3px con 3px de separación.
- **Contorno:** sin fondo, texto azul, aro interior de 1,5px al 35% que sube al 70%.
- **Quieto:** fondo azul profundo, texto agua. Para el cierre, sobre naranja.

### Cards / Containers
- **Corner Style:** según registro (2 / 10 / 20 / 24px).
- **Background:** papel = agua mezclada con blanco al 92% más fibra multiplicada;
  hojas entintadas = azul o naranja plano más fibra en `overlay`.
- **Shadow Strategy:** ver Elevation. La altura declara la jerarquía.
- **Internal Padding:** `1.75rem` en etiqueta, `3.5rem` en hoja, `3.5–5rem` en hoja
  entintada.

### Navigation
La cabecera es una pastilla de papel flotando sobre el agua, con el logotipo a la
izquierda, tres enlaces al centro y la llamada a WhatsApp a la derecha. Los enlaces
son azul al 75% y al pasar el puntero crecen un subrayado naranja de 1px desde la
izquierda. Debajo de `md` los enlaces se ocultan y queda el logotipo con el botón.

### La cuenca (componente firma)
El fondo es un solucionador de fluidos en WebGL2 —advección semi-lagrangiana con
proyección de presión de Jacobi— donde cada gota **desplaza** la tinta anterior en
lugar de pintarse encima (`sqrt(d²−r²)` conserva el área), que es exactamente como
el suminagashi hace sus anillos concéntricos. Dos pasadas cortas de abanico los
pluman. Responde al puntero y al dedo; cada sección suelta su propia tinta al
entrar; elegir un libro suelta la suya.

Se cuida sola: baja la resolución de cálculo en equipos modestos, se duerme a los
14 segundos sin actividad, se detiene con la pestaña oculta, y ante
`prefers-reduced-motion` o falta de WebGL2 sirve una marmoleada ya asentada
horneada del mismo solucionador.

### La bandeja (componente firma)
Los libros marcados se acumulan en una barra de tinta al pie que redacta sola el
mensaje de WhatsApp con los títulos nombrados. Aparece únicamente cuando hay algo
dentro.

## Do's and Don'ts

### Do:
- **Do** apoyar todo texto en una superficie opaca, siempre, sin excepción.
- **Do** usar `#A34E06` para naranja en texto corrido y `#16293A` para texto sobre
  naranja.
- **Do** alinear cada sección a la medida de 1240px.
- **Do** darle a toda superficie nueva la fibra de washi, con la trama y la dosis
  que le toque según sea papel o tinta.
- **Do** dibujar los iconos como SVG con el mismo grosor de trazo.
- **Do** guardar la fibra sin pérdida (PNG). El ruido de baja amplitud es el peor
  caso para la compresión con pérdida: a calidad media desaparece sin avisar y la
  superficie queda plana.

### Don't:
- **Don't** escribir texto en `#F8831D`, ni en blanco sobre `#F8831D`.
- **Don't** poner campos de color a sangre. Un color plano pegado sobre el agua
  siempre deja costura; lo que va sobre el agua son hojas, con su canto visible.
- **Don't** volver a la cuadrícula de tres fichas iguales en la selección.
- **Don't** usar un rótulo como antetítulo encima de un titular.
- **Don't** apagar la cuenca entera para resolver un choque local: se mueve la
  tinta, no se le baja el volumen.
- **Don't** declarar un material que no se ve. Si una textura no cambia los píxeles,
  o se aplica de otra forma o se quita.
