import type { LoanPageContent } from "@/content/loans/types";
import { FootnoteRef } from "@/components/ui/footnotes";
import { formatPercent, formatSGD, formatTenure, quoteFlatRate, repaymentSchedule } from "@/lib/loan-math";

type Example = LoanPageContent["example"];

/** The worked example as a card on a dark panel: the inputs, then what they cost. */
export function WorkedExample({ example }: { example: Example }) {
  const quote = quoteFlatRate(example.amount, example.months, example.flatRate, example.feeRate);
  const inputs = [
    { term: "Loan amount", value: formatSGD(quote.principal) },
    { term: "Tenure", value: formatTenure(quote.months) },
    { term: "Flat rate", value: `${formatPercent(quote.flatRate)} p.a.` },
    { term: "Processing fee", value: formatSGD(quote.fee) },
  ];
  const results = [
    { term: "Total interest", value: formatSGD(quote.totalInterest, true) },
    { term: "Total payable", value: formatSGD(quote.totalPayable, true) },
    { term: "EIR", value: `${formatPercent(quote.eir)} p.a.` },
  ];

  return (
    <div data-theme-lock="dark" className="rounded-xl bg-ink-900 p-6 sm:p-10 lg:p-12">
      <div className="rounded-lg border border-line bg-card p-6 md:p-8">
        <p className="text-label text-fg-muted">Worked example</p>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
          {inputs.map((row) => (
            <div key={row.term} className="flex flex-col gap-0.5">
              <dt className="text-caption text-fg-muted">{row.term}</dt>
              <dd className="text-body-md font-medium text-fg tabular">{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 border-t border-line pt-6">
          <p className="text-caption text-fg-muted">Monthly repayment</p>
          <p className="text-numeric text-fg">{formatSGD(quote.monthlyRepayment, true)}</p>
        </div>
        <dl className="mt-6 grid grid-cols-3 gap-4">
          {results.map((row) => (
            <div key={row.term} className="flex flex-col gap-0.5">
              <dt className="text-caption text-fg-muted">{row.term}</dt>
              <dd className="text-body-sm font-medium text-fg tabular">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

const SCHEDULE_ROWS = 6;

/** The first months of the same example's schedule, fading out to show it continues. */
export function RepaymentSchedule({ example }: { example: Example }) {
  const quote = quoteFlatRate(example.amount, example.months, example.flatRate, example.feeRate);
  const rows = repaymentSchedule(quote, SCHEDULE_ROWS);
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-surface-0 p-6 sm:p-10 lg:p-12">
      <table className="w-full text-left tabular">
        <caption className="mb-4 text-left text-label text-fg-muted">
          Months 1–{SCHEDULE_ROWS} of {quote.months}
        </caption>
        <thead>
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
            <th scope="col" className="hidden py-3 pr-4 text-right font-normal sm:table-cell">
              Principal
            </th>
            <th scope="col" className="py-3 text-right font-normal">
              Balance
            </th>
          </tr>
        </thead>
        <tbody className="text-body-sm text-fg">
          {rows.map((row) => (
            <tr key={row.month} className="border-b border-line last:border-0">
              <td className="h-14 pr-4 text-fg-muted">{row.month}</td>
              <td className="pr-4 text-right">{formatSGD(row.payment, true)}</td>
              <td className="hidden pr-4 text-right sm:table-cell">{formatSGD(row.interest, true)}</td>
              <td className="hidden pr-4 text-right sm:table-cell">{formatSGD(row.principal, true)}</td>
              <td className="text-right">{formatSGD(row.balance, true)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-surface-0 to-transparent" />
    </div>
  );
}

/** Banks against licensed moneylenders. A table from 768px, stacked cards below. */
export function EligibilityTable({ eligibility }: { eligibility: LoanPageContent["eligibility"] }) {
  const { columns, rows } = eligibility;
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-line bg-surface-0 md:block">
        <table className="w-full text-left">
          <thead className="bg-surface-2">
            <tr>
              <th scope="col" className="w-[28%] px-6 py-4 text-label font-medium text-fg-muted">
                <span className="sr-only">Criterion</span>
              </th>
              {columns.map((column) => (
                <th key={column.text} scope="col" className="px-6 py-4 text-left text-heading-sm font-medium text-fg">
                  {column.text}
                  {column.footnote && <FootnoteRef id={column.footnote} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-line align-top">
                <th scope="row" className="px-6 py-5 text-left text-body-sm font-medium text-fg-muted">
                  {row.label}
                </th>
                {row.values.map((value, index) => (
                  <td key={columns[index].text} className="px-6 py-5 text-body-sm text-fg tabular">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {columns.map((column, index) => (
          <section key={column.text} className="rounded-lg border border-line bg-surface-0 p-6">
            <h4 className="text-heading-sm">
              {column.text}
              {column.footnote && <FootnoteRef id={column.footnote} />}
            </h4>
            <dl className="mt-4 divide-y divide-line">
              {rows.map((row) => (
                <div key={row.label} className="flex flex-col gap-1 py-3">
                  <dt className="text-caption text-fg-muted">{row.label}</dt>
                  <dd className="text-body-sm text-fg tabular">{row.values[index]}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </>
  );
}
