import { drawSpriteStretched, shadowSprite, type Sprite } from "../engine/sprites";
import { easeInOutCubic, easeOutCubic, lerp, phase, smoothstep } from "../engine/timeline";
import type { Scene, SceneEnv, SceneFactory } from "../engine/types";
import { drawPrism } from "./shared";

const MARKET = [0.66, 0.74, 0.7, 0.72, 0.78, 0.68, 0.75];
const YOURS = 3;
const YOUR_LEVEL = 0.44;

/**
 * A row of stepped bars with one accent bar settling lower.
 * Your rate against the market, without a claim.
 */
const createRateVsMarket: SceneFactory = (): Scene => {
  let env: SceneEnv;
  let width = 0;
  let baseY = 0;
  let maxH = 0;
  let barW = 0;
  let pitch = 0;
  let left = 0;
  let depthX = 0;
  let depthY = 0;
  let averageY = 0;
  let averageAlpha = 0;
  const heights = new Float32Array(MARKET.length);
  const dash: number[] = [0, 0];
  const solid: number[] = [];
  let shadow: Sprite;

  return {
    duration: 7,
    posterT: 0.7,

    init(nextEnv) {
      env = nextEnv;
      shadow = shadowSprite(env.palette.shadow, 128);
    },

    resize(w, h) {
      width = w;
      const span = Math.min(w * 0.72, h * 1.1);
      pitch = span / MARKET.length;
      barW = pitch * 0.58;
      depthX = barW * 0.34;
      depthY = barW * 0.24;
      left = (w - span) / 2 + (pitch - barW) / 2;
      baseY = h * 0.78;
      maxH = h * 0.6;
      const average = MARKET.reduce((sum, v) => sum + v, 0) / MARKET.length;
      averageY = baseY - average * maxH;
      dash[0] = Math.max(3, h * 0.012);
      dash[1] = dash[0] * 1.4;
    },

    update(_dt, t) {
      const fall = easeInOutCubic(phase(t, 0.84, 0.97));
      const settle = easeInOutCubic(phase(t, 0.5, 0.66));
      for (let i = 0; i < MARKET.length; i++) {
        const grow = easeOutCubic(phase(t, 0.04 + i * 0.035, 0.3 + i * 0.035));
        const target = i === YOURS ? lerp(MARKET[i], YOUR_LEVEL, settle) : MARKET[i];
        heights[i] = target * maxH * grow * (1 - fall);
      }
      averageAlpha = smoothstep(phase(t, 0.34, 0.46)) * (1 - fall);
    },

    render(ctx) {
      if (width === 0) return;
      const p = env.palette;

      drawSpriteStretched(ctx, shadow, width / 2, baseY + depthY, pitch * MARKET.length * 1.05, barW * 0.9, p.isDark ? 0.5 : 0.14);

      ctx.globalAlpha = 1;
      for (let i = 0; i < MARKET.length; i++) {
        const h = heights[i];
        const isYours = i === YOURS;
        drawPrism(
          ctx,
          left + i * pitch,
          baseY - h,
          barW,
          h,
          depthX,
          depthY,
          isYours ? p.accentLight : p.formLight,
          isYours ? p.accent : p.form,
          isYours ? p.accentShade : p.formShade,
        );
      }

      if (averageAlpha > 0.01) {
        ctx.globalAlpha = averageAlpha;
        ctx.strokeStyle = p.isDark ? p.formLight : p.formShade;
        ctx.lineWidth = 1;
        ctx.setLineDash(dash);
        ctx.beginPath();
        ctx.moveTo(left - pitch * 0.3, averageY);
        ctx.lineTo(left + pitch * (MARKET.length - 1) + barW + depthX + pitch * 0.3, averageY);
        ctx.stroke();
        ctx.setLineDash(solid);
      }
      ctx.globalAlpha = 1;
    },
  };
};

export default createRateVsMarket;
