import { routes } from "@/content/site";
import { relatedLoans } from "./related";
import type { LoanPageContent } from "./types";

/**
 * Business loans. Government-scheme figures follow the Enterprise Financing
 * Scheme working capital loan as typically published; marked "to confirm".
 */
export const businessLoan: LoanPageContent = {
  purpose: "business",
  metadata: {
    title: "Business loans",
    description:
      "Compare business loans for working capital, stock and payroll from Singapore banks and licensed lenders, including government-backed options. Lendingvolt is a comparison platform, not a lender.",
  },
  hero: {
    title: "Business loans that keep the current flowing.",
    subhead:
      "Compare business loans for working capital, stock and payroll in one application. Offers from banks and licensed lenders, with the total cost of each shown side by side.",
    cta: "See my offers",
    disclosure:
      "Lendingvolt is a comparison platform, not a lender. Rates, loan amounts and approval are set by each lender after assessing your business.",
    product: "Business term loan",
  },
  valueProps: [
    {
      title: "Built around cash flow",
      text: "Fixed monthly repayments you can plan against invoices, payroll and seasonal stock.",
    },
    {
      title: "Government-backed options",
      text: "Offers under the Enterprise Financing Scheme appear alongside standard business term loans.",
      footnote: "market-typical",
    },
    {
      title: "No charge to compare",
      text: "You pay Lendingvolt nothing. Lenders pay us when a loan completes, and it never changes your rate.",
      footnote: "revenue",
    },
  ],
  example: { amount: 80_000, months: 36, flatRate: 0.055, feeRate: 0.01 },
  terms: {
    eyebrow: "Transparent terms",
    title: "Know the terms before you sign.",
    rows: [
      {
        fragment: "worked-example",
        title: "Working capital, worked out",
        body: "Business loans are often quoted as a flat rate plus a processing fee. The EIR combines both, so you can compare one offer with another.",
        bullets: [
          { text: "A flat rate is charged on the full amount for the whole tenure." },
          { text: "A processing fee is usually deducted before the funds reach your account." },
          { text: "Most lenders ask directors for a personal guarantee." },
        ],
        footnote: "calculator",
      },
      {
        fragment: "repayment-schedule",
        title: "Repayments against cash flow",
        body: "Every payment is the same, so you can set it against the revenue you expect each month.",
        bullets: [
          { text: "Business term loans usually run for 1 to 5 years.", footnote: "market-typical" },
          { text: "Some lenders offer a short interest-only period at the start." },
          { text: "Late payments add fees and can be reported to Credit Bureau Singapore and Moneylenders Credit Bureau." },
        ],
        footnote: "schedule-split",
      },
      {
        fragment: "eligibility-table",
        title: "Government-backed or unsecured",
        body: "The Enterprise Financing Scheme lets banks lend more to SMEs because Enterprise Singapore shares the risk. Unsecured business term loans are quicker to arrange, for smaller amounts.",
      },
    ],
  },
  eligibility: {
    columns: [
      { text: "EFS working capital loan", footnote: "market-typical" },
      { text: "Unsecured business term loan", footnote: "market-typical" },
    ],
    rows: [
      { label: "How much you can borrow", values: ["Up to S$500,000", "Typically S$50,000–S$300,000"] },
      { label: "Tenure", values: ["Up to 5 years", "1–5 years"] },
      {
        label: "Business requirements",
        values: [
          "Registered and operating in Singapore; at least 30% local shareholding; group revenue up to S$100M or up to 200 employees",
          "Usually at least 2 years of trading and a minimum annual revenue set by the lender",
        ],
      },
      { label: "Interest", values: ["Set by each bank; typically 5%–9% EIR", "Typically 6%–12% EIR"] },
      { label: "Guarantee", values: ["Personal guarantee from directors", "Personal guarantee from directors"] },
      { label: "Government risk share", values: ["Enterprise Singapore shares 50%–70% of the risk", "None"] },
    ],
  },
  related: relatedLoans("business"),
  faq: {
    title: "Business loan questions.",
    link: { label: "All questions", href: routes.faq },
    items: [
      {
        question: "How much can my business borrow?",
        answer:
          "Under the Enterprise Financing Scheme, working capital loans go up to S$500,000. Unsecured business term loans are typically S$50,000 to S$300,000. Each lender sets the amount from your revenue, trading history and existing debt.",
      },
      {
        question: "Does my business qualify for the Enterprise Financing Scheme?",
        answer:
          "Typically if it is registered and operating in Singapore, has at least 30% local shareholding, and has group revenue of up to S$100 million or up to 200 employees. The participating bank confirms eligibility.",
      },
      {
        question: "What documents will lenders ask for?",
        answer:
          "Usually your ACRA business profile, recent bank statements, financial statements or management accounts, and the directors' Notices of Assessment. Some lenders can retrieve part of this through Singpass and Myinfo Business.",
      },
      {
        question: "Do I need to give a personal guarantee?",
        answer:
          "Most business loans in Singapore ask directors for a personal guarantee, including loans under government schemes. It means you are personally responsible if the business cannot repay.",
      },
      {
        question: "Will checking my rate affect my credit score?",
        answer:
          "No. We match you using a soft search, which does not affect your credit score. A lender may run a full credit bureau search once you proceed with them, and they will tell you before they do.",
      },
      {
        question: "How fast can funds arrive?",
        answer:
          "Unsecured business loans can fund within a few business days of approval. Government-backed loans usually take longer because the bank assesses more documents. Timing is set by each lender.",
      },
    ],
  },
  closing: {
    title: "See what the capital would cost.",
    body: "One application, every matched business loan offer, and the total cost of each before you commit.",
    cta: "See my offers",
    secondary: "Talk to us on WhatsApp",
  },
};
