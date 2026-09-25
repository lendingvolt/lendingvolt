import { howItWorks } from "@/content/home";
import { Button } from "@/components/ui/button";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Container, Eyebrow, Section } from "@/components/ui/layout";
import { stepFragments } from "./how-it-works-fragments";

/** Eyebrow, H2, then each numbered step beside a crop of the product doing that step. */
export function HowItWorks() {
  return (
    <Section ground="surface-1" id="how-it-works" aria-labelledby="how-title">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-4">
            <Eyebrow>{howItWorks.eyebrow}</Eyebrow>
            <h2 id="how-title" className="text-display-md">
              {howItWorks.title}
            </h2>
          </div>
          <Button href={howItWorks.link.href} variant="text" className="shrink-0">
            {howItWorks.link.label}
          </Button>
        </div>

        <ol className="mt-12 flex flex-col gap-16 md:mt-20 md:gap-24">
          {howItWorks.steps.map((step, index) => {
            const Fragment = stepFragments[index];
            return (
              <li key={step.title} className="grid gap-8 border-t border-line pt-6 lg:grid-cols-12 lg:gap-6">
                <div className="grid grid-cols-[3ch_1fr] content-start gap-4 lg:col-span-5 lg:pr-12">
                  <span className="text-body-md text-fg-muted tabular">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-heading-sm">{step.title}</h3>
                    <p className="mt-2 max-w-[44ch] text-body-md">
                      {step.body}
                      {"footnote" in step && <FootnoteRef id={step.footnote} />}
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <Fragment />
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
