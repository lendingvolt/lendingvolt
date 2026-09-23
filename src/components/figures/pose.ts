/**
 * Figure geometry and pose maths, shared by the `<Figure>` component and by
 * scene timelines so a rendered pose and an animated one always agree.
 */

/** Base canvas, in units. Feet stand at the bottom centre. */
export const FIGURE_WIDTH = 24;
export const FIGURE_HEIGHT = 48;

export type Facing = "left" | "front" | "right";
export type Side = "L" | "R";

export type PoseName = "stand" | "hold-up" | "hand-over" | "look" | "point";

/**
 * A pose is a transform set, not a drawing. `active` and `other` lift the
 * arm on the facing side and the opposite arm (0 hangs, 90 is level, 180 is
 * straight up); `head` tilts toward the facing side, in degrees.
 */
export type PoseSet = { active: number; other: number; head: number };

export const POSES: Record<PoseName, PoseSet> = {
  stand: { active: 0, other: 0, head: 0 },
  "hold-up": { active: 150, other: 0, head: 0 },
  "hand-over": { active: 75, other: 0, head: 0 },
  look: { active: 0, other: 0, head: 6 },
  point: { active: 100, other: 0, head: 0 },
};

/** The same pose with absolute angles: each arm's lift and the head's clockwise tilt. */
export type LimbAngles = { liftL: number; liftR: number; tilt: number };

export const SHOULDER: Record<Side, { x: number; y: number }> = {
  L: { x: 2, y: 20 },
  R: { x: 22, y: 20 },
};

/** Distance from shoulder pivot to where the hand grips a prop. */
export const HAND_DROP = 12;

/** How far the eyes shift toward the facing side. */
const EYE_SHIFT = 2;

export function activeSide(facing: Facing): Side {
  return facing === "left" ? "L" : "R";
}

export function resolvePose(pose: PoseName | PoseSet): PoseSet {
  return typeof pose === "string" ? POSES[pose] : pose;
}

export function limbAngles(facing: Facing, pose: PoseName | PoseSet): LimbAngles {
  const set = resolvePose(pose);
  const isLeft = activeSide(facing) === "L";
  return {
    liftL: isLeft ? set.active : set.other,
    liftR: isLeft ? set.other : set.active,
    tilt: (isLeft ? -1 : 1) * set.head,
  };
}

export function toPoseSet(facing: Facing, angles: LimbAngles): PoseSet {
  const isLeft = activeSide(facing) === "L";
  return {
    active: isLeft ? angles.liftL : angles.liftR,
    other: isLeft ? angles.liftR : angles.liftL,
    head: (isLeft ? -1 : 1) * angles.tilt,
  };
}

/** CSS rotation of an arm group: outward is clockwise on the left, anticlockwise on the right. */
export function armRotation(side: Side, lift: number): number {
  return side === "L" ? lift : -lift;
}

/** The CSS transform strings for every moving part, in a fixed format so they interpolate. */
export const partTransform = {
  root: (x: number, y: number) => `translate(${x - FIGURE_WIDTH / 2}px, ${y - FIGURE_HEIGHT}px)`,
  arm: (side: Side, lift: number) => `rotate(${armRotation(side, lift)}deg)`,
  grip: (side: Side, lift: number) => {
    const shoulder = SHOULDER[side];
    return `translate(${shoulder.x}px, ${shoulder.y + HAND_DROP}px) rotate(${-armRotation(side, lift)}deg)`;
  },
  head: (tilt: number) => `rotate(${tilt}deg)`,
  eyes: (facing: Facing) =>
    `translateX(${facing === "left" ? -EYE_SHIFT : facing === "right" ? EYE_SHIFT : 0}px)`,
  leg: (angle: number) => `rotate(${angle}deg)`,
  bob: (dy: number) => `translateY(${dy}px)`,
};

/** Where a figure standing at (x, y) grips a prop in the given hand, in stage units. */
export function handPoint(x: number, y: number, side: Side, lift: number): { x: number; y: number } {
  const shoulder = SHOULDER[side];
  const radians = (armRotation(side, lift) * Math.PI) / 180;
  return {
    x: x - FIGURE_WIDTH / 2 + shoulder.x - HAND_DROP * Math.sin(radians),
    y: y - FIGURE_HEIGHT + shoulder.y + HAND_DROP * Math.cos(radians),
  };
}
