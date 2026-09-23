import type { Metadata } from "next";
import { faqAnswerText, faqPage } from "@/content/faq";
import { FaqDirectory } from "@/components/faq/faq-sections";
import { ClosingCta } from "@/components/home/closing";

export const metadata: Metadata = faqPage.metadata;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqPage.categories.flatMap((category) =>
    category.entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: faqAnswerText(entry) },
    })),
  ),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <FaqDirectory />
      <ClosingCta content={faqPage.closing} />
    </>
  );
}
