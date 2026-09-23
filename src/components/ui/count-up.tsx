"use client";

import { useEffect, useRef } from "react";

const DURATION_MS = 1200;
const NUMBER = /\d[\d,]*(?:\.\d+)?/;

/** Ease-out with no overshoot: fast start, settles on the figure. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

type Parsed = { before: string; after: string; target: number; decimals: number; grouped: boolean };

function parse(figure: string): Parsed | null {
  const match = figure.match(NUMBER);
  if (!match || match.index === undefined) return null;
  const digits = match[0];
  return {
    before: figure.slice(0, match.index),
    after: figure.slice(match.index + digits.length),
    target: Number(digits.replace(/,/g, "")),
    decimals: digits.split(".")[1]?.length ?? 0,
    grouped: digits.includes(","),
  };
}

/**
 * Counts a stat up from zero, once, when it scrolls into view. Renders the
 * final figure on the server and under reduced motion. Text with no number
 * in it (a placeholder such as "[N]") is left as it is.
 */
export function CountUp({ figure }: { figure: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    const parsed = parse(figure);
    if (!element || !parsed || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const format = new Intl.NumberFormat("en-SG", {
      minimumFractionDigits: parsed.decimals,
      maximumFractionDigits: parsed.decimals,
      useGrouping: parsed.grouped,
    });
    const show = (value: number) => {
      element.textContent = `${parsed.before}${format.format(value)}${parsed.after}`;
    };

    let frame = 0;
    show(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / DURATION_MS);
          show(parsed.target * easeOut(progress));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      element.textContent = figure;
    };
  }, [figure]);

  return (
    <>
      <span className="sr-only">{figure}</span>
      <span ref={ref} aria-hidden>
        {figure}
      </span>
    </>
  );
}
