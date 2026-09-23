import type { PoseSet } from "@/components/figures/pose";
import type { ActorState, PropState } from "../actors";
import type { CompiledTimeline } from "../timeline";

/** A small prop held low, beside the body rather than over it. */
export const LOWERED: PoseSet = { active: 30, other: 0, head: 0 };
export const LOWERED_LOOK: PoseSet = { active: 30, other: 0, head: 6 };
/** Carrying something in front, arm half out. */
export const CARRY: PoseSet = { active: 60, other: 0, head: 0 };
export const LOOK_WHILE_HANDING: PoseSet = { active: 75, other: 0, head: 6 };

/** What every scene script returns: its stage, its timeline, and where everything ends. */
export type SceneScript<Final> = {
  width: number;
  height: number;
  ground: number;
  timeline: CompiledTimeline;
  final: Final;
};

export type { ActorState, PropState };
