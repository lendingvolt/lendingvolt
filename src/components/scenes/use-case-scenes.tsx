import { Block, Box, Brick, Figure, GroundLine, Plank, RolledPlan, Slots, Tag } from "@/components/figures";
import { formatSGD } from "@/lib/loan-math";
import { Anim } from "./anim";
import { actorProps, GROUND_BLEED } from "./render";
import { SceneFrame } from "./scene-frame";
import { cashFlowScript, consolidateScript, lifeEventScript, renovateScript } from "./scripts/use-cases";

const consolidate = consolidateScript();
const renovate = renovateScript();
const cashFlow = cashFlowScript();
const lifeEvent = lifeEventScript();

type SceneProps = { className?: string };

export function ConsolidateScene({ className }: SceneProps) {
  const { width, height, ground: G, final } = consolidate;
  return (
    <SceneFrame
      timelineId="consolidate"
      width={width}
      height={height}
      tone="light"
      label="Four boxes due on the 3rd, 12th, 19th and 28th have gone into one box, which the borrower now carries, tagged one monthly repayment."
      className={className}
    >
      <GroundLine y={G} from={-GROUND_BLEED} to={width + GROUND_BLEED} />
      <Figure role="lender" index={1} animId="c1-lender" {...actorProps(final.lender)} />
      <Figure role="borrower" index={0} animId="c1-borrower" {...actorProps(final.borrower)} />
      {final.boxes.map((box) => (
        <Anim key={box.animId} id={box.animId} state={box.state}>
          <Box width={final.sizes.small.width} height={final.sizes.small.height} label={box.label} />
        </Anim>
      ))}
      <Anim id="c1-big-box" state={final.bigBox}>
        <Box width={final.sizes.big.width} height={final.sizes.big.height} highlight />
      </Anim>
      <Anim id="c1-tag" state={final.tag}>
        <Tag text="One monthly repayment" />
      </Anim>
    </SceneFrame>
  );
}

export function RenovateScene({ className }: SceneProps) {
  const { width, height, ground: G, final } = renovate;
  return (
    <SceneFrame
      timelineId="renovate"
      width={width}
      height={height}
      tone="light"
      label="Two workers in hard hats have finished a brick wall while the borrower, holding a rolled plan, looks at it."
      className={className}
    >
      <GroundLine y={G} from={-GROUND_BLEED} to={width + GROUND_BLEED} />
      <Figure role="borrower" index={0} animId="c2-borrower" {...actorProps(final.borrower)} held={<RolledPlan />} />
      {final.workers.map((worker, i) => (
        <Figure key={worker.animId} role="worker" index={i + 1} animId={worker.animId} {...actorProps(worker.state)} />
      ))}
      {final.bricks.map((brick) => (
        <Anim key={brick.animId} id={brick.animId} state={brick.state}>
          <Brick />
        </Anim>
      ))}
    </SceneFrame>
  );
}

export function CashFlowScene({ className }: SceneProps) {
  const { width, height, ground: G, final } = cashFlow;
  const { layout } = final;
  return (
    <SceneFrame
      timelineId="cash-flow"
      width={width}
      height={height}
      tone="light"
      label="A lender has laid a plank across the gap between payroll on Friday and an invoice paid in 30 days. The shopkeeper has walked across."
      className={className}
    >
      <GroundLine y={G} from={-GROUND_BLEED} to={width + GROUND_BLEED} />
      {[layout.left, layout.right].map((platform) => (
        <Block
          key={platform.label}
          x={platform.x}
          y={G}
          width={platform.width}
          height={layout.platformHeight}
          label={platform.label}
          sublabel={platform.sublabel}
        />
      ))}
      <Figure role="lender" index={1} animId="c3-lender" {...actorProps(final.lender)} />
      <Anim id="c3-plank" state={final.plank}>
        <Plank width={layout.plank.width} highlight />
      </Anim>
      <Figure role="shopkeeper" index={2} animId="c3-shopkeeper" {...actorProps(final.shopkeeper)} />
    </SceneFrame>
  );
}

export function LifeEventScene({ className }: SceneProps) {
  const { width, height, ground: G, final } = lifeEvent;
  const { layout } = final;
  return (
    <SceneFrame
      timelineId="life-event"
      width={width}
      height={height}
      tone="light"
      label="A couple have split a S$15,000 block into 24 monthly blocks and placed them in a row of 24 month slots."
      className={className}
    >
      <GroundLine y={G} from={-GROUND_BLEED} to={width + GROUND_BLEED} />
      <Anim id="c4-lump-sum" state={final.lumpSum}>
        <Block width={56} height={24} label={formatSGD(15_000)} tone="ink" />
      </Anim>
      <Slots x={layout.slotsX} y={G} count={final.slots.count} columns={final.slots.columns} size={layout.block} />
      {final.couple.map((person, i) => (
        <Figure key={person.animId} role="borrower" index={i} animId={person.animId} {...actorProps(person.state)} />
      ))}
      {final.months.map((month) => (
        <Anim key={month.animId} id={month.animId} state={month.state}>
          <Block width={layout.block} height={layout.block} tone={month.isHighlighted ? "highlight" : "ink"} />
        </Anim>
      ))}
      <Anim id="c4-tag" state={final.tag}>
        <Tag text={formatSGD(15_000)} />
      </Anim>
    </SceneFrame>
  );
}

/** The four use-case scenes, in the order of the cards. */
export const useCaseScenes = [ConsolidateScene, RenovateScene, CashFlowScene, LifeEventScene] as const;

