import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { PageTheme } from "@/components/site/page-theme";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lendingvolt — Compare licensed lenders in Singapore",
    template: "%s · Lendingvolt",
  },
  description:
    "One application. Offers from licensed lenders in Singapore, side by side. A soft check that leaves your credit file untouched. Lendingvolt is a comparison platform, not a lender.",
};

export const viewport: Viewport = {
  themeColor: "#171721",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-SG" className={instrumentSans.variable}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-surface-0 focus:px-4 focus:py-3 focus:text-ink-800"
        >
          Skip to content
        </a>
        <PageTheme />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
