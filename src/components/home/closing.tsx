import { closingCta, faq, stats } from "@/content/home";
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

export function Faq() {
  return (
    <Section ground="surface-1" aria-labelledby="faq-title" className="pt-0 md:pt-0">
      <Container>
        <div className="grid gap-10 border-t border-line pt-16 md:pt-30 lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col items-start gap-6 lg:col-span-4">
            <h2 id="faq-title" className="text-display-md">
              {faq.title}
            </h2>
            <Button href={faq.link.href} variant="text">
              {faq.link.label}
            </Button>
          </div>
          <Accordion name="home-faq" items={faq.items} className="lg:col-span-8" />
        </div>
      </Container>
    </Section>
  );
}

/** Mirrors the hero: one line, the amount field, a quiet way to talk to us. */
export function ClosingCta() {
  return (
    <Section ground="ink-900" spacing="roomy" aria-labelledby="closing-title">
      <Container>
        <h2 id="closing-title" className="max-w-[16ch] text-display-lg">
          {closingCta.title}
        </h2>
        <p className="mt-3 max-w-[48ch] text-body-lg text-fg-muted md:mt-4">{closingCta.body}</p>
        <AmountForm
          cta={closingCta.cta}
          className="mt-6 md:mt-8"
          secondary={
            <Button href={contact.whatsapp} variant="text" target="_blank" rel="noopener noreferrer">
              {closingCta.secondary}
            </Button>
          }
        />
      </Container>
    </Section>
  );
}
