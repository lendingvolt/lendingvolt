/** Drawing helpers shared by several renders. None of them allocate. */

/**
 * An extruded bar: front face plus top and right faces receding up and to
 * the right, lit from the top-left like every other render.
 */
export function drawPrism(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  depthX: number,
  depthY: number,
  top: string,
  front: string | CanvasGradient,
  side: string,
): void {
  if (w <= 0.5 || h <= 0.5) return;

  ctx.fillStyle = top;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + depthX, y - depthY);
  ctx.lineTo(x + w + depthX, y - depthY);
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = side;
  ctx.beginPath();
  ctx.moveTo(x + w, y);
  ctx.lineTo(x + w + depthX, y - depthY);
  ctx.lineTo(x + w + depthX, y + h - depthY);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = front;
  ctx.fillRect(x, y, w, h);
}

/** Rounded-rectangle path; call fill or stroke afterwards. */
export function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
