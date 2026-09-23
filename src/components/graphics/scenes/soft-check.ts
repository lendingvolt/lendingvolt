import { rgba } from "../engine/color";
import { drawSprite, drawSpriteStretched, shadowSprite, sphereSprite, type Sprite } from "../engine/sprites";
import { clamp, easeInOutSine, lerp, phase, smoothstep } from "../engine/timeline";
import type { Scene, SceneEnv, SceneFactory } from "../engine/types";

/**
 * A lit sphere sinks through a plane and leaves it untouched.
 * A soft check that leaves no trace.
 */
const createSoftCheck: SceneFactory = (): Scene => {
  let env: SceneEnv;
  let width = 0;
  let cxPos = 0;
  let planeY = 0;
  let planeRx = 0;
  let planeRy = 0;
  let thickness = 0;
  let sphereR = 0;
  let travelTop = 0;
  let travelBottom = 0;
  let sphereY = 0;
  let sphereAlpha = 0;
  let shadowAlpha = 0;
  let topFill: CanvasGradient | string = "";
  let sphere: Sprite;
  let shadow: Sprite;

  const clipAbove = (ctx: CanvasRenderingContext2D, above: boolean) => {
    ctx.beginPath();
    if (above) ctx.rect(0, 0, width, planeY);
    else ctx.rect(0, planeY, width, 1e5);
    ctx.clip();
  };

  const planePath = (ctx: CanvasRenderingContext2D, offsetY: number) => {
    ctx.beginPath();
    ctx.ellipse(cxPos, planeY + offsetY, planeRx, planeRy, 0, 0, Math.PI * 2);
  };

  return {
    duration: 7,
    posterT: 0.24,

    init(nextEnv) {
      env = nextEnv;
      const p = env.palette;
      sphere = sphereSprite(p.accentLight, p.accent, p.accentShade, 192);
      shadow = shadowSprite(p.shadow, 128);
    },

    resize(w, h) {
      width = w;
      cxPos = w / 2;
      planeY = h * 0.58;
      planeRx = Math.min(w * 0.38, h * 0.62);
      planeRy = planeRx * 0.26;
      thickness = Math.max(3, planeRx * 0.035);
      sphereR = planeRx * 0.2;
      travelTop = planeY - Math.min(planeRx * 0.95, h * 0.44);
      travelBottom = planeY + Math.min(planeRx * 0.62, h * 0.34);

      const ctx = document.createElement("canvas").getContext("2d");
      if (ctx) {
        const g = ctx.createLinearGradient(0, planeY - planeRy, 0, planeY + planeRy);
        g.addColorStop(0, env.palette.isDark ? rgba(env.palette.formShade, 1) : env.palette.formLight);
        g.addColorStop(1, env.palette.isDark ? rgba(env.palette.form, 0.55) : env.palette.form);
        topFill = g;
      } else {
        topFill = env.palette.form;
      }
    },

    update(_dt, t) {
      const travel = easeInOutSine(phase(t, 0.08, 0.64));
      sphereY = lerp(travelTop, travelBottom, travel);
      sphereAlpha = smoothstep(phase(t, 0, 0.1)) * (1 - smoothstep(phase(t, 0.6, 0.72)));

      const heightAbove = planeY - sphereY;
      const approach = smoothstep(1 - clamp(heightAbove / (sphereR * 5)));
      shadowAlpha = heightAbove > 0 ? approach * 0.34 * sphereAlpha : 0;
    },

    render(ctx) {
      if (width === 0) return;
      const p = env.palette;

      // Underside of the slab.
      planePath(ctx, thickness);
      ctx.fillStyle = p.formShade;
      ctx.globalAlpha = p.isDark ? 1 : 0.9;
      ctx.fill();

      // The part of the sphere beneath the surface.
      ctx.save();
      clipAbove(ctx, false);
      drawSprite(ctx, sphere, cxPos, sphereY, sphereR * 2, sphereAlpha);
      ctx.restore();

      // The surface itself, unchanged by what passes through it.
      planePath(ctx, 0);
      ctx.globalAlpha = 1;
      ctx.fillStyle = topFill;
      ctx.fill();
      ctx.strokeStyle = p.isDark ? p.line : rgba(p.highlight, 0.9);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cxPos, planeY, planeRx, planeRy, 0, Math.PI, Math.PI * 2);
      ctx.stroke();

      // Contact shadow while the sphere approaches.
      ctx.save();
      planePath(ctx, 0);
      ctx.clip();
      const spreadScale = 1 + clamp((planeY - sphereY) / (sphereR * 5));
      drawSpriteStretched(ctx, shadow, cxPos, planeY, sphereR * 2.6 * spreadScale, sphereR * 0.9 * spreadScale, shadowAlpha);
      ctx.restore();

      // The part above the surface.
      ctx.save();
      clipAbove(ctx, true);
      drawSprite(ctx, sphere, cxPos, sphereY, sphereR * 2, sphereAlpha);
      ctx.restore();

      ctx.globalAlpha = 1;
    },
  };
};

export default createSoftCheck;
