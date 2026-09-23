"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { useTimelinePlayback } from "./playback";
import type { TimelineId } from "./timelines";

type PlaybackFrameProps = ComponentPropsWithoutRef<"div"> & {
  timelineId: TimelineId;
  /** Wait for the page colour to match this band before playing. */
  band?: "dark";
};

/**
 * A box whose contents play a timeline once when it scrolls into view.
 * Children render their final state; they can be server components.
 */
export function PlaybackFrame({ timelineId, band, className, children, ...props }: PlaybackFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  useTimelinePlayback(ref, timelineId, { band });
  return (
    <div ref={ref} data-scene-pending="" data-band={band} className={cn("scene-frame", className)} {...props}>
      {children}
    </div>
  );
}
