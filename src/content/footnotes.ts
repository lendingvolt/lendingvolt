/**
 * Disclaimers registry. Every footnote marker resolves to an entry here,
 * and its number is its position in this list, so order entries by their
 * first appearance on the page.
 */

export const footnotes = [
  {
    id: "lender-vetting",
    text: "Lendingvolt reviews each lender individually before adding it to the panel, covering its licence, customer service and product knowledge. Passing the review is not an endorsement of any lender and does not guarantee approval, a particular rate or a level of service. Review criteria and how often lenders are re-reviewed to confirm before launch.",
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
    id: "switching-calculator",
    text: "Illustration only. Both offers are calculated as flat-rate loans for the same amount and tenure, with equal monthly repayments and no fees. It does not mean a lower rate will be offered to you; each lender sets its rate after assessing your application.",
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
  {
    id: "market-typical",
    text: "Typical figures for Singapore loans of this type as at [date], drawn from published bank terms and government scheme rules. They are not quotes or eligibility decisions; each lender sets its own criteria, rates and fees. To confirm before launch.",
  },
  {
    id: "moneylender-caps",
    text: "Licensed moneylenders are regulated by the Ministry of Law. Interest is capped at 4% a month, late interest at 4% a month on the late amount, late fees at S$60 a month and the upfront fee at 10% of the principal; total charges cannot exceed the principal. Unsecured loan limits depend on annual income and residency. To confirm against the Registry of Moneylenders before launch.",
  },
  {
    id: "schedule-split",
    text: "Illustration only. Interest is spread evenly across the tenure; a lender's statement may allocate it differently, for example under the Rule of 78, which changes how much you save by repaying early.",
  },
  {
    id: "affordability-method",
    text: "A guide, not a lending decision. The amount keeps all your debt repayments at or below 40% of gross income, leaves at least 20% of income after expenses and repayments, and stays within the typical bank limit of 4× monthly income (10× from S$120,000 a year). It assumes the flat rate you choose and no fees. Lenders apply their own checks, including your credit report.",
  },
] as const;

export type FootnoteId = (typeof footnotes)[number]["id"];

/** 1-based footnote number for a registry id. */
export function footnoteNumber(id: FootnoteId): number {
  return footnotes.findIndex((note) => note.id === id) + 1;
}
