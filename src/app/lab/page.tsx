import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GraphicSlot } from "@/components/graphics/graphic-slot";
import type { SceneId } from "@/components/graphics/scene-ids";
import { Container, Eyebrow, Section } from "@/components/ui/layout";
import { LabBench } from "./lab-bench";

export const metadata: Metadata = {
  title: "Render lab",
  robots: { index: false, follow: false },
};

type LabEntry = {
  scene: SceneId;
  title: string;
  sentence: string;
  ratio: "3/2" | "1/1";
};

const entries: LabEntry[] = [
  { scene: "converge", title: "Value 1", sentence: "Many points converge into one lit sphere.", ratio: "3/2" },
  { scene: "soft-check", title: "Value 2", sentence: "A sphere passes through a plane and leaves no mark.", ratio: "3/2" },
  { scene: "true-cost", title: "Value 3", sentence: "Three bars of differing length share one baseline.", ratio: "3/2" },
  { scene: "no-charge", title: "Value 4", sentence: "Two equal spheres settle level.", ratio: "3/2" },
  { scene: "consolidate", title: "Use case 1", sentence: "Seven lines merge into one.", ratio: "1/1" },
  { scene: "renovate", title: "Use case 2", sentence: "Steps build upward.", ratio: "1/1" },
  { scene: "cashflow", title: "Use case 3", sentence: "A channel widens and the flow spreads with it.", ratio: "1/1" },
  { scene: "life-event", title: "Use case 4", sentence: "A circle completes.", ratio: "1/1" },
  { scene: "fingerprint", title: "Accent", sentence: "Ridges brighten as light sweeps across.", ratio: "1/1" },
  { scene: "consent-toggles", title: "Accent", sentence: "Three toggles settle in a mixed state.", ratio: "1/1" },
  { scene: "rate-vs-market", title: "Accent", sentence: "One bar settles below the rest.", ratio: "1/1" },
  { scene: "offer-stack", title: "Product", sentence: "Offer cards fan out and settle into a sorted stack.", ratio: "3/2" },
];

const ratioClass = { "3/2": "aspect-[3/2]", "1/1": "aspect-square" } as const;

/** Dev-only review surface for every abstract render, light and dark. */
export default function LabPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <>
      <Section ground="ink-900" spacing="none" aria-labelledby="lab-hero" className="-mt-(--header-h) overflow-hidden">
        <GraphicSlot
          scene="converge"
          ground="transparent"
          tone="dark"
          driver="scroll"
          variant="hero"
          fill
          className="hero-graphic"
        />
        <Container className="relative flex min-h-[140vh] flex-col pt-[calc(var(--header-h)+80px)]">
          <Eyebrow>Render lab</Eyebrow>
          <h1 id="lab-hero" className="mt-4 max-w-[14ch] text-display-lg">
            Scroll to scrub the hero.
          </h1>
          <p className="mt-4 max-w-[48ch] text-body-md">
            The hero render advances with scroll position across this band. Below, every render in both palettes.
          </p>
        </Container>
      </Section>

      <LabBench />

      <Section ground="surface-0" aria-label="All renders">
        <Container className="flex flex-col gap-20">
          {entries.map((entry) => (
            <article key={`${entry.scene}`} className="flex flex-col gap-6">
              <header className="flex flex-col gap-1">
                <Eyebrow>
                  {entry.title} · {entry.scene}
                </Eyebrow>
                <h2 className="text-heading-lg">{entry.sentence}</h2>
              </header>
              <div className="grid gap-6 md:grid-cols-2">
                <GraphicSlot
                  scene={entry.scene}
                  ground="surface-1"
                  className={`${ratioClass[entry.ratio]} rounded-lg`}
                />
                <GraphicSlot
                  scene={entry.scene}
                  ground="ink-900"
                  className={`${ratioClass[entry.ratio]} rounded-lg border border-[var(--border-dark)]`}
                />
              </div>
            </article>
          ))}
        </Container>
      </Section>
    </>
  );
}
