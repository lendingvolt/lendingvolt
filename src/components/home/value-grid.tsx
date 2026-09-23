import { valueGrid } from "@/content/home";
import { GraphicSlot } from "@/components/graphics/graphic-slot";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Container, Reveal, Section } from "@/components/ui/layout";

/** Statement line, then four cells: render, title, one sentence. */
export function ValueGrid() {
  return (
    <Section ground="surface-0" aria-labelledby="value-title" className="pt-8 md:pt-12">
      <Container>
        <Reveal>
          <h2 id="value-title" className="mx-auto max-w-[22ch] text-center text-display-lg">
            {valueGrid.statement}
          </h2>
        </Reveal>

        <ul className="mt-16 grid gap-x-6 gap-y-16 md:mt-20 md:grid-cols-2 md:gap-y-20">
          {valueGrid.cells.map((cell) => (
            <li key={cell.title}>
              <Reveal>
                <GraphicSlot
                  scene={cell.scene}
                  ground="surface-1"
                  className="aspect-[4/5] rounded-lg sm:aspect-[3/2]"
                />
                <h3 className="mt-6 text-heading-lg md:mt-8">{cell.title}</h3>
                <p className="mt-2 max-w-[48ch] text-body-md">
                  {cell.body}
                  {"footnote" in cell && <FootnoteRef id={cell.footnote} />}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
