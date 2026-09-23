import { lenderVetting } from "@/content/home";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Container, Section } from "@/components/ui/layout";

/** How lenders get onto the panel: a statement, then the three things we check. */
export function LenderVetting() {
  return (
    <Section ground="surface-1" aria-labelledby="vetting-title">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-5">
          <h2 id="vetting-title" className="max-w-[18ch] text-display-md">
            {lenderVetting.title}
            <FootnoteRef id={lenderVetting.footnote} />
          </h2>
          <p className="mt-4 max-w-[44ch] text-body-md">{lenderVetting.lead}</p>
        </div>

        <ol className="flex flex-col lg:col-span-6 lg:col-start-7">
          {lenderVetting.criteria.map((criterion) => (
            <li key={criterion.title} className="border-t border-line py-6 last:pb-0">
              <h3 className="text-heading-sm">{criterion.title}</h3>
              <p className="mt-2 max-w-[52ch] text-body-md">{criterion.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
