import Link from "next/link";
import { about } from "@/content/about";
import { GraphicSlot } from "@/components/graphics/graphic-slot";
import { Button } from "@/components/ui/button";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Container, Eyebrow, Reveal, Section } from "@/components/ui/layout";
import { cn } from "@/lib/cn";

/** Statement H2, then two rows of story beside a render, alternating sides. */
export function AboutStory() {
  const { story } = about;
  return (
    <Section ground="surface-0" aria-labelledby="story-title">
      <Container>
        <div className="flex flex-col gap-4">
          <Eyebrow>{story.eyebrow}</Eyebrow>
          <h2 id="story-title" className="max-w-[22ch] text-display-md">
            {story.title}
          </h2>
        </div>
        <div className="mt-16 flex flex-col gap-20 md:mt-20 md:gap-30">
          {story.rows.map((row, index) => (
            <Reveal key={row.title} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
              <div className={cn("lg:col-span-5", index % 2 === 1 && "lg:order-2 lg:col-start-8")}>
                <h3 className="text-heading-lg">{row.title}</h3>
                <p className="mt-4 max-w-[52ch] text-body-md">
                  {row.body}
                  {"footnote" in row && row.footnote && <FootnoteRef id={row.footnote} />}
                </p>
              </div>
              <div className={cn("lg:col-span-6", index % 2 === 1 ? "lg:order-1 lg:col-start-1" : "lg:col-start-7")}>
                <GraphicSlot
                  scene={row.scene}
                  ground={row.tone === "dark" ? "ink-900" : "surface-1"}
                  className={cn(
                    "aspect-[3/2] rounded-xl border",
                    row.tone === "dark" ? "border-[var(--border-dark)]" : "border-line",
                  )}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/** The revenue model, disclosed in full, beside the two-equal-spheres render. */
export function AboutPaid() {
  const { paid } = about;
  return (
    <Section ground="surface-1" aria-labelledby="paid-title">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-6">
          <Eyebrow>{paid.eyebrow}</Eyebrow>
          <h2 id="paid-title" className="mt-4 text-display-lg">
            {paid.title}
          </h2>
          <p className="mt-4 max-w-[52ch] text-body-lg">
            {paid.body}
            <FootnoteRef id={paid.footnote} />
          </p>
          <dl className="mt-10 flex flex-col">
            {paid.facts.map((fact) => (
              <div key={fact.title} className="grid gap-1 border-t border-line py-5 sm:grid-cols-[14rem_1fr] sm:gap-6">
                <dt className="text-heading-sm text-fg">{fact.title}</dt>
                <dd className="text-body-md">{fact.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Reveal className="lg:col-span-5 lg:col-start-8 lg:self-center">
          <GraphicSlot scene="no-charge" ground="surface-0" className="aspect-square rounded-xl border border-line" />
        </Reveal>
      </Container>
    </Section>
  );
}

/** Banks, licensed moneylenders, and the lenders we never work with. */
export function AboutLenders() {
  const { lenders } = about;
  return (
    <Section ground="surface-0" aria-labelledby="lenders-title">
      <Container>
        <div className="flex flex-col gap-4">
          <Eyebrow>{lenders.eyebrow}</Eyebrow>
          <h2 id="lenders-title" className="text-display-md">
            {lenders.title}
          </h2>
        </div>
        <ul className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-6">
          {lenders.groups.map((group) => (
            <li key={group.title}>
              <Reveal className="flex h-full flex-col gap-3 border-t border-line pt-6">
                <h3 className="text-heading-lg">{group.title}</h3>
                <p className="max-w-[40ch] text-body-md">
                  {group.body}
                  {"footnote" in group && group.footnote && <FootnoteRef id={group.footnote} />}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/** Four numbered principles. */
export function AboutPrinciples() {
  const { principles } = about;
  return (
    <Section ground="surface-1" aria-labelledby="principles-title">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col gap-4 lg:col-span-4">
          <Eyebrow>{principles.eyebrow}</Eyebrow>
          <h2 id="principles-title" className="text-display-md">
            {principles.title}
          </h2>
        </div>
        <ol className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:col-span-8">
          {principles.items.map((item, index) => (
            <li key={item.title} className="grid grid-cols-[3ch_1fr] gap-4 border-t border-line pt-6">
              <span className="text-body-md text-fg-muted tabular">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-heading-sm">{item.title}</h3>
                <p className="mt-2 max-w-[40ch] text-body-md">{item.body}</p>
                {"link" in item && item.link && (
                  <Link
                    href={item.link.href}
                    className="mt-2 inline-flex min-h-11 items-center text-body-sm font-medium text-link underline underline-offset-2 hover:text-fg"
                  >
                    {item.link.label}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/** Three ways to reach us, then the company details the disclosure refers to. */
export function AboutContact() {
  const { contact } = about;
  return (
    <Section ground="surface-0" aria-labelledby="contact-title">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <h2 id="contact-title" className="text-display-md">
              {contact.title}
            </h2>
            <p className="max-w-[48ch] text-body-lg">{contact.body}</p>
          </div>
          <Button href={contact.whatsapp.href} variant="text" target="_blank" rel="noopener noreferrer">
            {contact.whatsapp.label}
          </Button>
        </div>

        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
          {contact.cards.map((card) => (
            <li key={card.title}>
              <article className="flex h-full flex-col rounded-lg border border-line bg-card p-6 md:p-8">
                <h3 className="text-heading-sm">{card.title}</h3>
                <p className="mt-2 flex-1 text-body-sm">{card.body}</p>
                <a
                  href={card.link.href}
                  className="mt-6 inline-flex min-h-11 items-center text-body-sm font-medium text-link underline underline-offset-2 [overflow-wrap:anywhere] hover:text-fg"
                >
                  {card.link.label}
                </a>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid gap-8 border-t border-line pt-10 md:mt-20 lg:grid-cols-12 lg:gap-6">
          <h3 className="text-heading-sm lg:col-span-4">{contact.company.title}</h3>
          <div className="flex flex-col gap-6 lg:col-span-8">
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {contact.company.rows.map((row) => (
                <div key={row.term} className="flex flex-col gap-0.5">
                  <dt className="text-caption text-fg-muted">{row.term}</dt>
                  <dd className="text-body-md text-fg tabular">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </Section>
  );
}
