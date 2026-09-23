import { mockLenders } from "@/content/offers";
import { formatPercent, formatSGD, formatTenure, quoteFlatRate } from "@/lib/loan-math";

/** Every figure in a scene is the calculator's maths for this loan. */
export const SCENE_LOAN = { amount: 20_000, months: 36 } as const;

export type SceneOfferId = "a" | "b" | "c" | "d" | "e" | "f";

/** The comparison section's four mock offers, plus the two extra lenders the hero queue needs. */
const sceneLenders: { id: string; name: string; flatRate: number; feeRate: number }[] = [
  ...mockLenders,
  { id: "e", name: "Lender E", flatRate: 0.056, feeRate: 0 },
  { id: "f", name: "Lender F", flatRate: 0.085, feeRate: 0 },
];

export type SceneOffer = {
  id: SceneOfferId;
  name: string;
  totalPayable: number;
  totalInterest: number;
  /** "S$22,088" */
  total: string;
  /** "3.48% flat" */
  rate: string;
};

export const sceneOffers: Record<SceneOfferId, SceneOffer> = Object.fromEntries(
  sceneLenders.map((lender) => {
    const quote = quoteFlatRate(SCENE_LOAN.amount, SCENE_LOAN.months, lender.flatRate, lender.feeRate);
    return [
      lender.id,
      {
        id: lender.id,
        name: lender.name,
        totalPayable: quote.totalPayable,
        totalInterest: quote.totalInterest,
        total: formatSGD(quote.totalPayable),
        rate: `${formatPercent(lender.flatRate)} flat`,
      },
    ];
  }),
) as Record<SceneOfferId, SceneOffer>;

/** Cheapest first by total payable. */
export function byTotal(ids: readonly SceneOfferId[]): SceneOfferId[] {
  return [...ids].sort((a, b) => sceneOffers[a].totalPayable - sceneOffers[b].totalPayable);
}

/** "S$20,000 · 3 years" */
export const applicationLabel = `${formatSGD(SCENE_LOAN.amount)} · ${formatTenure(SCENE_LOAN.months)}`;

/** One interest brick per S$250 of interest. */
export const INTEREST_PER_BRICK = 250;

export function interestBricks(id: SceneOfferId): number {
  return Math.round(sceneOffers[id].totalInterest / INTEREST_PER_BRICK);
}
