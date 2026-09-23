import { Figure, GroundLine, Placard } from "@/components/figures";
import { sceneOffers } from "./numbers";
import { actorProps, GROUND_BLEED } from "./render";
import { SceneFrame } from "./scene-frame";
import { closingScript } from "./scripts/closing";

const coda = closingScript();
const chosen = sceneOffers.a;

/** The closing coda: the borrower walks off to the right with the chosen offer. */
export function ClosingScene({ className }: { className?: string }) {
  const { width, height, ground, final } = coda;
  return (
    <SceneFrame
      timelineId="closing"
      width={width}
      height={height}
      tone="dark"
      band="dark"
      label={`The borrower walks away holding one placard: ${chosen.name}, ${chosen.total}.`}
      className={className}
    >
      <GroundLine y={ground} from={-GROUND_BLEED} to={width + GROUND_BLEED} />
      <Figure
        role="borrower"
        index={0}
        animId="coda-borrower"
        {...actorProps(final.borrower)}
        held={<Placard total={chosen.total} rate={chosen.name} flagged />}
      />
    </SceneFrame>
  );
}
