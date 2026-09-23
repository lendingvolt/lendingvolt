"use client";

import { useEffect, useRef } from "react";
import { getPalette } from "./engine/palette";
import { createRunner, type Driver, type Runner } from "./engine/runner";
import type { SceneVariant } from "./engine/types";
import type { SceneId, SceneTone } from "./scene-ids";
import { sceneLoaders } from "./scenes";

type SceneCanvasProps = {
  scene: SceneId;
  tone: SceneTone;
  driver: Driver;
  variant: SceneVariant;
};

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Lazy-loads a render module and runs it on a canvas that fills its
 * parent. The scroll driver maps the enclosing section's height to 0 → 1.
 */
export function SceneCanvas({ scene, tone, driver, variant }: SceneCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let runner: Runner | undefined;
    let isCancelled = false;
    const motionQuery = window.matchMedia(REDUCED_MOTION);
    const onMotionChange = () => runner?.setReducedMotion(motionQuery.matches);

    sceneLoaders[scene]()
      .then(({ default: createScene }) => {
        if (isCancelled) return;
        runner = createRunner({
          canvas,
          scene: createScene(),
          env: { palette: getPalette(tone), tone, variant },
          driver,
          scrollTarget: driver === "scroll" ? canvas.closest("section") : null,
          reducedMotion: motionQuery.matches,
        });
        canvas.dataset.ready = "true";
      })
      .catch(() => {
        // A failed chunk leaves the plain ground showing; nothing else depends on it.
      });

    motionQuery.addEventListener("change", onMotionChange);
    return () => {
      isCancelled = true;
      motionQuery.removeEventListener("change", onMotionChange);
      runner?.destroy();
    };
  }, [scene, tone, driver, variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 block size-full opacity-0 transition-opacity duration-500 ease-out data-ready:opacity-100"
    />
  );
}
