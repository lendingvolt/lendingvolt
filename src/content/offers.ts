/**
 * Illustrative offers for the homepage preview and calculator.
 * Lender names are placeholders; rates are examples, not quotes.
 */

export type FundingSpeed = "same-day" | "next-day" | "three-days";

export type MockLender = {
  id: string;
  name: string;
  kind: "Bank" | "Finance company" | "Licensed moneylender";
  product: string;
  /** Flat annual rate as a decimal, e.g. 0.0348 for 3.48% p.a. */
  flatRate: number;
  /** One-off processing fee as a share of principal. */
  feeRate: number;
  funding: FundingSpeed;
};

export const fundingLabels: Record<FundingSpeed, string> = {
  "same-day": "Same day",
  "next-day": "Next business day",
  "three-days": "Up to 3 business days",
};

export const fundingOrder: Record<FundingSpeed, number> = {
  "same-day": 0,
  "next-day": 1,
  "three-days": 2,
};

export const mockLenders: MockLender[] = [
  {
    id: "a",
    name: "Lender A",
    kind: "Bank",
    product: "Personal instalment loan",
    flatRate: 0.0348,
    feeRate: 0.01,
    funding: "three-days",
  },
  {
    id: "b",
    name: "Lender B",
    kind: "Bank",
    product: "Personal loan",
    flatRate: 0.0388,
    feeRate: 0,
    funding: "next-day",
  },
  {
    id: "c",
    name: "Lender C",
    kind: "Finance company",
    product: "Flexi term loan",
    flatRate: 0.0495,
    feeRate: 0,
    funding: "same-day",
  },
  {
    id: "d",
    name: "Lender D",
    kind: "Licensed moneylender",
    product: "Personal loan",
    flatRate: 0.078,
    feeRate: 0.02,
    funding: "same-day",
  },
];

export const loanLimits = {
  amount: { min: 1_000, max: 100_000, step: 500, initial: 20_000 },
  tenure: { min: 12, max: 60, step: 12, initial: 36 },
  rate: { min: 0.02, max: 0.12, step: 0.0005, initial: 0.0388 },
};
