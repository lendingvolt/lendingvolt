import type { ReactNode } from "react";
import { Stage, type StageTone } from "@/components/figures/stage";
import { cn } from "@/lib/cn";
import { PlaybackFrame } from "./playback-frame";
import type { TimelineId } from "./timelines";

/** Figures render at most 1.3px per unit: 62px tall on desktop. */
const MAX_SCALE = 1.3;

type SceneFrameProps = {
  timelineId: TimelineId;
  /** Stage size in units. */
  width: number;
  height: number;
  tone: StageTone;
  /** One sentence describing the final pose, for screen readers. */
  label: string;
  /** Scenes on the dark hero and closing bands wait for the page to turn dark. */
  band?: "dark";
  /** Box classes: the fixed aspect ratio, radius and fill. */
  className?: string;
  children: ReactNode;
};

/**
 * A scene in a fixed aspect-ratio box. The stage is centred and never
 * scaled past 1.3px per unit; its ground line bleeds to the box edges.
 */
export function SceneFrame({ timelineId, width, height, tone, label, band, className, children }: SceneFrameProps) {
  return (
    <PlaybackFrame
      timelineId={timelineId}
      band={band}
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
    >
      <Stage
        width={width}
        height={height}
        tone={tone}
        label={label}
        className="max-h-full"
        style={{ maxWidth: width * MAX_SCALE }}
      >
        {children}
      </Stage>
    </PlaybackFrame>
  );
}
