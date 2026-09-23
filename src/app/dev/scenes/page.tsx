import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClosingScene } from "@/components/scenes/closing-scene";
import { HeroScene } from "@/components/scenes/hero-scene";
import {
  CashFlowScene,
  ConsolidateScene,
  LifeEventScene,
  RenovateScene,
} from "@/components/scenes/use-case-scenes";
import { NoChargeScene, OneApplicationScene, SoftCheckScene, TrueCostScene } from "@/components/scenes/value-scenes";
import { Eyebrow } from "@/components/ui/layout";
import { Replay } from "./replay";

export const metadata: Metadata = {
  title: "Scenes",
  robots: { index: false, follow: false },
};

function Entry({ title, sentence, children }: { title: string; sentence: string; children: ReactNode }) {
  return (
    <article className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <Eyebrow>{title}</Eyebrow>
        <p className="max-w-[60ch] text-body-sm">{sentence}</p>
      </header>
      <Replay>{children}</Replay>
    </article>
  );
}

const panel = "rounded-lg bg-surface-1";

/** Dev-only review of every homepage scene at its real size, each replayable. Not linked. */
export default function ScenesReviewPage() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-[1264px] flex-col gap-16 px-5 py-16 md:px-8 md:py-20">
      <header className="flex max-w-[60ch] flex-col gap-4">
        <Eyebrow>Dev · not linked · noindex</Eyebrow>
        <h1 className="text-display-md">Scenes</h1>
        <p className="text-body-md">Each plays once when 35% of it is in view. Replay remounts it.</p>
      </header>

      <div data-theme-lock="dark" className="grid gap-10 rounded-xl bg-ink-900 p-6 md:p-10 lg:grid-cols-2">
        <Entry title="Hero" sentence="The offers line up: one application, six lenders re-sort by total payable, the cheapest flagged.">
          <HeroScene />
        </Entry>
        <Entry title="Closing CTA" sentence="The borrower walks off with the chosen offer.">
          <ClosingScene className="aspect-[2/1] w-full" />
        </Entry>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <Entry title="Value 1" sentence="One application card in a tray; six lenders face the borrower with offers.">
          <OneApplicationScene className={`aspect-[3/2] ${panel}`} />
        </Entry>
        <Entry title="Value 2" sentence="A lender inspects the folder; it goes back unmarked, the stamp unused.">
          <SoftCheckScene className={`aspect-[3/2] ${panel}`} />
        </Entry>
        <Entry title="Value 3" sentence="Three S$20,000 blocks topped with interest bricks; the borrower stops at the shortest.">
          <TrueCostScene className={`aspect-[3/2] ${panel}`} />
        </Entry>
        <Entry title="Value 4" sentence="A receipt: every line S$0.00, total S$0.00.">
          <NoChargeScene className={`aspect-[3/2] ${panel}`} />
        </Entry>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <Entry title="Consolidation" sentence="Four due dates into one box.">
          <ConsolidateScene className={`aspect-square ${panel}`} />
        </Entry>
        <Entry title="Renovation" sentence="Two workers build a wall.">
          <RenovateScene className={`aspect-square ${panel}`} />
        </Entry>
        <Entry title="Cash flow" sentence="A plank across the gap between payroll and an invoice.">
          <CashFlowScene className={`aspect-square ${panel}`} />
        </Entry>
        <Entry title="Life events" sentence="S$15,000 into 24 monthly blocks.">
          <LifeEventScene className={`aspect-square ${panel}`} />
        </Entry>
      </div>
    </main>
  );
}
