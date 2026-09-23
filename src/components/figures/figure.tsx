import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { castMember, type HairStyle, type Role } from "./cast";
import { rectPath } from "./paths";
import { activeSide, limbAngles, partTransform, type Facing, type PoseName, type PoseSet, type Side } from "./pose";
import { Shaded, Solid } from "./shapes";
import { styles } from "./classes";

export { FIGURE_HEIGHT, FIGURE_WIDTH, POSES } from "./pose";
export type { Facing, PoseName, PoseSet } from "./pose";

/** Offset of each walker's cycle so a crowd never steps in unison. */
const WALK_STAGGER_MS = 120;

type HairShape = { d: string; side: string };

const HAIR: Record<HairStyle, HairShape> = {
  short: {
    d: rectPath(6, 4, 12, 6, [2, 2, 0, 0]),
    side: rectPath(15, 4, 3, 6, [0, 2, 0, 0]),
  },
  bob: {
    d: "M7 4H17A2 2 0 0 1 19 6V16H17V9H7V16H5V6A2 2 0 0 1 7 4Z",
    side: "M16 4H17A2 2 0 0 1 19 6V16H17V9H16Z",
  },
  tied: {
    d: "M9 1H15V4H16A2 2 0 0 1 18 6V10H6V6A2 2 0 0 1 8 4H9Z",
    side: "M15 4H16A2 2 0 0 1 18 6V10H15Z",
  },
};

const HARD_HAT: HairShape = {
  d: "M9 1H15A4 4 0 0 1 19 5V8H20V10H4V8H5V5A4 4 0 0 1 9 1Z",
  side: "M15 1A4 4 0 0 1 19 5V8H20V10H15Z",
};

/** The one role item a figure wears, drawn over the torso. */
function RoleItem({ role }: { role: Role }) {
  switch (role) {
    case "lender":
      return <Solid x={11} y={18} w={2} h={10} side={1} paint="item" />;
    case "clerk":
      return <Shaded d="M8 21H16V26H18V40H6V26H8Z" side="M14 21H16V26H18V40H14Z" paint="item" />;
    case "shopkeeper":
      return <Solid x={5} y={28} w={14} h={12} side={4} paint="item" />;
    default:
      return null;
  }
}

function Arm({ side, lift, held }: { side: Side; lift: number; held?: ReactNode }) {
  return (
    <g
      data-part={`arm${side}`}
      className={cn(side === "L" ? styles.armL : styles.armR, lift === 0 && styles.armFree)}
      style={{ transform: partTransform.arm(side, lift) }}
    >
      <Solid x={side === "L" ? 0 : 20} y={18} w={4} h={14} side={1} paint="top" />
      {held && (
        <g data-part={`grip${side}`} className={styles.grip} style={{ transform: partTransform.grip(side, lift) }}>
          {held}
        </g>
      )}
    </g>
  );
}

export type FigureProps = {
  role: Role;
  /** Position in the scene's cast; picks skin and hair deterministically. */
  index: number;
  /** Where the feet meet the ground, in stage units. */
  x: number;
  y: number;
  facing?: Facing;
  pose?: PoseName | PoseSet;
  /** Plays the walk cycle. Combine with a pose to walk while holding something. */
  walking?: boolean;
  /**
   * A prop in the facing-side hand, drawn upright with its bottom centre at
   * the grip. Props rise from the hand, so the arm must be lifted (about 30°
   * or more); a hanging arm puts the prop over the figure's own body.
   */
  held?: ReactNode;
  /** A prop in the other hand. */
  heldOther?: ReactNode;
  /** Names the figure for a scene timeline, which drives its parts by `data-part`. */
  animId?: string;
  /** Review-page overrides; scenes should leave these to `index`. */
  skin?: string;
  hairStyle?: HairStyle;
  hairTone?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * One block figure: head, torso, two arms, two legs, hair and an optional
 * role item, on a 24 × 48 unit canvas. Pose changes animate on their own;
 * position changes animate if the scene adds a transition via `style`.
 */
export function Figure({
  role,
  index,
  x,
  y,
  facing = "front",
  pose = "stand",
  walking = false,
  held,
  heldOther,
  animId,
  skin,
  hairStyle,
  hairTone,
  className,
  style,
}: FigureProps) {
  const cast = castMember(index);
  const angles = limbAngles(facing, pose);
  const side = activeSide(facing);
  const chosenHair = hairStyle ?? cast.hairStyle;
  const hair = role === "worker" && chosenHair === "tied" ? "short" : chosenHair;

  const vars = {
    "--skin": skin ?? cast.skin,
    "--hair": hairTone ?? cast.hairTone,
    "--walk-delay": `${-(Math.abs(Math.trunc(index)) % 4) * WALK_STAGGER_MS}ms`,
    transform: partTransform.root(x, y),
    ...style,
  } as CSSProperties;

  return (
    <g
      className={cn(styles.figure, walking && styles.walking, className)}
      data-role={role}
      data-anim={animId}
      style={vars}
    >
      <g data-part="bob" className={styles.bob}>
        <g data-part="legL" className={styles.legL}>
          <Solid x={5} y={34} w={6} h={14} side={2} paint="legs" />
        </g>
        <g data-part="legR" className={styles.legR}>
          <Solid x={13} y={34} w={6} h={14} side={2} paint="legs" />
        </g>
        <Solid x={4} y={18} w={16} h={16} side={4} paint="top" />
        <RoleItem role={role} />
        <Arm side="L" lift={angles.liftL} held={side === "L" ? held : heldOther} />
        <Arm side="R" lift={angles.liftR} held={side === "R" ? held : heldOther} />
        <g data-part="head" className={styles.head} style={{ transform: partTransform.head(angles.tilt) }}>
          <Solid x={6} y={6} w={12} h={12} r={2} side={3} paint="skin" />
          <path
            data-part="eyes"
            className={styles.eye}
            d="M8 11h2v2h-2zM14 11h2v2h-2z"
            style={{ transform: partTransform.eyes(facing) }}
          />
          <Shaded {...HAIR[hair]} paint="hair" />
          {role === "worker" && <Shaded {...HARD_HAT} paint="item" />}
        </g>
      </g>
    </g>
  );
}
