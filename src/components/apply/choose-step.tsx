import { applyCopy } from "@/content/apply";
import { lenders } from "@/content/lenders";
import { parseAmount } from "@/lib/application-intent";
import { singaporeDate } from "@/lib/booking";
import { formatSGD, formatTenure, quoteFlatRate } from "@/lib/loan-math";
import { Button } from "@/components/ui/button";
import { OfferCard } from "@/components/ui/offer-card";
import { FlowScreen } from "./flow-screen";
import { RenderCard } from "./render-card";
import type { StepProps } from "./types";

const copy = applyCopy.choose;

export function ChooseStep({ state, dispatch, nav }: StepProps) {
  const amount = parseAmount(state.draft.amount);
  const months = Number(state.draft.tenure);
  const count = lenders.length;

  return (
    <FlowScreen
      {...nav}
      title={copy.title}
      body={
        <p>
          {count} {count === 1 ? "offer" : "offers"} for <span className="tabular">{formatSGD(amount)}</span> over{" "}
          {formatTenure(months)}.
        </p>
      }
      visual={<RenderCard scene="offer-stack" />}
    >
      {lenders.map((lender) => (
        <OfferCard
          key={lender.id}
          lenderName={lender.name}
          product={`${lender.kind} · ${lender.product}`}
          kind="Example figures"
          quote={quoteFlatRate(amount, months, lender.exampleTerms.flatRate, lender.exampleTerms.feeRate)}
          fundingLabel="After an in-person visit"
          note={
            <>
              <p>{copy.exampleBadge(lender.name)}.</p>
              <p>{lender.loanLimit}.</p>
            </>
          }
          action={
            <Button
              className="w-full"
              onClick={() => dispatch({ type: "chooseLender", lenderId: lender.id, today: singaporeDate(new Date()) })}
            >
              {copy.choose(lender.name)}
            </Button>
          }
        />
      ))}
    </FlowScreen>
  );
}
