"use client";

import { useEffect, useState } from "react";
import { getPalette } from "@/components/graphics/engine/palette";
import { sceneIds, type SceneId } from "@/components/graphics/scene-ids";
import { sceneLoaders } from "@/components/graphics/scenes";

const FRAMES = 600;
const STEP = 1 / 60;

type Result = { scene: SceneId; msPerFrame: number; heapKb: number | null };

type MemoryPerformance = Performance & { memory?: { usedJSHeapSize: number } };

/**
 * `/lab?bench` only: runs each render's update + draw for 600 frames on an
 * offscreen canvas and reports time per frame and heap growth.
 */
export function LabBench() {
  const [results, setResults] = useState<Result[] | null>(null);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("bench")) return;
    let isCancelled = false;

    (async () => {
      const out: Result[] = [];
      for (const id of sceneIds) {
        const { default: createScene } = await sceneLoaders[id]();
        const variant = id === "circuit" ? "hero" : "card";
        const [w, h] = variant === "hero" ? [1440, 800] : [600, 400];
        const canvas = document.createElement("canvas");
        canvas.width = w * 2;
        canvas.height = h * 2;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;

        const scene = createScene();
        scene.init({ palette: getPalette("dark"), tone: "dark", variant });
        scene.resize(w, h);
        for (let i = 0; i < 60; i++) scene.update(STEP, i / 60);

        const memory = (performance as MemoryPerformance).memory;
        const heapBefore = memory?.usedJSHeapSize ?? 0;
        const start = performance.now();
        for (let i = 0; i < FRAMES; i++) {
          scene.update(STEP, (i % 540) / 540);
          ctx.setTransform(2, 0, 0, 2, 0, 0);
          ctx.clearRect(0, 0, w, h);
          scene.render(ctx);
        }
        const msPerFrame = (performance.now() - start) / FRAMES;
        const heapKb = memory ? (memory.usedJSHeapSize - heapBefore) / 1024 : null;
        out.push({ scene: id, msPerFrame, heapKb });
      }
      if (isCancelled) return;
      (window as unknown as { __bench: Result[] }).__bench = out;
      setResults(out);
    })();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (!results) return null;
  return (
    <pre data-bench className="mx-auto max-w-[1200px] px-8 py-10 font-mono text-caption">
      {results
        .map((r) => `${r.scene.padEnd(16)} ${r.msPerFrame.toFixed(2)} ms/frame  heap ${r.heapKb === null ? "n/a" : `${r.heapKb.toFixed(0)} KB`}`)
        .join("\n")}
    </pre>
  );
}
