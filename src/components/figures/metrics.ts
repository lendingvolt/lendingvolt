/** Prop geometry scenes need for choreography, kept free of JSX so scripts stay testable. */

/** Stack bricks at this pitch so the 1-unit gap lets each one be counted. */
export const BRICK_PITCH = 5;

/** How far an open filing-cabinet drawer slides out. */
export const DRAWER_TRAVEL = 12;

/** Height of a placard's pole and board. */
export const PLACARD = { pole: 8, width: 40, height: 24 } as const;

/** Receipt layout: row height and padding. */
export const RECEIPT = { row: 13, pad: 8, width: 120 } as const;

export function receiptHeight(lines: number): number {
  return RECEIPT.pad + lines * RECEIPT.row + 6 + RECEIPT.row + RECEIPT.pad;
}

/** Bottom-centre of slot `index` in a `Slots` grid placed at the origin. */
export function slotPoint(index: number, columns: number, size = 9, gap = 1) {
  const pitch = size + gap;
  return { x: (index % columns) * pitch + size / 2, y: -Math.floor(index / columns) * pitch };
}
