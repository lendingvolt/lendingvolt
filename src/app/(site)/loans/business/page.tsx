import type { Metadata } from "next";
import { businessLoan } from "@/content/loans/business";
import { LoanPage } from "@/components/loans/loan-page";

export const metadata: Metadata = businessLoan.metadata;

export default function BusinessLoansPage() {
  return <LoanPage content={businessLoan} />;
}
