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
      <Testimonials />
      <Stats />
      <Faq />
      <ClosingCta scene={<ClosingScene className="aspect-[2/1] w-full" />} />
    </>
  );
}
