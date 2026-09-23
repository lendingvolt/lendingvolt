"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll colour controller. Watches a line across the middle of the
 * viewport; whichever section crosses it hands its ground (and light or dark
 * theme) to <html>, and the registered colour variables crossfade the page.
 * Renders nothing. Without JavaScript each section paints itself instead.
 */
export function PageTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-ground]"));
    if (sections.length === 0) return;

    const apply = (section: HTMLElement) => {
      const { theme, ground } = section.dataset;
      if (!theme || !ground) return;
      if (root.dataset.pageGround === ground && root.dataset.pageTheme === theme) return;
      root.dataset.pageTheme = theme;
      root.dataset.pageGround = ground;
    };

    // Set the starting colour without a fade, then enable the crossfade.
    const middle = window.innerHeight / 2;
    const initial =
      sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= middle && rect.bottom >= middle;
      }) ?? sections[0];
    root.classList.remove("theme-ready");
    apply(initial);
    root.classList.add("has-page-theme");

    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => root.classList.add("theme-ready"));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) apply(entry.target as HTMLElement);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
