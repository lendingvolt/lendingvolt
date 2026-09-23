import Link from "next/link";
import { entityDisclosure, legalLinks, routes } from "@/content/site";
import { Logo } from "@/components/site/logo";
import { Disclaimers } from "@/components/ui/footnotes";

/**
 * Focused chrome for the application: no site navigation, just the wordmark
 * and a way out, then a slim legal strip that footnote markers resolve to.
 */
export default function FlowLayout({ children }: LayoutProps<"/">) {
  return (
    <div data-ground="surface-0" data-theme="light" className="flex flex-1 flex-col bg-bg">
      <header className="h-(--header-h)">
        <div className="mx-auto flex h-full w-full max-w-[1264px] items-center justify-between px-5 md:px-8">
          <Logo />
          <Link
            href={routes.home}
            className="-mr-2 inline-flex min-h-11 items-center px-2 text-body-sm font-medium text-fg-muted hover:text-fg"
          >
            Exit
          </Link>
        </div>
      </header>

      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1264px] flex-col gap-6 px-5 py-10 md:px-8 md:py-12">
          <p className="max-w-[88ch] text-caption text-fg-muted">{entityDisclosure.statement}</p>
          <ul className="flex flex-wrap gap-x-6 text-caption text-fg-muted">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href ?? routes.home} className="inline-flex min-h-11 items-center hover:text-fg">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Disclaimers />
        </div>
      </footer>
    </div>
  );
}
