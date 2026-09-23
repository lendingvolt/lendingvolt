import { drawSpriteStretched, shadowSprite, type Sprite } from "../engine/sprites";
import { easeInOutCubic, easeOutCubic, phase } from "../engine/timeline";
import type { Scene, SceneEnv, SceneFactory } from "../engine/types";
import { drawPrism } from "./shared";
import { rgba } from "../engine/color";

const LENGTHS = [0.56, 0.78, 1];

/**
 * Three extruded bars of differing length, aligned at one baseline.
 * The real cost, shown plainly.
 */
const createTrueCost: SceneFactory = (): Scene => {
  let env: SceneEnv;
  let width = 0;
  let x0 = 0;
  let top = 0;
  let maxLength = 0;
  let barH = 0;
  let gap = 0;
  let depthX = 0;
  let depthY = 0;
  let sheenX = 0;
  let sheenAlpha = 0;
  const lengths = new Float32Array(3);
  let sheen: CanvasGradient | null = null;
  let shadow: Sprite;

  return {
    duration: 7,
    posterT: 0.6,

    init(nextEnv) {
      env = nextEnv;
      shadow = shadowSprite(env.palette.shadow, 128);
    },

    resize(w, h) {
      width = w;
      maxLength = Math.min(w * 0.66, h * 1.05);
      barH = maxLength * 0.105;
      gap = barH * 0.85;
      depthX = barH * 0.42;
      depthY = barH * 0.3;
      x0 = (w - maxLength - depthX) / 2;
      top = (h - (barH * 3 + gap * 2) + depthY) / 2;

      const ctx = document.createElement("canvas").getContext("2d");
      if (ctx) {
        const band = barH * 3;
        const g = ctx.createLinearGradient(0, 0, band, 0);
        g.addColorStop(0, rgba(env.palette.highlight, 0));
        g.addColorStop(0.5, rgba(env.palette.highlight, env.palette.isDark ? 0.28 : 0.55));
        g.addColorStop(1, rgba(env.palette.highlight, 0));
        sheen = g;
      }
    },

    update(_dt, t) {
      const retract = easeInOutCubic(phase(t, 0.8, 0.96));
      for (let i = 0; i < 3; i++) {
        const grow = easeOutCubic(phase(t, 0.06 + i * 0.1, 0.36 + i * 0.1));
        lengths[i] = maxLength * LENGTHS[i] * grow * (1 - retract);
      }
      const sweep = phase(t, 0.56, 0.76);
      sheenX = x0 - barH * 3 + sweep * (maxLength + barH * 4);
      sheenAlpha = sweep > 0 && sweep < 1 ? 1 : 0;
    },

    render(ctx) {
      if (width === 0) return;
      const p = env.palette;

      for (let i = 0; i < 3; i++) {
        const length = lengths[i];
        if (length <= 1) continue;
        const y = top + i * (barH + gap);
        drawSpriteStretched(ctx, shadow, x0 + length / 2 + depthX, y + barH + barH * 0.55, length * 1.1, barH * 0.9, p.isDark ? 0.5 : 0.16);
        ctx.globalAlpha = 1;
        const isAccent = i === 2;
        drawPrism(
          ctx,
          x0,
          y,
          length,
          barH,
          depthX,
          depthY,
          isAccent ? p.accentLight : p.formLight,
          isAccent ? p.accent : p.form,
          isAccent ? p.accentShade : p.formShade,
        );

        if (sheen && sheenAlpha > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(x0, y, length, barH);
          ctx.clip();
          ctx.translate(sheenX, 0);
          ctx.fillStyle = sheen;
          ctx.globalAlpha = sheenAlpha;
          ctx.fillRect(0, y, barH * 3, barH);
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
    },
  };
};

export default createTrueCost;
