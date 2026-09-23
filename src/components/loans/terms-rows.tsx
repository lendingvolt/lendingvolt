import type { ReactNode } from "react";
import type { LoanPageContent, TermsRow } from "@/content/loans/types";
import { FootnoteRef } from "@/components/ui/footnotes";
import { Container, Eyebrow, Reveal, Section } from "@/components/ui/layout";
import { cn } from "@/lib/cn";
import { EligibilityTable, RepaymentSchedule, WorkedExample } from "./fragments";

function RowText({ row }: { row: TermsRow }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-heading-lg">{row.title}</h3>
      <p className="max-w-[52ch] text-body-md">
        {row.body}
        {row.footnote && <FootnoteRef id={row.footnote} />}
      </p>
      {row.bullets && (
        <ul className="mt-2 flex flex-col gap-3">
          {row.bullets.map((bullet) => (
            <li key={bullet.text} className="grid grid-cols-[12px_1fr] gap-3 text-body-md">
              <span aria-hidden className="mt-[11px] size-1.5 rounded-pill bg-cta" />
              <span className="max-w-[48ch]">
                {bullet.text}
                {bullet.footnote && <FootnoteRef id={bullet.footnote} />}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Mercury's "transparent terms" rows: each a heading, one paragraph and a
 * few bullets beside a piece of the product, alternating sides. The
 * eligibility table is real reading content, so it spans the full width.
 */
export function TermsRows({ content }: { content: LoanPageContent }) {
  const { terms, example, eligibility } = content;
  const fragment: Record<TermsRow["fragment"], ReactNode> = {
    "worked-example": <WorkedExample example={example} />,
    "repayment-schedule": <RepaymentSchedule example={example} />,
    "eligibility-table": <EligibilityTable eligibility={eligibility} />,
  };

  return (
    <Section ground="surface-1" aria-labelledby="terms-title">
      <Container>
        <div className="flex flex-col gap-4">
          <Eyebrow>{terms.eyebrow}</Eyebrow>
          <h2 id="terms-title" className="text-display-md">
            {terms.title}
          </h2>
        </div>

        <div className="mt-16 flex flex-col gap-20 md:mt-20 md:gap-30">
          {terms.rows.map((row, index) =>
            row.fragment === "eligibility-table" ? (
              <Reveal key={row.title} className="flex flex-col gap-10">
                <RowText row={row} />
                {fragment[row.fragment]}
              </Reveal>
            ) : (
              <Reveal key={row.title} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
                <div className={cn("lg:col-span-5", index % 2 === 1 && "lg:order-2 lg:col-start-8")}>
                  <RowText row={row} />
                </div>
                <div className={cn("lg:col-span-6", index % 2 === 1 ? "lg:order-1 lg:col-start-1" : "lg:col-start-7")}>
                  {fragment[row.fragment]}
                </div>
              </Reveal>
            ),
          )}
        </div>
      </Container>
    </Section>
  );
}
