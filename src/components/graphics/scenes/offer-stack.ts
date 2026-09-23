import { drawSpriteStretched, shadowSprite, type Sprite } from "../engine/sprites";
import { easeInOutCubic, lerp, phase, smoothstep } from "../engine/timeline";
import type { Scene, SceneEnv, SceneFactory } from "../engine/types";
import { roundedRect } from "./shared";

const CARDS = 4;
/** Sorted position of each card; rank 0 is the best offer. */
const RANK = [2, 0, 3, 1];
const DEG = Math.PI / 180;
const PILE_ROTATION = [-4, 3, -2, 5];

/**
 * Four offer cards fan out, then settle into a sorted stack with the best
 * one on top. The comparison, in the render language.
 */
const createOfferStack: SceneFactory = (): Scene => {
  let env: SceneEnv;
  let width = 0;
  let cx = 0;
  let cy = 0;
  let cardW = 0;
  let cardH = 0;
  let highlight = 0;
  const x = new Float32Array(CARDS);
  const y = new Float32Array(CARDS);
  const rotation = new Float32Array(CARDS);
  const scale = new Float32Array(CARDS);
  const depth = new Float32Array(CARDS);
  const order = new Int8Array(CARDS);
  let shadow: Sprite;

  const drawCard = (ctx: CanvasRenderingContext2D, i: number) => {
    const p = env.palette;
    const isBest = RANK[i] === 0;
    const r = cardH * 0.12;
    const pad = cardH * 0.16;

    ctx.save();
    ctx.translate(x[i], y[i]);
    ctx.rotate(rotation[i]);
    ctx.scale(scale[i], scale[i]);

    drawSpriteStretched(ctx, shadow, 0, cardH * 0.22, cardW * 1.08, cardH * 1.25, p.isDark ? 0.45 : 0.16);

    ctx.globalAlpha = 1;
    roundedRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, r);
    ctx.fillStyle = p.card;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = p.cardLine;
    ctx.stroke();
    if (isBest && highlight > 0.01) {
      ctx.globalAlpha = highlight;
      ctx.strokeStyle = p.accent;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Skeleton content: lender mark, name, headline rate, figures.
    const left = -cardW / 2 + pad;
    const topY = -cardH / 2 + pad;
    const line = cardH * 0.07;
    ctx.fillStyle = p.form;
    roundedRect(ctx, left, topY, cardH * 0.2, cardH * 0.2, cardH * 0.05);
    ctx.fill();
    roundedRect(ctx, left + cardH * 0.28, topY + cardH * 0.03, cardW * 0.24, line, line / 2);
    ctx.fill();
    ctx.globalAlpha = 0.6;
    roundedRect(ctx, left + cardH * 0.28, topY + cardH * 0.13, cardW * 0.16, line * 0.8, line / 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.fillStyle = isBest && highlight > 0.5 ? p.accent : p.formShade;
    roundedRect(ctx, left, topY + cardH * 0.36, cardW * 0.22, line * 1.9, line);
    ctx.fill();

    ctx.fillStyle = p.form;
    ctx.globalAlpha = 0.7;
    const colX = cardW * 0.08;
    for (let c = 0; c < 2; c++) {
      for (let row = 0; row < 2; row++) {
        roundedRect(ctx, colX + c * cardW * 0.19, topY + cardH * (0.1 + row * 0.24), cardW * 0.13, line, line / 2);
        ctx.fill();
      }
    }
    ctx.restore();
  };

  return {
    duration: 9,
    posterT: 0.78,

    init(nextEnv) {
      env = nextEnv;
      shadow = shadowSprite(env.palette.shadow, 128);
      for (let i = 0; i < CARDS; i++) order[i] = i;
    },

    resize(w, h) {
      width = w;
      cx = w / 2;
      cy = h / 2;
      cardW = Math.min(w * 0.58, h * 0.92);
      cardH = cardW * 0.42;
    },

    update(_dt, t) {
      const toFan = easeInOutCubic(phase(t, 0.1, 0.34));
      const toStack = easeInOutCubic(phase(t, 0.44, 0.7));
      const toPile = easeInOutCubic(phase(t, 0.88, 1));
      highlight = smoothstep(phase(t, 0.62, 0.72)) * (1 - smoothstep(phase(t, 0.86, 0.92)));

      for (let i = 0; i < CARDS; i++) {
        const offset = i - 1.5;
        const rank = RANK[i];

        const pileX = cx;
        const pileY = cy + offset * cardH * 0.06;
        const pileRot = PILE_ROTATION[i] * DEG;

        const fanX = cx + offset * cardW * 0.3;
        const fanY = cy + Math.abs(offset) * cardH * 0.16;
        const fanRot = offset * 8 * DEG;

        const stackX = cx;
        const stackY = cy + cardH * 0.22 - rank * cardH * 0.2;
        const stackScale = 1 - rank * 0.06;

        let px = lerp(pileX, fanX, toFan);
        let py = lerp(pileY, fanY, toFan);
        let pr = lerp(pileRot, fanRot, toFan);
        let ps = 1;
        let pz = i;

        px = lerp(px, stackX, toStack);
        py = lerp(py, stackY, toStack);
        pr = lerp(pr, 0, toStack);
        ps = lerp(ps, stackScale, toStack);
        pz = lerp(pz, CARDS - rank, toStack);

        x[i] = lerp(px, pileX, toPile);
        y[i] = lerp(py, pileY, toPile);
        rotation[i] = lerp(pr, pileRot, toPile);
        scale[i] = lerp(ps, 1, toPile);
        depth[i] = lerp(pz, i, toPile);
      }

      // Insertion sort by depth; four items, no allocation.
      for (let a = 1; a < CARDS; a++) {
        const item = order[a];
        let b = a - 1;
        while (b >= 0 && depth[order[b]] > depth[item]) {
          order[b + 1] = order[b];
          b--;
        }
        order[b + 1] = item;
      }
    },

    render(ctx) {
      if (width === 0) return;
      for (let k = 0; k < CARDS; k++) drawCard(ctx, order[k]);
      ctx.globalAlpha = 1;
    },
  };
};

export default createOfferStack;
