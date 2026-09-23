import { routes } from "@/content/site";
import { relatedLoans } from "./related";
import type { LoanPageContent } from "./types";

/**
 * Personal loans. Market figures are typical Singapore terms, marked
 * "to confirm" through the `market-typical` and `moneylender-caps` footnotes.
 */
export const personalLoan: LoanPageContent = {
  purpose: "personal",
  metadata: {
    title: "Personal loans",
    description:
      "Compare personal loans from Singapore banks and licensed moneylenders. See the monthly repayment, total payable and EIR before you apply. Lendingvolt is a comparison platform, not a lender.",
  },
  hero: {
    eyebrow: "Personal loans",
    title: "Power the plans you've already made.",
    subhead:
      "Compare personal loans from banks and licensed moneylenders in one application. Fixed monthly repayments, and every fee shown before you apply.",
    cta: "See my offers",
    disclosure:
      "Lendingvolt is a comparison platform, not a lender. Rates, loan amounts and approval are set by each lender after assessing your application.",
  },
  valueProps: [
    {
      title: "Fixed monthly repayments",
      text: "The same amount every month for the whole tenure, so you can budget from the first payment to the last.",
    },
    {
      title: "Every cost shown upfront",
      text: "Monthly repayment, total payable, processing fee and EIR, side by side for every offer.",
    },
    {
      title: "No charge to compare",
      text: "You pay Lendingvolt nothing. Lenders pay us when a loan completes, and it never changes your rate.",
      footnote: "revenue",
    },
  ],
  example: { amount: 20_000, months: 36, flatRate: 0.0388, feeRate: 0 },
  terms: {
    eyebrow: "Transparent terms",
    title: "Know the terms before you apply.",
    rows: [
      {
        fragment: "worked-example",
        title: "The true cost, worked out",
        body: "Personal loans are usually quoted as a flat rate. The EIR is the number to compare, because it counts fees and the fact that you repay as you go.",
        bullets: [
          { text: "A flat rate is charged on the full amount for the whole tenure." },
          { text: "The EIR is what you pay each year on the balance you still owe." },
          { text: "A processing fee raises the EIR even when the flat rate stays the same." },
        ],
        footnote: "calculator",
      },
      {
        fragment: "repayment-schedule",
        title: "Repayments you can plan around",
        body: "Every payment is the same. Part of it pays down what you borrowed, and part of it is interest.",
        bullets: [
          { text: "Most bank personal loans run for 1 to 5 years.", footnote: "market-typical" },
          { text: "Repaying early can cut the interest you owe, though some lenders charge an early settlement fee." },
          { text: "Late payments add fees and can be reported to Credit Bureau Singapore." },
        ],
        footnote: "schedule-split",
      },
      {
        fragment: "eligibility-table",
        title: "Who can borrow, and how much",
        body: "Banks and licensed moneylenders follow different rules. Most people with a steady income can borrow from a bank; licensed moneylenders lend to more people, with tighter limits and higher costs.",
      },
    ],
  },
  eligibility: {
    columns: [
      { text: "Banks", footnote: "market-typical" },
      { text: "Licensed moneylenders", footnote: "moneylender-caps" },
    ],
    rows: [
      { label: "Minimum age", values: ["21", "21"] },
      {
        label: "Minimum annual income",
        values: ["S$20,000 for citizens and PRs; S$40,000–S$60,000 for foreigners", "No minimum; lower limits below S$20,000"],
      },
      {
        label: "How much you can borrow",
        values: [
          "Up to 4× monthly income, or up to 10× from S$120,000 a year",
          "Up to S$3,000 below S$20,000 a year; up to 6× monthly income above it",
        ],
      },
      { label: "Interest", values: ["Typically 1.5%–5% p.a. flat over 1–5 years", "Capped at 4% a month"] },
      { label: "Fees", values: ["Processing fee of 0%–2%, often waived", "Upfront fee of up to 10% of the principal"] },
      { label: "Cooling-off period", values: ["Varies by bank", "3 business days for loans disbursed from 15 Sep 2026"] },
    ],
  },
  related: relatedLoans("personal"),
  faq: {
    title: "Personal loan questions.",
    link: { label: "All questions", href: routes.faq },
    items: [
      {
        question: "How much can I borrow?",
        answer:
          "With a bank, usually up to 4 times your monthly income, or up to 10 times if you earn S$120,000 a year or more. Licensed moneylenders can lend up to 6 times your monthly income if you earn at least S$20,000 a year, and up to S$3,000 below that. Each lender decides the final amount.",
      },
      {
        question: "What's the difference between a flat rate and the EIR?",
        answer:
          "A flat rate is charged on the full amount you borrowed for the whole tenure, even as you repay it. The effective interest rate (EIR) turns that, plus any fees, into a yearly rate on what you still owe. Compare offers by EIR: 3.88% flat over three years works out to about 7.5% EIR.",
      },
      {
        question: "Should I choose a bank or a licensed moneylender?",
        answer:
          "Banks usually cost less if you meet their income requirements. Licensed moneylenders lend to more people and often fund faster, but they charge more and lend less. Banks are regulated by MAS and licensed moneylenders by the Ministry of Law. We show both side by side so you can decide.",
      },
      {
        question: "Will checking my rate affect my credit score?",
        answer:
          "No. We match you using a soft search, which does not affect your credit score. A lender may run a full credit bureau search once you proceed with them, and they will tell you before they do.",
      },
      {
        question: "How long does approval take?",
        answer:
          "Banks often decide within one to three business days, and some approve existing customers the same day. Licensed moneylenders usually decide faster but verify your identity in person before releasing funds. Timing is set by each lender.",
      },
      {
        question: "Can I repay early?",
        answer:
          "Usually, yes. Some banks charge an early settlement fee, often around 3% of the outstanding balance, and flat-rate loans may use the Rule of 78, which reduces the interest you save. Check the terms in your offer before you accept.",
      },
    ],
  },
  closing: {
    title: "See what you'd actually pay.",
    body: "One application, every matched personal loan offer, and the total cost of each before you commit.",
    cta: "See my offers",
    secondary: "Talk to us on WhatsApp",
  },
};
