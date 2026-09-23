"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { cn } from "@/lib/cn";

/** The three-shard mark. Takes its colour from `currentColor`. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="54 7 1017 1111"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      className={className}
    >
      <path fill="currentColor" d="M1069.957 1117.012 54.926 268.152l209.543 587.871Z" />
      <path fill="currentColor" d="M827.059 830.395 394.273 468.473 341.289 7.887Z" />
      <path fill="currentColor" d="M1017.738 1025.277 894.82 635.512 687.73 466.488Z" />
    </svg>
  );
}

/** Mark and live wordmark, linking home. On the homepage it scrolls to the top. */
export function Logo({ className }: { className?: string }) {
  const pathname = usePathname();

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <Link
      href="/"
      aria-label="Lendingvolt home"
      onClick={onClick}
      className={cn("inline-flex min-h-11 items-center gap-2.5 text-fg", className)}
    >
      <LogoMark className="h-[22px] w-auto shrink-0" />
      <span className="text-[20px] leading-none tracking-[-0.01em] [font-variation-settings:'wght'_480]">
        Lendingvolt
      </span>
    </Link>
  );
}
