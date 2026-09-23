import { applyCopy } from "@/content/apply";
import { findLender } from "@/content/lenders";
import { bookingDates, formatDayShort, formatTime, timeSlots } from "@/lib/booking";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/form-controls";
import { FlowScreen } from "./flow-screen";
import type { StepProps } from "./types";

const copy = applyCopy.book;

export function BookStep({ state, dispatch, nav }: StepProps) {
  const lender = findLender(state.lenderId);
  if (!lender || !state.bookingFrom) return null;

  const days = bookingDates(state.bookingFrom).map((value) => ({ value, label: formatDayShort(value) }));
  const times = timeSlots(lender.hours.open, lender.hours.close).map((value) => ({ value, label: formatTime(value) }));

  return (
    <FlowScreen
      {...nav}
      title={copy.title(lender.name)}
      body={<p>{copy.body(lender.name)}</p>}
      onSubmit={() => dispatch({ type: "confirmBooking" })}
      actions={
        <Button type="submit" className="w-full">
          {copy.confirm}
        </Button>
      }
    >
      <SegmentedControl
        name="apply-visit-date"
        legend={copy.dateLegend}
        options={days}
        columns={3}
        value={state.draft.visitDate}
        error={state.errors.visitDate}
        onChange={(visitDate) => dispatch({ type: "update", patch: { visitDate } })}
      />
      <SegmentedControl
        name="apply-visit-time"
        legend={copy.timeLegend}
        options={times}
        columns={4}
        value={state.draft.visitTime}
        error={state.errors.visitTime}
        onChange={(visitTime) => dispatch({ type: "update", patch: { visitTime } })}
      />
      <p className="text-body-sm text-fg-muted">
        {lender.name}, {lender.address.line1}, {lender.address.line2}. {lender.hours.days}.
      </p>
    </FlowScreen>
  );
}
