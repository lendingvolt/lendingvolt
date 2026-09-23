import { mix, rgba } from "../engine/color";
import { drawSprite, drawSpriteStretched, shadowSprite, sphereSprite, type Sprite } from "../engine/sprites";
import { easeInOutCubic, keyframes } from "../engine/timeline";
import type { Scene, SceneEnv, SceneFactory } from "../engine/types";
import { roundedRect } from "./shared";

const TOGGLES = 3;

/**
 * When each toggle switches on and back off. The middle one turns off
 * early, so the set holds a mixed state, as a real choice would.
 */
const TIMES = [
  [0, 0.12, 0.2, 0.86, 0.94, 1],
  [0, 0.26, 0.34, 0.56, 0.64, 1],
  [0, 0.4, 0.48, 0.86, 0.94, 1],
];
const VALUES = [0, 0, 1, 1, 0, 0];

/**
 * Three toggles switch in sequence and settle in a mixed state.
 * Consent and data controls.
 */
const createConsentToggles: SceneFactory = (): Scene => {
  let env: SceneEnv;
  let width = 0;
  let trackW = 0;
  let trackH = 0;
  let left = 0;
  let top = 0;
  let pitch = 0;
  const state = new Float32Array(TOGGLES);
  let knob: Sprite;
  let shadow: Sprite;
  let trackOff = "";
  let trackEdge = "";

  return {
    duration: 8,
    posterT: 0.72,

    init(nextEnv) {
      env = nextEnv;
      const p = env.palette;
      knob = p.isDark
        ? sphereSprite(p.highlight, p.formLight, p.form, 128)
        : sphereSprite(p.highlight, p.highlight, mix(p.form, p.highlight, 0.4), 128);
      shadow = shadowSprite(p.shadow, 96);
      trackOff = p.isDark ? p.formShade : rgba(p.formShade, 0.35);
      trackEdge = p.isDark ? p.line : rgba(p.formShade, 0.4);
    },

    resize(w, h) {
      width = w;
      trackW = Math.min(w * 0.44, h * 0.3 * 2.2);
      trackH = trackW * 0.44;
      pitch = trackH * 1.55;
      left = (w - trackW) / 2;
      top = (h - (pitch * (TOGGLES - 1) + trackH)) / 2;
    },

    update(_dt, t) {
      for (let i = 0; i < TOGGLES; i++) state[i] = keyframes(t, TIMES[i], VALUES, easeInOutCubic);
    },

    render(ctx) {
      if (width === 0) return;
      const p = env.palette;
      const r = trackH / 2;
      const knobD = trackH * 0.8;
      const inset = (trackH - knobD) / 2;

      for (let i = 0; i < TOGGLES; i++) {
        const y = top + i * pitch;

        ctx.globalAlpha = 1;
        roundedRect(ctx, left, y, trackW, trackH, r);
        ctx.fillStyle = trackOff;
        ctx.fill();
        if (state[i] > 0.001) {
          ctx.globalAlpha = state[i];
          ctx.fillStyle = p.accent;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.strokeStyle = trackEdge;
        ctx.lineWidth = 1;
        ctx.stroke();

        const kx = left + inset + knobD / 2 + (trackW - knobD - inset * 2) * state[i];
        const ky = y + trackH / 2;
        drawSpriteStretched(ctx, shadow, kx + knobD * 0.08, ky + knobD * 0.14, knobD * 1.1, knobD * 0.9, p.isDark ? 0.6 : 0.28);
        drawSprite(ctx, knob, kx, ky, knobD, 1);
      }
      ctx.globalAlpha = 1;
    },
  };
};

export default createConsentToggles;
