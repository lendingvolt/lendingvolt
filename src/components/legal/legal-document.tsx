import Link from "next/link";
import type { LegalBlock, LegalInline, LegalPageContent } from "@/content/legal";
import { legalLinks, routes } from "@/content/site";
import { Container, Eyebrow, Section } from "@/components/ui/layout";

const textLink = "text-link underline decoration-link/40 underline-offset-2 hover:decoration-link";

const hrefByTitle: Record<string, string> = {
  "Terms of Use": routes.terms,
  "Privacy Policy": routes.privacy,
  "PDPA Notice": routes.pdpa,
  "Cookie Policy": routes.cookies,
};

function Inline({ content }: { content: readonly LegalInline[] }) {
  return content.map((part, index) =>
    typeof part === "string" ? (
      part
    ) : (
      <Link key={index} href={part.href} className={textLink}>
        {part.label}
      </Link>
    ),
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (block.type === "ul") {
    return (
      <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-fg-muted">
        {block.items.map((item, index) => (
          <li key={index}>
            <Inline content={item} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p>
      <Inline content={block.content} />
    </p>
  );
}

/** A fine-print page: one column, a contents list, then numbered sections. */
export function LegalDocument({ page }: { page: LegalPageContent }) {
  const headingId = "legal-title";
  const others = legalLinks.filter((link) => link.href && hrefByTitle[link.label] !== hrefByTitle[page.title]);

  return (
    <Section ground="surface-0" aria-labelledby={headingId}>
      <Container>
        <article className="mx-auto flex max-w-[720px] flex-col">
          <Eyebrow>Legal</Eyebrow>
          <h1 id={headingId} className="mt-4 text-display-md">
            {page.title}
          </h1>
          <p className="mt-4 text-caption text-fg-muted">Last updated {page.updated}</p>
          <p className="mt-6 max-w-[60ch] text-body-lg">{page.intro}</p>

          <nav aria-label="On this page" className="mt-10 border-t border-line pt-8">
            <p className="text-label text-fg-muted">On this page</p>
            <ol className="mt-2">
              {page.sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className={`inline-flex min-h-11 items-center text-body-sm ${textLink}`}>
                    {index + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-12 flex flex-col gap-12 md:mt-16">
            {page.sections.map((section, index) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-24">
                <h2 id={`${section.id}-title`} className="text-heading-lg">
                  {index + 1}. {section.title}
                </h2>
                <div className="mt-4 flex max-w-[60ch] flex-col gap-4 text-body-md">
                  {section.blocks.map((block, blockIndex) => (
                    <Block key={blockIndex} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <nav aria-label="Other legal pages" className="mt-16 border-t border-line pt-10">
            <p className="text-label text-fg-muted">Also in this section</p>
            <ul className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:gap-x-6">
              {others.map((link) => (
                <li key={link.href}>
                  <Link href={link.href ?? "#"} className={`inline-flex min-h-11 items-center text-body-sm ${textLink}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </Container>
    </Section>
  );
}
