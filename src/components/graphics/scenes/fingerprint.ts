import { rgba } from "../engine/color";
import { createRng, range } from "../engine/random";
import { drawSpriteStretched, glowSprite, type Sprite } from "../engine/sprites";
import { TAU, easeInOutSine, lerp, phase, smoothstep } from "../engine/timeline";
import type { Scene, SceneEnv, SceneFactory } from "../engine/types";

const RINGS = 12;
const MAX_SEGMENTS = 120;

/**
 * Broken concentric ridges brighten as a band of light sweeps across.
 * Singpass and data security.
 */
const createFingerprint: SceneFactory = (): Scene => {
  let env: SceneEnv;
  let width = 0;
  let cx = 0;
  let cy = 0;
  let unit = 0;
  let innerR = 0;
  let ringStep = 0;
  let bandY = 0;
  let bandTop = 0;
  let bandBottom = 0;
  let bandWidth = 0;
  let bandAlpha = 0;
  let settle = 0;
  let segmentCount = 0;
  const segRing = new Uint8Array(MAX_SEGMENTS);
  const segStart = new Float32Array(MAX_SEGMENTS);
  const segEnd = new Float32Array(MAX_SEGMENTS);
  const segLit = new Float32Array(MAX_SEGMENTS);
  let scanGlow: Sprite;
  let scanLine = "";

  const ringRx = (k: number) => innerR + k * ringStep;
  const ringRy = (k: number) => (innerR + k * ringStep) * 1.24;
  const ringCy = (k: number) => cy + k * ringStep * 0.12;

  return {
    duration: 7.5,
    posterT: 0.42,

    init(nextEnv) {
      env = nextEnv;
      const rng = createRng(31);
      segmentCount = 0;
      for (let k = 0; k < RINGS && segmentCount < MAX_SEGMENTS; k++) {
        let angle = rng() * TAU;
        const end = angle + TAU;
        while (angle < end && segmentCount < MAX_SEGMENTS) {
          const length = range(rng, 0.5, 1.9);
          const a0 = angle;
          const a1 = Math.min(angle + length, end - 0.12);
          angle = a1 + range(rng, 0.14, 0.34);
          if (a1 <= a0) break;
          // Outer ridges open at the bottom, as a print does.
          const mid = ((((a0 + a1) / 2) % TAU) + TAU) % TAU;
          if (k > 7 && mid > 1.05 && mid < 2.1) continue;
          segRing[segmentCount] = k;
          segStart[segmentCount] = a0;
          segEnd[segmentCount] = a1;
          segmentCount++;
        }
      }
      const p = env.palette;
      scanGlow = glowSprite(p.accent, 128);
      scanLine = rgba(p.accent, 0.8);
    },

    resize(w, h) {
      width = w;
      unit = Math.min(w, h) / 100;
      cx = w / 2;
      cy = h * 0.47;
      const outer = Math.min(w * 0.3, (h * 0.36) / 1.24);
      innerR = outer * 0.1;
      ringStep = (outer - innerR) / (RINGS - 1);
      const extent = outer * 1.24 + ringStep * 1.5;
      bandTop = cy - extent;
      bandBottom = cy + extent + RINGS * ringStep * 0.12;
      bandWidth = extent * 0.22;
    },

    update(_dt, t) {
      const scan = phase(t, 0.1, 0.62);
      bandY = lerp(bandTop, bandBottom, easeInOutSine(scan));
      bandAlpha = smoothstep(phase(t, 0.06, 0.14)) * (1 - smoothstep(phase(t, 0.56, 0.66)));
      settle = 1 - smoothstep(phase(t, 0.84, 0.98));
      for (let s = 0; s < segmentCount; s++) {
        const k = segRing[s];
        const mid = (segStart[s] + segEnd[s]) / 2;
        const y = ringCy(k) + Math.sin(mid) * ringRy(k);
        const d = (y - bandY) / bandWidth;
        const near = Math.exp(-d * d) * bandAlpha;
        const passed = y < bandY && scan > 0 ? 0.42 : 0;
        segLit[s] = Math.max(near, passed * settle);
      }
    },

    render(ctx) {
      if (width === 0) return;
      const p = env.palette;
      ctx.lineCap = "round";
      ctx.lineWidth = unit * 0.95;

      ctx.globalAlpha = 1;
      ctx.strokeStyle = p.form;
      for (let s = 0; s < segmentCount; s++) {
        const k = segRing[s];
        ctx.beginPath();
        ctx.ellipse(cx, ringCy(k), ringRx(k), ringRy(k), 0, segStart[s], segEnd[s]);
        ctx.stroke();
      }

      ctx.strokeStyle = p.accent;
      for (let s = 0; s < segmentCount; s++) {
        if (segLit[s] < 0.02) continue;
        const k = segRing[s];
        ctx.globalAlpha = segLit[s];
        ctx.beginPath();
        ctx.ellipse(cx, ringCy(k), ringRx(k), ringRy(k), 0, segStart[s], segEnd[s]);
        ctx.stroke();
      }

      if (bandAlpha > 0.01) {
        const halfSpan = ringRx(RINGS - 1) * 1.25;
        drawSpriteStretched(ctx, scanGlow, cx, bandY, halfSpan * 2.4, bandWidth * 1.6, bandAlpha * (p.isDark ? 0.35 : 0.18));
        ctx.globalAlpha = bandAlpha;
        ctx.strokeStyle = scanLine;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - halfSpan, bandY);
        ctx.lineTo(cx + halfSpan, bandY);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },
  };
};

export default createFingerprint;
