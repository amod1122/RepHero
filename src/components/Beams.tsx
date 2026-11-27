"use client";

import { useEffect, useRef } from "react";

import "./Beams.css";

const QUAD_VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FIELD = `#version 300 es
precision highp float;
uniform vec2 uView;
uniform vec2 uScale;
uniform vec2 uTurn;
uniform float uTime;
uniform float uWidth;
uniform float uWave;
uniform float uDepth;
uniform float uRough;
uniform float uSeed;
uniform float uTwist;
uniform vec3 uLight;
uniform float uFill;
uniform float uCamera;
uniform vec4 uPointer;
out vec4 outColor;

const float PI = 3.141592653589793;

vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pf0.x, Pf0.y, Pf0.z, 0.0);
  vec4 iy = vec4(Pf1.y, Pf1.y, Pf1.y, 0.0);
  vec4 iz0 = vec4(Pf0.z, Pf0.z, Pf0.z, 0.0);
  vec4 iz1 = vec4(Pf1.z, Pf1.z, Pf1.z, 0.0);
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = 0.5 - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = 0.5 - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  vec4 gx = gx0 - gx1;
  vec4 gy = gy0 - gy1;
  vec4 gz = gz0 - gz1;
  vec4 norm = taylorInvSqrt(vec4(dot(gx, gx), dot(gy, gy), dot(gz, gz), dot(gx, gy)));
  gx *= norm.x;
  gy *= norm.y;
  gz *= norm.z;
  vec4 gxz = gx * gz;
  vec4 gyz = gy * gz;
  vec4 gzz = gz * gz;
  float px = Pf0.x;
  float py = Pf0.y;
  float pz = Pf0.z;
  float pxx = px * px;
  float pxy = px * py;
  float pxz = px * pz;
  float pyy = py * py;
  float pyz = py * pz;
  float pzz = pz * pz;
  vec4 fx = vec4(step(pzz, pxx));
  vec4 fy = vec4(step(pzz, pyy));
  vec4 fz = vec4(step(pzz, pzz));
  vec4 gx00 = mix(gxz, gx, fx);
  vec4 gy00 = mix(gyz, gy, fx);
  vec4 gz00 = mix(gzz, gz, fx);
  vec4 gx10 = mix(gxz, gx, fy);
  vec4 gy10 = mix(gyz, gy, fy);
  vec4 gz10 = mix(gzz, gz, fy);
  vec4 gx01 = mix(gxz, gx, fz);
  vec4 gy01 = mix(gyz, gy, fz);
  vec4 gz01 = mix(gzz, gz, fz);
  vec4 gx11 = mix(gxz, gx, fy * fz);
  vec4 gy11 = mix(gyz, gy, fy * fz);
  vec4 gz11 = mix(gzz, gz, fy * fz);
  vec4 g0000 = gx00 * px + gy00 * py + gz00 * pz;
  vec4 g1000 = gx10 * px + gy10 * py + gz10 * pz;
  vec4 g0100 = gx01 * px + gy01 * py + gz01 * pz;
  vec4 g1100 = gx11 * px + gy11 * py + gz11 * pz;
  vec4 g0010 = gx00 * (1.0 - px) + gy00 * (1.0 - py) + gz00 * (1.0 - pz);
  vec4 g1010 = gx10 * (1.0 - px) + gy10 * (1.0 - py) + gz10 * (1.0 - pz);
  vec4 g0110 = gx01 * (1.0 - px) + gy01 * (1.0 - py) + gz01 * (1.0 - pz);
  vec4 g1110 = gx11 * (1.0 - px) + gy11 * (1.0 - py) + gz11 * (1.0 - pz);
  vec4 value = g0000 - 0.5 * (g1000 + g0100 + g0010) + 0.25 * (g1100 + g1010 + g0110) - 0.125 * g1110;
  return 2.2 * value.x;
}

float laneHash(float lane) {
  return fract(sin(lane * 91.3458 + uSeed * 17.17) * 47453.5453);
}

float lobe(float nh, float nl, float nv, float vh, float roughness) {
  float a = roughness * roughness;
  float a2 = a * a;
  float d = nh * nh * (a2 - 1.0) + 1.0;
  float distribution = a2 / (PI * d * d);
  float gv = nl * sqrt(nv * nv * (1.0 - a2) + a2);
  float gl = nv * sqrt(nl * nl * (1.0 - a2) + a2);
  float visibility = 0.5 / max(gv + gl, 0.0001);
  float fresnel = 0.028 + 0.972 * pow(1.0 - vh, 5.0);
  return distribution * visibility * fresnel * nl;
}

vec2 glint(float lane, vec2 local) {
  float along = local.y / uWave - laneHash(lane) * 60.0;
  float slopeStep = 0.01;
  float slope = (cnoise(vec3(0.0, along + slopeStep, uTime)) - cnoise(vec3(0.0, along - slopeStep, uTime))) / (2.0 * slopeStep);
  slope *= 0.2 * uDepth;
  float spin = laneHash(lane + 0.37);
  float tilt = ((spin - 0.5) * 0.5 + sin(uTime * 2.1 + spin * 6.2831) * 0.06) * uTwist;
  vec3 normal = normalize(vec3(tilt, -slope, 1.0));
  vec3 view = normalize(vec3(-local, uCamera));
  float nv = max(dot(normal, view), 0.0001);
  vec3 light = normalize(uLight);
  vec3 halfway = normalize(light + view);
  float core = lobe(max(dot(normal, halfway), 0.0), max(dot(normal, light), 0.0), nv, max(dot(view, halfway), 0.0), uRough);
  vec3 fill = normalize(vec3(0.0, -uLight.y * 1.25, uLight.z));
  vec3 fillHalf = normalize(fill + view);
  core += uFill * lobe(max(dot(normal, fillHalf), 0.0), max(dot(normal, fill), 0.0), nv, max(dot(view, fillHalf), 0.0), uRough);
  return vec2(core, core);
}

void main() {
  vec2 css = gl_FragCoord.xy * uScale;
  vec2 centered = css - uView * 0.5;
  vec2 local = mat2(uTurn.x, -uTurn.y, uTurn.y, uTurn.x) * centered;

  float across = local.x / uWidth + 0.5;
  float lane = floor(across);
  float u = across - lane;
  vec2 value = glint(lane, local);

  float pixel = max(uScale.x, uScale.y);
  float seam = min(u, 1.0 - u) * uWidth;
  if (seam < pixel * 1.5) {
    float other = u < 0.5 ? lane - 1.0 : lane + 1.0;
    float blend = 0.5 * (1.0 - smoothstep(0.0, pixel * 1.5, seam));
    value = mix(value, glint(other, local), blend);
  }

  vec2 toPointer = css - uPointer.xy;
  float near = exp(-dot(toPointer, toPointer) / (2.0 * uPointer.w * uPointer.w)) * uPointer.z;
  value *= 1.0 + near * 0.8;
  float hot = max(value.y - 0.18, 0.0);
  outColor = vec4(value.x, value.y, min(hot, 6.0), 1.0);
}`;

const COMPOSITE = `#version 300 es
precision highp float;
uniform sampler2D uField;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform vec3 uInk;
uniform float uGain;
uniform float uGlow;
uniform float uPresence;
uniform float uGrain;
uniform float uFade;
uniform float uOpacity;
uniform float uLightMode;
out vec4 outColor;

float random(vec2 st) {
  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
}

float grainNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec3 acesFilmic(vec3 color) {
  const mat3 inputMatrix = mat3(
    vec3(0.59719, 0.07600, 0.02840),
    vec3(0.35458, 0.90834, 0.13383),
    vec3(0.04823, 0.01566, 0.83777)
  );
  const mat3 outputMatrix = mat3(
    vec3(1.60475, -0.10208, -0.00327),
    vec3(-0.53108, 1.10813, -0.07276),
    vec3(-0.07367, -0.00605, 1.07602)
  );
  color = inputMatrix * color;
  color = outputMatrix * (color / 0.6);
  color = clamp(color, 0.0, 1.0);
  return color;
}

vec3 toSrgb(vec3 color) {
  return mix(color * 12.92, 1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), color));
}

float feather(float x, float edge) {
  float t = clamp(x / max(edge, 0.0001), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float radiance = textureLod(uField, uv, 0.0).r;
  float bloom = 0.0;
  bloom += textureLod(uField, uv, 2.0).b * 0.3;
  bloom += textureLod(uField, uv, 3.0).b * 0.3;
  bloom += textureLod(uField, uv, 4.0).b * 0.22;
  bloom += textureLod(uField, uv, 5.0).b * 0.18;

  float hot = textureLod(uField, uv, 0.0).g;
  vec3 light = uColor * (radiance + bloom * uGlow) * uGain;
  light += mix(uColor, vec3(1.0), 0.7) * hot * hot * 0.12 * uGain;
  light *= uPresence;
  vec3 color = toSrgb(acesFilmic(light));
  color -= grainNoise(gl_FragCoord.xy) / 15.0 * uGrain;
  color = max(color, 0.0);

  float edge = uFade * 0.5;
  float mask = feather(uv.x, edge) * feather(1.0 - uv.x, edge) * feather(uv.y, edge) * feather(1.0 - uv.y, edge);
  mask *= uOpacity;
  float dither = (random(gl_FragCoord.yx + 31.7) - 0.5) / 255.0;

  float peak = max(color.r, max(color.g, color.b));
  if (uLightMode > 0.5) {
    float alpha = clamp(peak * 0.9 + dither, 0.0, 1.0) * mask;
    outColor = vec4(uInk * alpha, alpha);
  } else {
    color = clamp(color + dither, 0.0, 1.0) * mask;
    outColor = vec4(color, max(color.r, max(color.g, color.b)));
  }
}`;

const INTRO_SECONDS = 1.6;
const MAX_FIELD_PIXELS = 1600000;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const compile = (
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;

  const message = gl.getShaderInfoLog(shader) ?? "Unknown shader error";
  console.error("Beams shader compilation failed", message);
  (window as unknown as { __beamsError?: string }).__beamsError = message;
  gl.deleteShader(shader);
  return null;
};

const link = (
  gl: WebGL2RenderingContext,
  fragmentSource: string,
): {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
} | null => {
  const vertex = compile(gl, gl.VERTEX_SHADER, QUAD_VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  if (!vertex || !fragment || !program) return null;

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, "aPosition");
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? "Unknown link error";
    console.error("Beams shader link failed", message);
    (window as unknown as { __beamsError?: string }).__beamsError = message;
    gl.deleteProgram(program);
    return null;
  }

  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

  for (let index = 0; index < count; index += 1) {
    const info = gl.getActiveUniform(program, index);
    if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
  }

  return { program, uniforms };
};

export type BeamsProps = {
  color?: string;
  beamWidth?: number;
  rotation?: number;
  speed?: number;
  waveLength?: number;
  depth?: number;
  sharpness?: number;
  twist?: number;
  fillLight?: number;
  brightness?: number;
  glow?: number;
  grain?: number;
  variation?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  intro?: boolean;
  fade?: number;
  opacity?: number;
  lightMode?: boolean;
  backgroundColor?: string;
  quality?: number;
  paused?: boolean;
  dpr?: number;
  className?: string;
  style?: React.CSSProperties;
};

export const Beams = ({
  color = "#ffffff",
  beamWidth = 140,
  rotation = 30,
  speed = 1,
  waveLength = 233,
  depth = 1,
  sharpness = 0.6,
  twist = 0,
  fillLight = 0.3,
  glow = 0.6,
  brightness = 1.6,
  variation = 0,
  grain = 0.35,
  quality = 0.75,
  mouseInteraction = true,
  mouseStrength = 1,
  intro = true,
  fade = 0,
  opacity = 1,
  lightMode = false,
  backgroundColor,
  paused = false,
  dpr,
  className = "",
  style,
  ...rest
}: BeamsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wakeRef = useRef<(() => void) | null>(null);

  const settings = {
    color: String(color),
    beamWidth: Math.max(8, beamWidth),
    rotation,
    speed,
    waveLength: Math.max(20, waveLength),
    depth: Math.max(0, depth),
    sharpness: clamp(sharpness, 0, 1),
    twist: clamp(twist, 0, 2),
    fillLight: clamp(fillLight, 0, 1.5),
    glow: Math.max(0, glow),
    brightness: Math.max(0, brightness),
    variation: Number(variation) || 0,
    grain: Math.max(0, grain),
    quality: clamp(quality, 0.25, 1),
    mouseInteraction,
    mouseStrength: Math.max(0, mouseStrength),
    intro,
    fade: clamp(fade, 0, 1),
    opacity: clamp(opacity, 0, 1),
    lightMode,
    paused,
    dpr,
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });

    if (!container || !canvas || !gl) return undefined;

    const floatTargets = !!gl.getExtension("EXT_color_buffer_float");
    const fieldProgram = link(gl, FIELD);
    const compositeProgram = link(gl, COMPOSITE);
    if (!fieldProgram || !compositeProgram) return undefined;

    const buffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let texture: WebGLTexture | null = null;
    const framebuffer = gl.createFramebuffer();
    const target = { width: 0, height: 0 };
    const sizeTarget = (width: number, height: number) => {
      if (target.width === width && target.height === height) return;
      target.width = width;
      target.height = height;
      if (texture) gl.deleteTexture(texture);
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      const levels = Math.floor(Math.log2(Math.max(width, height))) + 1;
      gl.texStorage2D(
        gl.TEXTURE_2D,
        levels,
        floatTargets ? gl.RGBA16F : gl.RGBA8,
        width,
        height,
      );
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_S,
        gl.CLAMP_TO_EDGE,
      );
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_T,
        gl.CLAMP_TO_EDGE,
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0,
      );
    };

    const probe = document
      .createElement("canvas")
      .getContext("2d", { willReadFrequently: true });
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const colorCache = new Map<string, number[]>();
    const toLinear = (value: string) => {
      const cached = colorCache.get(value);
      if (cached) return cached;
      let rgb = [1, 1, 1];
      if (probe) {
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = "#ffffff";
        probe.fillStyle = value;
        probe.fillRect(0, 0, 1, 1);
        const data = probe.getImageData(0, 0, 1, 1).data;
        rgb = [data[0], data[1], data[2]].map((channel) =>
          Math.pow(channel / 255, 2.2),
        );
      }
      colorCache.set(value, rgb);
      return rgb;
    };

    const view = {
      width: 1,
      height: 1,
      fieldWidth: 1,
      fieldHeight: 1,
    };
    const pointer = { x: 0, y: 0, inside: false };
    const state = {
      clock: 0,
      intro: settingsRef.current.intro && !reduce ? 0 : 1,
      reach: 0,
      x: 0,
      y: 0,
      lightY: 0,
    };
    let raf = 0;
    let last = 0;
    let visible = true;

    const render = () => {
      const current = settingsRef.current;
      const presence =
        state.intro *
        state.intro *
        state.intro *
        (state.intro * (state.intro * 6 - 15) + 10);
      gl.bindVertexArray(vao);
      sizeTarget(view.fieldWidth, view.fieldHeight);

      const angle = (current.rotation * Math.PI) / 180;
      const sweep = (1 - presence) * -9;
      const reach = state.reach * current.mouseStrength;
      const field = fieldProgram.uniforms;
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.viewport(0, 0, target.width, target.height);
      gl.useProgram(fieldProgram.program);
      gl.uniform2f(field.uView, view.width, view.height);
      gl.uniform2f(
        field.uScale,
        view.width / target.width,
        view.height / target.height,
      );
      gl.uniform2f(field.uTurn, Math.cos(angle), Math.sin(angle));
      gl.uniform1f(field.uTime, (state.clock * 0.12) % 289);
      gl.uniform1f(field.uWidth, current.beamWidth);
      gl.uniform1f(field.uWave, current.waveLength);
      gl.uniform1f(field.uDepth, current.depth);
      gl.uniform1f(field.uRough, 0.55 - current.sharpness * 0.5);
      gl.uniform1f(field.uSeed, current.variation);
      gl.uniform1f(field.uTwist, current.twist);
      gl.uniform1f(field.uFill, current.fillLight);
      gl.uniform3f(field.uLight, 0, 3 + sweep + state.lightY * reach, 10);
      gl.uniform1f(field.uCamera, view.height * 1.866);
      gl.uniform4f(
        field.uPointer,
        state.x,
        view.height - state.y,
        reach,
        Math.max(view.height, view.width) * 0.28,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.generateMipmap(gl.TEXTURE_2D);

      const composite = compositeProgram.uniforms;
      const tint = toLinear(current.color);
      const tone =
        0.2126 * tint[0] + 0.7152 * tint[1] + 0.0722 * tint[2];
      const shadeDepth = Math.min(1, 0.18 / Math.max(tone, 0.001));
      const ink = tint.map((channel) =>
        Math.pow(Math.min(1, channel * shadeDepth), 1 / 2.2),
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(compositeProgram.program);
      gl.uniform2f(composite.uResolution, canvas.width, canvas.height);
      gl.uniform3fv(composite.uColor, tint);
      gl.uniform3fv(composite.uInk, ink);
      gl.uniform1f(composite.uGain, current.brightness);
      gl.uniform1f(composite.uGlow, current.glow);
      gl.uniform1f(composite.uPresence, presence);
      gl.uniform1f(composite.uGrain, current.grain * 1.75);
      gl.uniform1f(composite.uFade, current.fade);
      gl.uniform1f(composite.uOpacity, current.opacity);
      gl.uniform1f(composite.uLightMode, current.lightMode ? 1 : 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(composite.uField, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const current = settingsRef.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const moving = !current.paused && !reduce;
      if (moving) state.clock += dt * current.speed;
      if (!current.intro || reduce) state.intro = 1;
      else if (state.intro < 1) {
        state.intro = Math.min(1, state.intro + dt / INTRO_SECONDS);
      }

      const engaged =
        current.mouseInteraction && pointer.inside && !reduce;
      if (engaged && state.reach < 0.01) {
        state.x = pointer.x;
        state.y = pointer.y;
      }
      const follow = 1 - Math.exp(-dt * 7);
      state.x += (pointer.x - state.x) * follow;
      state.y += (pointer.y - state.y) * follow;
      state.reach +=
        ((engaged ? 1 : 0) - state.reach) *
        (1 - Math.exp(-dt * (engaged ? 3.2 : 1.8)));
      const turn = (current.rotation * Math.PI) / 180;
      const offsetX = state.x - view.width / 2;
      const offsetY = view.height / 2 - state.y;
      const along =
        -Math.sin(turn) * offsetX + Math.cos(turn) * offsetY;
      state.lightY = clamp(
        (along / (view.height * 0.5)) * 3,
        -4,
        4,
      );
      render();

      const settling =
        state.intro < 1 ||
        Math.abs((engaged ? 1 : 0) - state.reach) > 0.002 ||
        Math.abs(pointer.x - state.x) + Math.abs(pointer.y - state.y) >
          0.3;
      if (moving || settling) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => {
      if (!raf && visible && !document.hidden) {
        raf = requestAnimationFrame(frame);
      }
    };

    const resize = () => {
      const current = settingsRef.current;
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      const ratio = Math.min(
        current.dpr || window.devicePixelRatio || 1,
        2,
      );
      view.width = width;
      view.height = height;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      let fieldScale = current.quality * ratio;
      if (
        width * height * fieldScale * fieldScale >
        MAX_FIELD_PIXELS
      ) {
        fieldScale = Math.sqrt(
          MAX_FIELD_PIXELS / (width * height),
        );
      }
      view.fieldWidth = Math.max(
        1,
        Math.round(width * fieldScale),
      );
      view.fieldHeight = Math.max(
        1,
        Math.round(height * fieldScale),
      );
      render();
      wake();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.inside =
        pointer.x >= 0 &&
        pointer.y >= 0 &&
        pointer.x <= rect.width &&
        pointer.y <= rect.height;
      wake();
    };

    const onPointerLeave = () => {
      pointer.inside = false;
      wake();
    };

    const onVisibility = () => {
      last = 0;
      wake();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) {
        last = 0;
        wake();
      }
    });
    intersection.observe(container);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener(
      "pointerleave",
      onPointerLeave,
    );
    document.addEventListener("visibilitychange", onVisibility);
    resize();

    let lastQuality = settingsRef.current.quality;
    let lastDpr = settingsRef.current.dpr;
    wakeRef.current = () => {
      const current = settingsRef.current;
      if (
        current.quality !== lastQuality ||
        current.dpr !== lastDpr
      ) {
        lastQuality = current.quality;
        lastDpr = current.dpr;
        resize();
        return;
      }
      if (!raf) render();
      wake();
    };

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      document.removeEventListener("visibilitychange", onVisibility);
      if (texture) gl.deleteTexture(texture);
      gl.deleteFramebuffer(framebuffer);
      gl.deleteProgram(fieldProgram.program);
      gl.deleteProgram(compositeProgram.program);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      if (!canvas.isConnected) {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
    };
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  return (
    <div
      ref={containerRef}
      className={`beams-container${className ? ` ${className}` : ""}`}
      style={
        backgroundColor
          ? { background: backgroundColor, ...style }
          : style
      }
      {...rest}
    >
      <canvas
        ref={canvasRef}
        className="beams-canvas"
        aria-hidden="true"
      />
    </div>
  );
};

export default Beams;
