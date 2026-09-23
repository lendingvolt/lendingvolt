"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { showcase } from "@/content/home";
import { loanLimits } from "@/content/offers";
import { routes } from "@/content/site";
import { FootnoteRef } from "@/components/ui/footnotes";
import { SegmentedControl, Slider } from "@/components/ui/form-controls";
import { Container, Section } from "@/components/ui/layout";
import { OfferCard } from "@/components/ui/offer-card";
import { formatSGD, formatTenure } from "@/lib/loan-math";
import { quoteOffers, sortOptions, type SortKey } from "./offer-quotes";

const REORDER_MS = 300;
const REORDER_EASING = "cubic-bezier(0.2, 0, 0, 1)";

/**
 * FLIP on re-sort: remember where each card was, let React reorder them,
 * then play each card from its old place to its new one.
 */
function useReorder(dependency: unknown) {
  const listRef = useRef<HTMLUListElement>(null);
  const before = useRef(new Map<string, DOMRect>());

  const remember = () => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-offer]") ?? [];
    before.current = new Map(Array.from(items, (item) => [item.dataset.offer ?? "", item.getBoundingClientRect()]));
  };

  useLayoutEffect(() => {
    const first = before.current;
    before.current = new Map();
    if (first.size === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    listRef.current?.querySelectorAll<HTMLElement>("[data-offer]").forEach((item) => {
      const from = first.get(item.dataset.offer ?? "");
      if (!from) return;
      const to = item.getBoundingClientRect();
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      if (dx === 0 && dy === 0) return;
      item.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0px, 0px)" }], {
        duration: REORDER_MS,
        easing: REORDER_EASING,
      });
    });
  }, [dependency]);

  return { listRef, remember };
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
  const { listRef, remember } = useReorder(sort);

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
            onChange={(value) => {
              remember();
              setSort(value as SortKey);
            }}
            className="max-w-[560px]"
          />
          <ul ref={listRef} aria-label="Illustrative offers" className="grid gap-4 sm:grid-cols-2 lg:gap-6">
            {offers.map(({ lender, quote, fundingLabel, isBest }) => (
              <li key={lender.id} data-offer={lender.id}>
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
