import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { styles } from "./classes";

export type StageTone = "light" | "dark";

type StageProps = {
  /** Size in units. The viewBox always starts at 0 0; the pivots rely on it. */
  width: number;
  height: number;
  tone: StageTone;
  /** Fixed pixels per unit. Omit to fill the container's width. */
  scale?: number;
  /** Accessible description of the finished scene; omit if decorative. */
  label?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/** The SVG every scene draws into. Sets the palette for its tone. */
export function Stage({ width, height, tone, scale, label, className, style, children }: StageProps) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={scale ? width * scale : undefined}
      height={scale ? height * scale : undefined}
      data-tone={tone}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={cn(styles.stage, !scale && "h-auto w-full", className)}
      style={style}
    >
      {children}
    </svg>
  );
}

/** The single 1px ground line every scene stands on. */
export function GroundLine({ y, from = 0, to }: { y: number; from?: number; to: number }) {
  return <path d={`M${from} ${y}H${to}`} className={styles.ground} />;
}

type Point = { x: number; y: number };

type CurrentProps = {
  from: Point;
  to: Point;
  /** Starts the pulse. It travels once and is gone in the final pose. */
  run?: boolean;
  duration?: number;
  delay?: number;
  /** Length of the bright segment, in units. */
  pulse?: number;
};

/**
 * The one electrical metaphor: a short bright segment travelling once along
 * a thin wire. Only where something genuinely travels.
 */
export function Current({ from, to, run = false, duration = 600, delay = 0, pulse = 20 }: CurrentProps) {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
  const pulseStyle = {
    "--travel": `${Math.max(0, length - pulse)}px`,
    animationDuration: `${duration}ms`,
    animationDelay: `${delay}ms`,
  } as CSSProperties;

  return (
    <g transform={`translate(${from.x} ${from.y}) rotate(${angle})`}>
      <path d={`M0 0H${length}`} className={styles.wire} />
      <rect
        data-part="pulse"
        x={0}
        y={-1}
        width={pulse}
        height={2}
        className={cn(styles.pulse, run && styles.pulseRun)}
        style={pulseStyle}
      />
    </g>
  );
}
