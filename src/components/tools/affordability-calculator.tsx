"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type ChangeEvent } from "react";
import { routes } from "@/content/site";
import { affordabilityPage } from "@/content/tools";
import { affordability, type Budget } from "@/lib/affordability";
import { formatDigits } from "@/lib/application";
import { parseAmount, saveIntent, tenureOptions, type Tenure } from "@/lib/application-intent";
import { cn } from "@/lib/cn";
import { formatPercent, formatSGD, formatTenure } from "@/lib/loan-math";
import { Button } from "@/components/ui/button";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Input, SegmentedControl, Slider } from "@/components/ui/form-controls";
import { Container, Section } from "@/components/ui/layout";

const copy = affordabilityPage.labels;
const MIN_LOAN = 1_000;
/** The application accepts up to this amount; larger loans are handled directly. */
const MAX_LOAN = 500_000;
const tenures = tenureOptions.map((value) => ({ value, label: formatTenure(Number(value)).replace(" years", " yrs").replace(" year", " yr") }));

const toNumber = (value: string) => {
  const parsed = parseAmount(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/** Budget in; the monthly repayment that fits, and the loan amount it supports, out. */
export function AffordabilityCalculator() {
  const router = useRouter();
  const [income, setIncome] = useState("6,000");
  const [expenses, setExpenses] = useState("2,500");
  const [repayments, setRepayments] = useState("300");
  const [tenure, setTenure] = useState<Tenure>("36");
  const [rate, setRate] = useState(0.0388);

  const budget: Budget = useMemo(
    () => ({ income: toNumber(income), expenses: toNumber(expenses), existingRepayments: toNumber(repayments) }),
    [income, expenses, repayments],
  );
  const months = Number(tenure);
  const result = useMemo(() => affordability(budget, months, rate), [budget, months, rate]);
  const byTenure = useMemo(
    () => tenureOptions.map((value) => ({ months: Number(value), ...affordability(budget, Number(value), rate) })),
    [budget, rate],
  );

  const hasIncome = budget.income > 0;
  const canBorrow = result.amount >= MIN_LOAN;

  // The split bar covers income, or everything owed if spending runs past it.
  const committed = budget.expenses + budget.existingRepayments + result.payment;
  const scale = Math.max(budget.income, committed) || 1;
  const segments = [
    { key: "expenses", label: copy.split.expenses, value: budget.expenses, swatch: "bg-ink-300" },
    { key: "existing", label: copy.split.existing, value: budget.existingRepayments, swatch: "bg-ink-500" },
    { key: "loan", label: copy.split.loan, value: result.payment, swatch: "bg-cta" },
    { key: "left", label: copy.split.leftOver, value: Math.max(0, result.leftOver), swatch: "bg-surface-2" },
  ];

  const apply = () => {
    saveIntent({ amount: Math.min(result.amount, MAX_LOAN), purpose: "personal", tenure });
    router.push(routes.apply);
  };

  const field = (setter: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) =>
    setter(formatDigits(parseAmount(event.target.value)));

  return (
    <Section ground="surface-0" aria-label="Affordability check">
      <Container className="flex flex-col gap-16 md:gap-20">
        <div
          data-theme-lock="light"
          className="grid gap-6 rounded-xl border border-line bg-surface-1 p-6 md:p-10 lg:grid-cols-12 lg:gap-10 lg:p-12"
        >
          <div className="flex flex-col gap-6 lg:col-span-7">
            <Input
              id="af-income"
              label={copy.income}
              hint={copy.incomeHint}
              prefix="S$"
              inputMode="numeric"
              autoComplete="off"
              placeholder="6,000"
              value={income}
              onChange={field(setIncome)}
            />
            <Input
              id="af-expenses"
              label={copy.expenses}
              hint={copy.expensesHint}
              prefix="S$"
              inputMode="numeric"
              autoComplete="off"
              placeholder="2,500"
              value={expenses}
              onChange={field(setExpenses)}
            />
            <Input
              id="af-repayments"
              label={copy.repayments}
              hint={copy.repaymentsHint}
              prefix="S$"
              inputMode="numeric"
              autoComplete="off"
              placeholder="0"
              value={repayments}
              onChange={field(setRepayments)}
            />
            <SegmentedControl
              name="af-tenure"
              legend={copy.tenure}
              options={tenures}
              layout="row"
              value={tenure}
              onChange={(value) => setTenure(value as Tenure)}
            />
            <Slider
              id="af-rate"
              label={copy.rate}
              min={0.01}
              max={0.12}
              step={0.0005}
              value={rate}
              onValueChange={setRate}
              readout={formatPercent(rate)}
              aria-valuetext={`${formatPercent(rate)} per year, flat`}
            />
          </div>

          <div className="lg:col-span-5">
            <div aria-live="polite" className="flex h-full flex-col gap-6 rounded-lg border border-line bg-card p-6 md:p-8">
              <div>
                <p className="text-body-sm text-fg-muted">
                  {copy.headline}
                  <FootnoteRef id="affordability-method" />
                </p>
                <p className="mt-1 text-stat text-fg tabular">{formatSGD(result.amount)}</p>
                <p className="mt-1 text-body-sm text-fg-muted">over {formatTenure(months)}</p>
              </div>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6">
                <div className="flex flex-col gap-0.5">
                  <dt className="text-caption text-fg-muted">{copy.monthly}</dt>
                  <dd className="text-body-md font-medium text-fg tabular">{formatSGD(result.payment, true)}</dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="text-caption text-fg-muted">{copy.leftOver}</dt>
                  <dd className={cn("text-body-md font-medium tabular", result.leftOver < 0 ? "text-negative" : "text-fg")}>
                    {formatSGD(result.leftOver, true)}
                  </dd>
                </div>
              </dl>

              {hasIncome && !canBorrow ? (
                <div className="flex flex-col gap-2 rounded-md bg-surface-2 p-4">
                  <p className="text-body-sm text-fg">{copy.noRoom}</p>
                  <a
                    href={copy.noRoomLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-body-sm font-medium text-link underline underline-offset-2"
                  >
                    {copy.noRoomLink.label}
                  </a>
                </div>
              ) : (
                <p className="text-caption text-fg-muted">{copy.limit[result.limit]}</p>
              )}

              <div>
                <p className="text-caption text-fg-muted">{copy.splitTitle}</p>
                <div aria-hidden className="mt-3 flex h-3 overflow-hidden rounded-pill bg-surface-2">
                  {segments.map((segment) => (
                    <span
                      key={segment.key}
                      className={cn("h-full transition-[width] duration-300 ease-out", segment.swatch)}
                      style={{ width: `${(segment.value / scale) * 100}%` }}
                    />
                  ))}
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                  {segments.map((segment) => (
                    <div key={segment.key} className="flex items-center gap-2 text-caption">
                      <span
                        aria-hidden
                        className={cn("size-2.5 shrink-0 rounded-sm border border-line", segment.swatch)}
                      />
                      <dt className="text-fg-muted">{segment.label}</dt>
                      <dd className="ml-auto text-fg tabular">{formatSGD(segment.value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <Button onClick={apply} disabled={!canBorrow} className="mt-auto w-full disabled:opacity-50">
                {copy.cta(formatSGD(canBorrow ? result.amount : 0))}
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:max-w-[760px]">
          <h2 className="text-heading-lg">{copy.compareTitle}</h2>
          <table className="mt-6 w-full text-left tabular">
            <thead>
              <tr className="border-b border-line text-caption text-fg-muted">
                <th scope="col" className="py-3 pr-4 text-left font-normal">
                  Tenure
                </th>
                <th scope="col" className="py-3 pr-4 text-right font-normal">
                  You could borrow
                </th>
                <th scope="col" className="py-3 text-right font-normal">
                  Monthly
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
                    <td className="pr-4 text-right">{formatSGD(row.amount)}</td>
                    <td className="pr-3 text-right">{formatSGD(row.payment, true)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
}
