import type { Metadata } from "next";
import { ApplyFlow } from "@/components/apply/apply-flow";

export const metadata: Metadata = {
  title: "Apply",
  description: "One application to Singapore's licensed lenders. A soft check, and every offer side by side.",
  robots: { index: false },
};

export default function ApplyPage() {
  return <ApplyFlow />;
}
