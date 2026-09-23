import { createPool } from "./pool";
import { createRng } from "./random";
import { clamp, easeInOutCubic, easeOutCubic, keyframes, phase } from "./timeline";

describe("timeline", () => {
  it("clamps phase outside its window", () => {
    expect(phase(0.1, 0.2, 0.4)).toBe(0);
    expect(phase(0.3, 0.2, 0.4)).toBeCloseTo(0.5);
    expect(phase(0.9, 0.2, 0.4)).toBe(1);
  });

  it("keeps easing curves anchored at 0 and 1", () => {
    for (const ease of [easeOutCubic, easeInOutCubic]) {
      expect(ease(0)).toBe(0);
      expect(ease(1)).toBe(1);
    }
  });

  it("interpolates keyframes and holds the ends", () => {
    const times = [0, 0.5, 1];
    const values = [0, 10, 4];
    expect(keyframes(-1, times, values)).toBe(0);
    expect(keyframes(0.5, times, values)).toBe(10);
    expect(keyframes(0.25, times, values)).toBeCloseTo(5);
    expect(keyframes(2, times, values)).toBe(4);
  });

  it("clamps to a range", () => {
    expect(clamp(5, 0, 1)).toBe(1);
    expect(clamp(-5, 0, 1)).toBe(0);
  });
});

describe("pool", () => {
  it("reuses killed slots and reports when full", () => {
    const pool = createPool(2, ["x"] as const);
    const a = pool.spawn();
    const b = pool.spawn();
    expect(pool.spawn()).toBe(-1);
    expect(pool.count()).toBe(2);
    pool.kill(a);
    expect(pool.count()).toBe(1);
    expect(pool.spawn()).toBe(a);
    pool.kill(b);
    pool.kill(b);
    expect(pool.count()).toBe(1);
  });

  it("stores fields in typed arrays", () => {
    const pool = createPool(4, ["x", "y"] as const);
    const i = pool.spawn();
    pool.fields.x[i] = 1.5;
    expect(pool.fields.x).toBeInstanceOf(Float32Array);
    expect(pool.fields.x[i]).toBe(1.5);
  });
});

describe("rng", () => {
  it("is deterministic for a seed and stays in [0, 1)", () => {
    const a = createRng(42);
    const b = createRng(42);
    for (let i = 0; i < 100; i++) {
      const value = a();
      expect(value).toBe(b());
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});
