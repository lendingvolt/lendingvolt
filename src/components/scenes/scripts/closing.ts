import { createActor, type ActorState } from "../actors";
import { createTimeline } from "../timeline";
import type { SceneScript } from "./shared";

const CODA = { width: 176, height: 82, ground: 76, fromX: 36, toX: 123 };

/** A 1.5s coda: the borrower walks off to the right with the chosen offer. */
export function closingScript(): SceneScript<{ borrower: ActorState }> {
  const tl = createTimeline();
  const borrower = createActor(tl, "coda-borrower", { x: CODA.fromX, y: CODA.ground, facing: "right", pose: "hold-up" });
  borrower.walkTo({ x: CODA.toX }, 0);
  return {
    width: CODA.width,
    height: CODA.height,
    ground: CODA.ground,
    timeline: tl.compile(),
    final: { borrower: borrower.state() },
  };
}
