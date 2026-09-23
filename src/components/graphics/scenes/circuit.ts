import { rgba } from "../engine/color";
import { createPool, type Pool } from "../engine/pool";
import { createRng, range, type Rng } from "../engine/random";
import { drawSprite, glowSprite, sphereSprite, type Sprite } from "../engine/sprites";
import { TAU, clamp, easeInOutSine, easeOutCubic, lerp, phase, smoothstep } from "../engine/timeline";
import type { Scene, SceneEnv, SceneFactory } from "../engine/types";

const TRACES = 14;
const MAX_POINTS = 6;
const CAPACITY = 48;
const START = -Math.PI / 2;
/** Hero scroll progress by which the ring is full; the band turns light soon after. */
const HERO_FULL_AT = 0.38;
const RIPPLE_SECONDS = 1.8;
/** Frozen pulses for the still frame: trace index and how far along it. */
const POSTER_PULSES = [
  [1, 0.55],
  [4, 0.3],
  [8, 0.72],
  [11, 0.45],
] as const;

type Field = "trace" | "s" | "speed";

/**
 * Circuit traces run from pads at the edges into one disc; current pulses
 * along them and a ring around the disc charges up. Plugged into lenders.
 */
const createCircuit: SceneFactory = (): Scene => {
  let env: SceneEnv;
  let isHero = false;
  let width = 0;
  let height = 0;
  let unit = 1;
  let cx = 0;
  let cy = 0;
  let discR = 0;
  let ringR = 0;
  let ringW = 0;

  let charge = 0.25;
  let arcAlpha = 1;
  let rate = 1;
  let spawnDebt = 0;
  let isStill = false;
  let ripple = -1;
  let hasRippled = false;

  // Trace polylines, flattened: point k of trace i sits at i * MAX_POINTS + k.
  const px = new Float32Array(TRACES * MAX_POINTS);
  const py = new Float32Array(TRACES * MAX_POINTS);
  const plen = new Float32Array(TRACES * MAX_POINTS);
  const pointCount = new Uint8Array(TRACES);
  const traceLength = new Float32Array(TRACES);
  const pinX = new Float32Array(TRACES);
  const pinY = new Float32Array(TRACES);
  const flash = new Float32Array(TRACES);
  const split = new Float32Array(TRACES);
  const jitter = new Float32Array(TRACES);

  let rng: Rng;
  let pool: Pool<Field>;
  let layer: HTMLCanvasElement | null = null;
  let textMask: CanvasGradient | null = null;
  let disc: Sprite;
  let head: Sprite;
  let glow: Sprite;
  let tailGlow = "";

  // Scratch output for pointAt, so walking a trace never allocates.
  let atX = 0;
  let atY = 0;

  const pointAt = (i: number, s: number) => {
    const base = i * MAX_POINTS;
    const n = pointCount[i];
    for (let k = 1; k < n; k++) {
      const end = plen[base + k];
      if (s <= end || k === n - 1) {
        const startLen = plen[base + k - 1];
        const u = end > startLen ? clamp((s - startLen) / (end - startLen)) : 0;
        atX = lerp(px[base + k - 1], px[base + k], u);
        atY = lerp(py[base + k - 1], py[base + k], u);
        return;
      }
    }
    atX = px[base];
    atY = py[base];
  };

  /** Stroke the part of trace i between distances a and b. */
  const strokeSpan = (ctx: CanvasRenderingContext2D, i: number, a: number, b: number) => {
    if (b <= a) return;
    const base = i * MAX_POINTS;
    ctx.beginPath();
    pointAt(i, a);
    ctx.moveTo(atX, atY);
    for (let k = 1; k < pointCount[i] - 1; k++) {
      const d = plen[base + k];
      if (d > a && d < b) ctx.lineTo(px[base + k], py[base + k]);
    }
    pointAt(i, b);
    ctx.lineTo(atX, atY);
    ctx.stroke();
  };

  const addPoint = (i: number, x: number, y: number) => {
    const base = i * MAX_POINTS;
    const n = pointCount[i];
    if (n > 0) {
      const dx = x - px[base + n - 1];
      const dy = y - py[base + n - 1];
      const d = Math.hypot(dx, dy);
      if (d < 0.5) return;
      plen[base + n] = plen[base + n - 1] + d;
    } else {
      plen[base] = 0;
    }
    px[base + n] = x;
    py[base + n] = y;
    pointCount[i] = n + 1;
  };

  /**
   * Route from a pad on an edge to a pin on the disc: straight off the edge,
   * one 45° diagonal, then straight into the pin, like a circuit board.
   */
  const route = (i: number, sx: number, sy: number, ex: number, ey: number, isVerticalFirst: boolean) => {
    pointCount[i] = 0;
    addPoint(i, sx, sy);
    const dp = isVerticalFirst ? ey - sy : ex - sx;
    const dq = isVerticalFirst ? ex - sx : ey - sy;
    const sp = Math.sign(dp) || 1;
    const sq = Math.sign(dq) || 1;
    const ap = Math.abs(dp);
    const aq = Math.abs(dq);
    const at = (p: number, q: number) => (isVerticalFirst ? addPoint(i, sx + q, sy + p) : addPoint(i, sx + p, sy + q));

    if (ap >= aq) {
      const run = (ap - aq) * split[i];
      at(sp * run, 0);
      at(sp * (run + aq), dq);
    } else {
      const run = ap * (0.25 + 0.25 * split[i]);
      const diagonal = ap - run;
      at(sp * run, 0);
      at(dp, sq * diagonal);
    }
    addPoint(i, ex, ey);
    traceLength[i] = plen[i * MAX_POINTS + pointCount[i] - 1];
  };

  const layout = () => {
    const isWide = width >= 768;
    const minSide = Math.min(width, height);
    // Directions the traces fan out in, measured from +x. The hero keeps them off the text column.
    let fromAngle = -Math.PI;
    let toAngle = Math.PI;
    if (isHero) {
      cx = width * (isWide ? 0.72 : 0.84);
      cy = isWide ? height * 0.5 : clamp(height * 0.15, 124, 136);
      discR = isWide ? clamp(minSide * 0.075, 26, 60) : clamp(width * 0.065, 20, 28);
      fromAngle = isWide ? -1.92 : -2.2;
      toAngle = isWide ? 1.92 : 1.3;
    } else {
      cx = width / 2;
      cy = height / 2;
      discR = minSide * 0.1;
    }
    ringR = discR * 1.75;
    ringW = discR * 0.26;
    unit = clamp(minSide / 640, 0.7, 1.4);
    const pinR = ringR + ringW * 1.6;
    const margin = isHero ? 22 : minSide * 0.07;

    const isFullCircle = toAngle - fromAngle >= TAU - 0.001;
    const slots = isFullCircle ? TRACES : TRACES - 1;
    const spacing = (toAngle - fromAngle) / slots;
    for (let i = 0; i < TRACES; i++) {
      const angle = fromAngle + i * spacing + jitter[i] * spacing;
      const ux = Math.cos(angle);
      const uy = Math.sin(angle);
      pinX[i] = cx + ux * pinR;
      pinY[i] = cy + uy * pinR;

      // Where the ray from the disc leaves the inset frame decides the edge the pad sits on.
      const tx = ux > 0 ? (width - margin - cx) / ux : ux < 0 ? (margin - cx) / ux : Infinity;
      const ty = uy > 0 ? (height - margin - cy) / uy : uy < 0 ? (margin - cy) / uy : Infinity;
      const isVerticalEdge = tx < ty;
      const reach = Math.min(tx, ty);
      const padX = cx + ux * reach;
      const padY = cy + uy * reach;
      route(i, padX, padY, pinX[i], pinY[i], !isVerticalEdge);
    }
  };

  const bakeLayer = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    layer ??= document.createElement("canvas");
    layer.width = Math.max(1, Math.round(width * dpr));
    layer.height = Math.max(1, Math.round(height * dpr));
    const ctx = layer.getContext("2d");
    if (!ctx) return;
    const p = env.palette;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = p.line;
    ctx.lineWidth = 1.25 * unit;
    ctx.beginPath();
    for (let i = 0; i < TRACES; i++) {
      const base = i * MAX_POINTS;
      ctx.moveTo(px[base], py[base]);
      for (let k = 1; k < pointCount[i]; k++) ctx.lineTo(px[base + k], py[base + k]);
    }
    ctx.stroke();

    // Pads at the edge ends, vias at each corner, pins at the disc.
    const pad = 7 * unit;
    ctx.fillStyle = p.form;
    for (let i = 0; i < TRACES; i++) {
      const base = i * MAX_POINTS;
      ctx.beginPath();
      ctx.roundRect(px[base] - pad / 2, py[base] - pad / 2, pad, pad, 1.5 * unit);
      ctx.fill();
    }
    ctx.fillStyle = rgba(p.formLight, p.isDark ? 0.35 : 0.5);
    for (let i = 0; i < TRACES; i++) {
      const base = i * MAX_POINTS;
      for (let k = 1; k < pointCount[i] - 1; k++) {
        ctx.beginPath();
        ctx.arc(px[base + k], py[base + k], 1.6 * unit, 0, TAU);
        ctx.fill();
      }
    }
    ctx.fillStyle = p.form;
    for (let i = 0; i < TRACES; i++) {
      ctx.beginPath();
      ctx.arc(pinX[i], pinY[i], 2.4 * unit, 0, TAU);
      ctx.fill();
    }

    // The empty charge track.
    ctx.strokeStyle = p.isDark ? rgba(p.formLight, 0.1) : rgba(p.formShade, 0.25);
    ctx.lineWidth = ringW;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, TAU);
    ctx.stroke();
  };

  const spawn = () => {
    const i = pool.spawn();
    if (i < 0) return;
    const f = pool.fields;
    f.trace[i] = Math.floor(rng() * TRACES);
    f.s[i] = 0;
    f.speed[i] = range(rng, 150, 260) * unit;
  };

  const step = (dt: number) => {
    spawnDebt += rate * dt;
    while (spawnDebt >= 1) {
      spawnDebt -= 1;
      spawn();
    }
    const { trace, s, speed } = pool.fields;
    for (let i = 0; i < CAPACITY; i++) {
      if (!pool.alive[i]) continue;
      s[i] += speed[i] * dt;
      const t = trace[i];
      if (s[i] >= traceLength[t]) {
        flash[t] = 1;
        pool.kill(i);
      }
    }
    const decay = Math.exp(-dt * 4);
    for (let i = 0; i < TRACES; i++) flash[i] *= decay;

    if (charge >= 0.999 && !hasRippled) {
      hasRippled = true;
      ripple = 0;
    } else if (charge < 0.95) {
      hasRippled = false;
    }
    if (ripple >= 0) {
      ripple += dt / RIPPLE_SECONDS;
      if (ripple >= 1) ripple = -1;
    }
  };

  const drawPulse = (ctx: CanvasRenderingContext2D, trace: number, s: number, strength: number) => {
    const p = env.palette;
    const tail = 90 * unit;
    ctx.globalAlpha = 0.22 * strength;
    ctx.strokeStyle = tailGlow;
    ctx.lineWidth = 5 * unit;
    strokeSpan(ctx, trace, Math.max(0, s - tail), s);
    ctx.globalAlpha = 0.85 * strength;
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 1.6 * unit;
    strokeSpan(ctx, trace, Math.max(0, s - tail * 0.5), s);
    pointAt(trace, s);
    drawSprite(ctx, glow, atX, atY, 22 * unit, 0.4 * strength);
    drawSprite(ctx, head, atX, atY, 5.5 * unit, strength);
  };

  const strokeArc = (ctx: CanvasRenderingContext2D, sweep: number, dx: number, dy: number) => {
    ctx.beginPath();
    ctx.arc(cx + dx, cy + dy, ringR, START, START + sweep);
    ctx.stroke();
  };

  const scene: Scene = {
    duration: 8,
    posterT: 0.72,

    init(nextEnv) {
      env = nextEnv;
      isHero = env.variant === "hero";
      scene.posterT = isHero ? 0.24 : 0.72;
      rng = createRng(isHero ? 41 : 43);
      for (let i = 0; i < TRACES; i++) {
        split[i] = range(rng, 0.3, 0.7);
        jitter[i] = range(rng, -0.22, 0.22);
      }
      pool = createPool(CAPACITY, ["trace", "s", "speed"] as const);
      const p = env.palette;
      disc = sphereSprite(p.formLight, p.form, p.formShade, 256);
      head = sphereSprite(p.accentLight, p.accent, p.accentShade, 48);
      glow = glowSprite(p.accent, 128);
      tailGlow = p.accentLight;
    },

    resize(w, h) {
      width = w;
      height = h;
      layout();
      bakeLayer();
      pool.clear();
      spawnDebt = 0;

      textMask = null;
      if (isHero) {
        const isWide = w >= 768;
        const ctx = document.createElement("canvas").getContext("2d");
        if (ctx) {
          textMask = isWide ? ctx.createLinearGradient(0, 0, w * 0.6, 0) : ctx.createLinearGradient(0, h * 0.4, 0, h * 0.24);
          textMask.addColorStop(0, "rgba(0, 0, 0, 0.94)");
          if (isWide) textMask.addColorStop(0.55, "rgba(0, 0, 0, 0.7)");
          textMask.addColorStop(1, "rgba(0, 0, 0, 0)");
        }
      }
    },

    update(dt, t) {
      isStill = dt === 0;
      if (isHero) {
        const progress = clamp(t / HERO_FULL_AT);
        charge = 0.25 + 0.75 * easeInOutSine(progress);
        arcAlpha = 1;
        rate = lerp(1.6, 7, progress);
      } else {
        charge = 0.2 + 0.8 * easeInOutSine(phase(t, 0.05, 0.7));
        arcAlpha = smoothstep(phase(t, 0, 0.06)) * (1 - smoothstep(phase(t, 0.88, 1)));
        rate = lerp(1.5, 5, charge);
      }
      if (dt > 0) step(dt);
    },

    render(ctx) {
      if (width === 0 || !layer) return;
      const p = env.palette;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.globalAlpha = 1;
      ctx.drawImage(layer, 0, 0, width, height);

      if (isStill) {
        for (let k = 0; k < POSTER_PULSES.length; k++) {
          const trace = POSTER_PULSES[k][0];
          drawPulse(ctx, trace, traceLength[trace] * POSTER_PULSES[k][1], 1);
        }
      } else {
        const { trace, s } = pool.fields;
        for (let i = 0; i < CAPACITY; i++) {
          if (!pool.alive[i]) continue;
          const fadeIn = smoothstep(clamp(s[i] / (40 * unit)));
          drawPulse(ctx, trace[i], s[i], fadeIn);
        }
      }

      for (let i = 0; i < TRACES; i++) {
        if (flash[i] > 0.02) drawSprite(ctx, glow, pinX[i], pinY[i], 26 * unit, flash[i] * 0.6);
      }

      const lit = charge * arcAlpha;
      drawSprite(ctx, glow, cx, cy, ringR * 3.4, (p.isDark ? 0.08 : 0.05) + (p.isDark ? 0.26 : 0.12) * lit);
      drawSprite(ctx, disc, cx, cy, discR * 2, 1);

      // Shade, body and highlight strokes give the charge arc a tubular form.
      const sweep = TAU * charge;
      ctx.globalAlpha = arcAlpha;
      ctx.strokeStyle = p.accentShade;
      ctx.lineWidth = ringW * 1.1;
      strokeArc(ctx, sweep, ringW * 0.18, ringW * 0.24);
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = ringW;
      strokeArc(ctx, sweep, 0, 0);
      ctx.strokeStyle = p.accentLight;
      ctx.lineWidth = ringW * 0.28;
      ctx.globalAlpha = arcAlpha * 0.75;
      strokeArc(ctx, sweep, -ringW * 0.18, -ringW * 0.24);

      if (ripple >= 0 && !isStill) {
        const eased = easeOutCubic(ripple);
        ctx.globalAlpha = (1 - ripple) * 0.5;
        ctx.strokeStyle = p.accent;
        ctx.lineWidth = 1.5 * unit;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR + ringW + eased * ringR * 1.3, 0, TAU);
        ctx.stroke();
      }

      if (textMask) {
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = textMask;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "source-over";
      }
      ctx.globalAlpha = 1;
    },
  };

  return scene;
};

export default createCircuit;
