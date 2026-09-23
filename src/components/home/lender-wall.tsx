import { lenderWall } from "@/content/home";
import { Container, Section } from "@/components/ui/layout";

function Wordmark({ name }: { name: string }) {
  return (
    <span className="text-[22px] leading-none font-semibold tracking-[-0.02em] whitespace-nowrap text-fg-faint">
      {name}
    </span>
  );
}

/**
 * Quiet row of lender wordmarks under the hero. Static on desktop, a slow
 * 40s marquee on mobile. Placeholder names until licensed logos arrive.
 */
export function LenderWall() {
  return (
    <Section ground="surface-0" spacing="none" aria-labelledby="lender-wall-title" className="py-16 md:py-24">
      <Container>
        <h2 id="lender-wall-title" className="text-center text-body-md text-fg-muted">
          {lenderWall.line}
        </h2>

        <ul className="mt-10 hidden flex-wrap items-center justify-center gap-x-12 gap-y-8 motion-reduce:flex md:flex md:justify-between">
          {lenderWall.lenders.map((name) => (
            <li key={name}>
              <Wordmark name={name} />
            </li>
          ))}
        </ul>
      </Container>

      <div className="mt-10 overflow-hidden motion-reduce:hidden md:hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <ul className="marquee-track flex w-max items-center gap-12 pr-12">
          {[...lenderWall.lenders, ...lenderWall.lenders].map((name, index) => (
            <li key={`${name}-${index}`} aria-hidden={index >= lenderWall.lenders.length || undefined}>
              <Wordmark name={name} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
