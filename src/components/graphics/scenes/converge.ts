import { createRng, range } from "../engine/random";
import { drawSprite, glowSprite, sphereSprite, type Sprite } from "../engine/sprites";
import { TAU, clamp, easeInOutCubic, easeInOutSine, phase, smoothstep } from "../engine/timeline";
import type { Scene, SceneEnv, SceneFactory } from "../engine/types";

/**
 * Many points drift on curved paths into one lit focal sphere.
 * One application, every lender.
 */
const createConverge: SceneFactory = (): Scene => {
  let env: SceneEnv;
  let isHero = false;
  let count = 0;
  let width = 0;
  let fx = 0;
  let fy = 0;
  let spread = 0;
  let pointScale = 1;
  let focalRadius = 0;
  let clock = 0;
  let appear = 1;
  let release = 0;
  let arrived = 0;

  // Per-point constants.
  let angle: Float32Array;
  let radius: Float32Array;
  let depth: Float32Array;
  let curl: Float32Array;
  let delay: Float32Array;
  let drift: Float32Array;
  let driftPhase: Float32Array;
  let isAccent: Uint8Array;
  let order: Uint16Array;

  // Per-frame positions, written in update and read in render.
  let sx: Float32Array;
  let sy: Float32Array;
  let cx: Float32Array;
  let cy: Float32Array;
  let px: Float32Array;
  let py: Float32Array;
  let size: Float32Array;
  let alpha: Float32Array;

  /** Hero only: erases the render behind the text column. */
  let textMask: CanvasGradient | null = null;
  let height = 0;

  let inkSprite: Sprite;
  let accentSprite: Sprite;
  let focalSprite: Sprite;
  let glow: Sprite;
  const pathStride = 19;

  return {
    duration: 9,
    posterT: 0.62,

    init(nextEnv) {
      env = nextEnv;
      isHero = env.variant === "hero";
      count = isHero ? 560 : 150;
      const rng = createRng(isHero ? 7 : 11);

      angle = new Float32Array(count);
      radius = new Float32Array(count);
      depth = new Float32Array(count);
      curl = new Float32Array(count);
      delay = new Float32Array(count);
      drift = new Float32Array(count);
      driftPhase = new Float32Array(count);
      isAccent = new Uint8Array(count);
      sx = new Float32Array(count);
      sy = new Float32Array(count);
      cx = new Float32Array(count);
      cy = new Float32Array(count);
      px = new Float32Array(count);
      py = new Float32Array(count);
      size = new Float32Array(count);
      alpha = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        angle[i] = rng() * TAU;
        const r = Math.pow(rng(), 0.65);
        radius[i] = 0.3 + r * 0.95;
        depth[i] = rng();
        curl[i] = range(rng, 0.18, 0.55) * (rng() < 0.82 ? 1 : -0.6);
        delay[i] = r * 0.42 + rng() * 0.1;
        drift[i] = range(rng, 0.18, 0.42);
        driftPhase[i] = rng() * TAU;
        isAccent[i] = rng() < 0.26 ? 1 : 0;
      }

      order = new Uint16Array(count);
      for (let i = 0; i < count; i++) order[i] = i;
      order.sort((a, b) => depth[a] - depth[b]);

      const p = env.palette;
      inkSprite = sphereSprite(p.formLight, p.form, p.formShade, 64);
      accentSprite = sphereSprite(p.accentLight, p.accent, p.accentShade, 64);
      focalSprite = sphereSprite(p.accentLight, p.accent, p.accentShade, 256);
      glow = glowSprite(p.accent, 128);
    },

    resize(w, h) {
      width = w;
      height = h;
      const minSide = Math.min(w, h);
      if (isHero) {
        const isWide = w >= 768;
        fx = w * (isWide ? 0.72 : 0.8);
        fy = h * (isWide ? 0.5 : 0.2);
        spread = Math.max(w, h) * (isWide ? 0.5 : 0.62);
        pointScale = clamp(minSide / 640, 0.75, 1.5);
        focalRadius = clamp(minSide * 0.05, 18, 44);

        // Wide: fade out toward the left-hand text column. Narrow: below the top band.
        const ctx = document.createElement("canvas").getContext("2d");
        if (ctx) {
          textMask = isWide ? ctx.createLinearGradient(0, 0, w * 0.6, 0) : ctx.createLinearGradient(0, h * 0.5, 0, h * 0.18);
          textMask.addColorStop(0, "rgba(0, 0, 0, 0.94)");
          if (isWide) textMask.addColorStop(0.55, "rgba(0, 0, 0, 0.7)");
          textMask.addColorStop(1, "rgba(0, 0, 0, 0)");
        }
      } else {
        fx = w / 2;
        fy = h / 2;
        spread = minSide * 0.52;
        pointScale = clamp(minSide / 300, 0.7, 1.6);
        focalRadius = minSide * 0.085;
      }
    },

    update(dt, t) {
      clock += dt;
      let progress: number;
      if (isHero) {
        appear = 1;
        release = 0;
        progress = clamp(0.2 + t * 0.95 + Math.sin(clock * 0.35) * 0.025);
      } else {
        appear = smoothstep(phase(t, 0, 0.1));
        progress = easeInOutSine(phase(t, 0.06, 0.74));
        release = smoothstep(phase(t, 0.84, 1));
      }

      let landed = 0;
      for (let i = 0; i < count; i++) {
        const local = easeInOutCubic(clamp((progress - delay[i]) / 0.52));
        const r = radius[i] * spread;
        const wobble = spread * 0.018 * (1 - local);
        const x0 = fx + Math.cos(angle[i]) * r + Math.cos(clock * drift[i] + driftPhase[i]) * wobble;
        const y0 = fy + Math.sin(angle[i]) * r * 0.78 + Math.sin(clock * drift[i] * 1.3 + driftPhase[i]) * wobble;

        // Control point bends the path perpendicular to its chord.
        const dx = fx - x0;
        const dy = fy - y0;
        const c1x = (x0 + fx) / 2 - dy * curl[i];
        const c1y = (y0 + fy) / 2 + dx * curl[i];

        const u = 1 - local;
        sx[i] = x0;
        sy[i] = y0;
        cx[i] = c1x;
        cy[i] = c1y;
        px[i] = u * u * x0 + 2 * u * local * c1x + local * local * fx;
        py[i] = u * u * y0 + 2 * u * local * c1y + local * local * fy;

        const absorbed = local * local * local;
        size[i] = (1.4 + depth[i] * 4.2) * pointScale * (1 - 0.7 * absorbed);
        alpha[i] = (0.28 + 0.72 * depth[i]) * appear * (1 - release) * (1 - 0.92 * smoothstep(phase(local, 0.86, 1)));
        if (local > 0.97) landed++;
      }
      arrived = landed / count;
    },

    render(ctx) {
      if (width === 0) return;
      const p = env.palette;

      // A few of the paths, as hairlines, so the convergence reads as a system.
      ctx.strokeStyle = p.line;
      ctx.lineWidth = 1;
      ctx.globalAlpha = (isHero ? 0.55 : 0.8) * appear * (1 - release);
      ctx.beginPath();
      for (let i = 0; i < count; i += pathStride) {
        ctx.moveTo(sx[i], sy[i]);
        ctx.quadraticCurveTo(cx[i], cy[i], fx, fy);
      }
      ctx.stroke();

      const collected = arrived * (1 - release);
      drawSprite(ctx, glow, fx, fy, focalRadius * (6 + 4 * collected), (p.isDark ? 0.1 : 0.06) + (p.isDark ? 0.22 : 0.1) * collected);

      for (let k = 0; k < count; k++) {
        const i = order[k];
        drawSprite(ctx, isAccent[i] ? accentSprite : inkSprite, px[i], py[i], size[i], alpha[i]);
      }

      const r = focalRadius * (0.55 + 0.45 * collected);
      drawSprite(ctx, focalSprite, fx, fy, r * 2, isHero ? 1 : 0.4 + 0.6 * Math.max(appear - release, collected));

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
};

export default createConverge;
