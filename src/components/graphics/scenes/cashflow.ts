import { rgba } from "../engine/color";
import { createPool, type Pool } from "../engine/pool";
import { createRng, range, type Rng } from "../engine/random";
import { drawSprite, sphereSprite, type Sprite } from "../engine/sprites";
import { clamp, smoothstep } from "../engine/timeline";
import type { Scene, SceneEnv, SceneFactory } from "../engine/types";

const CAPACITY = 160;
const SPAWN_PER_SECOND = 15;
const EDGE_SAMPLES = 64;
const PREWARM_SECONDS = 9;
const STEP = 1 / 60;

type Field = "nx" | "lane" | "speed" | "size" | "accent";

/**
 * Two edges diverge into a widening channel; particles flow through and
 * spread with it. Business cash flow.
 */
const createCashflow: SceneFactory = (): Scene => {
  let env: SceneEnv;
  let width = 0;
  let startX = 0;
  let endX = 0;
  let centerY = 0;
  let narrow = 0;
  let wide = 0;
  let unit = 0;
  let spawnDebt = 0;
  let isPrewarmed = false;
  let rng: Rng;
  let pool: Pool<Field>;
  const edgeX = new Float32Array(EDGE_SAMPLES);
  const edgeHalf = new Float32Array(EDGE_SAMPLES);
  let neutral: Sprite;
  let accent: Sprite;
  let fill = "";

  const halfWidthAt = (nx: number) => narrow + (wide - narrow) * smoothstep(clamp(nx));

  const step = (dt: number) => {
    spawnDebt += SPAWN_PER_SECOND * dt;
    while (spawnDebt >= 1) {
      spawnDebt -= 1;
      const i = pool.spawn();
      if (i < 0) break;
      const f = pool.fields;
      f.nx[i] = 0;
      f.lane[i] = (rng() * 2 - 1) * 0.92;
      f.speed[i] = range(rng, 0.1, 0.17);
      f.size[i] = range(rng, 0.9, 1.9);
      f.accent[i] = rng() < 0.22 ? 1 : 0;
    }
    const { nx, speed } = pool.fields;
    for (let i = 0; i < CAPACITY; i++) {
      if (!pool.alive[i]) continue;
      nx[i] += speed[i] * dt * (1 + nx[i] * 0.35);
      if (nx[i] >= 1) pool.kill(i);
    }
  };

  return {
    duration: 8,
    posterT: 0,

    init(nextEnv) {
      env = nextEnv;
      rng = createRng(23);
      pool = createPool(CAPACITY, ["nx", "lane", "speed", "size", "accent"] as const);
      const p = env.palette;
      neutral = sphereSprite(p.formLight, p.form, p.formShade, 48);
      accent = sphereSprite(p.accentLight, p.accent, p.accentShade, 48);
      fill = rgba(p.accent, p.isDark ? 0.1 : 0.05);
    },

    resize(w, h) {
      width = w;
      unit = Math.min(w, h) / 100;
      // The channel runs off the right edge rather than stopping in frame.
      startX = w * 0.1;
      endX = w * 1.04;
      centerY = h / 2;
      narrow = h * 0.035;
      wide = h * 0.31;
      for (let s = 0; s < EDGE_SAMPLES; s++) {
        const nx = s / (EDGE_SAMPLES - 1);
        edgeX[s] = startX + (endX - startX) * nx;
        edgeHalf[s] = halfWidthAt(nx);
      }
      if (!isPrewarmed) {
        for (let k = 0; k < PREWARM_SECONDS / STEP; k++) step(STEP);
        isPrewarmed = true;
      }
    },

    update(dt) {
      if (dt > 0) step(dt);
    },

    render(ctx) {
      if (width === 0) return;
      const p = env.palette;

      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(edgeX[0], centerY - edgeHalf[0]);
      for (let s = 1; s < EDGE_SAMPLES; s++) ctx.lineTo(edgeX[s], centerY - edgeHalf[s]);
      for (let s = EDGE_SAMPLES - 1; s >= 0; s--) ctx.lineTo(edgeX[s], centerY + edgeHalf[s]);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();

      ctx.strokeStyle = p.form;
      ctx.lineWidth = unit * 0.5;
      ctx.lineCap = "round";
      for (let sign = -1; sign <= 1; sign += 2) {
        ctx.beginPath();
        ctx.moveTo(edgeX[0], centerY + sign * edgeHalf[0]);
        for (let s = 1; s < EDGE_SAMPLES; s++) ctx.lineTo(edgeX[s], centerY + sign * edgeHalf[s]);
        ctx.stroke();
      }

      const { nx, lane, size, accent: isAccent } = pool.fields;
      for (let i = 0; i < CAPACITY; i++) {
        if (!pool.alive[i]) continue;
        const t = nx[i];
        const x = startX + (endX - startX) * t;
        const y = centerY + lane[i] * halfWidthAt(t) * 0.86;
        const alpha = smoothstep(clamp(t / 0.08)) * (1 - smoothstep(clamp((t - 0.88) / 0.12)));
        drawSprite(ctx, isAccent[i] ? accent : neutral, x, y, size[i] * unit * (0.8 + t * 0.5), alpha);
      }
      ctx.globalAlpha = 1;
    },
  };
};

export default createCashflow;
