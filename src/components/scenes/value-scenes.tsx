import {
  ApplicationCard,
  Block,
  Brick,
  Counter,
  Current,
  Desk,
  FilingCabinet,
  Figure,
  Folder,
  GroundLine,
  Magnifier,
  Placard,
  Receipt,
  Stamp,
  Tag,
  Tray,
} from "@/components/figures";
import { Anim } from "./anim";
import { sceneOffers, SCENE_LOAN } from "./numbers";
import { actorProps, GROUND_BLEED, lenderIndex } from "./render";
import { SceneFrame } from "./scene-frame";
import {
  noChargeScript,
  oneApplicationScript,
  softCheckScript,
  trueCostScript,
  type SceneVariant,
} from "./scripts/value";
import { formatSGD } from "@/lib/loan-math";

const oneApplication = { wide: oneApplicationScript("wide"), narrow: oneApplicationScript("narrow") };
const softCheck = softCheckScript();
const trueCost = trueCostScript();
const noCharge = noChargeScript();

type SceneProps = { className?: string };

const COUNT_WORDS: Record<number, string> = { 4: "Four", 6: "Six" };

/**
 * Six lenders where the cell is at least ~470px wide (480–767px, one
 * column; 1024px and up, two columns). Four in narrower cells, so every
 * placard stays legible.
 */
export function OneApplicationScene({ className }: SceneProps) {
  return (
    <>
      <div className="hidden sm:block md:hidden lg:block">
        <OneApplicationStage variant="wide" className={className} />
      </div>
      <div className="sm:hidden md:block lg:hidden">
        <OneApplicationStage variant="narrow" className={className} />
      </div>
    </>
  );
}

function OneApplicationStage({ variant, className }: SceneProps & { variant: SceneVariant }) {
  const { width, height, ground: G, final } = oneApplication[variant];
  const { layout } = final;
  return (
    <SceneFrame
      timelineId={`one-application-${variant}`}
      width={width}
      height={height}
      tone="light"
      label={`One application card sits in a tray on the borrower's desk. ${COUNT_WORDS[final.lenders.length]} lenders have stepped out from their desks and face the borrower, each holding up an offer.`}
      className={className}
    >
      <GroundLine y={G} from={-GROUND_BLEED} to={width + GROUND_BLEED} />
      <g data-anim="v1-current" style={{ opacity: final.wire.opacity }}>
        <Current from={final.wire.from} to={final.wire.to} />
      </g>
      {final.lenders.map((lender) => {
        const offer = sceneOffers[lender.id];
        return (
          <Figure
            key={lender.id}
            role="lender"
            index={lenderIndex(lender.id)}
            animId={lender.animId}
            {...actorProps(lender.state)}
            held={<Placard total={offer.total} rate={offer.rate} />}
          />
        );
      })}
      {final.desks.map((x) => (
        <Desk key={x} x={x} y={G} width={layout.lenderDeskWidth} />
      ))}
      <Desk x={layout.deskX} y={G} />
      <Anim id="v1-tray-card" state={final.trayCard}>
        <ApplicationCard highlight />
      </Anim>
      <Tray x={layout.trayX} y={G - 20} />
      <Figure
        role="borrower"
        index={0}
        animId="v1-borrower"
        {...actorProps(final.borrower)}
        held={
          <g data-anim="v1-hand-card" style={{ opacity: final.handCardOpacity }}>
            <ApplicationCard highlight />
          </g>
        }
      />
    </SceneFrame>
  );
}

export function SoftCheckScene({ className }: SceneProps) {
  const { width, height, ground: G, final } = softCheck;
  const { layout } = final;
  return (
    <SceneFrame
      timelineId="soft-check"
      width={width}
      height={height}
      tone="light"
      label="A lender has looked at a borrower's folder through a magnifier. The clerk has put it back in the filing cabinet unmarked, the stamp on the desk unused. A tag reads: soft check, no record."
      className={className}
    >
      <GroundLine y={G} from={-GROUND_BLEED} to={width + GROUND_BLEED} />
      <Desk x={layout.deskX} y={G} width={40} />
      <Stamp x={layout.deskX} y={G - 20} />
      <Anim id="v2-drawer-folder" state={final.drawerFolder}>
        <Folder highlight />
      </Anim>
      <g data-anim="v2-cabinet">
        <FilingCabinet x={layout.cabinetX} y={G} open={final.drawerOpen ? 0 : undefined} />
      </g>
      <Figure
        role="clerk"
        index={3}
        animId="v2-clerk"
        {...actorProps(final.clerk)}
        held={
          <g data-anim="v2-hand-folder" style={{ opacity: final.handFolderOpacity }}>
            <Folder highlight />
          </g>
        }
      />
      <Figure
        role="lender"
        index={1}
        animId="v2-lender"
        {...actorProps(final.lender)}
        held={
          <g transform="scale(-1 1)">
            <Magnifier />
          </g>
        }
      />
      <Anim id="v2-tag" state={final.tag}>
        <Tag text="Soft check · no record" />
      </Anim>
    </SceneFrame>
  );
}

export function TrueCostScene({ className }: SceneProps) {
  const { width, height, ground: G, final } = trueCost;
  const { layout } = final;
  return (
    <SceneFrame
      timelineId="true-cost"
      width={width}
      height={height}
      tone="light"
      label={`Three stacks, each a ${formatSGD(SCENE_LOAN.amount)} block topped with interest bricks: ${final.stacks
        .map((stack) => `${sceneOffers[stack.id].name} ${stack.bricks.length} bricks, ${stack.tag.text} in total`)
        .join("; ")}. The borrower stops at the shortest.`}
      className={className}
    >
      <GroundLine y={G} from={-GROUND_BLEED} to={width + GROUND_BLEED} />
      {final.stacks.map((stack) => (
        <Figure
          key={stack.id}
          role="lender"
          index={lenderIndex(stack.id)}
          animId={stack.lender.animId}
          {...actorProps(stack.lender.state)}
        />
      ))}
      {final.stacks.map((stack) => (
        <g key={stack.id}>
          <Block
            x={stack.x}
            y={G}
            width={layout.baseWidth}
            height={layout.baseHeight}
            label={formatSGD(SCENE_LOAN.amount)}
            tone="ink"
          />
          {stack.bricks.map((brick) => (
            <Anim key={brick.animId} id={brick.animId} state={brick.state}>
              <Brick />
            </Anim>
          ))}
          <Anim id={stack.tag.animId} state={stack.tag.state}>
            <Tag text={stack.tag.text} />
          </Anim>
        </g>
      ))}
      <Figure role="borrower" index={0} animId="v3-borrower" {...actorProps(final.borrower)} />
    </SceneFrame>
  );
}

const RECEIPT_LINES = ["Application", "Comparison", "Matching", "Support"].map((label) => ({
  label,
  value: formatSGD(0, true),
}));

export function NoChargeScene({ className }: SceneProps) {
  const { width, height, ground: G, final } = noCharge;
  return (
    <SceneFrame
      timelineId="no-charge"
      width={width}
      height={height}
      tone="light"
      label="A clerk behind a counter has handed the borrower a receipt, which the borrower holds up to read: application, comparison, matching and support, each S$0.00. Total S$0.00."
      className={className}
    >
      <GroundLine y={G} from={-GROUND_BLEED} to={width + GROUND_BLEED} />
      <Figure role="clerk" index={2} animId="v4-clerk" {...actorProps(final.clerk)} />
      <Anim id="v4-receipt" state={final.receipt}>
        <Receipt lines={RECEIPT_LINES} total={{ label: "Total", value: formatSGD(0, true) }} />
      </Anim>
      <Counter x={final.layout.counterX} y={G} />
      <Figure role="borrower" index={0} animId="v4-borrower" {...actorProps(final.borrower)} />
    </SceneFrame>
  );
}

/** The four value-grid scenes, in the order of the cells. */
export const valueScenes = [OneApplicationScene, SoftCheckScene, TrueCostScene, NoChargeScene] as const;
