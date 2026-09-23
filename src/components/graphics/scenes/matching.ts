import { createRng, range } from "../engine/random";
import {
  drawSprite,
  drawSpriteStretched,
  glowSprite,
  shadowSprite,
  sphereSprite,
  type Sprite,
} from "../engine/sprites";
import { TAU, easeInOutCubic, lerp, phase, smoothstep } from "../engine/timeline";
import type { Scene, SceneEnv, SceneFactory } from "../engine/types";

const NODES = 12;
/** Lenders that send an offer back, spread around the ring. */
const MATCHED = [1, 4, 6, 9, 11];
const OUT_TRAVEL = 0.12;
const BACK_TRAVEL = 0.1;
const RESET_START = 0.86;
const RESET_END = 0.97;

/**
 * An application at the centre of a ring of lenders. A pulse runs out to
 * every lender; a few send an accent pulse back and stay lit. Matching.
 */
const createMatching: SceneFactory = (): Scene => {
  let env: SceneEnv;
  let width = 0;
  let cx = 0;
  let cy = 0;
  let radius = 0;
  let unit = 0;
  let reset = 0;
  let centreGlow = 0;

  const angle = new Float32Array(NODES);
  const nodeX = new Float32Array(NODES);
  const nodeY = new Float32Array(NODES);
  const outStart = new Float32Array(NODES);
  const backStart = new Float32Array(NODES);
  const isMatched = new Uint8Array(NODES);
  /** Per-frame: outbound progress, return progress, and how lit each node is. */
  const outT = new Float32Array(NODES);
  const backT = new Float32Array(NODES);
  const lit = new Float32Array(NODES);
  const reached = new Float32Array(NODES);

  let neutral: Sprite;
  let accent: Sprite;
  let core: Sprite;
  let pulse: Sprite;
  let glow: Sprite;
  let shadow: Sprite;

  return {
    duration: 8,
    posterT: 0.78,

    init(nextEnv) {
      env = nextEnv;
      const p = env.palette;
      neutral = sphereSprite(p.formLight, p.form, p.formShade, 64);
      accent = sphereSprite(p.accentLight, p.accent, p.accentShade, 64);
      core = sphereSprite(p.formLight, p.form, p.formShade, 160);
      pulse = sphereSprite(p.highlight, p.formLight, p.form, 32);
      glow = glowSprite(p.accent, 128);
      shadow = shadowSprite(p.shadow, 96);

      const rng = createRng(31);
      for (let i = 0; i < NODES; i++) {
        angle[i] = -Math.PI / 2 + (i / NODES) * TAU + range(rng, -0.06, 0.06);
        outStart[i] = 0.06 + (i / NODES) * 0.14 + range(rng, 0, 0.03);
        isMatched[i] = 0;
      }
      for (let k = 0; k < MATCHED.length; k++) {
        const i = MATCHED[k];
        isMatched[i] = 1;
        backStart[i] = 0.36 + k * 0.075 + range(rng, 0, 0.025);
      }
    },

    resize(w, h) {
      width = w;
      cx = w / 2;
      cy = h / 2;
      unit = Math.min(w, h) / 100;
      radius = Math.min(w * 0.36, h * 0.36);
      for (let i = 0; i < NODES; i++) {
        nodeX[i] = cx + Math.cos(angle[i]) * radius;
        nodeY[i] = cy + Math.sin(angle[i]) * radius;
      }
    },

    update(_dt, t) {
      reset = smoothstep(phase(t, RESET_START, RESET_END));
      let litTotal = 0;
      for (let i = 0; i < NODES; i++) {
        outT[i] = easeInOutCubic(phase(t, outStart[i], outStart[i] + OUT_TRAVEL));
        reached[i] = smoothstep(phase(t, outStart[i] + OUT_TRAVEL * 0.85, outStart[i] + OUT_TRAVEL * 1.25));
        if (isMatched[i]) {
          backT[i] = easeInOutCubic(phase(t, backStart[i], backStart[i] + BACK_TRAVEL));
          lit[i] = smoothstep(phase(t, backStart[i], backStart[i] + BACK_TRAVEL * 0.4)) * (1 - reset);
          litTotal += smoothstep(phase(t, backStart[i] + BACK_TRAVEL * 0.8, backStart[i] + BACK_TRAVEL * 1.3));
        } else {
          backT[i] = 0;
          lit[i] = 0;
        }
      }
      centreGlow = (litTotal / MATCHED.length) * (1 - reset);
    },

    render(ctx) {
      if (width === 0) return;
      const p = env.palette;
      ctx.lineCap = "round";

      // Hairlines: every lender, then the matched ones warming to accent.
      ctx.globalAlpha = 1;
      ctx.strokeStyle = p.line;
      ctx.lineWidth = unit * 0.35;
      ctx.beginPath();
      for (let i = 0; i < NODES; i++) {
        ctx.moveTo(cx, cy);
        ctx.lineTo(nodeX[i], nodeY[i]);
      }
      ctx.stroke();

      ctx.strokeStyle = p.accent;
      ctx.lineWidth = unit * 0.45;
      for (let i = 0; i < NODES; i++) {
        if (lit[i] <= 0.002) continue;
        ctx.globalAlpha = lit[i] * (p.isDark ? 0.55 : 0.4);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nodeX[i], nodeY[i]);
        ctx.stroke();
      }

      const nodeD = unit * 5;
      for (let i = 0; i < NODES; i++) {
        drawSpriteStretched(ctx, shadow, nodeX[i] + unit * 0.9, nodeY[i] + unit * 1.6, nodeD * 1.3, nodeD * 0.5, p.isDark ? 0.5 : 0.18);
        drawSprite(ctx, neutral, nodeX[i], nodeY[i], nodeD * (1 + reached[i] * 0.06 * (1 - reset)), 1);
        if (lit[i] > 0.002) {
          drawSprite(ctx, glow, nodeX[i], nodeY[i], nodeD * 3.4, lit[i] * (p.isDark ? 0.3 : 0.14));
          drawSprite(ctx, accent, nodeX[i], nodeY[i], nodeD * 1.06, lit[i]);
        }
      }

      // Pulses travel out along every line, and back along the matched ones.
      const pulseD = unit * 1.9;
      for (let i = 0; i < NODES; i++) {
        const out = outT[i];
        if (out > 0 && out < 1) {
          const alpha = smoothstep(phase(out, 0, 0.15)) * (1 - smoothstep(phase(out, 0.85, 1)));
          drawSprite(ctx, pulse, lerp(cx, nodeX[i], out), lerp(cy, nodeY[i], out), pulseD, alpha);
        }
        const back = backT[i];
        if (back > 0 && back < 1) {
          const x = lerp(nodeX[i], cx, back);
          const y = lerp(nodeY[i], cy, back);
          const alpha = smoothstep(phase(back, 0, 0.15)) * (1 - smoothstep(phase(back, 0.85, 1)));
          drawSprite(ctx, glow, x, y, pulseD * 4, alpha * 0.35);
          drawSprite(ctx, accent, x, y, pulseD * 1.2, alpha);
        }
      }

      const coreD = unit * 15;
      drawSpriteStretched(ctx, shadow, cx + unit * 2.4, cy + unit * 5, coreD * 1.2, coreD * 0.42, p.isDark ? 0.6 : 0.22);
      drawSprite(ctx, glow, cx, cy, coreD * 2.6, centreGlow * (p.isDark ? 0.34 : 0.16));
      drawSprite(ctx, core, cx, cy, coreD, 1);
      ctx.globalAlpha = 1;
    },
  };
};

export default createMatching;
