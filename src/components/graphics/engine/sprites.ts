import { rgba } from "./color";

/**
 * Pre-rendered shading. Gradients are expensive to build per frame, so
 * lit spheres, glows and cast shadows are baked once into small canvases
 * and stamped with drawImage.
 */

/** The single studio light every render shares: top-left, about 35°. */
export const LIGHT = { x: -0.62, y: -0.78 } as const;

export type Sprite = { canvas: HTMLCanvasElement; size: number };

function createCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D is not available");
  return [canvas, ctx];
}

/** A matte sphere lit from `LIGHT`, with a soft reflected rim opposite. */
export function sphereSprite(light: string, base: string, shade: string, size = 128): Sprite {
  const [canvas, ctx] = createCanvas(size);
  const c = size / 2;
  const r = size / 2 - 1;

  const body = ctx.createRadialGradient(c + LIGHT.x * r * 0.36, c + LIGHT.y * r * 0.36, r * 0.02, c, c, r * 1.02);
  body.addColorStop(0, light);
  body.addColorStop(0.5, base);
  body.addColorStop(1, shade);
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(c, c, r, 0, Math.PI * 2);
  ctx.fill();

  const rim = ctx.createRadialGradient(c - LIGHT.x * r * 0.9, c - LIGHT.y * r * 0.9, 0, c - LIGHT.x * r * 0.9, c - LIGHT.y * r * 0.9, r * 0.8);
  rim.addColorStop(0, rgba(light, 0.14));
  rim.addColorStop(1, rgba(light, 0));
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, size, size);

  return { canvas, size };
}

/** A soft radial glow that fades to transparent at the edge. */
export function glowSprite(color: string, size = 128): Sprite {
  const [canvas, ctx] = createCanvas(size);
  const c = size / 2;
  const g = ctx.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0, rgba(color, 1));
  g.addColorStop(0.35, rgba(color, 0.45));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return { canvas, size };
}

/** A blurred cast shadow; stretch it into an ellipse when drawing. */
export function shadowSprite(color: string, size = 128): Sprite {
  const [canvas, ctx] = createCanvas(size);
  const c = size / 2;
  const g = ctx.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0, rgba(color, 0.55));
  g.addColorStop(0.5, rgba(color, 0.22));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return { canvas, size };
}

/** Stamp a sprite centred on (x, y) at diameter `d`. */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  x: number,
  y: number,
  d: number,
  alpha = 1,
): void {
  if (alpha <= 0.002 || d <= 0.1) return;
  ctx.globalAlpha = alpha;
  ctx.drawImage(sprite.canvas, x - d / 2, y - d / 2, d, d);
}

/** Stamp a sprite stretched to width `w` and height `h`. */
export function drawSpriteStretched(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  x: number,
  y: number,
  w: number,
  h: number,
  alpha = 1,
): void {
  if (alpha <= 0.002 || w <= 0.1 || h <= 0.1) return;
  ctx.globalAlpha = alpha;
  ctx.drawImage(sprite.canvas, x - w / 2, y - h / 2, w, h);
}
