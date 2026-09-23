import { CalculatorStrip } from "@/components/home/calculator-strip";
import { ClosingCta, Faq, Stats } from "@/components/home/closing";
import { ComparisonShowcase } from "@/components/home/comparison-showcase";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { LenderWall } from "@/components/home/lender-wall";
import { Testimonials } from "@/components/home/testimonials";
import { UseCases } from "@/components/home/use-cases";
import { ValueGrid } from "@/components/home/value-grid";

export default function Home() {
  return (
    <>
      <Hero />
      <LenderWall />
      <ValueGrid />
      <HowItWorks />
      <ComparisonShowcase />
      <CalculatorStrip />
      <UseCases />
      <Testimonials />
      <Stats />
      <Faq />
      <ClosingCta />
    </>
  );
}
