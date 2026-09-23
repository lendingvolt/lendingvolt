import { valueGrid } from "@/content/home";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Container, Section } from "@/components/ui/layout";
import { valueScenes } from "@/components/scenes/value-scenes";

/** Statement line, then four cells: scene, title, one sentence. */
export function ValueGrid() {
  return (
    <Section ground="surface-0" aria-labelledby="value-title">
      <Container>
        <h2 id="value-title" className="mx-auto max-w-[22ch] text-center text-display-lg">
          {valueGrid.statement}
        </h2>

        <ul className="mt-16 grid gap-x-6 gap-y-16 md:mt-20 md:grid-cols-2 md:gap-y-20">
          {valueGrid.cells.map((cell, index) => {
            const Scene = valueScenes[index];
            return (
              <li key={cell.title}>
                <Scene className="aspect-[3/2] rounded-lg bg-surface-1" />
                <h3 className="mt-6 text-heading-lg md:mt-8">{cell.title}</h3>
                <p className="mt-2 max-w-[48ch] text-body-md">
                  {cell.body}
                  {"footnote" in cell && <FootnoteRef id={cell.footnote} />}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
