import type { Metadata } from "next";
import { howItWorksPage } from "@/content/how-it-works";
import { ClosingCta, Faq } from "@/components/home/closing";
import {
  ComparisonTable,
  HowHero,
  LoanTypes,
  Process,
  Proof,
} from "@/components/how-it-works/how-it-works-sections";
import { SwitchingCalculator } from "@/components/how-it-works/switching-calculator";

export const metadata: Metadata = howItWorksPage.metadata;

/**
 * Section order keeps the page to two colour changes: the dark hero, then
 * every light section together, then one dark band — the proof section,
 * the closing CTA and the footer, contiguous — at the very end.
 */
export default function HowItWorksPage() {
  return (
    <>
      <HowHero />
      <LoanTypes />
      <Process />
      <ComparisonTable />
      <SwitchingCalculator />
      <Faq content={howItWorksPage.faq} name="how-faq" />
      <Proof />
      <ClosingCta content={howItWorksPage.closing} />
    </>
  );
}
