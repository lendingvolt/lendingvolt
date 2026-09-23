import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { pdpaPage } from "@/content/legal";

export const metadata: Metadata = {
  title: pdpaPage.title,
  description: pdpaPage.description,
};

export default function PdpaPage() {
  return <LegalDocument page={pdpaPage} />;
}
