import type { ReactNode } from "react";
import { closingCta, faq, stats, type LoanPurpose } from "@/content/home";
import { contact } from "@/content/site";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/layout";
import { StatsBand } from "@/components/ui/stats-band";
import { AmountForm } from "./amount-form";

export function Stats() {
  return (
    <Section ground="surface-1" aria-label="Lendingvolt in numbers">
      <Container>
        <StatsBand stats={stats} />
      </Container>
    </Section>
  );
}

type FaqContent = {
  title: string;
  link: { label: string; href: string };
  items: readonly { question: string; answer: ReactNode }[];
};

/** Title and link on the left, an exclusive accordion on the right. Homepage copy by default. */
export function Faq({
  content = faq,
  name = "home-faq",
  divider = true,
}: {
  content?: FaqContent;
  name?: string;
  /** Hairline above, for when the FAQ follows another beige section. */
  divider?: boolean;
}) {
  return (
    <Section ground="surface-1" aria-labelledby={`${name}-title`} className={divider ? "pt-0 md:pt-0" : undefined}>
      <Container>
        <div
          className={
            divider
              ? "grid gap-10 border-t border-line pt-16 md:pt-30 lg:grid-cols-12 lg:gap-6"
              : "grid gap-10 lg:grid-cols-12 lg:gap-6"
          }
        >
          <div className="flex flex-col items-start gap-6 lg:col-span-4">
            <h2 id={`${name}-title`} className="text-display-md">
              {content.title}
            </h2>
            <Button href={content.link.href} variant="text">
              {content.link.label}
            </Button>
          </div>
          <Accordion name={name} items={content.items} className="lg:col-span-8" />
        </div>
      </Container>
    </Section>
  );
}

type ClosingContent = { title: string; body: string; cta: string; secondary: string };

/** Mirrors the hero: one line, the amount field, a quiet way to talk to us. */
export function ClosingCta({
  content = closingCta,
  purpose,
  scene,
}: {
  content?: ClosingContent;
  purpose?: LoanPurpose;
  /** A scene beside the form on desktop, beneath it on mobile. */
  scene?: ReactNode;
}) {
  return (
    <Section ground="ink-900" spacing="roomy" aria-labelledby="closing-title">
      <Container className={scene ? "grid items-center gap-10 lg:grid-cols-12 lg:gap-6" : undefined}>
        <div className={scene ? "lg:col-span-7" : undefined}>
          <h2 id="closing-title" className="max-w-[16ch] text-display-lg">
            {content.title}
          </h2>
          <p className="mt-3 max-w-[48ch] text-body-lg text-fg-muted md:mt-4">{content.body}</p>
          <AmountForm
            cta={content.cta}
            defaultPurpose={purpose}
            className="mt-6 md:mt-8"
            secondary={
              <Button href={contact.whatsapp} variant="text" target="_blank" rel="noopener noreferrer">
                {content.secondary}
              </Button>
            }
          />
        </div>
        {scene && <div className="lg:col-span-5">{scene}</div>}
      </Container>
    </Section>
  );
}
