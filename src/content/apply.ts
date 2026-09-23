import type { ApplicationDraft } from "@/lib/application";

/**
 * Copy for the application flow. Only the render screens carry a pun, and
 * never two in a row; question screens are plain.
 */
export const applyCopy = {
  loan: {
    title: "How much would you like to borrow?",
    body: "Amount, purpose and how long you'd like to repay. You can change any of this before you send it.",
    amountLabel: "Loan amount",
    purposeLegend: "What is the loan for?",
    tenureLegend: "Repayment period, in months",
  },
  softCheck: {
    title: "A soft check. No trace left behind.",
    bodyBefore: "We match you using a soft search, which does not affect your credit score",
    bodyAfter: " A lender may run a full credit bureau search once you proceed with them, and they will tell you before they do.",
  },
  singpass: {
    title: "Fill this in with Singpass.",
    body: "Myinfo fills in your name, contact details, residency and income from government records. You can check and change anything before you send it.",
    myinfo: "Retrieve Myinfo with Singpass",
    manual: "Fill in manually",
    prototypeNote: "Prototype: this uses sample details and does not connect to Singpass.",
  },
  about: {
    title: "About you",
    body: "So the lenders that make you an offer can reach you.",
    nameLabel: "Full name",
    nameHint: "As it appears on your NRIC or pass.",
    mobileLabel: "Mobile number",
    emailLabel: "Email",
    residencyLegend: "Residency status",
    myinfoBadge: "From Myinfo · sample data",
  },
  income: {
    title: "Your income",
    body: "Lenders use this to work out what they can offer. No documents at this stage.",
    employmentLegend: "How do you earn your income?",
    incomeLabel: "Monthly income before tax",
    incomeHint: "Your gross salary, or average monthly earnings if you're self-employed.",
  },
  review: {
    title: "Check your details",
    body: "This is what we'll send to matched lenders.",
    edit: "Edit",
  },
  consent: {
    title: "You decide who sees your details.",
    body: "We send your application only to lenders on our panel that may lend to you. Nobody else sees it.",
    pdpaBefore:
      "I agree to Lendingvolt collecting my name, contact details, residency, employment and income, and sharing them with matched lenders on its panel so they can assess my application and make me an offer. I have read the ",
    pdpaLink: "PDPA Notice",
    pdpaAfter: ".",
    marketing: "Send me occasional emails about rates and guides. Optional, and you can unsubscribe at any time.",
    submit: "See my offers",
    note: "Sending your application does not commit you to a loan.",
  },
  matching: {
    titleBefore: "Sending your application to ",
    lenderCount: "[N]",
    titleAfter: " licensed lenders.",
    statuses: [
      "Checking your details",
      "Sending to lenders on our panel",
      "Collecting their offers",
      "Sorting by total cost",
    ],
  },
  choose: {
    title: "Every offer, illuminated.",
    exampleBadge: (lender: string) => `Example only, not ${lender}'s actual rate`,
    choose: (lender: string) => `Choose ${lender}`,
  },
  book: {
    title: (lender: string) => `Book a visit to ${lender}`,
    body: (lender: string) =>
      `${lender} checks your identity in person before releasing funds. Pick a time that suits you.`,
    dateLegend: "Day",
    timeLegend: "Time",
    confirm: "Confirm visit",
  },
  booked: {
    title: "You're booked in.",
    whenLabel: "When",
    whereLabel: "Where",
    maps: "Open in Maps",
    contactLabel: "Contact",
    hoursLabel: "Opening hours",
    bringLabel: "Bring",
    bring: "Your NRIC or work pass",
    prototypeNote: (lender: string) => `Prototype: nothing has been sent to ${lender}.`,
    cta: "Back to homepage",
  },
  actions: {
    continue: "Continue",
    back: "Back",
    backToReview: "Back to review",
  },
} as const;

/** Sample Myinfo profile for the prototype. No NRIC or date of birth. */
export const sampleMyinfo: Partial<ApplicationDraft> = {
  fullName: "Tan Mei Ling",
  mobile: "9123 4567",
  email: "meiling.tan@example.com",
  residency: "citizen",
  employment: "salaried",
  monthlyIncome: "6,500",
};

/** How long the matching screen stays up, in ms. */
export const matchingDuration = { full: 5000, reducedMotion: 1500 };
