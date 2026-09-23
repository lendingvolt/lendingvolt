import { drawSprite, glowSprite, sphereSprite, type Sprite } from "../engine/sprites";
import { TAU, easeInOutCubic, phase, smoothstep } from "../engine/timeline";
import type { Scene, SceneEnv, SceneFactory } from "../engine/types";

const START = -Math.PI / 2;

/**
 * An arc closes into a full circle behind a lit leading point.
 * Life events.
 */
const createLifeEvent: SceneFactory = (): Scene => {
  let env: SceneEnv;
  let width = 0;
  let cx = 0;
  let cy = 0;
  let radius = 0;
  let unit = 0;
  let sweep = 0;
  let arcAlpha = 1;
  let headAlpha = 0;
  let glowAlpha = 0;
  let head: Sprite;
  let glow: Sprite;

  const strokeArc = (ctx: CanvasRenderingContext2D, dx: number, dy: number) => {
    ctx.beginPath();
    ctx.arc(cx + dx, cy + dy, radius, START, START + sweep);
    ctx.stroke();
  };

  return {
    duration: 7,
    posterT: 0.7,

    init(nextEnv) {
      env = nextEnv;
      const p = env.palette;
      head = sphereSprite(p.accentLight, p.accent, p.accentShade, 96);
      glow = glowSprite(p.accent, 128);
    },

    resize(w, h) {
      width = w;
      cx = w / 2;
      cy = h / 2;
      unit = Math.min(w, h) / 100;
      radius = Math.min(w, h) * 0.3;
    },

    update(_dt, t) {
      sweep = TAU * easeInOutCubic(phase(t, 0.08, 0.62));
      const complete = smoothstep(phase(t, 0.58, 0.7));
      const fade = smoothstep(phase(t, 0.84, 0.96));
      arcAlpha = 1 - fade;
      headAlpha = smoothstep(phase(t, 0.04, 0.12)) * (1 - complete);
      glowAlpha = complete * (1 - fade);
    },

    render(ctx) {
      if (width === 0) return;
      const p = env.palette;
      ctx.lineCap = "round";

      ctx.globalAlpha = 1;
      ctx.strokeStyle = p.line;
      ctx.lineWidth = unit * 1.6;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      ctx.stroke();

      drawSprite(ctx, glow, cx, cy, radius * 3.2, glowAlpha * (p.isDark ? 0.32 : 0.14));

      if (sweep > 0.001) {
        // Shade, body and highlight strokes give the arc a tubular form.
        ctx.globalAlpha = arcAlpha;
        ctx.strokeStyle = p.accentShade;
        ctx.lineWidth = unit * 1.9;
        strokeArc(ctx, unit * 0.35, unit * 0.45);
        ctx.strokeStyle = p.accent;
        ctx.lineWidth = unit * 1.7;
        strokeArc(ctx, 0, 0);
        ctx.strokeStyle = p.accentLight;
        ctx.lineWidth = unit * 0.45;
        ctx.globalAlpha = arcAlpha * 0.75;
        strokeArc(ctx, -unit * 0.35, -unit * 0.45);
      }

      const angle = START + sweep;
      drawSprite(ctx, glow, cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, unit * 16, headAlpha * 0.35);
      drawSprite(ctx, head, cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, unit * 5.6, headAlpha);
      ctx.globalAlpha = 1;
    },
  };
};

export default createLifeEvent;
