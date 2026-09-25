import { routes } from "@/content/site";
import { relatedLoans } from "./related";
import type { LoanPageContent } from "./types";

/** Renovation loans. Market figures are typical bank terms, marked "to confirm" via footnotes. */
export const renovationLoan: LoanPageContent = {
  purpose: "renovate",
  metadata: {
    title: "Renovation loans",
    description:
      "Compare renovation loans for HDB flats and private homes from Singapore banks and lenders. See the monthly repayment, total payable and EIR before you apply. Lendingvolt is a comparison platform, not a lender.",
  },
  hero: {
    title: "Renovation loans that work without resistance.",
    subhead:
      "Compare renovation loans for HDB flats and private homes in one application. Fixed monthly repayments, and the full cost of the works shown before you apply.",
    cta: "See my offers",
    disclosure:
      "Lendingvolt is a comparison platform, not a lender. Rates, loan amounts and approval are set by each lender after assessing your application.",
    product: "Renovation loan",
  },
  valueProps: [
    {
      title: "Keep your savings intact",
      text: "Spread the cost of the works over a few years instead of emptying your emergency fund.",
    },
    {
      title: "Know the limit upfront",
      text: "Bank renovation loans are capped by the cost of the works and your income, so you can plan the scope first.",
      footnote: "market-typical",
    },
    {
      title: "No charge to compare",
      text: "You pay Lendingvolt nothing. Lenders pay us when a loan completes, and it never changes your rate.",
      footnote: "revenue",
    },
  ],
  example: { amount: 25_000, months: 48, flatRate: 0.032, feeRate: 0 },
  terms: {
    eyebrow: "Transparent terms",
    title: "Know the terms before the works begin.",
    rows: [
      {
        fragment: "worked-example",
        title: "The cost of the works, worked out",
        body: "Renovation loans are often quoted at a lower rate than personal loans. The EIR shows what the loan really costs once fees and repayments are counted.",
        bullets: [
          { text: "A flat rate is charged on the full amount for the whole tenure." },
          { text: "Some bank renovation loans use a floating rate that can change during the tenure." },
          { text: "Ask for the EIR on every quote, including any processing or insurance fees." },
        ],
        footnote: "calculator",
      },
      {
        fragment: "repayment-schedule",
        title: "Repayments you can plan around",
        body: "Every payment is the same, so you can set it against your monthly budget before a contractor starts.",
        bullets: [
          { text: "Bank renovation loans usually run for 1 to 5 years.", footnote: "market-typical" },
          { text: "Funds from a bank renovation loan are usually paid straight to your contractor." },
          { text: "Late payments add fees and can be reported to Credit Bureau Singapore." },
        ],
        footnote: "schedule-split",
      },
      {
        fragment: "eligibility-table",
        title: "Renovation loan or personal loan",
        body: "A bank renovation loan usually costs less but covers only the works and pays your contractor. A personal loan can be used for anything, including furniture and appliances.",
      },
    ],
  },
  eligibility: {
    columns: [
      { text: "Bank renovation loans", footnote: "market-typical" },
      { text: "Personal loans used for renovation", footnote: "market-typical" },
    ],
    rows: [
      {
        label: "How much you can borrow",
        values: ["The lower of S$30,000 or 6× monthly income", "Up to 4× monthly income from a bank"],
      },
      { label: "Who can apply", values: ["Owners of the home being renovated", "Anyone who meets the lender's income rules"] },
      {
        label: "Minimum annual income",
        values: ["Around S$24,000–S$30,000", "S$20,000 for citizens and PRs; more for foreigners"],
      },
      {
        label: "Interest",
        values: ["Typically 3%–5% p.a., often floating, over 1–5 years", "Typically 1.5%–5% p.a. flat over 1–5 years"],
      },
      { label: "Paid to", values: ["Your contractor", "You"] },
      {
        label: "What it covers",
        values: ["Works on the home; usually not loose furniture or appliances", "Anything, including furniture and appliances"],
      },
    ],
  },
  related: relatedLoans("renovate"),
  faq: {
    title: "Renovation loan questions.",
    link: { label: "All questions", href: routes.faq },
    items: [
      {
        question: "How much can I borrow for a renovation?",
        answer:
          "Bank renovation loans are usually capped at the lower of S$30,000 or six times your monthly income, and at the quoted cost of the works. If you need more, or want to cover furniture and appliances, a personal loan may suit better.",
      },
      {
        question: "Does the loan work for HDB flats?",
        answer:
          "Yes. Most bank renovation loans cover HDB flats, executive condominiums and private homes. You usually need to own the home, alone or jointly, and use an approved contractor.",
      },
      {
        question: "Who receives the money?",
        answer:
          "Bank renovation loans are usually paid straight to your contractor, often in stages. Personal loans are paid to you, so you manage the payments yourself.",
      },
      {
        question: "Is the rate fixed?",
        answer:
          "Personal loans are fixed. Some bank renovation loans use a floating rate that can change during the tenure, so ask for the EIR and how the rate is set before you accept.",
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
    title: "See what the works would cost.",
    body: "One application, every matched renovation offer, and the total cost of each before you commit.",
    cta: "See my offers",
    secondary: "Talk to us on WhatsApp",
  },
};
