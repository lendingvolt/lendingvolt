import {
  activeSide,
  handPoint,
  limbAngles,
  partTransform,
  toPoseSet,
  type Facing,
  type LimbAngles,
  type PoseName,
  type PoseSet,
  type Side,
} from "@/components/figures/pose";
import { GESTURE, GESTURE_MS, LINEAR, type Timeline } from "./timeline";

/** Walking pace in stage units per second: about 75px/s at the 1.3px desktop scale. */
export const WALK_SPEED = 58;

/** 480ms per full cycle; samples fall on each quarter. */
const QUARTER_CYCLE = 120;
const LEG_SWING = 20;
const ARM_SWING = 15;
const BOB = 1;

const SIDES: readonly Side[] = ["L", "R"];

export type ActorState = { x: number; y: number; facing: Facing; pose: PoseSet; opacity: number };

type ActorInit = {
  x: number;
  y: number;
  facing: Facing;
  pose?: PoseName | PoseSet;
  opacity?: number;
  /** Which leg leads; alternate it across a crowd so nobody steps in unison. */
  lead?: 1 | -1;
};

const selectorFor = (id: string) => `[data-anim="${id}"]`;

/**
 * Scripts one `<Figure animId={id}>`. Every call is in stage units and
 * milliseconds and returns when the move ends, so calls can be chained.
 * `state()` is the pose to render, which is where every track ends.
 */
export function createActor(tl: Timeline, id: string, init: ActorInit) {
  const root = selectorFor(id);
  const part = (name: string) => `${root} [data-part="${name}"]`;
  let { x, y, facing } = init;
  let angles: LimbAngles = limbAngles(facing, init.pose ?? "stand");
  let opacity = init.opacity ?? 1;
  const lead = init.lead ?? 1;

  tl.start(root, "transform", partTransform.root(x, y));
  tl.start(root, "opacity", String(opacity));
  tl.start(part("bob"), "transform", partTransform.bob(0));
  tl.start(part("head"), "transform", partTransform.head(angles.tilt));
  tl.start(part("eyes"), "transform", partTransform.eyes(facing));
  for (const side of SIDES) {
    const lift = side === "L" ? angles.liftL : angles.liftR;
    tl.start(part(`leg${side}`), "transform", partTransform.leg(0));
    tl.start(part(`arm${side}`), "transform", partTransform.arm(side, lift));
    tl.start(part(`grip${side}`), "transform", partTransform.grip(side, lift));
  }

  const liftOf = (side: Side) => (side === "L" ? angles.liftL : angles.liftR);

  const actor = {
    /** Walk in a straight line with the walk cycle; held arms stay still. */
    walkTo(to: { x: number; y?: number }, at: number, speed = WALK_SPEED): number {
      const target = { x: to.x, y: to.y ?? y };
      const dur = (Math.hypot(target.x - x, target.y - y) / speed) * 1000;
      if (dur < 1) return at;
      const end = at + dur;
      tl.to(root, "transform", partTransform.root(target.x, target.y), at, dur, LINEAR);

      const legL = [];
      const legR = [];
      const armL = [];
      const armR = [];
      const bob = [];
      for (let quarter = 1; at + quarter * QUARTER_CYCLE < end - QUARTER_CYCLE / 2; quarter++) {
        const t = at + quarter * QUARTER_CYCLE;
        if (quarter % 2 === 1) {
          const sign = (((quarter - 1) / 2) % 2 === 0 ? 1 : -1) * lead;
          legL.push({ t, value: partTransform.leg(LEG_SWING * sign) });
          legR.push({ t, value: partTransform.leg(-LEG_SWING * sign) });
          armL.push({ t, value: `rotate(${-ARM_SWING * sign}deg)` });
          armR.push({ t, value: `rotate(${ARM_SWING * sign}deg)` });
          bob.push({ t, value: partTransform.bob(BOB) });
        } else {
          bob.push({ t, value: partTransform.bob(-BOB) });
        }
      }
      const rest = { t: end, value: partTransform.leg(0) };
      tl.path(part("legL"), "transform", at, [...legL, rest]);
      tl.path(part("legR"), "transform", at, [...legR, rest]);
      tl.path(part("bob"), "transform", at, [...bob, { t: end, value: partTransform.bob(0) }]);
      if (angles.liftL === 0) tl.path(part("armL"), "transform", at, [...armL, { t: end, value: "rotate(0deg)" }]);
      if (angles.liftR === 0) tl.path(part("armR"), "transform", at, [...armR, { t: end, value: "rotate(0deg)" }]);

      x = target.x;
      y = target.y;
      return end;
    },

    /** Change to a pose, relative to the current facing. */
    pose(next: PoseName | PoseSet, at: number, dur = GESTURE_MS): number {
      const target = limbAngles(facing, next);
      for (const side of SIDES) {
        const lift = side === "L" ? target.liftL : target.liftR;
        if (lift === liftOf(side)) continue;
        tl.to(part(`arm${side}`), "transform", partTransform.arm(side, lift), at, dur, GESTURE);
        tl.to(part(`grip${side}`), "transform", partTransform.grip(side, lift), at, dur, GESTURE);
      }
      if (target.tilt !== angles.tilt) tl.to(part("head"), "transform", partTransform.head(target.tilt), at, dur, GESTURE);
      angles = target;
      return at + dur;
    },

    /** Turn to face another way. Only the eyes move; pose angles are kept. */
    face(next: Facing, at: number, dur = 160): number {
      if (next === facing) return at;
      tl.to(part("eyes"), "transform", partTransform.eyes(next), at, dur, GESTURE);
      facing = next;
      return at + dur;
    },

    fade(to: number, at: number, dur = 250): number {
      tl.to(root, "opacity", String(to), at, dur, LINEAR);
      opacity = to;
      return at + dur;
    },

    /** Where a hand is right now in the script, in stage units. */
    hand(side: Side = activeSide(facing)) {
      return handPoint(x, y, side, liftOf(side));
    },

    state(): ActorState {
      return { x, y, facing, pose: toPoseSet(facing, angles), opacity };
    },
  };
  return actor;
}

export type Actor = ReturnType<typeof createActor>;

export type PropState = { x: number; y: number; sx: number; sy: number; opacity: number };

/** The transform for an animated prop wrapper; scale is about the prop's bottom centre. */
export function propTransform(state: Pick<PropState, "x" | "y" | "sx" | "sy">): string {
  return `translate(${state.x}px, ${state.y}px) scale(${state.sx}, ${state.sy})`;
}

type PropTarget = { x?: number; y?: number; scale?: number; sx?: number; sy?: number };

/** Scripts a free-standing prop wrapper (`<Anim id>`): position, scale and opacity. */
export function createProp(tl: Timeline, id: string, init: PropTarget & { opacity?: number }) {
  const root = selectorFor(id);
  let state: PropState = {
    x: init.x ?? 0,
    y: init.y ?? 0,
    sx: init.sx ?? init.scale ?? 1,
    sy: init.sy ?? init.scale ?? 1,
    opacity: init.opacity ?? 1,
  };
  tl.start(root, "transform", propTransform(state));
  tl.start(root, "opacity", String(state.opacity));

  return {
    moveTo(to: PropTarget, at: number, dur: number, easing = GESTURE): number {
      state = {
        ...state,
        x: to.x ?? state.x,
        y: to.y ?? state.y,
        sx: to.sx ?? to.scale ?? state.sx,
        sy: to.sy ?? to.scale ?? state.sy,
      };
      tl.to(root, "transform", propTransform(state), at, dur, easing);
      return at + dur;
    },
    fade(to: number, at: number, dur = 200): number {
      tl.to(root, "opacity", String(to), at, dur, LINEAR);
      state = { ...state, opacity: to };
      return at + dur;
    },
    state: (): PropState => state,
  };
}

/** Fades any element by selector: a held prop, a placard's flag, a pulse. */
export function createFader(tl: Timeline, selector: string, initial: number) {
  let value = initial;
  tl.start(selector, "opacity", String(initial));
  return {
    to(next: number, at: number, dur = 200): number {
      tl.to(selector, "opacity", String(next), at, dur, LINEAR);
      value = next;
      return at + dur;
    },
    value: () => value,
  };
}

/** Sends the current pulse once along a `<Current>` wrapped in `<g data-anim={id}>`. */
export function sendCurrent(tl: Timeline, id: string, length: number, at: number, dur: number, pulse = 20) {
  const selector = `${selectorFor(id)} [data-part="pulse"]`;
  const travel = Math.max(0, length - pulse);
  tl.start(selector, "transform", "translateX(0px)");
  tl.start(selector, "opacity", "0");
  tl.path(selector, "transform", at, [{ t: at + dur, value: `translateX(${travel}px)` }]);
  tl.path(selector, "opacity", at, [
    { t: at + dur * 0.06, value: "1" },
    { t: at + dur * 0.94, value: "1" },
    { t: at + dur, value: "0" },
  ]);
  return at + dur;
}

export { GESTURE, LINEAR };
