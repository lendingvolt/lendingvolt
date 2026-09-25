import Link from "next/link";
import type { ReactNode } from "react";
import { howItWorksPage, type ProcessVisual } from "@/content/how-it-works";
import { testimonials } from "@/content/home";
import { loanLimits } from "@/content/offers";
import { GraphicSlot } from "@/components/graphics/graphic-slot";
import { AmountForm } from "@/components/home/amount-form";
import {
  AmountFragment,
  ChooseFragment,
  OfferRowsFragment,
  TILE_HEIGHT,
} from "@/components/home/how-it-works-fragments";
import { OfferFragment } from "@/components/loans/loan-hero";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Badge, Container, Eyebrow, Reveal, Section } from "@/components/ui/layout";
import { cn } from "@/lib/cn";

/** Dark band: headline, one literal line, four points, the amount form, then the product. */
export function HowHero() {
  const { hero } = howItWorksPage;
  return (
    <Section ground="ink-900" spacing="none" aria-labelledby="how-hero-title" className="-mt-(--header-h) overflow-hidden">
      <Container className="grid gap-12 pt-[calc(var(--header-h)+64px)] lg:min-h-[80vh] lg:grid-cols-12 lg:gap-6 lg:pt-[calc(var(--header-h)+32px)]">
        <div className="flex flex-col justify-center lg:col-span-6 lg:py-24">
          <h1 id="how-hero-title" className="max-w-[17ch] text-display-lg">
            {hero.title}
          </h1>
          <p className="mt-3 max-w-[52ch] text-body-lg text-fg-muted md:mt-4">{hero.subhead}</p>
          <ul className="mt-6 flex flex-col gap-2 md:mt-8">
            {hero.points.map((point) => (
              <li key={point.text} className="grid grid-cols-[12px_1fr] gap-3 text-body-md text-fg">
                <span aria-hidden className="mt-[11px] size-1.5 rounded-pill bg-cta" />
                <span>
                  {point.text}
                  {point.footnote && <FootnoteRef id={point.footnote} />}
                </span>
              </li>
            ))}
          </ul>
          <AmountForm cta={hero.cta} className="mt-8 md:mt-10" />
          <p className="mt-4 text-caption text-fg-muted">{hero.note}</p>
          <p className="mt-6 max-w-[56ch] border-t border-line pt-4 text-caption text-fg-muted">{hero.disclosure}</p>
        </div>
        {/* Bleeds to the viewport's right edge: the gutter, plus the space beside the 1264px container. */}
        <div className="-mr-5 self-end md:-mr-8 lg:col-span-6 lg:mr-[min(-2rem,calc(600px-50vw))] lg:self-center">
          <OfferFragment amount={loanLimits.amount.initial} months={loanLimits.tenure.initial} />
        </div>
      </Container>
    </Section>
  );
}

/** Six things you can do here, each a linked title and one line. */
export function LoanTypes() {
  const { loanTypes } = howItWorksPage;
  return (
    <Section ground="surface-0" aria-labelledby="loan-types-title">
      <Container>
        <h2 id="loan-types-title" className="max-w-[20ch] text-display-md">
          {loanTypes.title}
        </h2>
        <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-y-12">
          {loanTypes.items.map((item) => (
            <li key={item.title}>
              <Reveal className="flex h-full flex-col gap-2 border-t border-line pt-6">
                <h3 className="text-heading-sm">
                  <Link href={item.href} className="group inline-flex min-h-11 items-center gap-2 hover:text-link">
                    {item.title}
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </h3>
                <p className="max-w-[40ch] text-body-md">{item.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

const processVisuals: Record<ProcessVisual, ReactNode> = {
  form: <AmountFragment tile />,
  "soft-check": (
    <GraphicSlot
      scene="soft-check"
      ground="ink-900"
      label="A disc passing through a plane without leaving a mark: the soft search."
      className={cn("h-[300px] rounded-xl md:h-[360px]", TILE_HEIGHT)}
    />
  ),
  offers: <OfferRowsFragment tile />,
  choose: <ChooseFragment tile />,
};

/** The four stages in a two-up grid, each a piece of the product above a numbered title. */
export function Process() {
  const { process } = howItWorksPage;
  return (
    <Section ground="surface-1" aria-labelledby="process-title">
      <Container>
        <div className="flex flex-col gap-4">
          <h2 id="process-title" className="text-display-md">
            {process.title}
          </h2>
          <p className="max-w-[52ch] text-body-md">{process.body}</p>
        </div>
        <ol className="mt-12 grid gap-x-6 gap-y-16 md:mt-20 lg:grid-cols-2 lg:gap-y-20">
          {process.steps.map((step, index) => (
            <li key={step.title}>
              <Reveal className="flex flex-col gap-8">
                {processVisuals[step.visual]}
                <div className="grid grid-cols-[3ch_1fr] gap-4">
                  <span className="text-body-md text-fg-muted tabular">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-heading-sm">{step.title}</h3>
                    <p className="mt-2 max-w-[48ch] text-body-md">
                      {step.body}
                      {step.footnote && <FootnoteRef id={step.footnote} />}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/**
 * Lendingvolt against applying lender by lender. A grouped table with a
 * sticky header from 768px; below that, each row becomes a stacked card.
 */
export function ComparisonTable() {
  const { comparison } = howItWorksPage;
  const [ours, theirs] = comparison.columns;
  return (
    <Section ground="surface-0" aria-labelledby="comparison-title">
      <Container>
        <h2 id="comparison-title" className="text-display-md">
          {comparison.title}
        </h2>

        <table className="mt-12 hidden w-full border-separate border-spacing-0 text-left md:mt-16 md:table">
          <thead className="sticky top-(--header-h) z-10">
            <tr>
              <th
                scope="col"
                className="w-[32%] rounded-tl-xl border-y border-l border-line bg-surface-1 px-6 py-4 font-normal"
              >
                <span className="sr-only">Compared on</span>
              </th>
              <th scope="col" className="border-y border-line bg-surface-1 px-6 py-4 text-body-sm font-medium text-fg">
                {ours}
              </th>
              <th
                scope="col"
                className="rounded-tr-xl border-y border-r border-line bg-surface-1 px-6 py-4 text-body-sm font-medium text-fg-muted"
              >
                {theirs}
              </th>
            </tr>
          </thead>
          {comparison.groups.map((group, groupIndex) => {
            const isLastGroup = groupIndex === comparison.groups.length - 1;
            return (
              <tbody key={group.title}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={3}
                    className="border-x border-b border-line px-6 pt-8 pb-3 text-label font-medium text-fg-muted"
                  >
                    {group.title}
                  </th>
                </tr>
                {group.rows.map((row, rowIndex) => {
                  const isLast = isLastGroup && rowIndex === group.rows.length - 1;
                  const cell = "border-b border-line px-6 py-4 align-top transition-colors";
                  return (
                    <tr key={row.label} className="h-14 text-body-sm hover:bg-tint">
                      <th
                        scope="row"
                        className={cn(cell, "border-l font-medium text-fg", isLast && "rounded-bl-xl")}
                      >
                        {row.label}
                        {row.footnote && <FootnoteRef id={row.footnote} />}
                      </th>
                      <td className={cn(cell, "text-fg tabular")}>{row.values[0]}</td>
                      <td className={cn(cell, "border-r text-fg-body tabular", isLast && "rounded-br-xl")}>
                        {row.values[1]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            );
          })}
        </table>

        <div className="mt-12 flex flex-col gap-10 md:hidden">
          {comparison.groups.map((group, groupIndex) => (
            <section
              key={group.title}
              aria-labelledby={`comparison-group-${groupIndex}`}
              className="flex flex-col gap-4"
            >
              <h3 id={`comparison-group-${groupIndex}`} className="text-label text-fg-muted">
                {group.title}
              </h3>
              {group.rows.map((row) => (
                <div key={row.label} className="rounded-lg border border-line p-6">
                  <p className="text-body-sm font-medium text-fg">
                    {row.label}
                    {row.footnote && <FootnoteRef id={row.footnote} />}
                  </p>
                  <dl className="mt-4 divide-y divide-line">
                    {comparison.columns.map((column, index) => (
                      <div key={column} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
                        <dt className="text-body-sm text-fg-muted">{column}</dt>
                        <dd className={cn("text-body-sm tabular", index === 0 ? "text-fg" : "text-fg-body")}>
                          {row.values[index]}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/** The headline and a figure we can source, then two typographic quotes side by side. */
export function Proof() {
  const { proof } = howItWorksPage;
  return (
    <Section ground="ink-900" aria-labelledby="proof-title">
      <Container>
        <div className="flex flex-col gap-4">
          <h2 id="proof-title" className="max-w-[18ch] text-display-lg">
            {proof.title}
          </h2>
          <p className="text-body-sm text-fg-muted tabular">
            {proof.stat}
            <FootnoteRef id={proof.footnote} />
          </p>
        </div>
        <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-2 lg:gap-6">
          {testimonials.items.map((item) => (
            <Reveal key={item.quote}>
              <figure className="flex flex-col gap-6 border-t border-line pt-6 lg:pr-12">
                <div className="flex flex-wrap items-center gap-3">
                  <Eyebrow>{item.tag}</Eyebrow>
                  {testimonials.isPlaceholder && <Badge>Placeholder quote</Badge>}
                </div>
                <blockquote className="text-display-md text-fg">
                  <p>“{item.quote}”</p>
                </blockquote>
                <figcaption className="text-body-sm text-fg-muted">
                  <span className="text-fg">{item.name}</span>
                  <span aria-hidden> · </span>
                  {item.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
