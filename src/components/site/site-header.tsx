"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { navGroups, routes, type NavGroup } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { cn } from "@/lib/cn";
import { Logo } from "./logo";

const SCROLL_THRESHOLD = 40;

/**
 * Sticky 72px header. Transparent at the top of the page, then a blurred
 * band in the current page colour with a hairline border after 40px.
 * Every colour follows the page theme, so it crossfades with the page.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpenGroup(null);
    setIsMenuOpen(false);
  }

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!isMenuOpen && !openGroup) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenGroup(null);
      setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMenuOpen, openGroup]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [isMenuOpen]);

  const isSolid = isScrolled || isMenuOpen;

  return (
    <header
      className="site-header sticky top-0 z-50 h-(--header-h)"
      data-theme-lock={isMenuOpen ? "light" : undefined}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-out",
          isSolid
            ? "border-line bg-bg/92 backdrop-blur-md backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
      />
      <Container className="relative flex h-full items-center justify-between gap-3 md:gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navGroups.map((group) => (
              <li key={group.label}>
                <NavDropdown
                  group={group}
                  isOpen={openGroup === group.label}
                  onOpenChange={(isOpen) => setOpenGroup(isOpen ? group.label : null)}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href={routes.login}
            className="hidden min-h-11 items-center px-2 text-body-sm font-medium text-fg hover:text-link sm:inline-flex"
          >
            Log in
          </Link>
          <Button href={routes.apply} size="sm">
            Apply Now
          </Button>
          <button
            type="button"
            className="-mr-2.5 inline-flex size-11 shrink-0 items-center justify-center rounded-md text-fg lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span aria-hidden className="relative block h-3 w-5">
              <span
                className={cn(
                  "absolute left-0 h-px w-5 bg-current transition-transform duration-300 ease-out",
                  isMenuOpen ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-px w-5 bg-current transition-transform duration-300 ease-out",
                  isMenuOpen ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </Container>

      {isMenuOpen && <MobileMenu />}
    </header>
  );
}

function NavDropdown({
  group,
  isOpen,
  onOpenChange,
}: {
  group: NavGroup;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) onOpenChange(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen, onOpenChange]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onPointerEnter={(event) => event.pointerType === "mouse" && onOpenChange(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && onOpenChange(false)}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) onOpenChange(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          event.stopPropagation();
          onOpenChange(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => onOpenChange(!isOpen)}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-body-sm font-medium text-fg hover:text-link"
      >
        {group.label}
        <span
          aria-hidden
          className={cn(
            "mt-px inline-block size-1.5 rotate-45 border-r border-b border-current transition-transform duration-200 ease-out",
            isOpen ? "translate-y-0.5 -rotate-135" : "-translate-y-0.5",
          )}
        />
      </button>
      <div
        id={panelId}
        hidden={!isOpen}
        className="absolute top-full left-1/2 w-[340px] -translate-x-1/2 pt-3"
      >
        <div data-theme-lock="light" className="rounded-lg bg-surface-0 p-3 shadow-pop">
          <ul className="flex flex-col">
            {group.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex flex-col gap-0.5 rounded-md p-3 transition-colors hover:bg-surface-1"
                >
                  <span className="text-heading-sm text-fg">{item.title}</span>
                  <span className="text-body-sm text-fg-muted">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MobileMenu() {
  return (
    <div
      id="mobile-menu"
      data-theme-lock="light"
      className="fixed inset-x-0 top-(--header-h) bottom-0 overflow-y-auto bg-surface-0 lg:hidden"
    >
      <Container className="flex flex-col gap-10 py-8">
        <nav aria-label="Mobile" className="flex flex-col gap-8">
          {navGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-2">
              <p className="text-label text-fg-muted">{group.label}</p>
              <ul className="flex flex-col">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="flex min-h-11 items-center text-heading-sm text-fg">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="flex flex-col gap-3 border-t border-line pt-8">
          <Button href={routes.apply} className="w-full">
            Start an application
          </Button>
          <Button href={routes.login} variant="secondary" className="w-full">
            Log in
          </Button>
        </div>
      </Container>
    </div>
  );
}
