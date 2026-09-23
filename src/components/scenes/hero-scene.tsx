import { ApplicationCard, Current, Figure, GroundLine, Placard, Tag } from "@/components/figures";
import { applicationLabel, sceneOffers } from "./numbers";
import { actorProps, GROUND_BLEED, lenderIndex } from "./render";
import { SceneFrame } from "./scene-frame";
import { heroScript, type HeroVariant } from "./scripts/hero";

const scripts = { desktop: heroScript("desktop"), mobile: heroScript("mobile") };

function describe(variant: HeroVariant): string {
  const queue = [...scripts[variant].final.lenders].sort((a, b) => a.state.x - b.state.x);
  const front = sceneOffers[queue[0].id];
  return `A borrower holds up one application for ${applicationLabel}. ${queue.length} lenders queue with placards showing their total payable, sorted cheapest first; ${front.name} is at the front with ${front.total}, marked lowest total cost.`;
}

function HeroStage({ variant }: { variant: HeroVariant }) {
  const { width, height, ground, final } = scripts[variant];
  return (
    <SceneFrame
      timelineId={`hero-${variant}`}
      width={width}
      height={height}
      tone="dark"
      band="dark"
      label={describe(variant)}
      className="aspect-[5/2] w-full"
    >
      <GroundLine y={ground} from={-GROUND_BLEED} to={width + GROUND_BLEED} />
      <g data-anim="hero-current" style={{ opacity: final.wire.opacity }}>
        <Current from={final.wire.from} to={final.wire.to} />
      </g>
      <Tag x={final.borrower.x} y={ground + 20} text={applicationLabel} />
      <Figure
        role="borrower"
        index={0}
        animId="hero-borrower"
        {...actorProps(final.borrower)}
        held={<ApplicationCard />}
      />
      {final.lenders.map((lender) => {
        const offer = sceneOffers[lender.id];
        return (
          <Figure
            key={lender.id}
            role="lender"
            index={lenderIndex(lender.id)}
            animId={lender.animId}
            {...actorProps(lender.state)}
            held={
              <Placard
                total={offer.total}
                rate={offer.rate}
                flagged={lender.isFront}
                badge={lender.isFront ? "Lowest total cost" : undefined}
              />
            }
          />
        );
      })}
    </SceneFrame>
  );
}

/**
 * The offers line up. Six lenders from 768px, four below.
 * `mobile` renders only the four-lender stage, for placing it on its own.
 */
export function HeroScene({
  className,
  variant = "responsive",
}: {
  className?: string;
  variant?: "responsive" | "mobile";
}) {
  if (variant === "mobile") {
    return (
      <div className={className}>
        <HeroStage variant="mobile" />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="hidden md:block">
        <HeroStage variant="desktop" />
      </div>
      {/* Below 480px the hero puts this stage above the amount field. */}
      <div className="hidden sm:block md:hidden">
        <HeroStage variant="mobile" />
      </div>
    </div>
  );
}
