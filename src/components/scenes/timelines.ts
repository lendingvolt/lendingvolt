import type { CompiledTimeline } from "./timeline";

/**
 * Every scene's timeline, built on the client from its script when the
 * scene first nears the viewport. Each script is its own chunk, so the page
 * carries only an id per scene, not thousands of keyframes.
 */
export const timelineLoaders = {
  "hero-desktop": () => import("./scripts/hero").then((m) => m.heroScript("desktop").timeline),
  "hero-mobile": () => import("./scripts/hero").then((m) => m.heroScript("mobile").timeline),
  "one-application-wide": () => import("./scripts/value").then((m) => m.oneApplicationScript("wide").timeline),
  "one-application-narrow": () => import("./scripts/value").then((m) => m.oneApplicationScript("narrow").timeline),
  "soft-check": () => import("./scripts/value").then((m) => m.softCheckScript().timeline),
  "true-cost": () => import("./scripts/value").then((m) => m.trueCostScript().timeline),
  "no-charge": () => import("./scripts/value").then((m) => m.noChargeScript().timeline),
  consolidate: () => import("./scripts/use-cases").then((m) => m.consolidateScript().timeline),
  renovate: () => import("./scripts/use-cases").then((m) => m.renovateScript().timeline),
  "cash-flow": () => import("./scripts/use-cases").then((m) => m.cashFlowScript().timeline),
  "life-event": () => import("./scripts/use-cases").then((m) => m.lifeEventScript().timeline),
  closing: () => import("./scripts/closing").then((m) => m.closingScript().timeline),
  "step-amount": () => import("./scripts/how-it-works").then((m) => m.amountTimeline(m.STEP_AMOUNT.length)),
  "step-offers": () => import("./scripts/how-it-works").then((m) => m.offerRowsTimeline(m.STEP_OFFER_ROWS)),
  "step-choose": () => import("./scripts/how-it-works").then((m) => m.chooseTimeline()),
} satisfies Record<string, () => Promise<CompiledTimeline>>;

export type TimelineId = keyof typeof timelineLoaders;
