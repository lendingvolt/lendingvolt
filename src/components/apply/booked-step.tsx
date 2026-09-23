import type { ReactNode } from "react";
import { applyCopy } from "@/content/apply";
import { findLender, mapsUrl } from "@/content/lenders";
import { routes } from "@/content/site";
import { formatDayLong, formatTime } from "@/lib/booking";
import { Button } from "@/components/ui/button";
import { FlowScreen } from "./flow-screen";
import { RenderCard } from "./render-card";
import type { StepProps } from "./types";

const copy = applyCopy.booked;
const linkClass = "text-link underline underline-offset-2 hover:text-fg";

export function BookedStep({ state, nav }: StepProps) {
  const lender = findLender(state.lenderId);
  if (!lender) return null;

  const rows: { term: string; value: ReactNode }[] = [
    {
      term: copy.whenLabel,
      value: (
        <span className="tabular">
          {formatDayLong(state.draft.visitDate)}, {formatTime(state.draft.visitTime)}
        </span>
      ),
    },
    {
      term: copy.whereLabel,
      value: (
        <>
          {lender.address.line1}
          <br />
          {lender.address.line2}
          <br />
          <a href={mapsUrl(lender)} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {copy.maps}
          </a>
        </>
      ),
    },
    {
      term: copy.contactLabel,
      value: (
        <>
          <a href={lender.phone.href} className={`${linkClass} tabular`}>
            {lender.phone.display}
          </a>
          <br />
          <a href={`mailto:${lender.email}`} className={`${linkClass} [overflow-wrap:anywhere]`}>
            {lender.email}
          </a>
        </>
      ),
    },
    {
      term: copy.hoursLabel,
      value: (
        <>
          {lender.hours.days}
          <br />
          {lender.hours.closed}
        </>
      ),
    },
    { term: copy.bringLabel, value: copy.bring },
  ];

  return (
    <FlowScreen
      {...nav}
      title={copy.title}
      body={<p>{lender.visit}</p>}
      visual={<RenderCard scene="life-event" />}
      actions={
        <>
          <Button href={routes.home} className="w-full">
            {copy.cta}
          </Button>
          <p className="text-center text-caption text-fg-muted">{copy.prototypeNote(lender.name)}</p>
        </>
      }
    >
      <section aria-labelledby="booked-lender" className="rounded-lg border border-line px-6">
        <header className="flex flex-col gap-0.5 border-b border-line py-4">
          <h2 id="booked-lender" className="text-heading-sm">
            {lender.name}
          </h2>
          <p className="text-caption text-fg-muted">
            {lender.kind} · Licence {lender.licence}
          </p>
        </header>
        <dl className="divide-y divide-line">
          {rows.map((row) => (
            <div key={row.term} className="grid grid-cols-[5.5rem_1fr] gap-3 py-3 sm:grid-cols-[7.5rem_1fr] sm:gap-4">
              <dt className="text-body-sm text-fg-muted">{row.term}</dt>
              <dd className="min-w-0 text-body-md text-fg">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </FlowScreen>
  );
}
