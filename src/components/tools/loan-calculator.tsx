"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { routes } from "@/content/site";
import { loanCalculatorPage } from "@/content/tools";
import { saveIntent, tenureOptions, type Tenure } from "@/lib/application-intent";
import { cn } from "@/lib/cn";
import { formatPercent, formatSGD, formatTenure, quoteFlatRate, repaymentSchedule } from "@/lib/loan-math";
import { Button } from "@/components/ui/button";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Slider } from "@/components/ui/form-controls";
import { Container, Section } from "@/components/ui/layout";

const copy = loanCalculatorPage.labels;
const limits = {
  amount: { min: 1_000, max: 200_000, step: 500 },
  months: { min: 6, max: 60, step: 6 },
  rate: { min: 0.01, max: 0.12, step: 0.0005 },
  fee: { min: 0, max: 0.05, step: 0.005 },
};
const compareTenures = [12, 24, 36, 48, 60];

/** Amount and tenure in; monthly repayment, total cost and EIR out, live. */
export function LoanCalculator() {
  const router = useRouter();
  const [amount, setAmount] = useState(20_000);
  const [months, setMonths] = useState(36);
  const [rate, setRate] = useState(0.0388);
  const [fee, setFee] = useState(0);

  const quote = useMemo(() => quoteFlatRate(amount, months, rate, fee), [amount, months, rate, fee]);
  const byTenure = useMemo(
    () => compareTenures.map((m) => quoteFlatRate(amount, m, rate, fee)),
    [amount, rate, fee],
  );
  const schedule = useMemo(() => repaymentSchedule(quote), [quote]);

  const results = [
    { term: copy.interest, value: formatSGD(quote.totalInterest, true) },
    { term: copy.feeAmount, value: formatSGD(quote.fee, true) },
    { term: copy.total, value: formatSGD(quote.totalPayable, true) },
    { term: copy.eir, value: `${formatPercent(quote.eir)} p.a.` },
  ];

  const apply = () => {
    const tenure = String(months) as Tenure;
    saveIntent({ amount, purpose: "personal", ...(tenureOptions.includes(tenure) && { tenure }) });
    router.push(routes.apply);
  };

  return (
    <Section ground="surface-0" aria-label="Loan calculator">
      <Container className="flex flex-col gap-16 md:gap-20">
        <div
          data-theme-lock="light"
          className="grid gap-6 rounded-xl border border-line bg-surface-1 p-6 md:p-10 lg:grid-cols-12 lg:gap-10 lg:p-12"
        >
          <div className="flex flex-col gap-8 lg:col-span-7">
            <Slider
              id="lc-amount"
              label={copy.amount}
              {...limits.amount}
              value={amount}
              onValueChange={setAmount}
              readout={formatSGD(amount)}
              aria-valuetext={formatSGD(amount)}
            />
            <Slider
              id="lc-tenure"
              label={copy.tenure}
              {...limits.months}
              value={months}
              onValueChange={setMonths}
              readout={formatTenure(months)}
              aria-valuetext={formatTenure(months)}
            />
            <Slider
              id="lc-rate"
              label={copy.rate}
              {...limits.rate}
              value={rate}
              onValueChange={setRate}
              readout={formatPercent(rate)}
              aria-valuetext={`${formatPercent(rate)} per year, flat`}
            />
            <Slider
              id="lc-fee"
              label={copy.fee}
              {...limits.fee}
              value={fee}
              onValueChange={setFee}
              readout={formatPercent(fee, 1)}
              aria-valuetext={`${formatPercent(fee, 1)} of the amount`}
            />
          </div>

          <div className="lg:col-span-5">
            <div aria-live="polite" className="flex h-full flex-col gap-6 rounded-lg border border-line bg-card p-6 md:p-8">
              <div>
                <p className="text-body-sm text-fg-muted">
                  {copy.monthly}
                  <FootnoteRef id="calculator" />
                </p>
                <p className="mt-1 text-stat text-fg tabular">{formatSGD(quote.monthlyRepayment, true)}</p>
                <p className="mt-1 text-body-sm text-fg-muted">for {formatTenure(months)}</p>
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6">
                {results.map((row) => (
                  <div key={row.term} className="flex flex-col gap-0.5">
                    <dt className="text-caption text-fg-muted">{row.term}</dt>
                    <dd className="text-body-md font-medium text-fg tabular">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <Button onClick={apply} className="mt-auto w-full">
                {copy.cta}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <h2 className="text-heading-lg">{copy.compareTitle}</h2>
            <table className="mt-6 w-full text-left tabular">
              <thead>
                <tr className="border-b border-line text-caption text-fg-muted">
                  <th scope="col" className="py-3 pr-4 text-left font-normal">
                    Tenure
                  </th>
                  <th scope="col" className="py-3 pr-4 text-right font-normal">
                    Monthly
                  </th>
                  <th scope="col" className="py-3 pr-4 text-right font-normal">
                    Total interest
                  </th>
                  <th scope="col" className="py-3 text-right font-normal">
                    EIR
                  </th>
                </tr>
              </thead>
              <tbody className="text-body-sm text-fg">
                {byTenure.map((row) => {
                  const isCurrent = row.months === months;
                  return (
                    <tr
                      key={row.months}
                      aria-current={isCurrent ? "true" : undefined}
                      className={cn("border-b border-line", isCurrent && "bg-tint")}
                    >
                      <td className={cn("h-14 pr-4 pl-3", isCurrent ? "font-medium" : "text-fg-muted")}>
                        {formatTenure(row.months)}
                      </td>
                      <td className="pr-4 text-right">{formatSGD(row.monthlyRepayment, true)}</td>
                      <td className="pr-4 text-right">{formatSGD(row.totalInterest)}</td>
                      <td className="pr-3 text-right">{formatPercent(row.eir)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <details className="group lg:col-span-5">
            <summary className="flex min-h-11 items-center justify-between gap-4 border-b border-line py-3 text-body-md font-medium text-fg hover:text-link">
              {copy.scheduleToggle}
              <span
                aria-hidden
                className="size-2 rotate-45 border-r border-b border-current transition-transform duration-200 group-open:-rotate-135"
              />
            </summary>
            <div className="max-h-[480px] overflow-y-auto">
              <table className="w-full text-left tabular">
                <caption className="sr-only">Repayment schedule, {formatTenure(months)}</caption>
                <thead className="sticky top-0 bg-bg">
                  <tr className="border-b border-line text-caption text-fg-muted">
                    <th scope="col" className="py-3 pr-4 text-left font-normal">
                      Month
                    </th>
                    <th scope="col" className="py-3 pr-4 text-right font-normal">
                      Payment
                    </th>
                    <th scope="col" className="hidden py-3 pr-4 text-right font-normal sm:table-cell">
                      Interest
                    </th>
                    <th scope="col" className="py-3 text-right font-normal">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="text-body-sm text-fg">
                  {schedule.map((row) => (
                    <tr key={row.month} className="border-b border-line last:border-0">
                      <td className="h-11 pr-4 text-fg-muted">{row.month}</td>
                      <td className="pr-4 text-right">{formatSGD(row.payment, true)}</td>
                      <td className="hidden pr-4 text-right sm:table-cell">{formatSGD(row.interest, true)}</td>
                      <td className="text-right">{formatSGD(row.balance, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-caption text-fg-muted">
              Interest spread evenly across the tenure
              <FootnoteRef id="schedule-split" />
            </p>
          </details>
        </div>
      </Container>
    </Section>
  );
}
