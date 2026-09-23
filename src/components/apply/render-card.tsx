import { GraphicSlot } from "@/components/graphics/graphic-slot";
import type { SceneId } from "@/components/graphics/scene-ids";
import { cn } from "@/lib/cn";

/** A single abstract render on a soft rounded panel, at 3:2. */
export function RenderCard({ scene, tone = "light" }: { scene: SceneId; tone?: "light" | "dark" }) {
  return (
    <GraphicSlot
      scene={scene}
      ground={tone === "dark" ? "ink-900" : "surface-1"}
      className={cn(
        "aspect-[3/2] rounded-lg border",
        tone === "dark" ? "border-[var(--border-dark)]" : "border-line",
      )}
    />
  );
}
