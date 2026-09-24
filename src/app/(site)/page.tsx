import { CalculatorStrip } from "@/components/home/calculator-strip";
import { ClosingCta, Faq, Stats } from "@/components/home/closing";
import { ComparisonShowcase } from "@/components/home/comparison-showcase";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { LenderVetting } from "@/components/home/lender-vetting";
import { Testimonials } from "@/components/home/testimonials";
import { UseCases } from "@/components/home/use-cases";
import { ValueGrid } from "@/components/home/value-grid";
import { ClosingScene } from "@/components/scenes/closing-scene";

/**
 * Section order keeps the page to two colour changes: the dark hero, then
 * every light section together, then one dark band — testimonials, the
 * closing CTA and the footer, contiguous — at the very end.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <LenderVetting />
      <ValueGrid />
      <HowItWorks />
      <ComparisonShowcase />
      <CalculatorStrip />
      <UseCases />
      <Stats />
      <Faq />
      <Testimonials />
      <ClosingCta scene={<ClosingScene className="aspect-[2/1] w-full" />} />
    </>
  );
}
