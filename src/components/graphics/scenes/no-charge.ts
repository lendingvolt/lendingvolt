import { drawSprite, drawSpriteStretched, shadowSprite, sphereSprite, type Sprite } from "../engine/sprites";
import { TAU, phase, smoothstep } from "../engine/timeline";
import type { Scene, SceneEnv, SceneFactory } from "../engine/types";

/**
 * Two equal spheres drift in counter-phase, then settle level.
 * No charge. Either kind.
 */
const createNoCharge: SceneFactory = (): Scene => {
  let env: SceneEnv;
  let width = 0;
  let radius = 0;
  let leftX = 0;
  let rightX = 0;
  let restY = 0;
  let floorY = 0;
  let amplitude = 0;
  let leftY = 0;
  let rightY = 0;
  let level = 0;
  let neutral: Sprite;
  let accent: Sprite;
  let shadow: Sprite;

  const castShadow = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const lift = (floorY - y) / (radius * 2.2);
    const strength = env.palette.isDark ? 0.55 : 0.22;
    drawSpriteStretched(ctx, shadow, x, floorY, radius * (2.4 + lift * 0.6), radius * 0.5, strength / (0.6 + lift));
  };

  return {
    duration: 8,
    posterT: 0.62,

    init(nextEnv) {
      env = nextEnv;
      const p = env.palette;
      neutral = sphereSprite(p.formLight, p.form, p.formShade, 192);
      accent = sphereSprite(p.accentLight, p.accent, p.accentShade, 192);
      shadow = shadowSprite(p.shadow, 128);
    },

    resize(w, h) {
      width = w;
      radius = Math.min(w * 0.105, h * 0.155);
      const gap = radius * 0.95;
      leftX = w / 2 - radius - gap / 2;
      rightX = w / 2 + radius + gap / 2;
      floorY = h * 0.76;
      restY = floorY - radius * 1.75;
      amplitude = radius * 0.42;
    },

    update(_dt, t) {
      const envelope = Math.max(1 - smoothstep(phase(t, 0.2, 0.46)), smoothstep(phase(t, 0.8, 1)));
      const swing = Math.sin(TAU * 2 * t) * amplitude * envelope;
      leftY = restY - swing;
      rightY = restY + swing;
      level = 1 - envelope;
    },

    render(ctx) {
      if (width === 0) return;
      const p = env.palette;

      castShadow(ctx, leftX, leftY);
      castShadow(ctx, rightX, rightY);

      if (level > 0.01) {
        ctx.globalAlpha = level * 0.9;
        ctx.strokeStyle = p.line;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(leftX + radius * 1.35, restY);
        ctx.lineTo(rightX - radius * 1.35, restY);
        ctx.stroke();
      }

      drawSprite(ctx, neutral, leftX, leftY, radius * 2, 1);
      drawSprite(ctx, accent, rightX, rightY, radius * 2, 1);
      ctx.globalAlpha = 1;
    },
  };
};

export default createNoCharge;
