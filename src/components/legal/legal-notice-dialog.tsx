"use client";

import { useState } from "react";
import type { LegalPageContent } from "@/content/legal";
import { Dialog } from "@/components/ui/dialog";
import { LegalBlocks } from "./legal-blocks";

/**
 * Opens a legal page's text in a modal instead of navigating to its route,
 * so the reader stays on the form and never sees the page URL.
 */
export function LegalNoticeDialog({
  page,
  triggerLabel,
  className,
}: {
  page: LegalPageContent;
  triggerLabel: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {triggerLabel}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title={page.title}>
        <p className="text-caption text-fg-muted">Last updated {page.updated}</p>
        <p className="mt-4 max-w-[60ch] text-body-md">{page.intro}</p>
        <div className="mt-8 flex flex-col gap-8">
          {page.sections.map((section, index) => (
            <section key={section.id} aria-labelledby={`${section.id}-dialog-title`}>
              <h3 id={`${section.id}-dialog-title`} className="text-heading-sm">
                {index + 1}. {section.title}
              </h3>
              <div className="mt-3 flex max-w-[60ch] flex-col gap-3 text-body-sm">
                <LegalBlocks blocks={section.blocks} />
              </div>
            </section>
          ))}
        </div>
      </Dialog>
    </>
  );
}
