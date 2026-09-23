import type { ReactNode } from "react";
import type { FlatRateQuote } from "@/lib/loan-math";
import { formatPercent, formatSGD, formatTenure } from "@/lib/loan-math";
import { cn } from "@/lib/cn";
import { Badge } from "./layout";
import { Button } from "./button";

export type OfferCardProps = {
  lenderName: string;
  product: string;
  kind: string;
  quote: FlatRateQuote;
  fundingLabel: string;
  isBest?: boolean;
  bestLabel?: string;
  cta?: { href: string; label: string };
  /** A button or other control in place of the `cta` link. */
  action?: ReactNode;
  /** Caption under the figures, e.g. what the figures are based on. */
  note?: ReactNode;
  className?: string;
};

/**
 * The offer card: lender, product, headline rate, the four figures a
 * borrower needs to compare, and one call to action. The best-value card is
 * marked with a 1px accent border and a badge, never a fill.
 */
export function OfferCard({
  lenderName,
  product,
  kind,
  quote,
  fundingLabel,
  isBest,
  bestLabel = "Lowest total cost",
  cta,
  action,
  note,
  className,
}: OfferCardProps) {
  const figures = [
    { term: "Monthly repayment", value: formatSGD(quote.monthlyRepayment, true) },
    { term: "Tenure", value: formatTenure(quote.months) },
    { term: "Total payable", value: formatSGD(quote.totalPayable, true) },
    { term: "EIR", value: `${formatPercent(quote.eir)} p.a.` },
  ];

  return (
    <article
      className={cn(
        "flex flex-col gap-6 rounded-lg border bg-card p-6 md:p-8",
        isBest ? "border-cta" : "border-line",
        className,
      )}
    >
      <header className="flex flex-col items-start gap-4">
        {isBest ? <Badge tone="accent">{bestLabel}</Badge> : <Badge>{kind}</Badge>}
        <div>
          <p className="text-heading-sm text-fg">{lenderName}</p>
          <p className="text-body-sm text-fg-muted">{product}</p>
        </div>
      </header>

      <div>
        <p className="flex items-baseline gap-2">
          <span className="text-numeric text-fg">{formatPercent(quote.flatRate)}</span>
          <span className="text-body-sm text-fg-muted">p.a. flat</span>
        </p>
        {quote.fee > 0 && (
          <p className="text-caption text-fg-muted tabular">
            Includes a {formatSGD(quote.fee)} processing fee
          </p>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5">
        {figures.map((figure) => (
          <div key={figure.term} className="flex flex-col gap-0.5">
            <dt className="text-caption text-fg-muted">{figure.term}</dt>
            <dd className="text-body-md font-medium text-fg tabular">{figure.value}</dd>
          </div>
        ))}
      </dl>

      <p className="text-caption text-fg-muted">
        Funds: <span className="text-fg">{fundingLabel}</span>
      </p>

      {note && <div className="flex flex-col gap-1 text-caption text-fg-muted">{note}</div>}

      {action}

      {cta && (
        <Button href={cta.href} variant={isBest ? "primary" : "secondary"} className="w-full">
          {cta.label}
        </Button>
      )}
    </article>
  );
}
