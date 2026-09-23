import type { ReactNode } from "react";
import { loanPurposes } from "@/content/home";
import { loanLimits } from "@/content/offers";
import { PlaybackFrame } from "@/components/scenes/playback-frame";
import { STEP_AMOUNT } from "@/components/scenes/scripts/how-it-works";
import type { TimelineId } from "@/components/scenes/timelines";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/layout";
import { OfferCard } from "@/components/ui/offer-card";
import { cn } from "@/lib/cn";
import { formatPercent, formatSGD } from "@/lib/loan-math";
import { quoteOffers } from "./offer-quotes";

const AMOUNT = STEP_AMOUNT;
const offers = quoteOffers(loanLimits.amount.initial, loanLimits.tenure.initial);

type PanelSize = { box: string; content: string };

const SIZES = {
  form: { box: "h-[200px] md:h-[240px]", content: "scale-[0.78] md:scale-[1.04]" },
  rows: { box: "h-[300px] md:h-[360px]", content: "scale-[0.78] md:scale-[1.04]" },
  card: { box: "h-[380px] md:h-[470px]", content: "scale-[0.7] md:scale-[0.84]" },
} satisfies Record<string, PanelSize>;

/** Dark panel holding a hard crop of the product, enlarged and bled off the right edge. */
function Panel({
  timelineId,
  label,
  size,
  children,
}: {
  timelineId: TimelineId;
  label: string;
  size: PanelSize;
  children: ReactNode;
}) {
  return (
    <PlaybackFrame
      timelineId={timelineId}
      role="img"
      aria-label={label}
      data-theme-lock="dark"
      className={cn("relative overflow-hidden rounded-xl bg-ink-900", size.box)}
    >
      <div inert className={cn("absolute top-10 left-8 w-[620px] origin-top-left md:top-14 md:left-14", size.content)}>
        {children}
      </div>
    </PlaybackFrame>
  );
}

const pill =
  "relative flex h-11 min-w-0 flex-1 items-center justify-center rounded-pill px-4 text-body-sm font-medium whitespace-nowrap";

/** Step 1: the hero form, the amount typing in and Consolidate selecting. */
export function AmountFragment() {
  return (
    <Panel
      timelineId="step-amount"
      size={SIZES.form}
      label={`The application form: loan amount S$${AMOUNT}, purpose Consolidate.`}
    >
      <div className="flex max-w-[520px] gap-1 rounded-pill border border-line-strong p-1">
        {loanPurposes.map((purpose) => {
          const isChosen = purpose.value === "consolidate";
          return (
            <span key={purpose.value} className={cn(pill, isChosen ? "bg-fg text-bg" : "text-fg-muted")}>
              {purpose.label}
              {purpose.value === "personal" && (
                <span
                  data-anim="purpose-was-selected"
                  style={{ opacity: 0 }}
                  className={cn(pill, "absolute inset-0 bg-fg text-bg")}
                >
                  {purpose.label}
                </span>
              )}
              {isChosen && (
                <span
                  data-anim="purpose-unselected"
                  style={{ opacity: 0 }}
                  className={cn(pill, "absolute inset-0 bg-ink-900 text-fg-muted")}
                >
                  {purpose.label}
                </span>
              )}
            </span>
          );
        })}
      </div>
      <div className="mt-4 flex items-start gap-3">
        <div className="flex h-13 w-60 items-center rounded-md border border-line-strong bg-field">
          <span className="pl-4 text-body-md text-fg-muted tabular">S$</span>
          <span className="px-4 pl-2 text-body-md text-fg tabular">
            {[...AMOUNT].map((character, i) => (
              <span key={i} data-anim={`amount-char-${i}`}>
                {character}
              </span>
            ))}
          </span>
        </div>
        <Button>See my offers</Button>
      </div>
    </Panel>
  );
}

/** Step 2: the matched offers arriving as rows, cheapest total flagged. */
export function OfferRowsFragment() {
  return (
    <Panel
      timelineId="step-offers"
      size={SIZES.rows}
      label={`Matched offers side by side, each with rate, monthly repayment and total payable. ${offers.find((offer) => offer.isBest)?.lender.name} has the lowest total cost.`}
    >
      <ul className="flex flex-col gap-3">
        {offers.map((offer, i) => (
          <li
            key={offer.lender.id}
            data-anim={`offer-row-${i}`}
            className={cn(
              "grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center gap-4 rounded-lg border bg-card px-5 py-4",
              offer.isBest ? "border-cta" : "border-line",
            )}
          >
            <div className="flex flex-col items-start gap-1">
              <span className="text-body-sm font-medium text-fg">{offer.lender.name}</span>
              {offer.isBest ? (
                <Badge tone="accent">Lowest total cost</Badge>
              ) : (
                <span className="text-caption text-fg-muted">{offer.lender.kind}</span>
              )}
            </div>
            {[
              { term: "Rate", value: `${formatPercent(offer.quote.flatRate)} flat` },
              { term: "Monthly", value: formatSGD(offer.quote.monthlyRepayment, true) },
              { term: "Total payable", value: formatSGD(offer.quote.totalPayable) },
            ].map((figure) => (
              <div key={figure.term} className="flex flex-col items-end gap-0.5">
                <span className="text-caption text-fg-muted">{figure.term}</span>
                <span className="text-body-sm font-medium text-fg tabular">{figure.value}</span>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/** Step 3: the top offer selected, its checkmark drawn and Continue pressed. */
export function ChooseFragment() {
  const best = offers.find((offer) => offer.isBest) ?? offers[0];
  return (
    <Panel
      timelineId="step-choose"
      size={SIZES.card}
      label={`${best.lender.name} selected, with Continue with ${best.lender.name} pressed.`}
    >
      <div className="relative w-[340px]">
        <OfferCard
          lenderName={best.lender.name}
          product={best.lender.product}
          kind={best.lender.kind}
          quote={best.quote}
          fundingLabel={best.fundingLabel}
          isBest
          action={
            <div data-anim="choose-press" style={{ transform: "scale(0.99)" }}>
              <Button className="relative w-full overflow-hidden">
                Continue with {best.lender.name}
                <span data-anim="choose-press-shade" aria-hidden className="absolute inset-0 bg-ink-900/15" />
              </Button>
            </div>
          }
        />
        <span
          data-anim="choose-check"
          className="absolute top-6 right-6 flex size-8 items-center justify-center overflow-hidden rounded-pill bg-cta md:top-8 md:right-8"
        >
          <svg viewBox="0 0 16 16" aria-hidden className="size-4">
            <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="square" />
          </svg>
          <span
            data-anim="choose-check-cover"
            style={{ transform: "translateX(101%)" }}
            className="absolute inset-0 bg-cta"
          />
        </span>
      </div>
    </Panel>
  );
}

export const stepFragments = [AmountFragment, OfferRowsFragment, ChooseFragment] as const;
