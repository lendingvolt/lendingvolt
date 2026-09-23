import { formatSGD, type FlatRateQuote } from "@/lib/loan-math";

/**
 * One bar per monthly repayment, all the same height, each split into
 * principal (below) and interest (above). A flat-rate loan splits every
 * month the same way, so the bars are identical; the split eases over
 * 200ms when the amount or rate changes.
 */
export function RepaymentBars({ quote }: { quote: FlatRateQuote }) {
  const interestShare = quote.totalPayable > 0 ? quote.totalInterest / quote.totalPayable : 0;
  const monthlyInterest = quote.totalInterest / quote.months;
  const monthlyPrincipal = quote.principal / quote.months;

  return (
    <div className="flex flex-col gap-2">
      <div
        role="img"
        aria-label={`${quote.months} monthly repayments of ${formatSGD(quote.monthlyRepayment, true)}, each ${formatSGD(monthlyPrincipal, true)} principal and ${formatSGD(monthlyInterest, true)} interest.`}
        className="flex h-10 items-stretch gap-0.5"
      >
        {Array.from({ length: quote.months }, (_, month) => (
          <span key={month} className="relative flex-1 overflow-hidden rounded-[1px] bg-line-strong">
            <span
              className="absolute inset-0 origin-top bg-cta transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none"
              style={{ transform: `scaleY(${interestShare})` }}
            />
          </span>
        ))}
      </div>
      <p aria-hidden className="flex gap-4 text-caption text-fg-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-[1px] bg-cta" />
          Interest
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-[1px] bg-line-strong" />
          Principal
        </span>
      </p>
    </div>
  );
}
