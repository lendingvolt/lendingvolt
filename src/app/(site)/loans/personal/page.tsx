import type { Metadata } from "next";
import { personalLoan } from "@/content/loans/personal";
import { LoanPage } from "@/components/loans/loan-page";

export const metadata: Metadata = personalLoan.metadata;

export default function PersonalLoansPage() {
  return <LoanPage content={personalLoan} />;
}
