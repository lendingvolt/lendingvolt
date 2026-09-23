import type { Metadata } from "next";
import { affordabilityPage } from "@/content/tools";
import { ClosingCta, Faq } from "@/components/home/closing";
import { AffordabilityCalculator } from "@/components/tools/affordability-calculator";
import { AffordabilityMethod } from "@/components/tools/affordability-method";
import { ToolHero } from "@/components/tools/tool-hero";

export const metadata: Metadata = affordabilityPage.metadata;

export default function AffordabilityPage() {
  const { hero, faq, closing } = affordabilityPage;
  return (
    <>
      <ToolHero {...hero} scene="no-charge" />
      <AffordabilityCalculator />
      <AffordabilityMethod />
      <Faq content={faq} name="affordability-faq" />
      <ClosingCta content={closing} />
    </>
  );
}
