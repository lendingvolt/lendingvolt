import type { FootnoteId } from "@/content/footnotes";
import { routes } from "@/content/site";

export type ProcessVisual = "form" | "soft-check" | "offers" | "choose";

type Footnoted = { footnote?: FootnoteId };

/**
 * How it works, modelled on Mercury's "Switch to Mercury" page: a hero with
 * four points and the form, what you can apply for, the process in four
 * stages, us against applying lender by lender, a savings calculator,
 * borrower quotes, questions, then the closing band.
 */
export const howItWorksPage = {
  metadata: {
    title: "How it works",
    description:
      "One application, a soft search, and every matched offer side by side with its full cost. How Lendingvolt works, from the first field to the funds. Lendingvolt is a comparison platform, not a lender.",
  },
  hero: {
    eyebrow: "How it works",
    title: "Apply once. Compare every offer.",
    subhead:
      "Tell us what you need in around two minutes. We send it to the licensed lenders on our panel and bring their offers back to one screen, with the full cost of each.",
    points: [
      { text: "One application for banks and licensed moneylenders" },
      { text: "A soft search that leaves your credit score as it is", footnote: "soft-search" },
      { text: "Monthly repayment, total payable and EIR on every offer" },
      { text: "No charge to you, at any step", footnote: "revenue" },
    ] satisfies ({ text: string } & Footnoted)[],
    cta: "See my offers",
    note: "Sending your application doesn't commit you to a loan.",
    disclosure:
      "Lendingvolt is a comparison platform, not a lender. Loans are offered by banks regulated by MAS and moneylenders licensed by the Ministry of Law.",
  },
  loanTypes: {
    title: "One application, whatever it's for.",
    items: [
      {
        title: "Personal loans",
        body: "Fixed monthly repayments for weddings, school fees and other planned costs.",
        href: routes.personal,
      },
      {
        title: "Debt consolidation",
        body: "Combine credit card balances into one fixed monthly repayment.",
        href: routes.debtConsolidation,
      },
      {
        title: "Renovation loans",
        body: "Fund works on an HDB flat or private home without drawing down savings.",
        href: routes.renovation,
      },
      {
        title: "Business loans",
        body: "Working capital for SMEs and the self-employed, from banks and licensed lenders.",
        href: routes.business,
      },
      {
        title: "Loan calculator",
        body: "Work out the monthly repayment, total payable and EIR before you apply.",
        href: routes.loanCalculator,
      },
      {
        title: "Affordability check",
        body: "See what repayment fits your budget. Nothing you enter is sent anywhere.",
        href: routes.affordability,
      },
    ],
  },
  process: {
    title: "Borrowing without resistance.",
    body: "Four stages from the first field to the funds, and what each one asks of you.",
    steps: [
      {
        title: "Tell us what you need",
        body: "The amount, what it's for and your income. Singpass Myinfo can fill in most of it. Around two minutes, and no documents yet.",
        visual: "form",
      },
      {
        title: "We match you with a soft search",
        body: "Your application goes only to lenders on our panel that may lend to you. Matching leaves your credit score as it is.",
        footnote: "soft-search",
        visual: "soft-check",
      },
      {
        title: "Compare every offer side by side",
        body: "Each offer shows its monthly repayment, total payable and EIR. Sort by what matters to you. No lender can pay to be listed higher.",
        footnote: "revenue",
        visual: "offers",
      },
      {
        title: "Finish with the lender you choose",
        body: "You complete the application with that lender, who confirms the final terms and pays out. Some can release funds the same day.",
        footnote: "funding-time",
        visual: "choose",
      },
    ] satisfies ({ title: string; body: string; visual: ProcessVisual } & Footnoted)[],
  },
  comparison: {
    title: "Apply once, or apply everywhere.",
    columns: ["Lendingvolt", "Applying lender by lender"] as const,
    groups: [
      {
        title: "Applying",
        rows: [
          { label: "Forms to fill in", values: ["One, in around two minutes", "One for each lender"] },
          {
            label: "Credit checks while you compare",
            footnote: "soft-search",
            values: [
              "A soft search that leaves your credit score as it is",
              "Each application may be recorded on your credit report",
            ],
          },
        ],
      },
      {
        title: "Comparing",
        rows: [
          {
            label: "Offers side by side",
            values: ["Every matched offer on one screen", "Gathered yourself, one lender at a time"],
          },
          {
            label: "Cost shown",
            values: ["Monthly repayment, total payable and EIR on every offer", "Set out in each lender's own format"],
          },
          {
            label: "Sorting offers",
            footnote: "revenue",
            values: [
              "By monthly repayment, total interest or how fast funds arrive",
              "By hand, from each lender's terms",
            ],
          },
        ],
      },
      {
        title: "Cost and commitment",
        rows: [
          { label: "Fee to compare", values: ["S$0", "S$0"] },
          {
            label: "Who you borrow from",
            values: ["The lender you choose. Lendingvolt is not a lender.", "The lender you apply to"],
          },
        ],
      },
    ] satisfies {
      title: string;
      rows: ({ label: string; values: readonly [string, string] } & Footnoted)[];
    }[],
  },
  calculator: {
    title: "See what switching could save you.",
    body: "We've filled in an example. Set the amount, the tenure and the rates of two offers to see the difference in what you'd pay.",
    labels: {
      amount: "Amount",
      tenure: "Tenure",
      first: "First offer, flat p.a.",
      compared: "Compared offer, flat p.a.",
    },
    defaults: { firstRate: 0.0548, comparedRate: 0.0388 },
    results: {
      saving: (tenure: string) => `Interest saved over ${tenure}`,
      first: "Total interest, first offer",
      compared: "Total interest, compared offer",
      monthly: "Lower monthly repayment by",
      noSaving: "The compared offer costs the same or more at these rates.",
    },
    cta: "See my offers",
    footnote: "switching-calculator" as FootnoteId,
  },
  proof: {
    title: "Why people compare before they borrow.",
    stat: "[N] applications sent through Lendingvolt so far.",
    footnote: "stat-applications" as FootnoteId,
  },
  faq: {
    title: "Frequently asked questions",
    link: { label: "All questions", href: routes.faq },
    items: [
      {
        question: "Is Lendingvolt a lender?",
        answer:
          "No. We don't lend money, set rates, approve loans or hold your money. When you accept an offer, your loan agreement is with that lender. Every lender on our panel is regulated by MAS or licensed by the Ministry of Law.",
      },
      {
        question: "Who can apply?",
        answer:
          "Most lenders on our panel lend to Singapore citizens and permanent residents aged 21 and over with a regular income, and some lend to foreigners on a valid employment pass. You only see offers from lenders whose criteria you meet.",
      },
      {
        question: "Is my data safe?",
        answer:
          "We collect only what lenders need to assess your application, and share it only with the lenders matched to you, with your consent, under Singapore's Personal Data Protection Act. We never ask for your NRIC number or date of birth.",
      },
      {
        question: "Can I still apply to my own bank?",
        answer:
          "Yes. Comparing with us doesn't stop you applying anywhere else, and sending your application doesn't commit you to any offer. If none of them suit you, you don't have to accept one.",
      },
    ],
  },
  closing: {
    title: "Borrowing should be this clear.",
    body: "One application, every matched offer, and the full cost of each before you commit.",
    cta: "See my offers",
    secondary: "Talk to us on WhatsApp",
  },
};
