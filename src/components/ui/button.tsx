import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "text";

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,border-color,color,transform] duration-150 ease-out select-none disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "rounded-md bg-cta text-white hover:bg-cta-hover active:scale-[0.99]",
  secondary: "rounded-md border border-line-strong text-fg hover:border-fg-muted active:scale-[0.99]",
  text: "min-h-11 text-fg hover:text-link",
};

type Size = "md" | "sm";

/** The white label on the accent fill only passes contrast at 16px and up. */
const sizes: Record<Size, string> = {
  md: "h-12 px-7 text-body-md md:h-13",
  sm: "h-11 px-3.5 text-[16px] md:px-5",
};

type CommonProps = {
  variant?: Variant;
  /** `sm` is the 44px header size; box sizes do not apply to text links. */
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Adds the trailing arrow. Defaults to true for text links. */
  arrow?: boolean;
};

type LinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;
type NativeButtonProps = Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export type ButtonProps =
  | (CommonProps & LinkProps & { href: string })
  | (CommonProps & NativeButtonProps & { href?: undefined });

/**
 * Primary, secondary or text-link button. Renders a Next.js `Link` when
 * `href` is set, otherwise a native `<button>`. Colours come from the
 * current theme, so the same button works on light and dark bands.
 */
export function Button({ variant = "primary", size = "md", className, children, arrow, ...rest }: ButtonProps) {
  const showArrow = arrow ?? variant === "text";
  const classes = cn(
    base,
    variants[variant],
    variant === "text" ? "text-body-md" : sizes[size],
    "group",
    className,
  );
  const content = (
    <>
      {children}
      {showArrow && (
        <span
          aria-hidden
          className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <Link {...(rest as LinkProps & { href: string })} className={classes}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as NativeButtonProps;
  return (
    <button {...buttonProps} type={type} className={classes}>
      {content}
    </button>
  );
}
