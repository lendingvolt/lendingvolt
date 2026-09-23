import { BRICK_PITCH, DRAWER_TRAVEL } from "@/components/figures/metrics";
import { createActor, createFader, createProp, sendCurrent, LINEAR, type ActorState, type PropState } from "../actors";
import { interestBricks, sceneOffers, type SceneOfferId } from "../numbers";
import { createTimeline } from "../timeline";
import { LOOK_WHILE_HANDING, LOWERED, type SceneScript } from "./shared";

// ---- 1. One application, every lender -----------------------------------

const V1 = {
  height: 84,
  ground: 78,
  borrowerX: 20,
  deskX: 56,
  trayX: 50,
  firstDesk: 140,
  deskPitch: 46,
  lenderDeskWidth: 20,
};
/** Lenders step from behind their desk to the gap in front of it, clear of both neighbouring desks. */
const V1_STEP = 23;
/** Six lenders where the cell is wide enough to read their placards, four where it is not. */
const V1_LENDERS: Record<SceneVariant, SceneOfferId[]> = {
  wide: ["a", "b", "c", "d", "e", "f"],
  narrow: ["a", "b", "c", "d"],
};

export type SceneVariant = "wide" | "narrow";

export type OneApplicationFinal = {
  borrower: ActorState;
  handCardOpacity: number;
  trayCard: PropState;
  desks: number[];
  lenders: { id: SceneOfferId; animId: string; state: ActorState }[];
  wire: { from: { x: number; y: number }; to: { x: number; y: number }; opacity: number };
  layout: typeof V1;
};

export function oneApplicationScript(variant: SceneVariant = "wide"): SceneScript<OneApplicationFinal> {
  const { ground: G } = V1;
  const ids = V1_LENDERS[variant];
  const width = V1.firstDesk + V1.deskPitch * (ids.length - 1) + V1.lenderDeskWidth;
  const tl = createTimeline();

  const borrower = createActor(tl, "v1-borrower", { x: V1.borrowerX, y: G, facing: "right", pose: LOWERED });
  const handCard = createFader(tl, '[data-anim="v1-hand-card"]', 1);
  borrower.pose("hand-over", 0);
  const hand = borrower.hand();
  const trayCard = createProp(tl, "v1-tray-card", { x: hand.x, y: hand.y, opacity: 0 });
  handCard.to(0, 350, 150);
  trayCard.fade(1, 350, 120);
  trayCard.moveTo({ x: V1.trayX, y: G - 21 }, 350, 350);
  borrower.pose("stand", 650);

  const wire = { from: { x: V1.trayX + 10, y: G - 24 }, to: { x: width, y: G - 24 } };
  const length = wire.to.x - wire.from.x;
  const CURRENT_AT = 700;
  const CURRENT_MS = 600;
  const wireFade = createFader(tl, '[data-anim="v1-current"]', 0);
  wireFade.to(1, CURRENT_AT - 100, 100);
  const pulsed = sendCurrent(tl, "v1-current", length, CURRENT_AT, CURRENT_MS);
  wireFade.to(0, pulsed, 300);

  const desks = ids.map((_, i) => V1.firstDesk + V1.deskPitch * i);
  const lenders = ids.map((id, i) => {
    const animId = `v1-lender-${id}`;
    const actor = createActor(tl, animId, { x: desks[i], y: G, facing: "left", lead: i % 2 === 0 ? 1 : -1 });
    const reached = CURRENT_AT + ((desks[i] - wire.from.x) / length) * CURRENT_MS;
    actor.pose("hold-up", reached);
    createFader(tl, `[data-anim="${animId}"] [data-part="gripL"]`, 0).to(1, reached + 120, 200);
    actor.walkTo({ x: desks[i] - V1_STEP }, reached + 400);
    return { id, animId, actor };
  });

  return {
    width,
    height: V1.height,
    ground: G,
    timeline: tl.compile(),
    final: {
      borrower: borrower.state(),
      handCardOpacity: handCard.value(),
      trayCard: trayCard.state(),
      desks,
      lenders: lenders.map(({ id, animId, actor }) => ({ id, animId, state: actor.state() })),
      wire: { ...wire, opacity: wireFade.value() },
      layout: V1,
    },
  };
}

// ---- 2. Your credit score stays intact ----------------------------------

const V2 = { width: 180, height: 80, ground: 74, deskX: 26, cabinetX: 66, clerkX: 98, lenderX: 150 };

export type SoftCheckFinal = {
  clerk: ActorState;
  lender: ActorState;
  handFolderOpacity: number;
  drawerFolder: PropState;
  tag: PropState;
  drawerOpen: boolean;
  layout: typeof V2;
};

/**
 * The folder goes back and the drawer closes; the folder is taller than
 * the drawer, so its unmarked tab, the scene's highlight, still shows above
 * the cabinet in the final pose.
 */
export function softCheckScript(): SceneScript<SoftCheckFinal> {
  const { ground: G } = V2;
  const tl = createTimeline();

  const clerk = createActor(tl, "v2-clerk", { x: V2.clerkX, y: G, facing: "right" });
  const lender = createActor(tl, "v2-lender", { x: V2.lenderX + 46, y: G, facing: "left", pose: LOWERED, opacity: 0 });
  const handFolder = createFader(tl, '[data-anim="v2-hand-folder"]', 0);
  const drawer = '[data-anim="v2-cabinet"] [data-part="drawer0"]';
  const drawerFolder = createProp(tl, "v2-drawer-folder", { x: V2.cabinetX + DRAWER_TRAVEL, y: G - 36, opacity: 0 });
  const tag = createProp(tl, "v2-tag", { x: 110, y: G - 50, opacity: 0 });

  lender.fade(1, 0);
  lender.walkTo({ x: V2.lenderX }, 0);

  tl.start(drawer, "transform", "translateX(0px)");
  tl.to(drawer, "transform", `translateX(${DRAWER_TRAVEL}px)`, 300, 400);
  clerk.pose({ active: 0, other: 40, head: 0 }, 250);
  clerk.pose("hand-over", 700);
  handFolder.to(1, 820, 200);

  lender.pose(LOOK_WHILE_HANDING, 1100);

  lender.pose(LOWERED, 2400);
  clerk.pose("stand", 2400);
  handFolder.to(0, 2400, 200);
  drawerFolder.fade(1, 2500, 150);
  drawerFolder.moveTo({ y: G - 35 }, 2500, 350);
  const CLOSE_AT = 2900;
  tl.to(drawer, "transform", "translateX(0px)", CLOSE_AT, 400);
  drawerFolder.moveTo({ x: V2.cabinetX }, CLOSE_AT, 400);
  clerk.pose({ active: 0, other: 40, head: 0 }, CLOSE_AT - 50);
  clerk.pose("stand", CLOSE_AT + 400);
  tag.fade(1, CLOSE_AT + 400, 300);

  return {
    width: V2.width,
    height: V2.height,
    ground: G,
    timeline: tl.compile(),
    final: {
      clerk: clerk.state(),
      lender: lender.state(),
      handFolderOpacity: handFolder.value(),
      drawerFolder: drawerFolder.state(),
      tag: tag.state(),
      drawerOpen: false,
      layout: V2,
    },
  };
}

// ---- 3. The real cost, shown plainly ------------------------------------

const V3 = { width: 240, height: 110, ground: 84, baseWidth: 56, baseHeight: 16, borrowerStop: 160 };
/** Left to right the borrower passes the dearest first and stops at the cheapest. */
const V3_STACKS: { id: SceneOfferId; x: number }[] = [
  { id: "c", x: 40 },
  { id: "b", x: 120 },
  { id: "a", x: 200 },
];
const BRICK_MS = 110;

export type TrueCostStack = {
  id: SceneOfferId;
  x: number;
  lender: { animId: string; state: ActorState };
  bricks: { animId: string; state: PropState }[];
  tag: { animId: string; state: PropState; text: string };
};

export type TrueCostFinal = { borrower: ActorState; stacks: TrueCostStack[]; layout: typeof V3 };

export function trueCostScript(): SceneScript<TrueCostFinal> {
  const { ground: G } = V3;
  const tl = createTimeline();

  const stacks = V3_STACKS.map(({ id, x }, s) => {
    const lenderId = `v3-lender-${id}`;
    const lender = createActor(tl, lenderId, { x: x + 14, y: G, facing: "left" });
    lender.pose("hand-over", 0, 300);
    const count = interestBricks(id);
    const bricks = Array.from({ length: count }, (_, k) => {
      const animId = `v3-brick-${id}-${k}`;
      const y = G - V3.baseHeight - k * BRICK_PITCH;
      const brick = createProp(tl, animId, { x: x - 14, y: y - 10, opacity: 0 });
      const at = 300 + k * BRICK_MS;
      brick.fade(1, at, 120);
      brick.moveTo({ y }, at, 180);
      return { animId, brick };
    });
    const done = 300 + (count - 1) * BRICK_MS + 180;
    lender.pose("stand", done + 100);
    const tag = createProp(tl, `v3-tag-${id}`, { x, y: G + 20, opacity: 0 });
    tag.fade(1, done + 100, 250);
    return { id, x, s, lenderId, lender, bricks, tag };
  });

  const borrower = createActor(tl, "v3-borrower", { x: -24, y: G, facing: "right", opacity: 0 });
  borrower.fade(1, 300);
  const arrived = borrower.walkTo({ x: V3.borrowerStop }, 300);
  borrower.pose("look", arrived + 30);

  return {
    width: V3.width,
    height: V3.height,
    ground: G,
    timeline: tl.compile(),
    final: {
      borrower: borrower.state(),
      stacks: stacks.map(({ id, x, lenderId, lender, bricks, tag }) => ({
        id,
        x,
        lender: { animId: lenderId, state: lender.state() },
        bricks: bricks.map(({ animId, brick }) => ({ animId, state: brick.state() })),
        tag: { animId: `v3-tag-${id}`, state: tag.state(), text: sceneOffers[id].total },
      })),
      layout: V3,
    },
  };
}

// ---- 4. No charge. Either kind. -----------------------------------------

const V4 = { width: 220, height: 138, ground: 132, counterX: 24, borrowerX: 80 };
const RECEIPT_SMALL = 0.3;

export type NoChargeFinal = {
  clerk: ActorState;
  borrower: ActorState;
  receipt: PropState;
  layout: typeof V4;
};

export function noChargeScript(): SceneScript<NoChargeFinal> {
  const { ground: G } = V4;
  const tl = createTimeline();

  const clerk = createActor(tl, "v4-clerk", { x: V4.counterX, y: G, facing: "right" });
  const borrower = createActor(tl, "v4-borrower", { x: V4.borrowerX, y: G, facing: "left" });
  const receipt = createProp(tl, "v4-receipt", { x: V4.counterX + 12, y: G - 20, sx: RECEIPT_SMALL, sy: 0 });

  // The receipt prints up out of the counter.
  receipt.moveTo({ sy: RECEIPT_SMALL }, 0, 600, LINEAR);
  clerk.pose("hand-over", 500);
  receipt.moveTo(clerk.hand(), 600, 400);

  borrower.pose("hand-over", 900);
  receipt.moveTo(borrower.hand(), 1100, 400);
  clerk.pose("stand", 1300);

  // The borrower turns and holds it up to read, full size.
  borrower.face("right", 1550);
  borrower.pose({ active: 150, other: 0, head: 0 }, 1600);
  const readAt = { x: 150, y: G - 40 };
  receipt.moveTo({ ...readAt, scale: 1 }, 1600, 600);
  borrower.pose({ active: 150, other: 0, head: 6 }, 2100);

  return {
    width: V4.width,
    height: V4.height,
    ground: G,
    timeline: tl.compile(),
    final: { clerk: clerk.state(), borrower: borrower.state(), receipt: receipt.state(), layout: V4 },
  };
}

