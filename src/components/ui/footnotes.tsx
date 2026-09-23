import { footnoteNumber, footnotes, type FootnoteId } from "@/content/footnotes";
import { cn } from "@/lib/cn";

/** Superscript marker linking to its entry in the disclaimers block. */
export function FootnoteRef({
  id,
  size = "relative",
  className,
}: {
  id: FootnoteId;
  /** `relative` scales with the text (0.7em); `fixed` stays at 14px beside large figures. */
  size?: "relative" | "fixed";
  className?: string;
}) {
  const n = footnoteNumber(id);
  return (
    <sup
      className={cn(
        "relative ml-px leading-none",
        size === "relative" ? "-top-[0.6em] text-[0.7em]" : "-top-[1.6em] ml-1 text-[14px] tracking-normal",
        className,
      )}
    >
      <a
        href={`#disclaimer-${n}`}
        aria-label={`Footnote ${n}`}
        className="text-fg-muted no-underline hover:text-link"
      >
        {n}
      </a>
    </sup>
  );
}

/** Numbered disclaimers that every footnote marker resolves to. */
export function Disclaimers({ className }: { className?: string }) {
  return (
    <ol aria-label="Disclaimers" className={cn("flex flex-col gap-3", className)}>
      {footnotes.map((note, index) => (
        <li
          key={note.id}
          id={`disclaimer-${index + 1}`}
          className="grid grid-cols-[2ch_1fr] gap-3 text-caption text-fg-muted target:text-fg"
        >
          <span className="tabular">{index + 1}</span>
          <span className="max-w-[88ch]">{note.text}</span>
        </li>
      ))}
    </ol>
  );
}
