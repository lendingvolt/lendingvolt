export const sceneIds = [
  "converge",
  "soft-check",
  "true-cost",
  "no-charge",
  "consolidate",
  "renovate",
  "cashflow",
  "life-event",
  "fingerprint",
  "consent-toggles",
  "rate-vs-market",
  "offer-stack",
  "matching",
  "circuit",
] as const;

export type SceneId = (typeof sceneIds)[number];

/** Which palette a render draws with. */
export type SceneTone = "light" | "dark";
