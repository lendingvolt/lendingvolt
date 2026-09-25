"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

/**
 * A centred panel over a dimmed ground, in the same surface, radius and
 * shadow-pop language as the nav dropdown. Traps Escape and scroll, and
 * returns focus to the trigger on close.
 */
export function Dialog({ open, onClose, title, children }: DialogProps) {
  const headingId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const root = document.documentElement;
    root.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root.style.overflow = "";
      triggerRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        data-theme-lock="light"
        className="relative z-10 flex max-h-[85vh] w-full max-w-[600px] flex-col rounded-t-xl border border-line bg-surface-0 shadow-pop outline-none sm:max-h-[80vh] sm:rounded-xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
          <h2 id={headingId} className="text-heading-lg">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="relative -mr-1.5 flex size-9 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <span aria-hidden className="relative block size-4">
              <span className="absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
