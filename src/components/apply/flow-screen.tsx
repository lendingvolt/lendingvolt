import type { FormEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

export const FLOW_HEADING_ID = "flow-heading";

type FlowScreenProps = {
  title: ReactNode;
  body?: ReactNode;
  /** "Step 2 of 7"; omitted after submission. */
  progress?: { current: number; total: number } | null;
  onBack?: () => void;
  backLabel?: string;
  /** Render card or other visual placed between the text and the fields. */
  visual?: ReactNode;
  /** Primary action, then an optional quiet secondary action. */
  actions?: ReactNode;
  onSubmit?: () => void;
  children?: ReactNode;
};

/**
 * One idea per screen, the way Mercury's sign-up sheets work: a display
 * headline top-left, a line or two of plain text, then the fields and a
 * full-width primary action pinned to the bottom on mobile.
 */
export function FlowScreen({
  title,
  body,
  progress,
  onBack,
  backLabel = "Back",
  visual,
  actions,
  onSubmit,
  children,
}: FlowScreenProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-1 flex-col">
      {(progress || onBack) && (
        <div className="flex min-h-11 items-center justify-between gap-4">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="-ml-2 inline-flex min-h-11 items-center gap-2 px-2 text-body-sm font-medium text-fg-muted hover:text-fg"
            >
              <span aria-hidden>←</span>
              {backLabel}
            </button>
          ) : (
            <span />
          )}
          {progress && (
            <p className="text-label text-fg-muted tabular">
              Step {progress.current} of {progress.total}
            </p>
          )}
        </div>
      )}
      {progress && (
        <div
          role="progressbar"
          aria-label="Application progress"
          aria-valuemin={1}
          aria-valuemax={progress.total}
          aria-valuenow={progress.current}
          className="mt-2 h-0.5 overflow-hidden rounded-pill bg-line"
        >
          <div
            className="h-full rounded-pill bg-cta transition-[width] duration-500 ease-out"
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
        </div>
      )}

      <div className={cn("flex flex-col", progress || onBack ? "mt-10 md:mt-16" : "mt-4 md:mt-12")}>
        <h1 id={FLOW_HEADING_ID} tabIndex={-1} className="text-display-md outline-none">
          {title}
        </h1>
        {body && <div className="mt-3 prose-width text-body-lg md:mt-4">{body}</div>}
      </div>

      {visual && <div className="mt-8">{visual}</div>}

      {children && <div className="mt-8 flex flex-col gap-6">{children}</div>}

      {actions && (
        <div className="sticky bottom-0 z-10 -mx-5 mt-auto flex flex-col gap-2 bg-bg/92 px-5 pt-6 pb-[max(16px,env(safe-area-inset-bottom))] backdrop-blur-md md:static md:mx-0 md:mt-10 md:bg-transparent md:px-0 md:pb-0 md:backdrop-blur-none">
          {actions}
        </div>
      )}
    </form>
  );
}
