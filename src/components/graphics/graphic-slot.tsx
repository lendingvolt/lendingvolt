import type { SceneId, SceneTone } from "./scene-ids";
import { SceneCanvas } from "./scene-canvas";
import { cn } from "@/lib/cn";

export type GraphicGround = "surface-0" | "surface-1" | "ink-900" | "transparent";

type GraphicSlotProps = {
  scene: SceneId;
  ground: GraphicGround;
  /** Palette to draw with; defaults from the ground (dark on ink-900). */
  tone?: SceneTone;
  /** `scroll` scrubs with the page (hero only); `time` loops. */
  driver?: "time" | "scroll";
  /** Scene-specific density or layout variant. */
  variant?: "hero" | "card";
  /** Accessible description; omit for decorative renders. */
  label?: string;
  /** Cover the nearest positioned ancestor instead of sizing from className. */
  fill?: boolean;
  className?: string;
};

const groundClass: Record<GraphicGround, string> = {
  "surface-0": "bg-surface-0",
  "surface-1": "bg-surface-1",
  "ink-900": "bg-ink-900",
  transparent: "bg-transparent",
};

/**
 * Where an abstract render sits. Sizing comes from `className` (aspect
 * ratio, radius); the render fills the box. The ground paints on the
 * server, so layout never shifts while the render loads.
 */
export function GraphicSlot({
  scene,
  ground,
  tone,
  driver = "time",
  variant = "card",
  label,
  fill,
  className,
}: GraphicSlotProps) {
  const resolvedTone: SceneTone = tone ?? (ground === "ink-900" ? "dark" : "light");
  return (
    <div
      data-scene={scene}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(fill ? "absolute inset-0" : "relative", "overflow-hidden", groundClass[ground], className)}
    >
      <SceneCanvas scene={scene} tone={resolvedTone} driver={driver} variant={variant} />
    </div>
  );
}
