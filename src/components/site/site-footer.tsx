import Link from "next/link";
import { entityDisclosure, footerColumns, legalLinks, type FooterLink } from "@/content/site";
import { Disclaimers } from "@/components/ui/footnotes";
import { Container } from "@/components/ui/layout";

function FooterItem({ link }: { link: FooterLink }) {
  if (!link.href) {
    return <span className="inline-flex min-h-11 items-center">{link.label}</span>;
  }
  return (
    <Link href={link.href} className="inline-flex min-h-11 items-center transition-colors hover:text-fg">
      {link.label}
    </Link>
  );
}

/**
 * Dark footer: the full site map in five columns (accordions below 768px),
 * then the entity disclosure, legal links and the numbered disclaimers every
 * footnote on the page resolves to.
 */
export function SiteFooter() {
  return (
    <footer data-ground="ink-900" data-theme="dark" className="pt-20 pb-12 md:pt-30">
      <Container>
        <div className="hidden gap-8 md:grid md:grid-cols-3 lg:grid-cols-5">
          {footerColumns.map((column) => (
            <div key={column.heading} className="flex flex-col gap-4">
              <h2 className="text-label text-fg">{column.heading}</h2>
              <ul className="flex flex-col text-body-sm text-fg-muted">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterItem link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-line md:hidden">
          {footerColumns.map((column) => (
            <details key={column.heading} className="group border-b border-line">
              <summary className="flex min-h-14 cursor-pointer items-center justify-between">
                <h2 className="text-label text-fg">{column.heading}</h2>
                <span
                  aria-hidden
                  className="size-2 rotate-45 border-r border-b border-fg-muted transition-transform duration-200 group-open:-rotate-135"
                />
              </summary>
              <ul className="flex flex-col pb-4 text-body-sm text-fg-muted">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterItem link={link} />
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-8 border-t border-line pt-10 md:mt-20">
          <div className="flex max-w-[88ch] flex-col gap-3 text-caption text-fg-muted">
            <p>
              {entityDisclosure.copyright} {entityDisclosure.builtWith}
            </p>
            <p>{entityDisclosure.statement}</p>
          </div>

          <ul className="flex flex-wrap gap-x-6 text-caption text-fg-muted">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <FooterItem link={link} />
              </li>
            ))}
          </ul>

          <section aria-labelledby="disclaimers-heading" className="flex flex-col gap-4">
            <h2 id="disclaimers-heading" className="text-label text-fg">
              Disclaimers
            </h2>
            <Disclaimers />
          </section>
        </div>
      </Container>
    </footer>
  );
}
