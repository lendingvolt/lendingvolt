import type { Metadata } from "next";
import { renovationLoan } from "@/content/loans/renovation";
import { LoanPage } from "@/components/loans/loan-page";

export const metadata: Metadata = renovationLoan.metadata;

export default function RenovationLoansPage() {
  return <LoanPage content={renovationLoan} />;
}
