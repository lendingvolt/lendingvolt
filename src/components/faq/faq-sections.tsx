import Link from "next/link";
import { faqPage, type FaqBlock, type FaqEntry, type FaqListItem } from "@/content/faq";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Container, Section } from "@/components/ui/layout";

const inlineLink = "text-link underline underline-offset-2 hover:text-fg";

function ListItem({ item }: { item: FaqListItem }) {
  if (typeof item === "string") return <li>{item}</li>;
  return (
    <li>
      <Link href={item.link.href} className={inlineLink}>
        {item.link.label}
      </Link>{" "}
      {item.text}
    </li>
  );
}

function Block({ block }: { block: FaqBlock }) {
  if (typeof block === "string") return <p>{block}</p>;
  if ("list" in block) {
    return (
      <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-fg-muted">
        {block.list.map((item) => (
          <ListItem key={typeof item === "string" ? item : item.link.label} item={item} />
        ))}
      </ul>
    );
  }
  return (
    <p>
      {block.text}
      <FootnoteRef id={block.footnote} />
    </p>
  );
}

function Answer({ entry }: { entry: FaqEntry }) {
  return (
    <div className="flex flex-col gap-4">
      {entry.answer.map((block, index) => (
        <Block key={index} block={block} />
      ))}
      {entry.link && (
        <Button href={entry.link.href} variant="text" className="self-start">
          {entry.link.label}
        </Button>
      )}
    </div>
  );
}

/**
 * Mercury's FAQ layout: a centred page title, then one centred heading per
 * topic over a narrow column of questions. Topic links let readers jump
 * straight to a group.
 */
export function FaqDirectory() {
  const { hero, categories, contact } = faqPage;
  return (
    <Section ground="surface-0" aria-labelledby="faq-title">
      <Container>
        <div className="flex flex-col items-center text-center">
          <h1 id="faq-title" className="text-display-md">
            {hero.title}
          </h1>
          <p className="mt-3 max-w-[48ch] text-body-lg md:mt-4">{hero.subhead}</p>
          <nav aria-label={hero.jumpLabel} className="mt-8 md:mt-10">
            <ul className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <a
                    href={`#faq-${category.id}`}
                    className="inline-flex min-h-11 items-center rounded-pill border border-line px-4 text-body-sm text-fg transition-colors hover:border-line-strong hover:text-link"
                  >
                    {category.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mx-auto mt-20 flex max-w-[720px] flex-col gap-20 md:mt-30 md:gap-30">
          {categories.map((category, index) => (
            <section
              key={category.id}
              id={`faq-${category.id}`}
              aria-labelledby={`faq-${category.id}-title`}
            >
              <h2 id={`faq-${category.id}-title`} className="text-center text-heading-lg">
                {category.title}
              </h2>
              <Accordion
                name={`faq-${category.id}`}
                openFirst={index === 0}
                items={category.entries.map((entry) => ({ question: entry.question, answer: <Answer entry={entry} /> }))}
                className="mt-8 md:mt-10"
              />
            </section>
          ))}

          <div className="flex flex-col items-center text-center">
            <h2 className="text-heading-lg">{contact.title}</h2>
            <p className="mt-2 text-body-md">{contact.body}</p>
            <a
              href={contact.link.href}
              className="mt-2 inline-flex min-h-11 items-center text-body-md font-medium text-link underline underline-offset-2 hover:text-fg"
            >
              {contact.link.label}
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
