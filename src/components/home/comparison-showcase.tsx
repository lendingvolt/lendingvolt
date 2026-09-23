"use client";

import { useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { showcase } from "@/content/home";
import { loanLimits } from "@/content/offers";
import { routes } from "@/content/site";
import { FootnoteRef } from "@/components/ui/footnotes";
import { SegmentedControl, Slider } from "@/components/ui/form-controls";
import { Container, Section } from "@/components/ui/layout";
import { OfferCard } from "@/components/ui/offer-card";
import { formatSGD, formatTenure } from "@/lib/loan-math";
import { quoteOffers, sortOptions, type SortKey } from "./offer-quotes";

/** Re-sort inside a view transition so cards glide to their new places. */
function withTransition(update: () => void) {
  const canAnimate =
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!canAnimate) {
    update();
    return;
  }
  document.startViewTransition(() => flushSync(update));
}

/**
 * The product, live: amount and tenure sliders drive four illustrative
 * offers, re-sortable, with the cheapest by total cost flagged.
 */
export function ComparisonShowcase() {
  const [amount, setAmount] = useState(loanLimits.amount.initial);
  const [months, setMonths] = useState(loanLimits.tenure.initial);
  const [sort, setSort] = useState<SortKey>("monthly");

  const offers = useMemo(() => quoteOffers(amount, months, sort), [amount, months, sort]);

  return (
    <Section ground="surface-0" aria-labelledby="showcase-title">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col lg:col-span-4 lg:pr-8">
          <h2 id="showcase-title" className="text-display-md">
            {showcase.title}
          </h2>
          <p className="mt-4 max-w-[44ch] text-body-md">
            {showcase.body}
            <FootnoteRef id="illustrative-offers" />
          </p>

          <div className="mt-10 flex flex-col gap-6 lg:mt-12">
            <Slider
              id="showcase-amount"
              label="Amount"
              min={loanLimits.amount.min}
              max={loanLimits.amount.max}
              step={loanLimits.amount.step}
              value={amount}
              onValueChange={setAmount}
              readout={formatSGD(amount)}
              aria-valuetext={formatSGD(amount)}
            />
            <Slider
              id="showcase-tenure"
              label="Tenure"
              min={loanLimits.tenure.min}
              max={loanLimits.tenure.max}
              step={loanLimits.tenure.step}
              value={months}
              onValueChange={setMonths}
              readout={formatTenure(months)}
              aria-valuetext={formatTenure(months)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-8">
          <SegmentedControl
            name="showcase-sort"
            legend="Sort by"
            hideLegend
            options={sortOptions}
            value={sort}
            onChange={(value) => withTransition(() => setSort(value as SortKey))}
            className="max-w-[560px]"
          />
          <ul aria-label="Illustrative offers" className="grid gap-4 sm:grid-cols-2 lg:gap-6">
            {offers.map(({ lender, quote, fundingLabel, isBest }) => (
              <li key={lender.id} style={{ viewTransitionName: `offer-${lender.id}` }}>
                <OfferCard
                  lenderName={lender.name}
                  product={lender.product}
                  kind={lender.kind}
                  quote={quote}
                  fundingLabel={fundingLabel}
                  isBest={isBest}
                  cta={{ href: routes.apply, label: `Continue with ${lender.name}` }}
                  className="h-full"
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
