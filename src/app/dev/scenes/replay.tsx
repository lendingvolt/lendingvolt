"use client";

import { useState, type ReactNode } from "react";

/** Remounts its scene on click, so the story plays again from the start. */
export function Replay({ children }: { children: ReactNode }) {
  const [run, setRun] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      <div key={run}>{children}</div>
      <button
        type="button"
        onClick={() => setRun((count) => count + 1)}
        className="inline-flex h-11 items-center self-start rounded-md border border-line-strong px-5 text-body-sm font-medium text-fg hover:border-fg"
      >
        Replay
      </button>
    </div>
  );
}
