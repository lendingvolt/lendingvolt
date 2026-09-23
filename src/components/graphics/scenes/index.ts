import type { SceneId } from "../scene-ids";
import type { SceneFactory } from "../engine/types";

type SceneModule = { default: SceneFactory };

/** Each render is its own chunk, loaded only when a page uses it. */
export const sceneLoaders: Record<SceneId, () => Promise<SceneModule>> = {
  converge: () => import("./converge"),
  "soft-check": () => import("./soft-check"),
  "true-cost": () => import("./true-cost"),
  "no-charge": () => import("./no-charge"),
  consolidate: () => import("./consolidate"),
  renovate: () => import("./renovate"),
  cashflow: () => import("./cashflow"),
  "life-event": () => import("./life-event"),
  fingerprint: () => import("./fingerprint"),
  "consent-toggles": () => import("./consent-toggles"),
  "rate-vs-market": () => import("./rate-vs-market"),
  "offer-stack": () => import("./offer-stack"),
};
