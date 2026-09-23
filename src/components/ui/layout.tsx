import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Ground = "surface-0" | "surface-1" | "ink-900";

const groundTheme: Record<Ground, "light" | "dark"> = {
  "surface-0": "light",
  "surface-1": "light",
  "ink-900": "dark",
};

/** 1200px content column with 32px / 20px gutters. */
export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1264px] px-5 md:px-8", className)} {...props} />;
}

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  ground: Ground;
  /** default = 120px desktop / 64px mobile; roomy = 160px / 80px. */
  spacing?: "default" | "roomy" | "none";
  /** Keep this theme even when the page-level colour changes. */
  lockTheme?: boolean;
};

/**
 * Full-bleed band. Declares its ground so the scroll colour controller can
 * crossfade the page to it; without JavaScript it paints the ground itself.
 */
export function Section({ ground, spacing = "default", lockTheme, className, ...props }: SectionProps) {
  const theme = groundTheme[ground];
  return (
    <section
      data-ground={ground}
      data-theme={theme}
      data-theme-lock={lockTheme ? theme : undefined}
      className={cn(
        "relative",
        spacing === "default" && "py-16 md:py-30",
        spacing === "roomy" && "py-20 md:py-40",
        className,
      )}
      {...props}
    />
  );
}

/** Small uppercase kicker above an H2. */
export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn("text-label text-fg-muted", className)}>{children}</p>;
}

/** 28px pill. `accent` for highlights, `neutral` for metadata. */
export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: "accent" | "neutral";
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-pill px-3 text-label whitespace-nowrap",
        tone === "accent" ? "bg-tint text-link" : "bg-control text-badge-fg",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Fade-and-rise on scroll entry. CSS only; disabled under reduced motion. */
export function Reveal({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("reveal", className)} {...props} />;
}
