import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { privacyPage } from "@/content/legal";

export const metadata: Metadata = {
  title: privacyPage.title,
  description: privacyPage.description,
};

export default function PrivacyPage() {
  return <LegalDocument page={privacyPage} />;
}
