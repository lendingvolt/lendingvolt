import { drawSprite, glowSprite, sphereSprite, type Sprite } from "../engine/sprites";
import { TAU } from "../engine/timeline";
import type { Scene, SceneEnv, SceneFactory } from "../engine/types";

const LINES = 7;
const CYCLES = 3;

/**
 * Seven lines merge into one, with current flowing along them.
 * Debt consolidation.
 */
const createConsolidate: SceneFactory = (): Scene => {
  let env: SceneEnv;
  let width = 0;
  let unit = 0;
  let startX = 0;
  let mergeX = 0;
  let endX = 0;
  let centerY = 0;
  let flowOffset = 0;
  let pulse = 0;
  let patternLength = 0;
  const startY = new Float32Array(LINES);
  const dash: number[] = [0, 0];
  const solid: number[] = [];
  let node: Sprite;
  let hub: Sprite;
  let glow: Sprite;

  const tracePaths = (ctx: CanvasRenderingContext2D, from: number, to: number) => {
    const span = mergeX - startX;
    for (let i = from; i < to; i++) {
      ctx.beginPath();
      ctx.moveTo(startX, startY[i]);
      ctx.bezierCurveTo(startX + span * 0.55, startY[i], startX + span * 0.5, centerY, mergeX, centerY);
      ctx.lineDashOffset = -flowOffset - i * patternLength * 0.37;
      ctx.stroke();
    }
  };

  return {
    duration: 6,
    posterT: 0.3,

    init(nextEnv) {
      env = nextEnv;
      const p = env.palette;
      node = sphereSprite(p.formLight, p.form, p.formShade, 64);
      hub = sphereSprite(p.accentLight, p.accent, p.accentShade, 160);
      glow = glowSprite(p.accent, 128);
    },

    resize(w, h) {
      width = w;
      unit = Math.min(w, h) / 100;
      startX = w * 0.14;
      mergeX = w * 0.6;
      endX = w * 0.88;
      centerY = h / 2;
      const spacing = Math.min(h * 0.1, w * 0.085);
      for (let i = 0; i < LINES; i++) startY[i] = centerY + (i - (LINES - 1) / 2) * spacing;
      dash[0] = unit * 2.2;
      dash[1] = unit * 5.5;
      patternLength = dash[0] + dash[1];
    },

    update(_dt, t) {
      flowOffset = t * patternLength * CYCLES * 4;
      pulse = 0.5 + 0.5 * Math.sin(TAU * t * 2);
    },

    render(ctx) {
      if (width === 0) return;
      const p = env.palette;
      ctx.lineCap = "round";

      // Resting lines.
      ctx.setLineDash(solid);
      ctx.strokeStyle = p.form;
      ctx.globalAlpha = p.isDark ? 0.7 : 1;
      ctx.lineWidth = unit * 0.5;
      tracePaths(ctx, 0, LINES);
      ctx.lineWidth = unit * 1.1;
      ctx.beginPath();
      ctx.moveTo(mergeX, centerY);
      ctx.lineTo(endX, centerY);
      ctx.stroke();

      // Current flowing toward the merge and on through the single line.
      ctx.setLineDash(dash);
      ctx.strokeStyle = p.accent;
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = unit * 0.55;
      tracePaths(ctx, 0, LINES);
      ctx.lineWidth = unit * 1.15;
      ctx.lineDashOffset = -flowOffset * 1.4;
      ctx.beginPath();
      ctx.moveTo(mergeX, centerY);
      ctx.lineTo(endX, centerY);
      ctx.stroke();
      ctx.setLineDash(solid);

      for (let i = 0; i < LINES; i++) drawSprite(ctx, node, startX, startY[i], unit * 2.6, 1);
      drawSprite(ctx, glow, mergeX, centerY, unit * (22 + pulse * 6), p.isDark ? 0.3 : 0.14);
      drawSprite(ctx, hub, mergeX, centerY, unit * 6.4, 1);
      drawSprite(ctx, hub, endX, centerY, unit * 3, 1);
      ctx.globalAlpha = 1;
    },
  };
};

export default createConsolidate;
