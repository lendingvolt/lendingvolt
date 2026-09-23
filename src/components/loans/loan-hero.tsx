import type { LoanPageContent } from "@/content/loans/types";
import { quoteOffers, sortOptions } from "@/components/home/offer-quotes";
import { AmountForm } from "@/components/home/amount-form";
import { Container, Eyebrow, Section } from "@/components/ui/layout";
import { OfferCard } from "@/components/ui/offer-card";
import { cn } from "@/lib/cn";

/** Two offer cards and the sort control, enlarged and bled off the right edge. */
function OfferFragment({ amount, months, product }: { amount: number; months: number; product?: string }) {
  const offers = quoteOffers(amount, months).slice(0, 2);
  return (
    <div
      role="img"
      aria-label="Illustrative offers side by side, sorted by monthly repayment, the cheapest marked Lowest total cost."
      data-theme-lock="dark"
      className="relative h-[360px] overflow-hidden rounded-l-xl border-y border-l border-line bg-card sm:h-[440px] lg:h-[560px]"
    >
      <div inert className="absolute top-8 left-6 w-[680px] origin-top-left scale-[0.78] md:top-12 md:left-12 md:scale-100">
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
              product={product ?? lender.product}
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

/** Dark band: eyebrow, headline, one literal line, the amount form, the disclosure, then the product. */
export function LoanHero({ content }: { content: LoanPageContent }) {
  const { hero, example, purpose } = content;
  return (
    <Section ground="ink-900" spacing="none" aria-labelledby="loan-hero-title" className="-mt-(--header-h) overflow-hidden">
      <Container className="grid gap-12 pt-[calc(var(--header-h)+64px)] lg:min-h-[80vh] lg:grid-cols-12 lg:gap-6 lg:pt-[calc(var(--header-h)+32px)]">
        <div className="flex flex-col justify-center lg:col-span-6 lg:py-24">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1 id="loan-hero-title" className="mt-4 max-w-[14ch] text-display-lg">
            {hero.title}
          </h1>
          <p className="mt-3 max-w-[52ch] text-body-lg text-fg-muted md:mt-4">{hero.subhead}</p>
          <AmountForm cta={hero.cta} defaultPurpose={purpose} className="mt-6 md:mt-8" />
          <p className="mt-4 max-w-[56ch] text-caption text-fg-muted">{hero.disclosure}</p>
        </div>
        {/* Bleeds to the viewport's right edge: the gutter, plus the space beside the 1264px container. */}
        <div className="-mr-5 self-end md:-mr-8 lg:col-span-6 lg:mr-[min(-2rem,calc(600px-50vw))] lg:self-center">
          <OfferFragment amount={example.amount} months={example.months} product={hero.product} />
        </div>
      </Container>
    </Section>
  );
}
