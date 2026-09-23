import type { LoanPageContent } from "@/content/loans/types";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Container, Reveal, Section } from "@/components/ui/layout";

/** Three short promises, each a title and one sentence. */
export function ValueProps({ items }: { items: LoanPageContent["valueProps"] }) {
  return (
    <Section ground="surface-0" aria-label="Why compare with Lendingvolt">
      <Container>
        <ul className="grid gap-10 md:grid-cols-3 md:gap-6">
          {items.map((item) => (
            <li key={item.title}>
              <Reveal className="flex h-full flex-col gap-3 border-t border-line pt-6">
                <h2 className="text-heading-lg">{item.title}</h2>
                <p className="max-w-[40ch] text-body-md">
                  {item.text}
                  {item.footnote && <FootnoteRef id={item.footnote} />}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
