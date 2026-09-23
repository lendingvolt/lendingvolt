import { fundingLabels, fundingOrder, mockLenders, type MockLender } from "@/content/offers";
import { quoteFlatRate, type FlatRateQuote } from "@/lib/loan-math";

export type SortKey = "monthly" | "interest" | "speed";

export const sortOptions = [
  { value: "monthly", label: "Monthly repayment" },
  { value: "interest", label: "Total interest" },
  { value: "speed", label: "Funds arrive" },
] as const satisfies ReadonlyArray<{ value: SortKey; label: string }>;

export type QuotedOffer = {
  lender: MockLender;
  quote: FlatRateQuote;
  fundingLabel: string;
  /** Interest plus fees: what the loan costs beyond the principal. */
  totalCost: number;
  isBest: boolean;
};

/** Quote every mock lender for an amount and tenure, flag the cheapest, and sort. */
export function quoteOffers(amount: number, months: number, sort: SortKey = "monthly"): QuotedOffer[] {
  const offers = mockLenders.map((lender) => {
    const quote = quoteFlatRate(amount, months, lender.flatRate, lender.feeRate);
    return {
      lender,
      quote,
      fundingLabel: fundingLabels[lender.funding],
      totalCost: quote.totalInterest + quote.fee,
      isBest: false,
    };
  });

  const cheapest = offers.reduce((best, offer) => (offer.totalCost < best.totalCost ? offer : best));
  cheapest.isBest = true;

  const compare: Record<SortKey, (a: QuotedOffer, b: QuotedOffer) => number> = {
    monthly: (a, b) => a.quote.monthlyRepayment - b.quote.monthlyRepayment,
    interest: (a, b) => a.quote.totalInterest - b.quote.totalInterest,
    speed: (a, b) =>
      fundingOrder[a.lender.funding] - fundingOrder[b.lender.funding] || a.totalCost - b.totalCost,
  };

  return offers.sort(compare[sort]);
}
