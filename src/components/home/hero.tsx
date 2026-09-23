import { hero } from "@/content/home";
import { Button } from "@/components/ui/button";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Container, Section } from "@/components/ui/layout";
import { HeroScene } from "@/components/scenes/hero-scene";
import { AmountForm } from "./amount-form";

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
              {hero.subheadMiddle}
              {hero.subheadFootnoted}
              <FootnoteRef id="soft-search" />
              {hero.subheadAfter}
            </p>
            <AmountForm
              cta={hero.cta}
              withPurpose
              className="mt-6 md:mt-8"
              secondary={
                <Button href={hero.secondary.href} variant="text">
                  {hero.secondary.label}
                </Button>
              }
            />
          </div>
          <HeroScene className="lg:col-span-6" />
        </div>
        <ul className="mt-14 flex flex-wrap gap-x-6 gap-y-2 text-caption text-fg-muted md:mt-20">
          {hero.trust.map((item, index) => (
            <li key={item} className="flex items-center gap-6">
              {index > 0 && <span aria-hidden className="hidden h-3 w-px bg-line-strong sm:block" />}
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
