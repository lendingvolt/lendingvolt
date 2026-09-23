import type { LoanPurpose } from "@/content/home";
import { routes } from "@/content/site";
import type { LoanPageContent } from "./types";

type RelatedItem = LoanPageContent["related"]["items"][number];

const allLoans: Record<LoanPurpose, RelatedItem> = {
  personal: {
    title: "Personal loans",
    body: "Weddings, school fees and other planned costs, spread over time.",
    href: routes.personal,
    scene: "life-event",
  },
  consolidate: {
    title: "Debt consolidation",
    body: "Move card balances into one fixed monthly repayment.",
    href: routes.debtConsolidation,
    scene: "consolidate",
  },
  renovate: {
    title: "Home renovation",
    body: "Fund the works on your flat without drawing down savings.",
    href: routes.renovation,
    scene: "renovate",
  },
  business: {
    title: "Business cash flow",
    body: "Bridge the gap between invoices and payroll.",
    href: routes.business,
    scene: "cashflow",
  },
};

/** "Other ways to borrow": every loan type except the page's own. */
export function relatedLoans(purpose: LoanPurpose): LoanPageContent["related"] {
  return {
    title: "Other ways to borrow.",
    items: (Object.keys(allLoans) as LoanPurpose[]).filter((key) => key !== purpose).map((key) => allLoans[key]),
  };
}
