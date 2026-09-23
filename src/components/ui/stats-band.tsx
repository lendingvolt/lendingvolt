import type { FootnoteId } from "@/content/footnotes";
import { cn } from "@/lib/cn";
import { CountUp } from "./count-up";
import { FootnoteRef } from "./footnotes";

type Stat = { figure: string; label: string; footnote: FootnoteId };

/** Four figures across on desktop, 2×2 on mobile, dividers on desktop only. */
export function StatsBand({ stats, className }: { stats: readonly Stat[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-0", className)}>
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={cn("flex flex-col gap-2 lg:px-8", index > 0 && "lg:border-l lg:border-line", index === 0 && "lg:pl-0")}
        >
          <dt className="order-2 text-body-sm text-fg-muted">{stat.label}</dt>
          <dd className="order-1 text-stat text-fg">
            <CountUp figure={stat.figure} />
            <FootnoteRef id={stat.footnote} size="fixed" />
          </dd>
        </div>
      ))}
    </dl>
  );
}
