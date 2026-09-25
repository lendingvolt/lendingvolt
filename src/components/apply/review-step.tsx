import { applyCopy } from "@/content/apply";
import { Button } from "@/components/ui/button";
import { FlowScreen } from "./flow-screen";
import { describeDraft } from "./format";
import type { StepProps } from "./types";

const copy = applyCopy.review;

export function ReviewStep({ state, dispatch, nav }: StepProps) {
  const groups = describeDraft(state.draft);
  return (
    <FlowScreen
      {...nav}
      title={copy.title}
      body={<p>{copy.body}</p>}
      onSubmit={() => dispatch({ type: "next" })}
      gap="gap-4"
      actions={
        <Button type="submit" className="w-full">
          {applyCopy.actions.continue}
        </Button>
      }
    >
      {groups.map((group) => (
        <section
          key={group.step}
          aria-labelledby={`review-${group.step}`}
          className="rounded-lg border border-line px-6"
        >
          <header className="flex min-h-12 items-center justify-between gap-4 border-b border-line">
            <h2 id={`review-${group.step}`} className="text-heading-sm">
              {group.title}
            </h2>
            <button
              type="button"
              aria-label={`${copy.edit} ${group.title.toLowerCase()}`}
              onClick={() => dispatch({ type: "goTo", step: group.step })}
              className="-mr-2 inline-flex min-h-11 items-center px-2 text-body-sm font-medium text-link hover:text-fg"
            >
              {copy.edit}
            </button>
          </header>
          <dl className="divide-y divide-line">
            {group.rows.map((row) => (
              <div key={row.term} className="flex items-baseline justify-between gap-6 py-2">
                <dt className="shrink-0 text-body-sm text-fg-muted">{row.term}</dt>
                <dd className="min-w-0 text-right text-body-md text-fg tabular [overflow-wrap:anywhere]">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </FlowScreen>
  );
}
