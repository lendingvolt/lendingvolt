import { drawSpriteStretched, shadowSprite, type Sprite } from "../engine/sprites";
import { easeInOutCubic, easeOutCubic, phase } from "../engine/timeline";
import type { Scene, SceneEnv, SceneFactory } from "../engine/types";

const STEPS = 5;
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = 0.5;
const STEP_RISE = 0.55;

/**
 * Five isometric blocks build upward into a flight of steps.
 * Home renovation.
 */
const createRenovate: SceneFactory = (): Scene => {
  let env: SceneEnv;
  let width = 0;
  let scale = 0;
  let originX = 0;
  let originY = 0;
  const heights = new Float32Array(STEPS);
  let shadow: Sprite;

  /** Isometric projection of (x, y, z) in block units. */
  const isoX = (x: number, y: number) => originX + (x - y) * COS30 * scale;
  const isoY = (x: number, y: number, z: number) => originY + (x + y) * SIN30 * scale - z * scale;

  const quad = (
    ctx: CanvasRenderingContext2D,
    ax: number, ay: number, bx: number, by: number,
    cx: number, cy: number, dx: number, dy: number,
  ) => {
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineTo(cx, cy);
    ctx.lineTo(dx, dy);
    ctx.closePath();
    ctx.fill();
  };

  /** Block occupying x ∈ [0,1], y ∈ [y0, y0+1], z ∈ [0, h]. */
  const drawBlock = (ctx: CanvasRenderingContext2D, y0: number, h: number, isAccent: boolean) => {
    const p = env.palette;
    const x0 = 0;
    const x1 = 1;
    const y1 = y0 + 1;

    // Right face (+x), in shade.
    ctx.fillStyle = isAccent ? p.accentShade : p.formShade;
    quad(ctx, isoX(x1, y0), isoY(x1, y0, h), isoX(x1, y1), isoY(x1, y1, h), isoX(x1, y1), isoY(x1, y1, 0), isoX(x1, y0), isoY(x1, y0, 0));

    // Front face (+y), mid-tone.
    ctx.fillStyle = isAccent ? p.accent : p.form;
    quad(ctx, isoX(x0, y1), isoY(x0, y1, h), isoX(x1, y1), isoY(x1, y1, h), isoX(x1, y1), isoY(x1, y1, 0), isoX(x0, y1), isoY(x0, y1, 0));

    // Top face, lit.
    ctx.fillStyle = isAccent ? p.accentLight : p.formLight;
    quad(ctx, isoX(x0, y0), isoY(x0, y0, h), isoX(x1, y0), isoY(x1, y0, h), isoX(x1, y1), isoY(x1, y1, h), isoX(x0, y1), isoY(x0, y1, h));
  };

  return {
    duration: 7,
    posterT: 0.62,

    init(nextEnv) {
      env = nextEnv;
      shadow = shadowSprite(env.palette.shadow, 128);
    },

    resize(w, h) {
      width = w;
      // Blocks span x ∈ [0, 1], y ∈ [1 − STEPS, 1], z ∈ [0, STEPS × rise].
      // Projected, (x − y) runs from −1 to STEPS and the screen height
      // from the tallest block's top to the front corner of the first.
      const minU = -1;
      const maxU = STEPS;
      const minV = (1 - STEPS) * SIN30 - STEPS * STEP_RISE;
      const maxV = 2 * SIN30;
      scale = Math.min((w * 0.72) / ((maxU - minU) * COS30), (h * 0.72) / (maxV - minV));
      originX = w / 2 - ((minU + maxU) / 2) * COS30 * scale;
      originY = h / 2 - ((minV + maxV) / 2) * scale;
    },

    update(_dt, t) {
      const fall = easeInOutCubic(phase(t, 0.82, 0.97));
      for (let i = 0; i < STEPS; i++) {
        const grow = easeOutCubic(phase(t, 0.05 + i * 0.08, 0.32 + i * 0.08));
        heights[i] = (i + 1) * STEP_RISE * grow * (1 - fall);
      }
    },

    render(ctx) {
      if (width === 0) return;
      const p = env.palette;

      // Footprint and a soft shadow, so the form has a floor even at rest.
      const midX = isoX(0.5, -(STEPS - 1) / 2);
      const midY = isoY(0.5, -(STEPS - 1) / 2 + 0.5, 0);
      drawSpriteStretched(ctx, shadow, midX + scale * 0.4, midY + scale * 0.3, scale * STEPS * 1.5, scale * 1.9, p.isDark ? 0.5 : 0.18);

      ctx.globalAlpha = 1;
      ctx.strokeStyle = p.line;
      ctx.lineWidth = 1;
      for (let i = 0; i < STEPS; i++) {
        const y0 = -i;
        ctx.beginPath();
        ctx.moveTo(isoX(0, y0), isoY(0, y0, 0));
        ctx.lineTo(isoX(1, y0), isoY(1, y0, 0));
        ctx.lineTo(isoX(1, y0 + 1), isoY(1, y0 + 1, 0));
        ctx.lineTo(isoX(0, y0 + 1), isoY(0, y0 + 1, 0));
        ctx.closePath();
        ctx.stroke();
      }

      // Back to front: the tallest step sits furthest back.
      for (let i = STEPS - 1; i >= 0; i--) {
        if (heights[i] > 0.01) drawBlock(ctx, -i, heights[i], i === STEPS - 1);
      }
    },
  };
};

export default createRenovate;
