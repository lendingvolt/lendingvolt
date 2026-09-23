import Link from "next/link";
import type { LoanPageContent } from "@/content/loans/types";
import { GraphicSlot } from "@/components/graphics/graphic-slot";
import { Container, Reveal, Section } from "@/components/ui/layout";

/** Three cards into the other loan-type pages. */
export function RelatedLoans({
  related,
}: {
  related: LoanPageContent["related"];
}) {
  return (
    <Section ground="surface-1" aria-labelledby="related-title">
      <Container>
        <h2 id="related-title" className="text-display-md">
          {related.title}
        </h2>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6">
          {related.items.map((item) => (
            <li key={item.title}>
              <Reveal className="h-full">
                <article className="group relative flex h-full flex-col rounded-lg border border-line bg-card p-6 transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card md:p-8">
                  <GraphicSlot
                    scene={item.scene}
                    ground="surface-1"
                    className="aspect-[3/2] rounded-md"
                  />
                  <h3 className="mt-6 text-heading-sm">{item.title}</h3>
                  <p className="mt-2 flex-1 text-body-sm">{item.body}</p>
                  <Link
                    href={item.href}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 text-body-sm font-medium text-fg after:absolute after:inset-0 after:rounded-lg group-hover:text-link"
                  >
                    See rates
                    <span className="sr-only">
                      {" "}
                      for {item.title.toLowerCase()}
                    </span>
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
