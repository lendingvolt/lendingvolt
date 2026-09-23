import type { LoanPageContent } from "@/content/loans/types";
import { CalculatorStrip } from "@/components/home/calculator-strip";
import { ClosingCta, Faq } from "@/components/home/closing";
import { LoanHero } from "./loan-hero";
import { RelatedLoans } from "./related-loans";
import { TermsRows } from "./terms-rows";
import { ValueProps } from "./value-props";

/**
 * Loan-type page, modelled on Mercury's product pages: dark hero with the
 * product, three promises, transparent terms, the calculator, related loans,
 * questions, then the closing band. Content comes from `content/loans`.
 */
export function LoanPage({ content }: { content: LoanPageContent }) {
  return (
    <>
      <LoanHero content={content} />
      <ValueProps items={content.valueProps} />
      <TermsRows content={content} />
      <CalculatorStrip purpose={content.purpose} className="pt-16 md:pt-30" />
      <RelatedLoans related={content.related} />
      <Faq content={content.faq} name={`${content.purpose}-faq`} />
      <ClosingCta content={content.closing} purpose={content.purpose} />
    </>
  );
}
