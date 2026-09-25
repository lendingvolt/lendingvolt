import { routes } from "@/content/site";
import { relatedLoans } from "./related";
import type { LoanPageContent } from "./types";

/**
 * Debt consolidation. Bank figures follow the Debt Consolidation Plan (DCP)
 * rules as typically published; all marked "to confirm" via footnotes.
 */
export const debtConsolidationLoan: LoanPageContent = {
  purpose: "consolidate",
  metadata: {
    title: "Debt consolidation loans",
    description:
      "Combine credit card balances and credit lines into one loan with one fixed monthly repayment. Compare debt consolidation offers from Singapore banks and licensed moneylenders. Lendingvolt is a comparison platform, not a lender.",
  },
  hero: {
    title: "Switch many repayments for one debt consolidation loan.",
    subhead:
      "Combine credit card balances and credit lines into one loan with one fixed monthly repayment. Compare offers from banks and licensed moneylenders in one application.",
    cta: "See my offers",
    disclosure:
      "Lendingvolt is a comparison platform, not a lender. Rates, loan amounts and approval are set by each lender after assessing your application.",
    product: "Debt consolidation loan",
  },
  valueProps: [
    {
      title: "One repayment, one date",
      text: "Replace several card bills and credit line payments with a single fixed amount each month.",
    },
    {
      title: "See what you'd save",
      text: "Every offer shows the total you'd pay, so you can set it against what your cards cost you now.",
    },
    {
      title: "No charge to compare",
      text: "You pay Lendingvolt nothing. Lenders pay us when a loan completes, and it never changes your rate.",
      footnote: "revenue",
    },
  ],
  example: { amount: 30_000, months: 60, flatRate: 0.035, feeRate: 0 },
  terms: {
    eyebrow: "Transparent terms",
    title: "Know the terms before you consolidate.",
    rows: [
      {
        fragment: "worked-example",
        title: "What one loan costs, worked out",
        body: "Credit card balances usually charge far more than a consolidation loan. The EIR lets you compare the two on the same basis.",
        bullets: [
          { text: "Card balances in Singapore typically charge around 27% a year.", footnote: "market-typical" },
          { text: "A consolidation loan's EIR counts the flat rate and any fees." },
          { text: "A longer tenure lowers the monthly repayment but raises the total you pay." },
        ],
        footnote: "calculator",
      },
      {
        fragment: "repayment-schedule",
        title: "A fixed date to pay it down",
        body: "Each payment is the same and part of every one reduces what you owe, so the balance reaches zero on a known date.",
        bullets: [
          { text: "Bank consolidation plans can run for up to 10 years.", footnote: "market-typical" },
          { text: "Avoid new card spending while you repay, or the total owed can climb again." },
          { text: "Late payments add fees and can be reported to Credit Bureau Singapore." },
        ],
        footnote: "schedule-split",
      },
      {
        fragment: "eligibility-table",
        title: "Bank plan or licensed moneylender",
        body: "Banks offer a Debt Consolidation Plan to Singaporeans and PRs within an income band. Licensed moneylenders lend to more people, with smaller limits and higher costs.",
      },
    ],
  },
  eligibility: {
    columns: [
      { text: "Bank Debt Consolidation Plan", footnote: "market-typical" },
      { text: "Licensed moneylenders", footnote: "moneylender-caps" },
    ],
    rows: [
      { label: "Who can apply", values: ["Singapore citizens and PRs", "Citizens, PRs and foreigners"] },
      {
        label: "Income",
        values: [
          "S$30,000–S$120,000 a year, with unsecured debt above 12× monthly income",
          "No minimum; lower limits below S$20,000 a year",
        ],
      },
      {
        label: "What it covers",
        values: [
          "Credit cards and unsecured credit lines; not renovation, education, medical or business loans",
          "Any unsecured debt",
        ],
      },
      { label: "Interest", values: ["Typically 3%–8% EIR over up to 10 years", "Capped at 4% a month"] },
      {
        label: "Your cards afterwards",
        values: [
          "Most cards and credit lines are closed; one new line of up to 1× monthly income",
          "Your cards stay open",
        ],
      },
      { label: "Cooling-off period", values: ["Varies by bank", "3 business days for loans disbursed from 15 Sep 2026"] },
    ],
  },
  related: relatedLoans("consolidate"),
  faq: {
    title: "Debt consolidation questions.",
    link: { label: "All questions", href: routes.faq },
    items: [
      {
        question: "What debts can I consolidate?",
        answer:
          "A bank Debt Consolidation Plan covers credit card balances and unsecured credit lines. It does not cover renovation, education, medical or business loans. Licensed moneylenders can consolidate most unsecured debt.",
      },
      {
        question: "Will consolidating lower what I pay?",
        answer:
          "Usually, if the new loan's EIR is below what your cards charge, which is typically around 27% a year. A longer tenure lowers the monthly repayment but can raise the total. Each offer shows the total payable so you can compare.",
      },
      {
        question: "What happens to my credit cards?",
        answer:
          "With a bank plan, most of your cards and credit lines are closed, and you can keep one new line of up to one month's income. A licensed moneylender loan leaves your cards open, so the discipline is up to you.",
      },
      {
        question: "Am I eligible for a Debt Consolidation Plan?",
        answer:
          "Typically if you are a Singapore citizen or PR, earn S$30,000 to S$120,000 a year, and your unsecured debt is more than 12 times your monthly income. Each bank confirms eligibility when you apply.",
      },
      {
        question: "Will checking my rate affect my credit score?",
        answer:
          "No. We match you using a soft search, which does not affect your credit score. A lender may run a full credit bureau search once you proceed with them, and they will tell you before they do.",
      },
      {
        question: "Can I repay early?",
        answer:
          "Usually, yes, though some lenders charge an early settlement fee and flat-rate loans may use the Rule of 78, which reduces the interest you save. Check the terms in your offer before you accept.",
      },
    ],
  },
  closing: {
    title: "See what one repayment would cost.",
    body: "One application, every matched consolidation offer, and the total cost of each before you commit.",
    cta: "See my offers",
    secondary: "Talk to us on WhatsApp",
  },
};
