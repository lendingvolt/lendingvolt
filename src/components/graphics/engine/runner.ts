import { clamp, damp } from "./timeline";
import type { Scene, SceneEnv } from "./types";

const STEP = 1 / 60;
const MAX_STEPS = 4;
const MAX_DPR = 2;
const SCROLL_EASE_RATE = 5;

export type Driver = "time" | "scroll";

export type RunnerOptions = {
  canvas: HTMLCanvasElement;
  scene: Scene;
  env: SceneEnv;
  driver: Driver;
  /** Element whose height the scroll driver maps to progress 0 → 1. */
  scrollTarget?: HTMLElement | null;
  reducedMotion: boolean;
};

export type Runner = {
  setReducedMotion(isReduced: boolean): void;
  destroy(): void;
};

/**
 * Owns one canvas: sizes it for the screen's pixel density, runs the scene
 * on a fixed 60 Hz timestep drawn on each animation frame, pauses when the
 * canvas is off screen or the tab is hidden, and draws a single still
 * frame under reduced motion.
 */
export function createRunner({ canvas, scene, env, driver, scrollTarget, reducedMotion }: RunnerOptions): Runner {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return { setReducedMotion() {}, destroy() {} };

  scene.init(env);

  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;
  let last = 0;
  let accumulator = 0;
  let clock = 0;
  let isOnScreen = false;
  let isPageVisible = document.visibilityState === "visible";
  let isReduced = reducedMotion;
  let scrollStart = 0;
  let scrollRange = 1;
  let scrollProgress = 0;

  const readScroll = () => clamp((window.scrollY - scrollStart) / scrollRange);

  const currentPhase = () => (driver === "scroll" ? scrollProgress : (clock / scene.duration) % 1);

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, width, height);
    scene.render(ctx);
  };

  const drawStill = () => {
    if (width === 0) return;
    scene.update(0, scene.posterT);
    draw();
  };

  const shouldRun = () => isOnScreen && isPageVisible && !isReduced && width > 0;

  const tick = (now: number) => {
    frame = 0;
    if (!shouldRun()) return;

    const elapsed = last ? Math.min(now - last, 250) / 1000 : STEP;
    last = now;
    accumulator += elapsed;

    let steps = 0;
    while (accumulator >= STEP && steps < MAX_STEPS) {
      clock += STEP;
      if (driver === "scroll") scrollProgress = damp(scrollProgress, readScroll(), SCROLL_EASE_RATE, STEP);
      scene.update(STEP, currentPhase());
      accumulator -= STEP;
      steps++;
    }
    if (steps === MAX_STEPS) accumulator = 0;

    draw();
    frame = requestAnimationFrame(tick);
  };

  const sync = () => {
    if (shouldRun()) {
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
      return;
    }
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (isReduced) drawStill();
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    scene.resize(width, height);

    if (scrollTarget) {
      const box = scrollTarget.getBoundingClientRect();
      scrollStart = box.top + window.scrollY;
      scrollRange = Math.max(1, box.height);
      if (!frame) scrollProgress = readScroll();
    }

    if (isReduced) drawStill();
    else {
      scene.update(0, currentPhase());
      draw();
    }
    sync();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      isOnScreen = entry.isIntersecting;
      sync();
    },
    { rootMargin: "120px 0px" },
  );
  intersectionObserver.observe(canvas);

  const onVisibility = () => {
    isPageVisible = document.visibilityState === "visible";
    sync();
  };
  document.addEventListener("visibilitychange", onVisibility);

  return {
    setReducedMotion(next) {
      isReduced = next;
      sync();
    },
    destroy() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
