import type { Metadata } from "next";
import { loanCalculatorPage } from "@/content/tools";
import { ClosingCta, Faq } from "@/components/home/closing";
import { LoanCalculator } from "@/components/tools/loan-calculator";
import { ToolHero } from "@/components/tools/tool-hero";

export const metadata: Metadata = loanCalculatorPage.metadata;

export default function LoanCalculatorPage() {
  const { hero, faq, closing } = loanCalculatorPage;
  return (
    <>
      <ToolHero {...hero} scene="true-cost" />
      <LoanCalculator />
      <Faq content={faq} name="calculator-faq" divider={false} />
      <ClosingCta content={closing} />
    </>
  );
}
