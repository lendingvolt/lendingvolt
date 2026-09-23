/** Per-corner radii: top-left, top-right, bottom-right, bottom-left. */
export type Radii = readonly [number, number, number, number];

/** SVG path data for a rectangle with optional per-corner radii. */
export function rectPath(x: number, y: number, w: number, h: number, r: number | Radii = 0): string {
  const [tl, tr, br, bl] = typeof r === "number" ? [r, r, r, r] : r;
  const arc = (radius: number, ex: number, ey: number) => (radius ? `A${radius} ${radius} 0 0 1 ${ex} ${ey}` : "");
  return (
    `M${x + tl} ${y}H${x + w - tr}${arc(tr, x + w, y + tr)}` +
    `V${y + h - br}${arc(br, x + w - br, y + h)}` +
    `H${x + bl}${arc(bl, x, y + h - bl)}` +
    `V${y + tl}${arc(tl, x + tl, y)}Z`
  );
}

/**
 * A block as two paths: the full face, and the strip down its right-hand
 * side that faces away from the top-left light. The strip keeps the
 * block's right-hand corner radii.
 */
export function blockPaths(x: number, y: number, w: number, h: number, r = 0, side = Math.round(w / 4)) {
  const sideRadius = Math.min(r, side);
  return {
    face: rectPath(x, y, w, h, r),
    side: rectPath(x + w - side, y, side, h, [0, sideRadius, sideRadius, 0]),
  };
}

/**
 * Rough rendered width of a line of Instrument Sans, in the same units as
 * `fontSize`. Used to size tags and pills around their text on the server,
 * where text cannot be measured.
 */
export function estimateTextWidth(text: string, fontSize: number, tracking = 0): number {
  let ems = 0;
  for (const char of text) {
    if (char === " ") ems += 0.26;
    else if (/[.,:·']/.test(char)) ems += 0.26;
    else if (/[0-9]/.test(char)) ems += 0.6;
    else if (/[A-Z]/.test(char)) ems += 0.67;
    else if (char === "$") ems += 0.58;
    else ems += 0.52;
    ems += tracking;
  }
  return ems * fontSize;
}
