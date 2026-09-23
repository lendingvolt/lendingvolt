import type { Metadata } from "next";
import { debtConsolidationLoan } from "@/content/loans/debt-consolidation";
import { LoanPage } from "@/components/loans/loan-page";

export const metadata: Metadata = debtConsolidationLoan.metadata;

export default function DebtConsolidationPage() {
  return <LoanPage content={debtConsolidationLoan} />;
}
