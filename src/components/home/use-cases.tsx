import Link from "next/link";
import { useCases } from "@/content/home";
import { Container, Section } from "@/components/ui/layout";
import { useCaseScenes } from "@/components/scenes/use-case-scenes";

/** Four cards into the loan-type pages; carries most internal linking. */
export function UseCases() {
  return (
    <Section ground="surface-1" aria-labelledby="use-cases-title">
      <Container>
        <h2 id="use-cases-title" className="text-display-md">
          {useCases.title}
        </h2>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4 lg:gap-6">
          {useCases.cards.map((card, index) => {
            const Scene = useCaseScenes[index];
            return (
              <li key={card.title}>
                <article className="group relative flex h-full flex-col rounded-lg border border-line bg-card p-6 transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card md:p-8">
                  <Scene className="aspect-square rounded-md bg-surface-1" />
                  <h3 className="mt-6 text-heading-sm">{card.title}</h3>
                  <p className="mt-2 flex-1 text-body-sm">{card.body}</p>
                  <Link
                    href={card.href}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 text-body-sm font-medium text-fg after:absolute after:inset-0 after:rounded-lg group-hover:text-link"
                  >
                    See rates
                    <span className="sr-only"> for {card.title.toLowerCase()}</span>
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
