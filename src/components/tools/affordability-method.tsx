import { affordabilityPage } from "@/content/tools";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Container, Section } from "@/components/ui/layout";

/** The three rules the affordability check applies, stated in full. */
export function AffordabilityMethod() {
  const { method } = affordabilityPage;
  return (
    <Section ground="surface-1" aria-labelledby="method-title">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-6">
        <h2 id="method-title" className="text-display-md lg:col-span-4">
          {method.title}
          <FootnoteRef id="affordability-method" />
        </h2>
        <ol className="flex flex-col gap-8 lg:col-span-8">
          {method.rules.map((rule, index) => (
            <li key={rule} className="grid grid-cols-[3ch_1fr] gap-4 border-t border-line pt-6">
              <span className="text-body-md text-fg-muted tabular">{String(index + 1).padStart(2, "0")}</span>
              <p className="max-w-[52ch] text-body-lg text-fg">{rule}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
