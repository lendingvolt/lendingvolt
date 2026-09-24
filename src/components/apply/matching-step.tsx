import type { CSSProperties } from "react";
import { applyCopy, matchingDuration } from "@/content/apply";
import { FlowScreen } from "./flow-screen";
import { RenderCard } from "./render-card";
import type { StepProps } from "./types";

const copy = applyCopy.matching;

/** Shown while the application goes out. Status lines step in with CSS only. */
export function MatchingStep({ nav }: StepProps) {
  return (
    <FlowScreen
      {...nav}
      title={
        <>
          {copy.titleBefore}
          {copy.lenderCount}
          {copy.titleAfter}
        </>
      }
      visual={<RenderCard scene="matching" tone="dark" />}
    >
      <div
        aria-hidden
        className="h-0.5 overflow-hidden rounded-pill bg-line"
      >
        <div
          className="flow-fill h-full bg-cta"
          style={{ "--duration": `${matchingDuration.full}ms` } as CSSProperties}
        />
      </div>
      <ol role="status" className="flex flex-col gap-3">
        {copy.statuses.map((status, index) => (
          <li
            key={status}
            className="flow-status flex items-center gap-3 text-body-md text-fg"
            style={{ "--i": index } as CSSProperties}
          >
            <span aria-hidden className="size-1.5 shrink-0 rounded-pill bg-cta" />
            {status}
          </li>
        ))}
      </ol>
    </FlowScreen>
  );
}
