import { BRICK_PITCH, slotPoint } from "@/components/figures/metrics";
import { handPoint } from "@/components/figures/pose";
import { createActor, createProp, LINEAR, type ActorState, type PropState } from "../actors";
import { createTimeline } from "../timeline";
import { CARRY, LOWERED, LOWERED_LOOK, type SceneScript } from "./shared";

// ---- Debt consolidation ---------------------------------------------------

const C1 = { width: 206, height: 86, ground: 80, lenderX: 112, arriveX: 32, meetX: 60, endX: 140 };
const DUE_DATES = ["3rd", "12th", "19th", "28th"] as const;
/** Uneven stacking: each box sits a little off the one below. */
const STACK_OFFSETS = [-3, 3, -2, 4] as const;
const SMALL_BOX = { width: 32, height: 12 } as const;
const BIG_BOX = { width: 40, height: 22 } as const;
/** Carried boxes sit forward of the hand and below it, clear of the head. */
const CARRY_OFFSET = { stack: { x: 8, y: 0 }, box: { x: 12, y: 6 } } as const;

export type ConsolidateFinal = {
  borrower: ActorState;
  lender: ActorState;
  boxes: { animId: string; label: string; state: PropState }[];
  bigBox: PropState;
  tag: PropState;
  sizes: { small: typeof SMALL_BOX; big: typeof BIG_BOX };
};

export function consolidateScript(): SceneScript<ConsolidateFinal> {
  const G = C1.ground;
  const tl = createTimeline();

  const lender = createActor(tl, "c1-lender", { x: C1.lenderX, y: G, facing: "left", pose: "hold-up" });
  const borrower = createActor(tl, "c1-borrower", { x: 10, y: G, facing: "right", pose: CARRY, opacity: 0 });
  const bigBox = createProp(tl, "c1-big-box", lender.hand());
  const intoBox = { x: lender.hand().x, y: lender.hand().y - 14 };

  const stackAt = (x: number, k: number) => {
    const hand = handPoint(x, G, "R", CARRY.active);
    return { x: hand.x + CARRY_OFFSET.stack.x + STACK_OFFSETS[k], y: hand.y - SMALL_BOX.height * k };
  };
  const boxes = DUE_DATES.map((label, k) => ({
    animId: `c1-box-${k}`,
    label,
    prop: createProp(tl, `c1-box-${k}`, { ...stackAt(10, k), opacity: 0 }),
  }));

  // The borrower walks in with four boxes, each due on a different day.
  borrower.fade(1, 0, 200);
  boxes.forEach(({ prop }) => prop.fade(1, 0, 200));
  const arrived = borrower.walkTo({ x: C1.arriveX }, 0);
  boxes.forEach(({ prop }, k) => prop.moveTo(stackAt(C1.arriveX, k), 0, arrived, LINEAR));

  // They drop, top first, into the lender's one larger box.
  [...boxes].reverse().forEach(({ prop }, j) => {
    const at = arrived + 20 + j * 120;
    prop.moveTo({ ...intoBox, scale: 0.4 }, at, 380);
    prop.fade(0, at + 230, 150);
  });

  // The lender hands it over, the box held between them, clear of both heads.
  lender.pose("hand-over", 1150);
  const lenderHand = lender.hand();
  const met = borrower.walkTo({ x: C1.meetX }, 1150);
  borrower.pose("hand-over", met + 5);
  const borrowerHand = borrower.hand();
  bigBox.moveTo({ x: (lenderHand.x + borrowerHand.x) / 2, y: lenderHand.y }, 1150, 400);
  lender.pose("stand", 2050);

  // The borrower walks on carrying one box.
  const carried = (x: number) => {
    const hand = handPoint(x, G, "R", CARRY.active);
    return { x: hand.x + CARRY_OFFSET.box.x, y: hand.y + CARRY_OFFSET.box.y };
  };
  borrower.pose(CARRY, 2050, 300);
  bigBox.moveTo(carried(C1.meetX), 2050, 300);
  const walkedOn = borrower.walkTo({ x: C1.endX }, 2350, 62);
  bigBox.moveTo(carried(C1.endX), 2350, walkedOn - 2350, LINEAR);
  const tag = createProp(tl, "c1-tag", { x: C1.endX, y: G - 52, opacity: 0 });
  tag.fade(1, walkedOn - 100, 250);

  return {
    width: C1.width,
    height: C1.height,
    ground: G,
    timeline: tl.compile(),
    final: {
      borrower: borrower.state(),
      lender: lender.state(),
      boxes: boxes.map(({ animId, label, prop }) => ({ animId, label, state: prop.state() })),
      bigBox: bigBox.state(),
      tag: tag.state(),
      sizes: { small: SMALL_BOX, big: BIG_BOX },
    },
  };
}

// ---- Home renovation ------------------------------------------------------

const C2 = { width: 210, height: 60, ground: 54, borrowerX: 22, leftWorkerX: 66, rightWorkerX: 190, wallX: 94 };
const WALL = { columns: 6, courses: 8, pitch: 13 } as const;

export type RenovateFinal = {
  borrower: ActorState;
  workers: { animId: string; state: ActorState }[];
  bricks: { animId: string; state: PropState }[];
};

export function renovateScript(): SceneScript<RenovateFinal> {
  const G = C2.ground;
  const tl = createTimeline();

  const borrower = createActor(tl, "c2-borrower", { x: C2.borrowerX, y: G, facing: "right", pose: LOWERED });
  const left = createActor(tl, "c2-worker-l", { x: C2.leftWorkerX, y: G, facing: "right" });
  const right = createActor(tl, "c2-worker-r", { x: C2.rightWorkerX, y: G, facing: "left", lead: -1 });
  left.pose("hand-over", 0, 300);
  right.pose("hand-over", 0, 300);

  const bricks = [];
  let done = 0;
  for (let course = 0; course < WALL.courses; course++) {
    for (let column = 0; column < WALL.columns; column++) {
      const animId = `c2-brick-${course}-${column}`;
      const x = C2.wallX + WALL.pitch * column + (course % 2 === 1 ? 6 : 0);
      const y = G - BRICK_PITCH * course;
      // Each worker lays their half from the outside in.
      const reach = column < WALL.columns / 2 ? column : WALL.columns - 1 - column;
      const at = 250 + course * 190 + reach * 35;
      const brick = createProp(tl, animId, { x, y: y - 8, opacity: 0 });
      brick.fade(1, at, 100);
      done = Math.max(done, brick.moveTo({ y }, at, 160));
      bricks.push({ animId, brick });
    }
  }

  left.pose("stand", done + 100);
  right.pose("stand", done + 100);
  borrower.pose(LOWERED_LOOK, done + 200);

  return {
    width: C2.width,
    height: C2.height,
    ground: G,
    timeline: tl.compile(),
    final: {
      borrower: borrower.state(),
      workers: [
        { animId: "c2-worker-l", state: left.state() },
        { animId: "c2-worker-r", state: right.state() },
      ],
      bricks: bricks.map(({ animId, brick }) => ({ animId, state: brick.state() })),
    },
  };
}

// ---- Business cash flow ---------------------------------------------------

/**
 * Two-line platform labels keep the stage narrow enough for 48px figures in
 * a square card. The invoice platform runs past the stage edge so the lender
 * is on it from the moment he fades in.
 */
const C3 = {
  width: 196,
  height: 90,
  ground: 84,
  platformHeight: 30,
  left: { x: 34, width: 64, label: "Payroll", sublabel: "Friday" },
  right: { x: 160, width: 124, label: "Invoice paid", sublabel: "30 days" },
  shopkeeperFrom: 52,
  shopkeeperTo: 116,
  lenderX: 150,
  plank: { x: 82, width: 56 },
};

export type CashFlowFinal = {
  shopkeeper: ActorState;
  lender: ActorState;
  plank: PropState;
  layout: typeof C3;
};

export function cashFlowScript(): SceneScript<CashFlowFinal> {
  const G = C3.ground;
  const top = G - C3.platformHeight;
  const tl = createTimeline();

  const shopkeeper = createActor(tl, "c3-shopkeeper", { x: C3.shopkeeperFrom, y: top, facing: "right" });
  const lender = createActor(tl, "c3-lender", { x: C3.lenderX + 74, y: top, facing: "left", pose: LOWERED, opacity: 0 });
  const plank = createProp(tl, "c3-plank", { ...lender.hand(), opacity: 0 });

  // A lender walks in along the invoice side with a plank.
  lender.fade(1, 0);
  plank.fade(1, 0, 250);
  const arrived = lender.walkTo({ x: C3.lenderX }, 0);
  plank.moveTo(lender.hand(), 0, arrived, LINEAR);

  // He lays it across the gap.
  lender.pose("hand-over", arrived + 20);
  plank.moveTo({ x: C3.plank.x, y: top + 4 }, arrived + 20, 400);
  lender.pose("stand", arrived + 470);

  // The shopkeeper walks over from payroll to the invoice side.
  shopkeeper.walkTo({ x: C3.shopkeeperTo }, arrived + 620);

  return {
    width: C3.width,
    height: C3.height,
    ground: G,
    timeline: tl.compile(),
    final: { shopkeeper: shopkeeper.state(), lender: lender.state(), plank: plank.state(), layout: C3 },
  };
}

// ---- Life events ----------------------------------------------------------

const BLOCK = 7;
const C4 = { width: 210, height: 58, ground: 54, blockX: 30, pickerX: 70, placerX: 94, slotsX: 110, block: BLOCK };
const MONTHS = 24;
const SLOT_COLUMNS = 12;
const PILE_COLUMNS = 6;
/** Left edge of the split pile, centred under the 56-unit lump sum. */
const PILE_X = 10;

export type LifeEventFinal = {
  couple: { animId: string; state: ActorState }[];
  lumpSum: PropState;
  months: { animId: string; state: PropState; isHighlighted: boolean }[];
  tag: PropState;
  layout: typeof C4;
  slots: { count: number; columns: number };
};

export function lifeEventScript(): SceneScript<LifeEventFinal> {
  const G = C4.ground;
  const tl = createTimeline();

  const picker = createActor(tl, "c4-picker", { x: C4.pickerX, y: G, facing: "left" });
  const placer = createActor(tl, "c4-placer", { x: C4.placerX, y: G, facing: "right", lead: -1 });
  const lumpSum = createProp(tl, "c4-lump-sum", { x: C4.blockX, y: G });

  // The S$15,000 block splits into 24 monthly blocks.
  lumpSum.fade(0, 250, 200);
  const pile = (i: number) => ({
    x: PILE_X + (i % PILE_COLUMNS) * (BLOCK + 1),
    y: G - Math.floor(i / PILE_COLUMNS) * (BLOCK + 1),
  });
  const slot = (s: number) => {
    const point = slotPoint(s, SLOT_COLUMNS, BLOCK);
    return { x: C4.slotsX + point.x, y: G + point.y };
  };

  picker.pose("hand-over", 450);
  placer.pose("hand-over", 450);
  const pickHand = picker.hand();
  const placeHand = placer.hand();

  let done = 0;
  const months = Array.from({ length: MONTHS }, (_, s) => {
    const animId = `c4-month-${s}`;
    const from = pile(MONTHS - 1 - s);
    const month = createProp(tl, animId, { ...from, opacity: 0 });
    month.fade(1, 250 + s * 8, 200);
    if (s < 3) {
      // The first three are carried hand to hand, at walking pace.
      const at = 900 + s * 450;
      const picked = month.moveTo({ x: pickHand.x, y: pickHand.y }, at, 250);
      const passed = month.moveTo({ x: placeHand.x, y: placeHand.y }, picked, 250);
      done = Math.max(done, month.moveTo(slot(s), passed, 250));
    } else {
      // The rest fill quickly.
      done = Math.max(done, month.moveTo(slot(s), 2250 + (s - 3) * 50, 300));
    }
    return { animId, month, isHighlighted: s === 0 };
  });

  const tag = createProp(tl, "c4-tag", { x: C4.slotsX + (SLOT_COLUMNS * (BLOCK + 1)) / 2, y: G - 26, opacity: 0 });
  tag.fade(1, done - 100, 250);
  picker.pose("stand", done);
  placer.pose("stand", done);

  return {
    width: C4.width,
    height: C4.height,
    ground: G,
    timeline: tl.compile(),
    final: {
      couple: [
        { animId: "c4-picker", state: picker.state() },
        { animId: "c4-placer", state: placer.state() },
      ],
      lumpSum: lumpSum.state(),
      months: months.map(({ animId, month, isHighlighted }) => ({ animId, state: month.state(), isHighlighted })),
      tag: tag.state(),
      layout: C4,
      slots: { count: MONTHS, columns: SLOT_COLUMNS },
    },
  };
}
