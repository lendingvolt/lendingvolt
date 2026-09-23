import Image from "next/image";
import { hero } from "@/content/home";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Container, Section } from "@/components/ui/layout";
import { HeroScene } from "@/components/scenes/hero-scene";
import { cn } from "@/lib/cn";
import { AmountForm } from "./amount-form";

/** Source is 1404×243; shown at the caption's cap height. */
const SINGPASS_HEIGHT = 14;
const SINGPASS_WIDTH = Math.round((SINGPASS_HEIGHT * 1404) / 243);
/** The white and full-colour marks share one cell and crossfade with the page theme. */
const logoLayer = "col-start-1 row-start-1 h-3.5 w-auto transition-opacity duration-(--theme-fade) ease-linear";

/** Dark hero band: one headline, one literal subhead, the amount form. */
export function Hero() {
  return (
    <Section ground="ink-900" spacing="none" aria-labelledby="hero-title" className="-mt-(--header-h) overflow-hidden">
      <Container className="relative flex flex-col justify-center pt-[calc(var(--header-h)+64px)] pb-20 md:min-h-[88vh] md:pt-[calc(var(--header-h)+80px)] md:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="max-w-[640px] lg:col-span-6">
            <h1 id="hero-title" className="text-display-xl">
              {hero.title}
            </h1>
            <p className="mt-3 max-w-[52ch] text-body-lg text-fg-muted md:mt-4">
              {hero.subheadBefore}
              <span className="tabular">{hero.lenderCount}</span>
              <FootnoteRef id="lender-count" />
              {hero.subheadAfter}
              <span className="ml-6 hidden align-middle lg:inline-flex">
                <TrustStrip inline />
              </span>
            </p>
            <div className="mt-6 sm:hidden">
              <HeroScene variant="mobile" />
              <TrustStrip className="mt-4" />
            </div>
            <AmountForm
              cta={hero.cta}
              withPurpose
              purposeClassName="max-sm:hidden"
              className="mt-6 md:mt-8"
            />
          </div>
          <div className="hidden sm:block lg:col-span-6">
            <HeroScene />
            <TrustStrip className="mt-6 md:mt-8 lg:hidden" />
          </div>
        </div>
      </Container>
    </Section>
  );
}

/**
 * Singpass wordmark and the regulator line. `inline` renders a span so it can
 * sit inside the subhead, on the line after "Singapore.", on desktop.
 */
function TrustStrip({ className, inline = false }: { className?: string; inline?: boolean }) {
  const items = [
    <span key="singpass" className="flex items-center gap-1.5">
      <span className="grid">
        <Image
          src={hero.singpass.onDark}
          alt={hero.singpass.alt}
          width={SINGPASS_WIDTH}
          height={SINGPASS_HEIGHT}
          className={cn(logoLayer, "[html.has-page-theme[data-page-theme=light]_&]:opacity-0")}
        />
        <Image
          src={hero.singpass.onLight}
          alt=""
          aria-hidden
          width={SINGPASS_WIDTH}
          height={SINGPASS_HEIGHT}
          className={cn(logoLayer, "opacity-0 [html.has-page-theme[data-page-theme=light]_&]:opacity-100")}
        />
      </span>
      {hero.singpass.label}
    </span>,
    ...hero.trust,
  ];

  const Tag = inline ? "span" : "ul";
  const Item = inline ? "span" : "li";

  return (
    <Tag
      className={cn(
        "flex-wrap items-center gap-x-6 gap-y-2 text-caption text-fg-muted",
        inline ? "inline-flex" : "flex",
        className,
      )}
    >
      {items.map((item, index) => (
        <Item key={index} className="flex items-center gap-6">
          {index > 0 && <span aria-hidden className="hidden h-3 w-px bg-line-strong sm:block" />}
          {item}
        </Item>
      ))}
    </Tag>
  );
}
