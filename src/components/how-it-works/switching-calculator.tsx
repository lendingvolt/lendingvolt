"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { howItWorksPage } from "@/content/how-it-works";
import { loanLimits } from "@/content/offers";
import { routes } from "@/content/site";
import { saveIntent } from "@/lib/application-intent";
import { Button } from "@/components/ui/button";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Slider } from "@/components/ui/form-controls";
import { Container, Section } from "@/components/ui/layout";
import { formatPercent, formatSGD, formatTenure, quoteFlatRate } from "@/lib/loan-math";

/** Below a cent, two offers cost the same. */
const MIN_SAVING = 0.005;

/**
 * Two offers for the same amount and tenure, and what the cheaper one saves
 * in interest. Figures are flat-rate illustrations, not quotes.
 */
export function SwitchingCalculator() {
  const { calculator } = howItWorksPage;
  const router = useRouter();
  const [amount, setAmount] = useState(loanLimits.amount.initial);
  const [months, setMonths] = useState(loanLimits.tenure.initial);
  const [firstRate, setFirstRate] = useState(calculator.defaults.firstRate);
  const [comparedRate, setComparedRate] = useState(calculator.defaults.comparedRate);

  const { first, compared, saving, monthlySaving } = useMemo(() => {
    const first = quoteFlatRate(amount, months, firstRate);
    const compared = quoteFlatRate(amount, months, comparedRate);
    return {
      first,
      compared,
      saving: first.totalInterest - compared.totalInterest,
      monthlySaving: first.monthlyRepayment - compared.monthlyRepayment,
    };
  }, [amount, months, firstRate, comparedRate]);

  const hasSaving = saving > MIN_SAVING;
  const rateSlider = { min: loanLimits.rate.min, max: loanLimits.rate.max, step: loanLimits.rate.step };

  return (
    <Section ground="surface-1" aria-labelledby="switching-title">
      <Container>
        <div className="flex flex-col gap-4">
          <h2 id="switching-title" className="max-w-[20ch] text-display-md">
            {calculator.title}
          </h2>
          <p className="max-w-[52ch] text-body-md">{calculator.body}</p>
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-6">
          <div className="grid content-start gap-x-8 gap-y-8 sm:grid-cols-2 lg:col-span-7 lg:gap-y-10 lg:pr-8">
            <Slider
              id="switching-amount"
              label={calculator.labels.amount}
              min={loanLimits.amount.min}
              max={loanLimits.amount.max}
              step={loanLimits.amount.step}
              value={amount}
              onValueChange={setAmount}
              readout={formatSGD(amount)}
              aria-valuetext={formatSGD(amount)}
            />
            <Slider
              id="switching-tenure"
              label={calculator.labels.tenure}
              min={loanLimits.tenure.min}
              max={loanLimits.tenure.max}
              step={loanLimits.tenure.step}
              value={months}
              onValueChange={setMonths}
              readout={formatTenure(months)}
              aria-valuetext={formatTenure(months)}
            />
            <Slider
              id="switching-first-rate"
              label={calculator.labels.first}
              {...rateSlider}
              value={firstRate}
              onValueChange={setFirstRate}
              readout={formatPercent(firstRate)}
              aria-valuetext={`${formatPercent(firstRate)} per year, flat`}
            />
            <Slider
              id="switching-compared-rate"
              label={calculator.labels.compared}
              {...rateSlider}
              value={comparedRate}
              onValueChange={setComparedRate}
              readout={formatPercent(comparedRate)}
              aria-valuetext={`${formatPercent(comparedRate)} per year, flat`}
            />
          </div>

          <div className="flex flex-col gap-8 rounded-lg border border-line bg-card p-6 md:p-8 lg:col-span-5">
            <div aria-live="polite" className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <p className="text-body-sm text-fg-muted">{calculator.results.saving(formatTenure(months))}</p>
                <p className="text-stat text-fg">
                  {formatSGD(hasSaving ? saving : 0)}
                  <FootnoteRef id={calculator.footnote} size="fixed" />
                </p>
                {!hasSaving && <p className="text-caption text-fg-muted">{calculator.results.noSaving}</p>}
              </div>
              <dl className="flex flex-col border-t border-line">
                {[
                  { term: calculator.results.first, value: formatSGD(first.totalInterest) },
                  { term: calculator.results.compared, value: formatSGD(compared.totalInterest) },
                  {
                    term: calculator.results.monthly,
                    value: formatSGD(hasSaving ? monthlySaving : 0, true),
                  },
                ].map((row) => (
                  <div key={row.term} className="flex items-baseline justify-between gap-4 border-b border-line py-3">
                    <dt className="text-body-sm text-fg-muted">{row.term}</dt>
                    <dd className="text-body-md font-medium text-fg tabular">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                saveIntent({ amount, purpose: "personal" });
                router.push(routes.apply);
              }}
            >
              {calculator.cta}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
