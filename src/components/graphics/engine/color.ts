/** Colour helpers for set-up time (they allocate strings; never call per frame). */

type Rgb = [number, number, number];

export function parseColor(input: string): Rgb {
  const value = input.trim();
  if (value.startsWith("#")) {
    const hex = value.length === 4 ? value.replace(/^#(.)(.)(.)$/, "#$1$1$2$2$3$3") : value;
    const n = Number.parseInt(hex.slice(1, 7), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const match = value.match(/rgba?\(([^)]+)\)/);
  if (match) {
    const [r, g, b] = match[1].split(/[\s,/]+/).map(Number);
    return [r, g, b];
  }
  return [0, 0, 0];
}

export function rgba(color: string, alpha = 1): string {
  const [r, g, b] = parseColor(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Linear mix of two colours, `t` = 0 → a, 1 → b. */
export function mix(a: string, b: string, t: number): string {
  const ca = parseColor(a);
  const cb = parseColor(b);
  const c = ca.map((v, i) => Math.round(v + (cb[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}
