import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { termsPage } from "@/content/legal";

export const metadata: Metadata = {
  title: termsPage.title,
  description: termsPage.description,
};

export default function TermsPage() {
  return <LegalDocument page={termsPage} />;
}
