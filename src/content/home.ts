import { routes } from "./site";

/**
 * Homepage copy, as written in the brief. Bracketed values are figures to
 * confirm before launch and are rendered literally until then.
 */

export const loanPurposes = [
  { value: "personal", label: "Personal" },
  { value: "consolidate", label: "Consolidate" },
  { value: "renovate", label: "Renovate" },
  { value: "business", label: "Business" },
] as const;

export type LoanPurpose = (typeof loanPurposes)[number]["value"];

export const hero = {
  title: "Supercharge your loan search.",
  subhead: "Get matched instantly with banks and licensed lenders.",
  cta: "See my offers",
  /** Rendered as the Singpass wordmark followed by `label`. */
  singpass: {
    onDark: "/images/singpass_logo_white-1.png",
    onLight: "/images/singpass_logo_fullcolours.png",
    alt: "Singpass",
    label: "secured",
  },
  trust: ["MAS & MinLaw regulated lenders"],
};

export const lenderVetting = {
  title: "Every lender is vetted by hand, one by one.",
  footnote: "lender-vetting",
  lead: "We review each bank and licensed moneylender individually before they join our panel.",
  criteria: [
    {
      title: "Licensed, then reviewed",
      body: "Banks are regulated by MAS and moneylenders are licensed by the Ministry of Law. That is where our review starts, not where it ends.",
    },
    {
      title: "Customer service",
      body: "How a lender treats borrowers before and after the loan: how quickly they respond, how they handle complaints, and how clearly they explain the terms.",
    },
    {
      title: "Product knowledge",
      body: "Their staff should be able to explain the rate, every fee and the total cost of a loan in plain terms, without pressure.",
    },
  ],
} as const;

export const valueGrid = {
  statement: "Borrowing well is a decision, not an emergency.",
  cells: [
    {
      title: "One application, every lender",
      body: "Fill in one form. We send it to every lender in our network and bring the offers back to you.",
    },
    {
      title: "Your credit score stays intact",
      body: "We use soft searches to match you. Nothing appears on your credit file until you choose a lender.",
      footnote: "soft-search",
    },
    {
      title: "The real cost, shown plainly",
      body: "Every offer displays the monthly repayment, total payable and effective interest rate side by side.",
    },
    {
      title: "No charge. Either kind.",
      body: "You pay nothing. Lenders pay us a fee when a loan completes, and it never changes the rates you see.",
      footnote: "revenue",
    },
  ],
} as const;

export const howItWorks = {
  eyebrow: "How it works",
  title: "Three steps. One circuit.",
  link: { label: "The full process", href: routes.howItWorks },
  steps: [
    {
      title: "Tell us what you need",
      body: "Loan amount, purpose, and a few details about your income. Around two minutes, no documents yet.",
    },
    {
      title: "Compare your matched offers",
      body: "Rates, monthly repayments and total cost from every lender that will lend to you, on one screen.",
    },
    {
      title: "Choose and complete",
      body: "Pick your offer and finish the application with that lender directly. Funds can arrive the same day.",
      footnote: "funding-time",
    },
  ],
} as const;

export const showcase = {
  title: "Every offer, illuminated.",
  body: "Sort by monthly repayment, total interest, or how fast funds arrive. No hidden fees, no offers buried below the fold because a lender paid more.",
};

export const calculator = {
  title: "Run the current numbers.",
  cta: "See offers at this amount",
};

export const useCases = {
  title: "What people power with us.",
  cards: [
    {
      title: "Debt consolidation",
      body: "Move card balances into one fixed monthly repayment.",
      href: routes.debtConsolidation,
    },
    {
      title: "Home renovation",
      body: "Fund the works on your flat without drawing down savings.",
      href: routes.renovation,
    },
    {
      title: "Business cash flow",
      body: "Bridge the gap between invoices and payroll.",
      href: routes.business,
    },
    {
      title: "Life events",
      body: "Weddings, school fees and other planned costs, spread over time.",
      href: routes.personal,
    },
  ],
} as const;

/** Placeholders until real, consented quotes are on file. */
export const testimonials = {
  isPlaceholder: true,
  items: [
    {
      tag: "Debt consolidation",
      quote:
        "I had three offers in front of me with the total cost of each. I picked the cheapest one and it wasn't my own bank.",
      name: "[Customer name]",
      role: "[Role, company]",
    },
    {
      tag: "Renovation",
      quote:
        "The EIR was on every offer, so I could see the S$[X] difference over five years before I applied anywhere.",
      name: "[Customer name]",
      role: "[Role, company]",
    },
  ],
};

export const stats = [
  { figure: "[N]", label: "licensed lenders" },
  { figure: "S$[X]M", label: "matched", footnote: "stat-matched" },
  { figure: "[N]", label: "applications", footnote: "stat-applications" },
  { figure: "[X]", label: "minutes average application", footnote: "stat-minutes" },
] as const;

export const faq = {
  title: "Questions, answered plainly.",
  link: { label: "All questions", href: routes.faq },
  items: [
    {
      question: "Is this free?",
      answer:
        "Yes. You pay Lendingvolt nothing, at any stage. Lenders pay us a fee when a loan completes, and that fee never changes the rate a lender offers you.",
    },
    {
      question: "Will it affect my credit score?",
      answer:
        "No. A soft search does not affect your credit score. A lender may run a full credit bureau search once you proceed with them, and they will tell you before they do.",
    },
    {
      question: "Who are your lenders?",
      answer:
        "Banks and financial institutions regulated by the Monetary Authority of Singapore, and moneylenders licensed by the Ministry of Law. The panel changes over time.",
    },
    {
      question: "How fast can I get funds?",
      answer:
        "It depends on the lender. Some transfer funds the same day once you complete their checks; others take a few business days. Each offer shows the lender's typical funding time before you choose.",
    },
    {
      question: "Am I eligible?",
      answer:
        "Most lenders on our panel lend to Singapore citizens and permanent residents aged 21 and over with a regular income, and some lend to foreigners on a valid employment pass. You only see offers from lenders whose criteria you meet.",
    },
    {
      question: "What happens to my data?",
      answer:
        "We collect only what lenders need to assess your application and share it only with the lenders matched to you, with your consent. We handle it under Singapore's Personal Data Protection Act; our PDPA notice has the detail.",
    },
  ],
};

export const closingCta = {
  title: "See what you'd actually pay.",
  body: "One form, every matched offer, and the total cost of each before you commit.",
  cta: "See my offers",
  secondary: "Talk to us on WhatsApp",
};
