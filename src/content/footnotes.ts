/**
 * Disclaimers registry. Every footnote marker resolves to an entry here,
 * and its number is its position in this list, so order entries by their
 * first appearance on the page.
 */

export const footnotes = [
  {
    id: "lender-count",
    text: "[N] is the number of licensed lenders on the Lendingvolt panel as at [date]. The panel changes over time; the current list is on our lenders page.",
  },
  {
    id: "soft-search",
    text: "A soft search does not affect your credit score. A lender may run a full credit bureau search once you proceed with them, and they will tell you before they do.",
  },
  {
    id: "revenue",
    text: "Lenders pay Lendingvolt a fee when a loan completes. The fee does not change the rate a lender offers you, and offers are ordered only by the sort you choose.",
  },
  {
    id: "funding-time",
    text: "Funding times are set by each lender and depend on when you complete their checks. Same-day funding is not guaranteed.",
  },
  {
    id: "illustrative-offers",
    text: "Offers in this preview are illustrative and calculated from the amount and tenure you choose. They are not quotes. Actual rates, fees and approval depend on each lender's assessment of your application.",
  },
  {
    id: "calculator",
    text: "Indicative only. The calculator applies a flat annual rate over the full tenure with equal monthly repayments and no fees. The effective interest rate (EIR) is derived from those repayments. Actual rates depend on the lender's assessment.",
  },
  {
    id: "stat-matched",
    text: "S$[X]M is the total principal of loans completed through Lendingvolt between [start date] and [end date]. Source: [internal records, audited by —].",
  },
  {
    id: "stat-applications",
    text: "[N] applications submitted through Lendingvolt between [start date] and [end date]. Source: [internal records].",
  },
  {
    id: "stat-minutes",
    text: "Median time from the first field to submission for completed applications between [start date] and [end date].",
  },
] as const;

export type FootnoteId = (typeof footnotes)[number]["id"];

/** 1-based footnote number for a registry id. */
export function footnoteNumber(id: FootnoteId): number {
  return footnotes.findIndex((note) => note.id === id) + 1;
}
