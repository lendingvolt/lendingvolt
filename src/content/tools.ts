import { routes } from "@/content/site";

/**
 * Copy for the two tools. The loan calculator starts from an amount and
 * shows the cost; the affordability check starts from a budget and shows
 * the amount.
 */

const closingSecondary = "Talk to us on WhatsApp";

export const loanCalculatorPage = {
  metadata: {
    title: "Loan calculator",
    description:
      "Work out the monthly repayment, total interest, total payable and EIR for a flat-rate loan in Singapore. Lendingvolt is a comparison platform, not a lender.",
  },
  hero: {
    eyebrow: "Loan calculator",
    title: "Run the current numbers.",
    subhead:
      "Enter an amount and a tenure to see the monthly repayment, the total you'd pay, and the EIR, before you apply anywhere.",
    link: { label: "Not sure how much to borrow? Check what you can afford", href: routes.affordability },
  },
  labels: {
    amount: "Loan amount",
    tenure: "Tenure",
    rate: "Flat rate p.a.",
    fee: "Processing fee",
    monthly: "Monthly repayment",
    interest: "Total interest",
    feeAmount: "Processing fee",
    total: "Total payable",
    eir: "EIR",
    compareTitle: "The same loan over different tenures",
    scheduleToggle: "Show the full repayment schedule",
    cta: "See offers at this amount",
  },
  faq: {
    title: "Calculator questions.",
    link: { label: "All questions", href: routes.faq },
    items: [
      {
        question: "Why is the EIR higher than the flat rate?",
        answer:
          "A flat rate charges interest on the full amount for the whole tenure, even as you repay it. The EIR expresses the same cost as a yearly rate on what you still owe, and it counts any fees, so it is always higher.",
      },
      {
        question: "Should I choose a shorter or longer tenure?",
        answer:
          "A shorter tenure means higher monthly repayments but less interest in total. A longer one lowers the monthly amount and raises the total. The tenure table shows both side by side.",
      },
      {
        question: "Are these the rates I'll be offered?",
        answer:
          "No. The calculator uses the rate and fee you enter. Each lender sets its own after assessing your application, and your matched offers show their real figures.",
      },
      {
        question: "Does using the calculator affect my credit score?",
        answer: "No. Nothing you enter here is sent anywhere or stored, and no credit search is made.",
      },
    ],
  },
  closing: {
    title: "See the real offers at this amount.",
    body: "One application, every matched offer, and the total cost of each before you commit.",
    cta: "See my offers",
    secondary: closingSecondary,
  },
};

export const affordabilityPage = {
  metadata: {
    title: "Affordability check",
    description:
      "Start from your income and monthly spending to see how much you could comfortably borrow, and what the repayment would be. Lendingvolt is a comparison platform, not a lender.",
  },
  hero: {
    eyebrow: "Affordability check",
    title: "Borrow within your means.",
    subhead:
      "Start with what comes in and what goes out each month. We work backwards to the repayment that fits, and the loan amount it supports.",
    link: { label: "Already know the amount? Use the loan calculator", href: routes.loanCalculator },
  },
  labels: {
    income: "Monthly income before tax",
    incomeHint: "Your gross salary, or average monthly earnings if you're self-employed.",
    expenses: "Monthly living costs",
    expensesHint: "Rent or mortgage, bills, food, transport, insurance and family support.",
    repayments: "Existing monthly repayments",
    repaymentsHint: "Other loans, instalment plans and credit card minimums.",
    tenure: "Repay over",
    rate: "Assumed flat rate p.a.",
    headline: "You could comfortably borrow",
    monthly: "Monthly repayment",
    leftOver: "Left each month",
    splitTitle: "Where your income would go",
    split: {
      expenses: "Living costs",
      existing: "Existing repayments",
      loan: "This loan",
      leftOver: "Left over",
    },
    compareTitle: "What you could borrow over each tenure",
    cta: (amount: string) => `See offers for ${amount}`,
    limit: {
      "debt-share": "Limited by the 40% rule: all your repayments together stay within 40% of your income.",
      buffer: "Limited by your spending: at least 20% of your income stays free after everything is paid.",
      "bank-cap": "Limited by the typical bank ceiling of 4× monthly income (10× from S$120,000 a year).",
      none: "Enter your monthly income to begin.",
    },
    noRoom:
      "Your living costs and repayments already use most of your income, so a new loan could be hard to repay. Credit Counselling Singapore offers free, confidential advice.",
    noRoomLink: { label: "Visit Credit Counselling Singapore", href: "https://www.ccs.org.sg" },
  },
  method: {
    title: "How we work it out",
    rules: [
      "All your debt repayments, old and new, stay at or below 40% of your gross income.",
      "After living costs and every repayment, at least 20% of your income is left over.",
      "The amount stays within the typical bank limit for unsecured loans.",
    ],
  },
  faq: {
    title: "Affordability questions.",
    link: { label: "All questions", href: routes.faq },
    items: [
      {
        question: "Is this how much a lender will offer me?",
        answer:
          "Not necessarily. It is a guide to what fits your budget. Lenders also look at your credit report, employment and existing debts, and may offer more or less.",
      },
      {
        question: "Why 40% and 20%?",
        answer:
          "They are cautious rules of thumb. Keeping total repayments under 40% of income and a fifth of it spare leaves room for surprises. You can borrow less than the figure shown, and often should.",
      },
      {
        question: "What counts as a living cost?",
        answer:
          "Anything you pay every month to live: rent or mortgage, utilities, phone, food, transport, insurance, childcare and money you send to family. Leave out savings and investments.",
      },
      {
        question: "Does using this affect my credit score?",
        answer: "No. Nothing you enter here is sent anywhere or stored, and no credit search is made.",
      },
    ],
  },
  closing: {
    title: "See offers that fit your budget.",
    body: "One application, every matched offer, and the total cost of each before you commit.",
    cta: "See my offers",
    secondary: closingSecondary,
  },
};
