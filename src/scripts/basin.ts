/**
 * La cuenca — suminagashi en WebGL2.
 *
 * Tinta flotando sobre agua quieta. Un solucionador de fluidos de verdad
 * (advección semi-lagrangiana + proyección de presión de Jacobi), no una
 * imitación con gradientes: cada gota empuja hacia afuera la tinta que ya
 * estaba, que es exactamente como se forman los anillos del suminagashi.
 *
 * Las tres tintas son las de la marca. La gota más nueva es siempre la más
 * saturada; el tinte se adelgaza a medida que se extiende.
 */

type NombreTinta = 'naranja' | 'azul' | 'amarillo' | 'agua';

const TINTAS: Record<NombreTinta, [number, number, number]> = {
  naranja: [0.973, 0.514, 0.114],
  azul: [0.129, 0.239, 0.325],
  amarillo: [0.98, 0.855, 0.341],
  // El "agua" es el surfactante: empuja la tinta sin teñir.
  agua: [0, 0, 0],
};

const VERT = `#version 300 es
precision highp float;
in vec2 aPos;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
uniform vec2 uTexel;
void main () {
  vUv = aPos * 0.5 + 0.5;
  vL = vUv - vec2(uTexel.x, 0.0);
  vR = vUv + vec2(uTexel.x, 0.0);
  vT = vUv + vec2(0.0, uTexel.y);
  vB = vUv - vec2(0.0, uTexel.y);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const F_COPY = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; out vec4 fragColor;
uniform sampler2D uTex;
void main () { fragColor = texture(uTex, vUv); }`;

/** Gota de tinta: tiñe y, a la vez, empuja radialmente hacia afuera. */
const F_SPLAT = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; out vec4 fragColor;
uniform sampler2D uTarget;
uniform float uAspect;
uniform vec3 uColor;
uniform vec2 uPoint;
uniform float uRadius;
uniform float uAlpha;
uniform float uSuavidad;
void main () {
  vec2 p = vUv - uPoint;
  p.x *= uAspect;
  float d = length(p);
  vec2 dir = d > 1e-5 ? p / d : vec2(1.0, 0.0);

  // El corazón del suminagashi: la gota nueva no se pinta encima, DESPLAZA.
  // Se muestrea el campo anterior desde más cerca del centro (sqrt(d²-r²)
  // conserva el área), así toda la tinta que ya estaba se corre hacia afuera
  // en un anillo. Empujar con velocidad no sirve: el solucionador es
  // incompresible y la proyección de presión cancela un campo radial puro.
  float rr = sqrt(max(d * d - uRadius * uRadius, 0.0));
  vec2 origen = uPoint + vec2(dir.x * rr / uAspect, dir.y * rr);
  vec4 base = texture(uTarget, origen);

  // Borde neto: la tinta sobre agua tiene filo, no degradado.
  float borde = max(uRadius * uSuavidad, 0.0012);
  float caida = 1.0 - smoothstep(uRadius - borde, uRadius + borde, d);
  float a = clamp(caida * uAlpha, 0.0, 1.0);

  fragColor = vec4(uColor * a + base.rgb * (1.0 - a), clamp(a + base.a * (1.0 - a), 0.0, 1.0));
}`;

/** Empuje radial: lo que hace que la gota nueva abra un anillo en la anterior. */
const F_EMPUJE = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; out vec4 fragColor;
uniform sampler2D uTarget;
uniform float uAspect;
uniform vec2 uPoint;
uniform float uRadius;
uniform float uFuerza;
void main () {
  vec2 p = vUv - uPoint;
  p.x *= uAspect;
  float d = length(p);
  float caida = exp(-dot(p, p) / uRadius);
  vec2 dir = d > 0.0001 ? p / d : vec2(0.0);
  vec2 base = texture(uTarget, vUv).xy;
  fragColor = vec4(base + dir * caida * uFuerza, 0.0, 1.0);
}`;

/** Arrastre del dedo sobre la superficie. */
const F_ARRASTRE = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; out vec4 fragColor;
uniform sampler2D uTarget;
uniform float uAspect;
uniform vec2 uPoint;
uniform vec2 uDelta;
uniform float uRadius;
void main () {
  vec2 p = vUv - uPoint;
  p.x *= uAspect;
  float caida = exp(-dot(p, p) / uRadius);
  fragColor = vec4(texture(uTarget, vUv).xy + uDelta * caida, 0.0, 1.0);
}`;

const F_ADVECCION = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uDt;
uniform float uDisipacion;
void main () {
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uTexel;
  vec4 resultado = texture(uSource, coord);
  fragColor = resultado / (1.0 + uDisipacion * uDt);
}`;

const F_DIVERGENCIA = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
out vec4 fragColor;
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`;

const F_CURL = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
out vec4 fragColor;
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  fragColor = vec4(0.5 * ((R - L) - (T - B)), 0.0, 0.0, 1.0);
}`;

/** Vorticidad: le devuelve al agua los remolinos finos que la rejilla se come. */
const F_VORTICIDAD = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uCurlFuerza;
uniform float uDt;
void main () {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 fuerza = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  fuerza /= length(fuerza) + 0.0001;
  fuerza *= uCurlFuerza * C;
  fuerza.y *= -1.0;
  vec2 vel = texture(uVelocity, vUv).xy + fuerza * uDt;
  fragColor = vec4(clamp(vel, -1000.0, 1000.0), 0.0, 1.0);
}`;

const F_PRESION = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
out vec4 fragColor;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergencia = texture(uDivergence, vUv).x;
  fragColor = vec4((L + R + B + T - divergencia) * 0.25, 0.0, 0.0, 1.0);
}`;

const F_GRADIENTE = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
out vec4 fragColor;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 vel = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  fragColor = vec4(vel, 0.0, 1.0);
}`;

/**
 * Pantalla: la tinta sobre el papel mojado. Mate, sin brillos.
 * El grano es del papel, no del monitor.
 */
const F_PANTALLA = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; out vec4 fragColor;
uniform sampler2D uTinta;
uniform vec3 uAgua;
uniform float uGrano;

float ruido (vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main () {
  vec4 tinta = texture(uTinta, vUv);
  float cobertura = clamp(tinta.a, 0.0, 1.0);

  // La tinta al adelgazarse pierde saturación antes que valor: el borde
  // de una mancha extendida es más pálido que su centro, como en el agua.
  vec3 color = cobertura > 0.001 ? tinta.rgb / max(cobertura, 0.001) : uAgua;
  vec3 fondo = mix(uAgua, color, smoothstep(0.0, 1.0, cobertura));

  float g = (ruido(vUv * 900.0) - 0.5) * uGrano;
  fragColor = vec4(fondo + g, 1.0);
}`;

interface Programa {
  prog: WebGLProgram;
  uni: Record<string, WebGLUniformLocation | null>;
}

interface FBO {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
  w: number;
  h: number;
  texelX: number;
  texelY: number;
}

interface DobleFBO {
  leer: FBO;
  escribir: FBO;
  intercambiar(): void;
}

export interface OpcionesCuenca {
  canvas: HTMLCanvasElement;
  /** Sin movimiento: se asienta y se congela en una marmoleada quieta. */
  quieto?: boolean;
}

export class Cuenca {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private quieto: boolean;

  private progCopy!: Programa;
  private progSplat!: Programa;
  private progEmpuje!: Programa;
  private progArrastre!: Programa;
  private progAdveccion!: Programa;
  private progDivergencia!: Programa;
  private progCurl!: Programa;
  private progVorticidad!: Programa;
  private progPresion!: Programa;
  private progGradiente!: Programa;
  private progPantalla!: Programa;

  private velocidad!: DobleFBO;
  private tinta!: DobleFBO;
  private presion!: DobleFBO;
  private divergencia!: FBO;
  private curl!: FBO;

  private simRes: number;
  private tintaRes: number;
  private iteraciones: number;

  private ultimo = 0;
  private rafId = 0;
  private corriendo = false;
  private ultimaActividad = 0;
  private destruido = false;

  private puntero = { x: 0, y: 0, dx: 0, dy: 0, abajo: false, movido: false };
  /** Pantalla angosta: el contenido ocupa todo el ancho y pisa la tinta. */
  private angosto = false;

  constructor(op: OpcionesCuenca) {
    this.canvas = op.canvas;
    this.quieto = op.quieto ?? false;

    const gl = this.canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    });
    if (!gl) throw new Error('sin-webgl2');
    this.gl = gl;

    // La rejilla se ajusta al presupuesto de GPU: un teléfono de gama media
    // que llega desde Instagram no debe calentarse por un fondo.
    const angosto = Math.min(window.innerWidth, window.innerHeight) < 760;
    this.angosto = window.innerWidth < 900;
    const pocosNucleos = (navigator.hardwareConcurrency ?? 4) <= 4;
    const modesto = angosto || pocosNucleos;

    this.simRes = modesto ? 96 : 128;
    this.tintaRes = modesto ? 320 : 512;
    this.iteraciones = modesto ? 10 : 18;

    if (!gl.getExtension('EXT_color_buffer_float')) {
      // Sin texturas flotantes renderizables no hay solucionador estable.
      throw new Error('sin-float');
    }
    gl.getExtension('OES_texture_float_linear');

    this.compilarTodo();
    this.crearBuffers();
    this.redimensionar();
  }

  // --- Infraestructura GL ------------------------------------------------

  private compilar(tipo: number, fuente: string): WebGLShader {
    const gl = this.gl;
    const sh = gl.createShader(tipo)!;
    gl.shaderSource(sh, fuente);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(sh) ?? 'shader');
    }
    return sh;
  }

  private programa(frag: string): Programa {
    const gl = this.gl;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, this.compilar(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, this.compilar(gl.FRAGMENT_SHADER, frag));
    gl.bindAttribLocation(prog, 0, 'aPos');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) ?? 'link');
    }
    const uni: Record<string, WebGLUniformLocation | null> = {};
    const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(prog, i)!;
      uni[info.name] = gl.getUniformLocation(prog, info.name);
    }
    return { prog, uni };
  }

  private compilarTodo() {
    this.progCopy = this.programa(F_COPY);
    this.progSplat = this.programa(F_SPLAT);
    this.progEmpuje = this.programa(F_EMPUJE);
    this.progArrastre = this.programa(F_ARRASTRE);
    this.progAdveccion = this.programa(F_ADVECCION);
    this.progDivergencia = this.programa(F_DIVERGENCIA);
    this.progCurl = this.programa(F_CURL);
    this.progVorticidad = this.programa(F_VORTICIDAD);
    this.progPresion = this.programa(F_PRESION);
    this.progGradiente = this.programa(F_GRADIENTE);
    this.progPantalla = this.programa(F_PANTALLA);
  }

  private crearBuffers() {
    const gl = this.gl;
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  }

  private fbo(w: number, h: number, internal: number, format: number, tipo: number): FBO {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, tipo, null);

    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return { tex, fbo, w, h, texelX: 1 / w, texelY: 1 / h };
  }

  private doble(w: number, h: number, internal: number, format: number, tipo: number): DobleFBO {
    const a = this.fbo(w, h, internal, format, tipo);
    const b = this.fbo(w, h, internal, format, tipo);
    return {
      leer: a,
      escribir: b,
      intercambiar() {
        const t = this.leer;
        this.leer = this.escribir;
        this.escribir = t;
      },
    };
  }

  private redimensionar() {
    const gl = this.gl;
    // Tope de densidad de píxeles: un fondo no justifica renderizar a 3x.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width === w && this.canvas.height === h && this.velocidad) return;
    this.canvas.width = w;
    this.canvas.height = h;

    const aspecto = w / h;
    const simW = Math.round(this.simRes * (aspecto > 1 ? aspecto : 1));
    const simH = Math.round(this.simRes * (aspecto > 1 ? 1 : 1 / aspecto));
    const tinW = Math.round(this.tintaRes * (aspecto > 1 ? aspecto : 1));
    const tinH = Math.round(this.tintaRes * (aspecto > 1 ? 1 : 1 / aspecto));

    const RG16F = (gl as unknown as { RG16F: number }).RG16F ?? 0x822f;
    const R16F = (gl as unknown as { R16F: number }).R16F ?? 0x822d;

    this.velocidad = this.doble(simW, simH, RG16F, gl.RG, gl.HALF_FLOAT);
    this.tinta = this.doble(tinW, tinH, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT);
    this.presion = this.doble(simW, simH, R16F, gl.RED, gl.HALF_FLOAT);
    this.divergencia = this.fbo(simW, simH, R16F, gl.RED, gl.HALF_FLOAT);
    this.curl = this.fbo(simW, simH, R16F, gl.RED, gl.HALF_FLOAT);
  }

  private dibujar(destino: FBO | null, prog: Programa) {
    const gl = this.gl;
    gl.useProgram(prog.prog);
    if (destino) {
      gl.viewport(0, 0, destino.w, destino.h);
      gl.bindFramebuffer(gl.FRAMEBUFFER, destino.fbo);
    } else {
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  private textura(prog: Programa, nombre: string, fbo: FBO, unidad: number) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unidad);
    gl.bindTexture(gl.TEXTURE_2D, fbo.tex);
    gl.uniform1i(prog.uni[nombre]!, unidad);
  }

  private texel(prog: Programa, fbo: FBO) {
    this.gl.uniform2f(prog.uni['uTexel']!, fbo.texelX, fbo.texelY);
  }

  // --- Verbos de la cuenca ------------------------------------------------

  /**
   * Suelta una gota. Tiñe y empuja: la tinta que ya estaba se abre en anillo,
   * que es como el suminagashi hace sus círculos concéntricos.
   */
  /**
   * Un baño ancho de tinta, sin empuje: la mano que entinta el agua antes de
   * peinarla. Es lo que hace que la cuenca tenga color en todo el campo y no
   * solo una manchita en el centro.
   */
  bano(x: number, y: number, tinta: NombreTinta, radio = 0.24, alpha = 0.5, suavidad = 0.85) {
    if (this.destruido || tinta === 'agua') return;
    const gl = this.gl;
    const color = TINTAS[tinta];
    const p = this.progSplat;
    gl.useProgram(p.prog);
    this.textura(p, 'uTarget', this.tinta.leer, 0);
    gl.uniform1f(p.uni['uAspect']!, this.canvas.width / this.canvas.height);
    gl.uniform3f(p.uni['uColor']!, color[0], color[1], color[2]);
    gl.uniform2f(p.uni['uPoint']!, x, y);
    gl.uniform1f(p.uni['uRadius']!, radio);
    gl.uniform1f(p.uni['uAlpha']!, alpha);
    gl.uniform1f(p.uni['uSuavidad']!, suavidad);
    this.dibujar(this.tinta.escribir, p);
    this.tinta.intercambiar();
  }

  drop(x: number, y: number, tinta: NombreTinta, fuerza = 1) {
    if (this.destruido) return;
    const gl = this.gl;
    const aspecto = this.canvas.width / this.canvas.height;
    const color = TINTAS[tinta];

    // El tensoactivo también cae: desplaza la tinta sin teñirla. Por eso se
    // ejecuta siempre el splat, con alfa 0 cuando la gota es agua.
    const p = this.progSplat;
    gl.useProgram(p.prog);
    this.textura(p, 'uTarget', this.tinta.leer, 0);
    gl.uniform1f(p.uni['uAspect']!, aspecto);
    gl.uniform3f(p.uni['uColor']!, color[0], color[1], color[2]);
    gl.uniform2f(p.uni['uPoint']!, x, y);
    gl.uniform1f(p.uni['uRadius']!, 0.082 * fuerza);
    gl.uniform1f(p.uni['uAlpha']!, tinta === 'agua' ? 0 : 0.95);
    // Filo casi limpio: es una gota, no una nube.
    gl.uniform1f(p.uni['uSuavidad']!, 0.09);
    this.dibujar(this.tinta.escribir, p);
    this.tinta.intercambiar();

    // Un empujoncito de velocidad, solo para que el anillo no salga perfecto.
    const e = this.progEmpuje;
    gl.useProgram(e.prog);
    this.textura(e, 'uTarget', this.velocidad.leer, 0);
    gl.uniform1f(e.uni['uAspect']!, aspecto);
    gl.uniform2f(e.uni['uPoint']!, x, y);
    gl.uniform1f(e.uni['uRadius']!, 0.006 * fuerza);
    gl.uniform1f(e.uni['uFuerza']!, 26 * fuerza);
    this.dibujar(this.velocidad.escribir, e);
    this.velocidad.intercambiar();

    this.despertar();
  }

  /** El dedo sobre la superficie: arrastra sin teñir. */
  private arrastrar(x: number, y: number, dx: number, dy: number) {
    const gl = this.gl;
    const p = this.progArrastre;
    gl.useProgram(p.prog);
    this.textura(p, 'uTarget', this.velocidad.leer, 0);
    gl.uniform1f(p.uni['uAspect']!, this.canvas.width / this.canvas.height);
    gl.uniform2f(p.uni['uPoint']!, x, y);
    gl.uniform2f(p.uni['uDelta']!, dx, dy);
    gl.uniform1f(p.uni['uRadius']!, 0.0022);
    this.dibujar(this.velocidad.escribir, p);
    this.velocidad.intercambiar();
  }

  private paso(dt: number) {
    const gl = this.gl;

    // Curl + vorticidad
    let p = this.progCurl;
    gl.useProgram(p.prog);
    this.texel(p, this.velocidad.leer);
    this.textura(p, 'uVelocity', this.velocidad.leer, 0);
    this.dibujar(this.curl, p);

    p = this.progVorticidad;
    gl.useProgram(p.prog);
    this.texel(p, this.velocidad.leer);
    this.textura(p, 'uVelocity', this.velocidad.leer, 0);
    this.textura(p, 'uCurl', this.curl, 1);
    gl.uniform1f(p.uni['uCurlFuerza']!, 12);
    gl.uniform1f(p.uni['uDt']!, dt);
    this.dibujar(this.velocidad.escribir, p);
    this.velocidad.intercambiar();

    // Divergencia
    p = this.progDivergencia;
    gl.useProgram(p.prog);
    this.texel(p, this.velocidad.leer);
    this.textura(p, 'uVelocity', this.velocidad.leer, 0);
    this.dibujar(this.divergencia, p);

    // Presión (Jacobi)
    p = this.progPresion;
    gl.useProgram(p.prog);
    this.texel(p, this.presion.leer);
    this.textura(p, 'uDivergence', this.divergencia, 0);
    for (let i = 0; i < this.iteraciones; i++) {
      this.textura(p, 'uPressure', this.presion.leer, 1);
      this.dibujar(this.presion.escribir, p);
      this.presion.intercambiar();
    }

    p = this.progGradiente;
    gl.useProgram(p.prog);
    this.texel(p, this.velocidad.leer);
    this.textura(p, 'uPressure', this.presion.leer, 0);
    this.textura(p, 'uVelocity', this.velocidad.leer, 1);
    this.dibujar(this.velocidad.escribir, p);
    this.velocidad.intercambiar();

    // Advección: primero la velocidad, después la tinta.
    p = this.progAdveccion;
    gl.useProgram(p.prog);
    this.texel(p, this.velocidad.leer);
    this.textura(p, 'uVelocity', this.velocidad.leer, 0);
    this.textura(p, 'uSource', this.velocidad.leer, 0);
    gl.uniform1f(p.uni['uDt']!, dt);
    // El agua es poco profunda y viscosa: los remolinos se calman solos.
    gl.uniform1f(p.uni['uDisipacion']!, 0.32);
    this.dibujar(this.velocidad.escribir, p);
    this.velocidad.intercambiar();

    gl.useProgram(p.prog);
    this.texel(p, this.velocidad.leer);
    this.textura(p, 'uVelocity', this.velocidad.leer, 0);
    this.textura(p, 'uSource', this.tinta.leer, 1);
    gl.uniform1f(p.uni['uDt']!, dt);
    // La tinta casi no se disipa: la cuenca recuerda por dónde pasó cada color.
    gl.uniform1f(p.uni['uDisipacion']!, 0.035);
    this.dibujar(this.tinta.escribir, p);
    this.tinta.intercambiar();
  }

  private pintar() {
    const gl = this.gl;
    const p = this.progPantalla;
    gl.useProgram(p.prog);
    this.textura(p, 'uTinta', this.tinta.leer, 0);
    // Debe coincidir con --color-agua.
    gl.uniform3f(p.uni['uAgua']!, 0.957, 0.949, 0.933);
    gl.uniform1f(p.uni['uGrano']!, 0.014);
    this.dibujar(null, p);
  }

  // --- Ciclo de vida -------------------------------------------------------

  /**
   * Un velo apenas visible. El agua limpia manda: el suminagashi es una isla
   * de tinta sobre papel mojado, no una superficie entintada de lado a lado.
   */
  private banarCuenca() {
    if (this.angosto) {
      this.bano(0.7, 0.88, 'naranja', 0.4, 0.16, 0.98);
      this.bano(0.28, 0.1, 'azul', 0.3, 0.1, 0.98);
    } else {
      this.bano(0.72, 0.56, 'naranja', 0.42, 0.16, 0.98);
      this.bano(0.16, 0.22, 'azul', 0.3, 0.1, 0.98);
    }
  }

  /**
   * El abanico cruzando la cuenca: convierte los anillos concéntricos en
   * lluvia plumeada. Es el segundo gesto del suminagashi, el que lo vuelve
   * marmoleado en vez de diana.
   */
  private peinar(altura: number, fuerza: number, ondas = 2.4, vertical = false) {
    const n = 26;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const onda = Math.sin(t * Math.PI * ondas);
      if (vertical) {
        // El abanico baja por la cuenca en vez de cruzarla.
        this.arrastrar(altura, t, fuerza * onda, fuerza * 0.3);
      } else {
        this.arrastrar(t, altura, fuerza * 0.28, fuerza * onda);
      }
    }
  }

  /**
   * Los anillos: tinta, tensoactivo, tinta, tensoactivo. Cada gota nueva abre
   * en anillo la anterior, y así se forman los círculos concéntricos.
   */
  private anillos(cx: number, cy: number, vueltas: number, escala = 1) {
    const orden: NombreTinta[] = ['naranja', 'agua', 'azul', 'agua', 'naranja', 'agua', 'amarillo', 'agua'];
    const pasos: Array<[NombreTinta, number]> = [];
    for (let i = 0; i < vueltas; i++) {
      // Muchas gotas finas en vez de pocas gruesas: así se ven los anillos
      // encajados unos dentro de otros, que es lo que nombra la palabra.
      pasos.push([orden[i % orden.length], (0.62 + (i % 3) * 0.14) * escala]);
    }
    return pasos.map(([tinta, fuerza], i) => ({
      tinta,
      fuerza,
      x: cx + Math.cos(i * 1.7) * 0.006,
      y: cy + Math.sin(i * 1.7) * 0.006,
    }));
  }

  private temporizadores: number[] = [];

  /** El guion completo del entintado, en el orden en que lo haría una mano. */
  private guion() {
    const gestos: Array<{ en: number; hacer: () => void }> = [];
    let t = 0;

    // En ancho la isla cae a la derecha, donde el margen quieto no llega.
    // En angosto se va al borde superior y al inferior: el contenido ocupa
    // todo el ancho y la banda central tiene que quedar de agua limpia para
    // que la portada real no compita con el plumón.
    const principal = this.angosto ? { x: 0.7, y: 0.88 } : { x: 0.74, y: 0.55 };
    const secundaria = this.angosto ? { x: 0.28, y: 0.1 } : { x: 0.24, y: 0.2 };

    this.anillos(principal.x, principal.y, 22).forEach((g) => {
      gestos.push({ en: (t += 88), hacer: () => this.drop(g.x, g.y, g.tinta, g.fuerza) });
    });

    this.anillos(secundaria.x, secundaria.y, 9, 0.78).forEach((g) => {
      gestos.push({ en: (t += 85), hacer: () => this.drop(g.x, g.y, g.tinta, g.fuerza) });
    });

    // Dos pasadas cortas del abanico, de onda fina y poca fuerza: el peine
    // pluma el borde de los anillos, no los deshace. Seis pasadas fuertes
    // convierten la cuenca en humo y borran el anillado, que es justo lo que
    // la palabra suminagashi nombra.
    const altoA = this.angosto ? 0.84 : 0.5;
    const altoB = this.angosto ? 0.14 : 0.66;
    gestos.push({ en: (t += 320), hacer: () => this.peinar(altoA, 30, 6) });
    gestos.push({ en: (t += 280), hacer: () => this.peinar(altoB, -22, 8, true) });

    return gestos;
  }

  sembrar() {
    this.temporizadores.forEach(clearTimeout);
    this.temporizadores = [];

    this.banarCuenca();

    this.guion().forEach(({ en, hacer }) => {
      const id = window.setTimeout(() => {
        if (this.destruido) return;
        hacer();
        this.despertar();
      }, en);
      this.temporizadores.push(id);
    });
  }

  arranca() {
    if (this.quieto) {
      // Sin movimiento: la cuenca se entinta de una vez y se congela en una
      // marmoleada quieta. Mismo mundo, sin nada moviéndose.
      this.banarCuenca();
      let previo = 0;
      for (const { en, hacer } of this.guion()) {
        const cuadros = Math.max(1, Math.round(((en - previo) / 1000) * 60));
        previo = en;
        hacer();
        for (let s = 0; s < Math.min(cuadros, 14); s++) this.paso(1 / 60);
      }
      for (let s = 0; s < 50; s++) this.paso(1 / 60);
      this.pintar();
      return;
    }
    this.sembrar();
    this.escuchar();
    this.despertar();
  }

  private despertar() {
    this.ultimaActividad = performance.now();
    if (this.corriendo || this.destruido || this.quieto) return;
    this.corriendo = true;
    this.ultimo = performance.now();
    this.rafId = requestAnimationFrame(this.bucle);
  }

  private dormir() {
    this.corriendo = false;
    cancelAnimationFrame(this.rafId);
  }

  private bucle = (ahora: number) => {
    if (this.destruido) return;
    const dt = Math.min((ahora - this.ultimo) / 1000, 1 / 45);
    this.ultimo = ahora;

    if (this.puntero.movido) {
      this.arrastrar(this.puntero.x, this.puntero.y, this.puntero.dx, this.puntero.dy);
      this.puntero.movido = false;
      this.puntero.dx = 0;
      this.puntero.dy = 0;
    }

    this.paso(dt);
    this.pintar();

    // La cuenca se aquieta sola: 14 s después del último gesto el agua ya
    // está quieta y seguir calculando solo gasta batería.
    if (ahora - this.ultimaActividad > 14000) {
      this.dormir();
      return;
    }
    this.rafId = requestAnimationFrame(this.bucle);
  };

  private escuchar() {
    const rect = () => this.canvas.getBoundingClientRect();

    const mover = (cx: number, cy: number) => {
      const r = rect();
      const x = (cx - r.left) / r.width;
      const y = 1 - (cy - r.top) / r.height;
      this.puntero.dx = (x - this.puntero.x) * 5200;
      this.puntero.dy = (y - this.puntero.y) * 5200;
      this.puntero.x = x;
      this.puntero.y = y;
      this.puntero.movido = true;
      this.despertar();
    };

    window.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType === 'touch' && !this.puntero.abajo) return;
        mover(e.clientX, e.clientY);
      },
      { passive: true },
    );
    window.addEventListener('pointerdown', (e) => {
      this.puntero.abajo = true;
      const r = rect();
      this.puntero.x = (e.clientX - r.left) / r.width;
      this.puntero.y = 1 - (e.clientY - r.top) / r.height;
    });
    window.addEventListener('pointerup', () => {
      this.puntero.abajo = false;
    });

    window.addEventListener('resize', () => {
      this.redimensionar();
      this.sembrar();
      this.despertar();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.dormir();
      else this.despertar();
    });
  }

  destruir() {
    this.destruido = true;
    this.dormir();
  }

  /** Diagnóstico: qué hay realmente en la tinta y si los destinos son válidos. */
  diagnostico() {
    const gl = this.gl;
    const f = this.tinta.leer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo);
    const estadoFbo = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    const px = new Float32Array(4);
    let leible = true;
    try {
      gl.readPixels(Math.floor(f.w * 0.62), Math.floor(f.h * 0.56), 1, 1, gl.RGBA, gl.FLOAT, px);
    } catch {
      leible = false;
    }
    return {
      estadoFbo,
      completo: estadoFbo === gl.FRAMEBUFFER_COMPLETE,
      leible,
      centro: [...px],
      errorGl: gl.getError(),
      tam: [f.w, f.h],
      corriendo: this.corriendo,
    };
  }
}

/** Monta la cuenca, o deja el respaldo de CSS si el equipo no da. */
export function montarCuenca(canvas: HTMLCanvasElement): Cuenca | null {
  // `?quieto=1` fuerza la cuenca asentada: sirve para capturas y para revisar
  // exactamente lo que ve quien pidió menos movimiento.
  const forzado = new URLSearchParams(location.search).get('quieto') === '1';
  const quieto = forzado || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Si el agua no va a responder, la invitación a tocarla es mentira.
  const inerte = () => document.documentElement.classList.add('cuenca-inerte');

  try {
    const cuenca = new Cuenca({ canvas, quieto });
    cuenca.arranca();
    canvas.dataset.estado = 'viva';
    if (quieto) inerte();
    return cuenca;
  } catch {
    // Sin WebGL2 o sin texturas flotantes: queda la marmoleada horneada.
    canvas.dataset.estado = 'respaldo';
    inerte();
    return null;
  }
}
