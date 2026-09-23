import { blockPaths } from "./paths";
import { styles } from "./classes";

/** Colours a two-tone shape can take; each has a matching shaded side. */
export type Paint = "top" | "legs" | "skin" | "hair" | "item" | "furniture" | "highlight" | "ink";

const sideClass: Record<Paint, string> = {
  top: styles.topSide,
  legs: styles.legsSide,
  skin: styles.skinSide,
  hair: styles.hairSide,
  item: styles.itemSide,
  furniture: styles.furnitureSide,
  highlight: styles.highlightSide,
  ink: styles.inkSide,
};

type ShadedProps = {
  /** Path data for the whole shape. */
  d: string;
  /** Path data for the part of it facing away from the light. */
  side: string;
  paint: Paint;
  /** Draw the 1px furniture edge (visible on dark stages only). */
  outlined?: boolean;
};

/** Any flat shape with its shaded side. No outline, no gradient. */
export function Shaded({ d, side, paint, outlined }: ShadedProps) {
  return (
    <>
      <path d={d} className={styles[paint]} />
      <path d={side} className={sideClass[paint]} />
      {outlined && <path d={d} className={styles.outline} />}
    </>
  );
}

type SolidProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  /** Width of the shaded strip; defaults to a quarter of the width. */
  side?: number;
  paint: Paint;
  outlined?: boolean;
};

/** A rectangular block with its shaded right-hand side. */
export function Solid({ x, y, w, h, r = 0, side, paint, outlined }: SolidProps) {
  const paths = blockPaths(x, y, w, h, r, side);
  return <Shaded d={paths.face} side={paths.side} paint={paint} outlined={outlined ?? paint === "furniture"} />;
}
