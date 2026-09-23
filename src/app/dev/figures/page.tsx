import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  ApplicationCard,
  Block,
  Box,
  Brick,
  BRICK_PITCH,
  Counter,
  Desk,
  Envelope,
  FilingCabinet,
  Figure,
  Folder,
  GroundLine,
  HAIR_STYLES,
  HAIR_TONES,
  Magnifier,
  Pill,
  Placard,
  Plank,
  Receipt,
  ROLES,
  RolledPlan,
  SKIN_TONES,
  Stage,
  Stamp,
  Tag,
  Tray,
  type PoseName,
  type Role,
  type StageTone,
} from "@/components/figures";
import { Eyebrow } from "@/components/ui/layout";
import { mockLenders } from "@/content/offers";
import { cn } from "@/lib/cn";
import { formatPercent, formatSGD, quoteFlatRate } from "@/lib/loan-math";
import { CabinetDemo, CurrentDemo, GestureDemo } from "./demos";
import styles from "./review.module.css";

export const metadata: Metadata = {
  title: "Figure kit",
  robots: { index: false, follow: false },
};

/** Nominal stage scale: a 48-unit figure renders 60px tall. */
const SCALE = 1.25;

const TONES: readonly StageTone[] = ["light", "dark"];

const ROLE_NOTES: Record<Role, string> = {
  borrower: "Accent top. Always the highlighted person.",
  lender: "Ink suit, thin tie in ink-400.",
  clerk: "Bib apron in surface-2.",
  worker: "Hard hat in warning.",
  shopkeeper: "Waist apron in surface-2.",
};

/** The comparison section's mock offers at S$20,000 over 3 years. */
function placardFor(id: string) {
  const lender = mockLenders.find((candidate) => candidate.id === id);
  if (!lender) throw new Error(`No mock lender "${id}"`);
  const quote = quoteFlatRate(20_000, 36, lender.flatRate, lender.feeRate);
  return { name: lender.name, total: formatSGD(quote.totalPayable), rate: `${formatPercent(lender.flatRate)} flat` };
}

const lenderA = placardFor("a");
const lenderB = placardFor("b");

function Panel({ tone, className, children }: { tone: StageTone; className?: string; children: ReactNode }) {
  return (
    <div
      data-theme-lock={tone}
      className={cn(
        "flex items-end justify-center overflow-hidden rounded-lg border px-4 pt-8",
        tone === "dark" ? "border-[var(--border-dark)] bg-ink-900" : "border-line bg-surface-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

type SpecimenProps = {
  tone?: StageTone;
  width: number;
  height: number;
  caption: string;
  note?: string;
  scale?: number;
  /** Draw the ground line at the bottom of the stage. */
  hasGround?: boolean;
  children: ReactNode;
};

/** One item on its own small stage, captioned. */
function Specimen({ tone = "light", width, height, caption, note, scale = SCALE, hasGround = true, children }: SpecimenProps) {
  return (
    <figure className="flex flex-col gap-3">
      <Panel tone={tone} className={hasGround ? undefined : "pb-8"}>
        <Stage width={width} height={height} tone={tone} scale={scale}>
          {hasGround && <GroundLine y={height - 4} to={width} />}
          {children}
        </Stage>
      </Panel>
      <figcaption className="flex flex-col gap-0.5">
        <span className="text-body-sm font-medium text-fg">{caption}</span>
        {note && <span className="text-caption text-fg-muted">{note}</span>}
      </figcaption>
    </figure>
  );
}

function Group({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-8 border-t border-line pt-10">
      <div className="flex max-w-[60ch] flex-col gap-2">
        <h2 className="text-heading-lg">{title}</h2>
        <p className="text-body-sm">{body}</p>
      </div>
      {children}
    </section>
  );
}

const grid = "grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6";

const POSE_SPECIMENS: { pose: PoseName; role: Role; walking?: boolean; held?: ReactNode; note: string }[] = [
  { pose: "stand", role: "borrower", note: "Every limb at rest." },
  { pose: "stand", role: "borrower", walking: true, note: "Walk: the cycle, in place." },
  { pose: "hold-up", role: "borrower", held: <ApplicationCard highlight />, note: "Arm raised 150°, prop upright." },
  { pose: "hand-over", role: "clerk", held: <Envelope />, note: "Arm forward at 75°." },
  { pose: "look", role: "borrower", note: "Head tilted 6° toward the facing side." },
  { pose: "point", role: "lender", note: "Arm out at 100°." },
];

const RECEIPT_LINES = [
  { label: "Application", value: "S$0.00" },
  { label: "Comparison", value: "S$0.00" },
  { label: "Matching", value: "S$0.00" },
  { label: "Support", value: "S$0.00" },
] as const;

/** Every prop, on its own stage, for one tone. */
function PropGrid({ tone }: { tone: StageTone }) {
  return (
    <div className={grid}>
      <Specimen tone={tone} width={48} height={32} caption="Application card" note="Plain and highlighted.">
        <ApplicationCard x={16} y={28} />
        <ApplicationCard x={32} y={28} highlight />
      </Specimen>
      <Specimen tone={tone} width={56} height={48} caption="Placard" note={`${lenderB.name}, 40 × 24.`}>
        <Placard x={28} y={44} total={lenderB.total} rate={lenderB.rate} />
      </Specimen>
      <Specimen tone={tone} width={136} height={64} caption="Placard, flagged" note={`${lenderA.name}, border and pill.`}>
        <Placard x={68} y={60} total={lenderA.total} rate={lenderA.rate} flagged badge="Lowest total cost" />
      </Specimen>
      <Specimen tone={tone} width={64} height={48} caption="Placard at caption size" note="Alternative: a 56 × 30 board fits 13px and 12px.">
        <Placard x={32} y={44} total={lenderB.total} rate={lenderB.rate} width={56} height={30} totalSize={10.4} rateSize={9.6} />
      </Specimen>
      <Specimen tone={tone} width={40} height={24} caption="Envelope">
        <Envelope x={20} y={20} />
      </Specimen>
      <Specimen tone={tone} width={40} height={32} caption="Bricks" note="12 × 4, one per S$250, stacked at a 5-unit pitch.">
        {[0, 1, 2].map((row) => (
          <Brick key={row} x={20} y={28 - row * BRICK_PITCH} />
        ))}
        <Brick x={20} y={28 - 3 * BRICK_PITCH} neutral />
      </Specimen>
      <Specimen tone={tone} width={136} height={104} caption="Receipt" note="Total in the highlight colour.">
        <Receipt x={68} y={100} lines={RECEIPT_LINES} total={{ label: "Total", value: "S$0.00" }} />
      </Specimen>
      <Specimen tone={tone} width={32} height={28} caption="Magnifier">
        <Magnifier x={10} y={24} />
      </Specimen>
      <Specimen tone={tone} width={80} height={20} caption="Plank" note="Neutral and highlighted.">
        <Plank x={40} y={10} />
        <Plank x={40} y={16} highlight />
      </Specimen>
      <Specimen tone={tone} width={56} height={28} caption="Box" note="Neutral and highlighted.">
        <Box x={18} y={24} />
        <Box x={40} y={24} width={20} height={16} highlight />
      </Specimen>
      <Specimen tone={tone} width={56} height={52} caption="Filing cabinet" note="Top drawer open.">
        <FilingCabinet x={20} y={48} open={0} />
      </Specimen>
      <Specimen tone={tone} width={64} height={32} caption="Desk and tray">
        <Desk x={32} y={28} />
        <Tray x={24} y={8} />
        <Stamp x={42} y={8} />
      </Specimen>
      <Specimen tone={tone} width={72} height={40} caption="Counter" note="Shopkeeper behind.">
        <Figure role="shopkeeper" index={2} x={36} y={36} />
        <Counter x={36} y={36} />
      </Specimen>
      <Specimen tone={tone} width={48} height={24} caption="Folder" note="Plain and highlighted.">
        <Folder x={14} y={20} />
        <Folder x={34} y={20} highlight />
      </Specimen>
      <Specimen tone={tone} width={40} height={20} caption="Stamp">
        <Stamp x={20} y={16} />
      </Specimen>
      <Specimen tone={tone} width={40} height={16} caption="Rolled plan">
        <RolledPlan x={20} y={12} />
      </Specimen>
      <Specimen tone={tone} width={128} height={28} caption="Tag" hasGround={false}>
        <Tag x={64} y={22} text="Soft check · no record" />
      </Specimen>
      <Specimen tone={tone} width={136} height={24} caption="Pill" hasGround={false}>
        <Pill x={68} y={20} text="Lowest total cost" />
      </Specimen>
      <Specimen tone={tone} width={80} height={32} caption="Block" note="Principal, in ink.">
        <Block x={40} y={28} width={64} height={20} label="S$20,000" tone="ink" />
      </Specimen>
    </div>
  );
}

/**
 * Dev-only review of the figure kit: every role, pose, prop and skin tone,
 * and the walk cycle. Not linked from anywhere.
 */
export default function FiguresReviewPage() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-[1264px] flex-col gap-16 px-5 py-16 md:px-8 md:py-20">
      <header className="flex max-w-[60ch] flex-col gap-4">
        <Eyebrow>Dev · not linked · noindex</Eyebrow>
        <h1 className="text-display-md">Figure kit</h1>
        <p className="text-body-md">
          Every figure on the site comes from this kit. Shown at the nominal scale of 1.25px per unit, so a figure is
          60px tall and the numbers render at the size they will in a scene. Placard figures are the comparison
          section&apos;s mock offers at S$20,000 over 3 years.
        </p>
      </header>

      <Group title="Roles" body="Five roles, on light and on dark. Told apart by what they wear and carry, never by the colour of a lender.">
        {TONES.map((tone) => (
          <div key={tone} className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {ROLES.map((role, index) => (
              <Specimen key={role} tone={tone} width={48} height={60} caption={`${role} · ${tone}`} note={ROLE_NOTES[role]}>
                <Figure role={role} index={index} x={24} y={56} />
              </Specimen>
            ))}
          </div>
        ))}
      </Group>

      <Group title="Poses" body="Transform sets on the limb groups, not separate drawings. The pose uses the arm on the facing side.">
        <div className={grid}>
          {POSE_SPECIMENS.map((specimen, index) => (
            <Specimen
              key={`${specimen.pose}-${index}`}
              width={64}
              height={76}
              caption={specimen.walking ? "walk" : specimen.pose}
              note={specimen.note}
            >
              <Figure
                role={specimen.role}
                index={index}
                x={24}
                y={72}
                facing="right"
                pose={specimen.pose}
                walking={specimen.walking}
                held={specimen.held}
              />
            </Specimen>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6 lg:w-1/2">
          {(["left", "front", "right"] as const).map((facing) => (
            <Specimen key={facing} width={48} height={60} caption={`Facing ${facing}`} note="Eyes shift 2 units.">
              <Figure role="borrower" index={0} x={24} y={56} facing={facing} />
            </Specimen>
          ))}
        </div>
      </Group>

      <Group title="Gestures" body="Pose changes animate over 400ms on cubic-bezier(0.2, 0, 0, 1). The held prop counter-rotates, so it stays upright the whole way.">
        <div className="grid gap-10 lg:grid-cols-2">
          <GestureDemo placard={lenderA} />
          <CabinetDemo />
        </div>
      </Group>

      <Group title="Walk cycle" body="480ms per cycle, linear. Legs ±20° about the hip, arms ±15° in opposite phase, a 2-unit bob. Held arms stay still. The lane crosses at 70px per second; it loops on this page only.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Specimen width={40} height={56} scale={4} caption="Borrower at 4×" note="Free arms swing.">
            <Figure role="borrower" index={0} x={20} y={52} facing="right" walking />
          </Specimen>
          <Specimen width={40} height={56} scale={4} caption="Worker at 4×" note="Offset start per figure.">
            <Figure role="worker" index={1} x={20} y={52} facing="right" walking />
          </Specimen>
        </div>
        <Panel tone="light" className="justify-start">
          <Stage width={480} height={100} tone="light" scale={SCALE}>
            <GroundLine y={96} to={480} />
            <g className={styles.lane}>
              <Figure
                role="lender"
                index={2}
                x={0}
                y={96}
                facing="right"
                pose="hold-up"
                walking
                held={<Placard total={lenderB.total} rate={lenderB.rate} />}
              />
            </g>
          </Stage>
        </Panel>
      </Group>

      <Group title="Skin tones and hair" body="Four skin tones and three hair styles in three dark neutrals, assigned by a figure's index in its scene's cast.">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {SKIN_TONES.map((skin) => (
            <Specimen key={skin} width={48} height={60} caption={skin}>
              <Figure role="borrower" index={0} x={24} y={56} skin={skin} hairStyle="short" hairTone={HAIR_TONES[0]} />
            </Specimen>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6 sm:grid-cols-6">
          {HAIR_STYLES.map((hairStyle) => (
            <Specimen key={hairStyle} width={48} height={60} caption={hairStyle}>
              <Figure role="lender" index={1} x={24} y={56} hairStyle={hairStyle} />
            </Specimen>
          ))}
          {HAIR_TONES.map((hairTone) => (
            <Specimen key={hairTone} width={48} height={60} caption={hairTone}>
              <Figure role="clerk" index={2} x={24} y={56} hairStyle="bob" hairTone={hairTone} />
            </Specimen>
          ))}
        </div>
        <Specimen width={300} height={60} caption="Cast order" note="Figures 0 to 8, as any nine-figure scene would assign them.">
          {Array.from({ length: 9 }, (_, index) => (
            <Figure key={index} role={index === 0 ? "borrower" : "lender"} index={index} x={22 + index * 32} y={56} />
          ))}
        </Specimen>
      </Group>

      <Group title="Props" body="Each prop is drawn with its bottom centre at the origin, which is also where a hand grips it. Furniture is two-tone; on dark it carries a 1px border.">
        {TONES.map((tone) => (
          <PropGrid key={tone} tone={tone} />
        ))}
      </Group>

      <Group title="Current" body="The one electrical metaphor: a 20-unit segment in the highlight colour travelling once along a 1px wire, then gone.">
        <div className="lg:w-1/2">
          <CurrentDemo />
        </div>
      </Group>

      <Group title="Sizes" body="48–64px tall on desktop, 36–44px on mobile.">
        <Panel tone="light" className="justify-start gap-10">
          {[36, 44, 48, 56, 64].map((px) => (
            <figure key={px} className="flex flex-col items-center gap-2">
              <Stage width={32} height={52} tone="light" scale={px / 48}>
                <GroundLine y={50} to={32} />
                <Figure role="borrower" index={px} x={16} y={50} />
              </Stage>
              <figcaption className="pb-4 text-caption text-fg-muted tabular">{px}px</figcaption>
            </figure>
          ))}
        </Panel>
      </Group>
    </main>
  );
}
