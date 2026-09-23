import { howItWorks } from "@/content/home";
import { loanLimits } from "@/content/offers";
import { Button } from "@/components/ui/button";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Container, Eyebrow, Reveal, Section } from "@/components/ui/layout";
import { OfferCard } from "@/components/ui/offer-card";
import { cn } from "@/lib/cn";
import { quoteOffers, sortOptions } from "./offer-quotes";

/**
 * A hard crop of the real comparison screen, enlarged past life size and
 * bled off the right and bottom edges of a dark panel.
 */
function ComparisonFragment() {
  const offers = quoteOffers(loanLimits.amount.initial, loanLimits.tenure.initial).slice(0, 2);
  return (
    <div
      role="img"
      aria-label="The comparison screen: offers sorted by monthly repayment, the cheapest marked Lowest total cost."
      data-theme-lock="dark"
      className="relative h-[440px] overflow-hidden rounded-xl bg-ink-900 md:h-[560px]"
    >
      <div inert className="absolute top-10 left-8 w-[680px] origin-top-left scale-[0.82] md:top-14 md:left-14 md:scale-[1.08]">
        <div className="flex gap-1 rounded-pill border border-line-strong p-1">
          {sortOptions.map((option, index) => (
            <span
              key={option.value}
              className={cn(
                "flex h-11 flex-1 items-center justify-center rounded-pill text-body-sm font-medium",
                index === 0 ? "bg-fg text-bg" : "text-fg-muted",
              )}
            >
              {option.label}
            </span>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {offers.map(({ lender, quote, fundingLabel, isBest }) => (
            <OfferCard
              key={lender.id}
              lenderName={lender.name}
              product={lender.product}
              kind={lender.kind}
              quote={quote}
              fundingLabel={fundingLabel}
              isBest={isBest}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Eyebrow, H2, three numbered steps beside a crop of the product. */
export function HowItWorks() {
  return (
    <Section ground="surface-1" id="how-it-works" aria-labelledby="how-title">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <Eyebrow>{howItWorks.eyebrow}</Eyebrow>
            <h2 id="how-title" className="text-display-md">
              {howItWorks.title}
            </h2>
          </div>
          <Button href={howItWorks.link.href} variant="text">
            {howItWorks.link.label}
          </Button>
        </div>

        <div className="mt-12 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-6">
          <ol className="flex flex-col gap-10 lg:col-span-5 lg:gap-12 lg:pr-12">
            {howItWorks.steps.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[3ch_1fr] gap-4 border-t border-line pt-6">
                <span className="text-body-md text-fg-muted tabular">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-heading-sm">{step.title}</h3>
                  <p className="mt-2 max-w-[44ch] text-body-md">
                    {step.body}
                    {"footnote" in step && <FootnoteRef id={step.footnote} />}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <Reveal className="lg:col-span-7">
            <ComparisonFragment />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
