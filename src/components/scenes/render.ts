import type { ActorState } from "./actors";

/** Figure props for an actor's final state. */
export function actorProps(state: ActorState) {
  return {
    x: state.x,
    y: state.y,
    facing: state.facing,
    pose: state.pose,
    style: state.opacity < 1 ? { opacity: state.opacity } : undefined,
  };
}

/** Cast index for a lender, fixed by id so re-sorting never changes who they look like. */
export function lenderIndex(id: string): number {
  return "abcdef".indexOf(id) + 1;
}

/** How far past the stage the ground line runs, so it reaches the edges of its box. */
export const GROUND_BLEED = 600;
