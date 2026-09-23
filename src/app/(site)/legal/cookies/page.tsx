import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { cookiesPage } from "@/content/legal";

export const metadata: Metadata = {
  title: cookiesPage.title,
  description: cookiesPage.description,
};

export default function CookiesPage() {
  return <LegalDocument page={cookiesPage} />;
}
