"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { calculator, type LoanPurpose } from "@/content/home";
import { loanLimits } from "@/content/offers";
import { routes } from "@/content/site";
import { saveIntent } from "@/lib/application-intent";
import { Button } from "@/components/ui/button";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Slider } from "@/components/ui/form-controls";
import { Container, Section } from "@/components/ui/layout";
import { cn } from "@/lib/cn";
import { formatPercent, formatSGD, formatTenure, quoteFlatRate } from "@/lib/loan-math";

/** Slim inline calculator: three sliders and a live repayment readout. */
export function CalculatorStrip({
  purpose = "personal",
  className,
}: {
  purpose?: LoanPurpose;
  /** Extra section classes, e.g. top padding when it does not follow another white section. */
  className?: string;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(loanLimits.amount.initial);
  const [months, setMonths] = useState(loanLimits.tenure.initial);
  const [rate, setRate] = useState(loanLimits.rate.initial);

  const quote = useMemo(() => quoteFlatRate(amount, months, rate), [amount, months, rate]);

  return (
    <Section
      ground="surface-0"
      spacing="none"
      aria-labelledby="calculator-title"
      className={cn("pb-16 md:pb-30", className)}
    >
      <Container>
        <div className="rounded-xl border border-line bg-surface-1 p-6 md:p-10 lg:p-12">
          <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
            <h2 id="calculator-title" className="text-heading-lg">
              {calculator.title}
            </h2>
            <p className="text-caption text-fg-muted">
              Indicative only
              <FootnoteRef id="calculator" />
            </p>
          </div>

          <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-12 lg:gap-6">
            <div className="grid gap-6 sm:grid-cols-3 lg:col-span-8 lg:gap-8">
              <Slider
                id="calc-amount"
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
                id="calc-tenure"
                label="Tenure"
                min={loanLimits.tenure.min}
                max={loanLimits.tenure.max}
                step={loanLimits.tenure.step}
                value={months}
                onValueChange={setMonths}
                readout={formatTenure(months)}
                aria-valuetext={formatTenure(months)}
              />
              <Slider
                id="calc-rate"
                label="Flat rate p.a."
                min={loanLimits.rate.min}
                max={loanLimits.rate.max}
                step={loanLimits.rate.step}
                value={rate}
                onValueChange={setRate}
                readout={formatPercent(rate)}
                aria-valuetext={`${formatPercent(rate)} per year, flat`}
              />
            </div>

            <div className="flex flex-col justify-between gap-6 border-t border-line pt-6 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              <dl aria-live="polite" className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <dt className="text-body-sm text-fg-muted">Monthly repayment</dt>
                  <dd className="text-numeric text-fg">{formatSGD(quote.monthlyRepayment, true)}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-body-sm text-fg-muted">Total payable</dt>
                  <dd className="text-numeric text-fg">{formatSGD(quote.totalPayable)}</dd>
                </div>
                <div className="col-span-2 text-caption text-fg-muted tabular">
                  EIR {formatPercent(quote.eir)} p.a. · Total interest {formatSGD(quote.totalInterest)}
                </div>
              </dl>
              <Button
                variant="text"
                className="self-start"
                onClick={() => {
                  saveIntent({ amount, purpose });
                  router.push(routes.apply);
                }}
              >
                {calculator.cta}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
