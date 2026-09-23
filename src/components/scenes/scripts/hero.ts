import { createActor, createFader, sendCurrent, type ActorState } from "../actors";
import { byTotal, type SceneOfferId } from "../numbers";
import { createTimeline } from "../timeline";
import { LOWERED, LOWERED_LOOK, type SceneScript } from "./shared";

export type HeroVariant = "desktop" | "mobile";

/** Arrival order: unsorted, but each lender is at most one place from where it belongs. */
const ARRIVAL: Record<HeroVariant, SceneOfferId[]> = {
  desktop: ["b", "a", "c", "d", "e", "f"],
  mobile: ["b", "a", "d", "c"],
};

const GROUND = 96;
const BORROWER_X = 64;
const FRONT_X = 170;
/** A 40-unit placard held 16 units ahead of each lender needs 48 between them. */
const SPACING = 48;
/** Lenders fade in this far behind their place, so all six arrive inside the 0.6–2.4s window. */
const ENTRY = 48;
const STEP_OUT = 8;
const SORT_AT = 2600;
const FLAG_AT = 3800;

export type HeroLender = { id: SceneOfferId; animId: string; state: ActorState; isFront: boolean };

export type HeroFinal = {
  borrower: ActorState;
  /** In drawing order: lenders who step out of the line come last, so they pass in front. */
  lenders: HeroLender[];
  /** The wire only carries the pulse; it is gone once the offers arrive. */
  wire: { from: { x: number; y: number }; to: { x: number; y: number }; opacity: number };
};

/**
 * The offers line up: the borrower raises one application, a current runs
 * out, lenders arrive with their total payable, the queue re-sorts, and the
 * cheapest is flagged at the front.
 */
export function heroScript(variant: HeroVariant): SceneScript<HeroFinal> {
  const arrival = ARRIVAL[variant];
  const sorted = byTotal(arrival);
  const width = FRONT_X + (arrival.length - 1) * SPACING + 18;
  const slotX = (place: number) => FRONT_X + place * SPACING;
  const tl = createTimeline();

  // 0–0.6s: the application goes up and a current runs to the edge.
  const borrower = createActor(tl, "hero-borrower", { x: BORROWER_X, y: GROUND, facing: "right", pose: LOWERED });
  borrower.pose("hold-up", 0);
  const card = borrower.hand();
  const wire = { from: { x: card.x + 8, y: GROUND - 48 }, to: { x: width, y: GROUND - 48 } };
  const wireFade = createFader(tl, '[data-anim="hero-current"]', 0);
  wireFade.to(1, 100, 100);
  const pulsed = sendCurrent(tl, "hero-current", wire.to.x - wire.from.x, 150, 550);
  wireFade.to(0, pulsed, 300);

  // 0.6–2.4s: lenders walk in unsorted, 200ms apart, and stop in a queue.
  const lenders = arrival.map((id, place) => {
    const actor = createActor(tl, `hero-lender-${id}`, {
      x: slotX(place) + ENTRY,
      y: GROUND,
      facing: "left",
      pose: "hold-up",
      opacity: 0,
      lead: place % 2 === 0 ? 1 : -1,
    });
    const at = 600 + 200 * place;
    actor.fade(1, at);
    actor.walkTo({ x: slotX(place) }, at);
    return { id, actor, from: place, to: sorted.indexOf(id) };
  });

  // 2.6–3.8s: the queue re-sorts by total payable.
  for (const lender of lenders) {
    if (lender.to === lender.from) continue;
    const target = slotX(lender.to);
    if (lender.to < lender.from) {
      const out = lender.actor.walkTo({ x: slotX(lender.from) - STEP_OUT, y: GROUND + STEP_OUT }, SORT_AT);
      const across = lender.actor.walkTo({ x: target + STEP_OUT, y: GROUND + STEP_OUT }, out);
      lender.actor.walkTo({ x: target, y: GROUND }, across);
    } else {
      const turned = lender.actor.face("right", SORT_AT);
      const walked = lender.actor.walkTo({ x: target }, turned);
      lender.actor.face("left", walked);
    }
  }

  // 3.8–4.5s: the front placard is flagged; the borrower lowers the card and looks.
  const front = `[data-anim="hero-lender-${sorted[0]}"]`;
  createFader(tl, `${front} [data-part="flag"]`, 0).to(1, FLAG_AT, 300);
  createFader(tl, `${front} [data-part="badge"]`, 0).to(1, FLAG_AT, 300);
  borrower.pose(LOWERED_LOOK, FLAG_AT + 50);

  const rank = (lender: (typeof lenders)[number]) => (lender.to < lender.from ? 2 : lender.to > lender.from ? 1 : 0);
  return {
    width,
    height: 120,
    ground: GROUND,
    timeline: tl.compile(),
    final: {
      borrower: borrower.state(),
      lenders: [...lenders]
        .sort((a, b) => rank(a) - rank(b))
        .map((lender) => ({
          id: lender.id,
          animId: `hero-lender-${lender.id}`,
          state: lender.actor.state(),
          isFront: lender.id === sorted[0],
        })),
      wire: { ...wire, opacity: wireFade.value() },
    },
  };
}
