import type { FootnoteId } from "@/content/footnotes";
import type { LoanPurpose } from "@/content/home";
import type { SceneId } from "@/components/graphics/scene-ids";

export type Footnoted = { text: string; footnote?: FootnoteId };

/** The cropped product-UI fragment shown beside a terms row. */
export type TermsFragment = "worked-example" | "repayment-schedule" | "eligibility-table";

export type TermsRow = {
  fragment: TermsFragment;
  title: string;
  body: string;
  bullets?: readonly Footnoted[];
  footnote?: FootnoteId;
};

/**
 * Everything a loan-type page needs. One file per loan type fills this in;
 * the template in `components/loans` lays it out.
 */
export type LoanPageContent = {
  purpose: LoanPurpose;
  metadata: { title: string; description: string };
  hero: {
    title: string;
    subhead: string;
    cta: string;
    disclosure: string;
    /** Product name on the hero's illustrative offer cards; defaults to each mock lender's own. */
    product?: string;
  };
  valueProps: readonly (Footnoted & { title: string })[];
  /** Amount, tenure and terms used by the worked example and schedule fragments. */
  example: { amount: number; months: number; flatRate: number; feeRate: number };
  terms: { eyebrow: string; title: string; rows: readonly TermsRow[] };
  eligibility: {
    columns: readonly [Footnoted, Footnoted];
    rows: readonly { label: string; values: readonly [string, string] }[];
  };
  related: {
    title: string;
    items: readonly { title: string; body: string; href: string; scene: SceneId }[];
  };
  faq: {
    title: string;
    link: { label: string; href: string };
    items: readonly { question: string; answer: string }[];
  };
  closing: { title: string; body: string; cta: string; secondary: string };
};
