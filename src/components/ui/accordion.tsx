import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AccordionItem = { question: string; answer: ReactNode };

/**
 * Exclusive accordion on native `<details name>`: no JavaScript, keyboard
 * accessible, and only one item open at a time. The first item starts open.
 */
export function Accordion({
  name,
  items,
  className,
}: {
  name: string;
  items: readonly AccordionItem[];
  className?: string;
}) {
  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((item, index) => (
        <details key={item.question} name={name} open={index === 0} className="group border-b border-line">
          <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-6 py-6">
            <h3 className="text-heading-sm text-fg">{item.question}</h3>
            <span
              aria-hidden
              className="relative size-4 shrink-0 text-fg-muted before:absolute before:top-1/2 before:left-0 before:h-px before:w-4 before:bg-current after:absolute after:top-0 after:left-1/2 after:h-4 after:w-px after:bg-current after:transition-transform after:duration-300 after:ease-out group-open:after:scale-y-0"
            />
          </summary>
          <div className="max-w-[60ch] pb-8 text-body-md text-fg-body">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
