"use client";

import { useEffect, useRef, useState } from "react";
import {
  ApplicationCard,
  Current,
  FilingCabinet,
  Figure,
  GroundLine,
  Placard,
  Stage,
  type PoseName,
  type PoseSet,
} from "@/components/figures";

/** A small prop held low needs about 30° of lift; hanging straight down, it covers the figure. */
const LOWERED_LOOK: PoseSet = { active: 30, other: 0, head: 6 };

type Step = { label: string; borrower: PoseName | PoseSet; lender: PoseName | PoseSet; isHolding: boolean };

const SEQUENCE: Step[] = [
  { label: "hold-up", borrower: "hold-up", lender: "hold-up", isHolding: true },
  { label: "hand-over", borrower: "hand-over", lender: "hand-over", isHolding: true },
  { label: "card lowered, as a custom set { active: 30, head: 6 }", borrower: LOWERED_LOOK, lender: "hold-up", isHolding: true },
  { label: "look and point, props put down", borrower: "look", lender: "point", isHolding: false },
  { label: "hold-up", borrower: "hold-up", lender: "hold-up", isHolding: true },
];
const STEP_MS = 1000;
const SCALE = 1.25;

function PlayButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 items-center self-start rounded-md border border-line-strong px-5 text-body-sm font-medium text-fg hover:border-fg"
    >
      {label}
    </button>
  );
}

/** Steps two figures through every gesture once, with the kit's easing. */
export function GestureDemo({ placard }: { placard: { total: string; rate: string } }) {
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const play = () => {
    timers.current.forEach(clearTimeout);
    timers.current = SEQUENCE.map((_, index) => window.setTimeout(() => setStep(index), index * STEP_MS));
  };

  const current = SEQUENCE[step];
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-line bg-surface-0 px-4 pt-6">
        <Stage width={200} height={96} tone="light" scale={SCALE}>
          <GroundLine y={92} to={200} />
          <Figure
            role="borrower"
            index={1}
            x={50}
            y={92}
            facing="right"
            pose={current.borrower}
            held={current.isHolding ? <ApplicationCard highlight /> : undefined}
          />
          <Figure
            role="lender"
            index={2}
            x={150}
            y={92}
            facing="left"
            pose={current.lender}
            held={current.isHolding ? <Placard total={placard.total} rate={placard.rate} /> : undefined}
          />
        </Stage>
      </div>
      <div className="flex items-center gap-4">
        <PlayButton onClick={play} label="Play gestures" />
        <p className="text-caption text-fg-muted">Pose: {current.label}</p>
      </div>
    </div>
  );
}

/** Replays the current pulse once per click. */
export function CurrentDemo() {
  const [run, setRun] = useState(0);
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-[var(--border-dark)] bg-ink-900 px-4 py-8" data-theme-lock="dark">
        <Stage width={240} height={24} tone="dark" scale={SCALE}>
          <Current key={run} from={{ x: 8, y: 12 }} to={{ x: 232, y: 12 }} run={run > 0} duration={600} />
        </Stage>
      </div>
      <PlayButton onClick={() => setRun((count) => count + 1)} label="Send current" />
    </div>
  );
}

/** Opens and closes the top drawer so the slide easing can be judged. */
export function CabinetDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-line bg-surface-0 px-4 pt-6">
        <Stage width={120} height={64} tone="light" scale={SCALE}>
          <GroundLine y={60} to={120} />
          <FilingCabinet x={44} y={60} open={isOpen ? 0 : undefined} />
          <Figure role="clerk" index={3} x={88} y={60} facing="left" pose={isOpen ? "look" : "stand"} />
        </Stage>
      </div>
      <PlayButton onClick={() => setIsOpen((open) => !open)} label={isOpen ? "Close drawer" : "Open drawer"} />
    </div>
  );
}
