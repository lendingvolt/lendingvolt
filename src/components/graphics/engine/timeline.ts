/**
 * Easing and keyframe helpers. Pure functions, no allocation, so they are
 * safe to call from inside the frame loop.
 */

export const TAU = Math.PI * 2;

export function clamp(value: number, min = 0, max = 1): number {
  return value < min ? min : value > max ? max : value;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 0 → 1 as `t` moves from `start` to `end`, clamped outside. */
export function phase(t: number, start: number, end: number): number {
  return clamp((t - start) / (end - start));
}

export function easeOutCubic(t: number): number {
  const u = 1 - t;
  return 1 - u * u * u;
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Sample piecewise keyframes. `times` must be ascending in [0, 1]; each
 * segment is eased with `ease`. Arrays are allocated once by the caller.
 */
export function keyframes(
  t: number,
  times: ArrayLike<number>,
  values: ArrayLike<number>,
  ease: (t: number) => number = easeInOutCubic,
): number {
  const last = times.length - 1;
  if (t <= times[0]) return values[0];
  if (t >= times[last]) return values[last];
  for (let i = 0; i < last; i++) {
    if (t < times[i + 1]) {
      return lerp(values[i], values[i + 1], ease(phase(t, times[i], times[i + 1])));
    }
  }
  return values[last];
}

/** Frame-rate independent exponential approach toward `target`. */
export function damp(current: number, target: number, rate: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-rate * dt));
}
