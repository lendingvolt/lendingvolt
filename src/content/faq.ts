import type { FootnoteId } from "@/content/footnotes";
import { contact, routes } from "@/content/site";

export type FaqLink = { label: string; href: string };

/** A list item is plain text, or a link followed by a short description. */
export type FaqListItem = string | { link: FaqLink; text: string };

/** One block of an answer: a paragraph, a paragraph ending in a footnote marker, or a list. */
export type FaqBlock = string | { text: string; footnote: FootnoteId } | { list: readonly FaqListItem[] };

export type FaqEntry = {
  question: string;
  answer: readonly FaqBlock[];
  /** Onward link beneath the answer. */
  link?: FaqLink;
};

export type FaqCategory = { id: string; title: string; entries: readonly FaqEntry[] };

/**
 * The full FAQ, modelled on Mercury's: one page, grouped by topic, every
 * answer in plain sentences. Figures match the loan pages and tools, and
 * carry the same footnotes.
 */
export const faqPage = {
  metadata: {
    title: "FAQ",
    description:
      "Answers on cost, credit checks, eligibility, offers and your data. Lendingvolt is a loan comparison platform in Singapore, not a lender.",
  },
  hero: {
    title: "Frequently asked questions",
    subhead: "Plain answers on cost, credit checks, eligibility and your data.",
    jumpLabel: "Jump to a topic",
  },
  categories: [
    {
      id: "general",
      title: "General",
      entries: [
        {
          question: "What is Lendingvolt?",
          answer: [
            "Lendingvolt is a loan comparison platform for Singapore. You fill in one application, we send it to the licensed lenders on our panel, and their offers come back side by side so you can choose on the numbers.",
            {
              list: [
                "One application for personal, debt consolidation, renovation and business loans",
                "Offers from banks and licensed moneylenders on one screen",
                "The monthly repayment, total payable and EIR for every offer",
                "A soft search that does not affect your credit score",
                "No charge to you, at any step",
              ],
            },
          ],
        },
        {
          question: "Is Lendingvolt a lender?",
          answer: [
            "No. We don't lend money, set rates, approve loans or hold your money. When you accept an offer, your loan agreement is with that lender, and they are responsible for it.",
            "Every lender on our panel is regulated by the Monetary Authority of Singapore (MAS) or licensed by the Ministry of Law.",
          ],
        },
        {
          question: "Who are your lenders?",
          answer: [
            "Banks and financial institutions regulated by MAS, and moneylenders licensed by the Ministry of Law. The panel changes over time.",
          ],
        },
        {
          question: "How do you decide which lenders to work with?",
          answer: [
            "We only work with lenders we can check against the MAS Financial Institutions Directory or the Ministry of Law's Registry of Moneylenders. If a lender isn't licensed, it isn't on Lendingvolt.",
          ],
        },
        {
          question: "What can I borrow for?",
          answer: [
            "Four kinds of loan, each with its own guide:",
            {
              list: [
                {
                  link: { label: "Personal loans", href: routes.personal },
                  text: "for planned costs like a wedding, school fees or a medical bill",
                },
                {
                  link: { label: "Debt consolidation", href: routes.debtConsolidation },
                  text: "to combine credit card balances into one fixed repayment",
                },
                { link: { label: "Renovation loans", href: routes.renovation }, text: "for works on an HDB flat or private home" },
                { link: { label: "Business loans", href: routes.business }, text: "for working capital, stock and payroll" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "cost",
      title: "Cost and fees",
      entries: [
        {
          question: "Is Lendingvolt free?",
          answer: [
            "Yes. You pay Lendingvolt nothing, at any step. There is no application fee, no success fee and no subscription.",
          ],
        },
        {
          question: "How does Lendingvolt make money?",
          answer: [
            {
              text: "When a loan completes, the lender pays us a fee. That fee never changes the rate a lender offers you.",
              footnote: "revenue",
            },
          ],
          link: { label: "How we're paid", href: routes.about },
        },
        {
          question: "Can a lender pay to be shown first?",
          answer: [
            "No. Offers are ordered only by the sort you choose: monthly repayment, total interest or how fast funds arrive. A lender can't pay to appear higher, and no offer is hidden because another lender paid more.",
          ],
        },
        {
          question: "What will the loan itself cost?",
          answer: [
            "That's set by each lender. Depending on the loan, you may pay interest, a processing fee, and fees for paying late or settling early.",
            "Every offer shows the monthly repayment, total payable and effective interest rate (EIR) before you choose, so you see the full cost upfront.",
          ],
        },
        {
          question: "What's the difference between a flat rate and the EIR?",
          answer: [
            "A flat rate is charged on the full amount you borrowed for the whole tenure, even as you repay it. The effective interest rate (EIR) turns that, plus any fees, into a yearly rate on what you still owe.",
            {
              text: "Compare offers by EIR. For example, 3.88% flat over three years works out to about 7.5% EIR.",
              footnote: "calculator",
            },
          ],
          link: { label: "Try the loan calculator", href: routes.loanCalculator },
        },
        {
          question: "What can licensed moneylenders charge?",
          answer: [
            { text: "The Ministry of Law caps what licensed moneylenders can charge:", footnote: "moneylender-caps" },
            {
              list: [
                "Interest of up to 4% a month",
                "Late interest of up to 4% a month on the amount that's late",
                "A late fee of up to S$60 a month",
                "An upfront fee of up to 10% of the loan",
                "In total, charges can't exceed the amount you borrowed",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "credit",
      title: "Credit checks",
      entries: [
        {
          question: "Will comparing offers affect my credit score?",
          answer: [
            {
              text: "No. We match you using a soft search, which does not affect your credit score. A lender may run a full credit bureau search once you proceed with them, and they will tell you before they do.",
              footnote: "soft-search",
            },
          ],
        },
        {
          question: "What's the difference between a soft search and a full credit search?",
          answer: [
            "A soft search checks whether a lender is likely to lend to you without making a formal credit enquiry, so it doesn't affect your credit score.",
            "A full search is the formal enquiry a lender makes before approving a loan, and it is recorded on your Credit Bureau Singapore report. It only happens after you choose a lender and proceed, and the lender will tell you before they run it.",
          ],
        },
        {
          question: "Can I apply if my credit history isn't perfect?",
          answer: [
            "Yes. You'll only see offers from lenders whose criteria you meet. Licensed moneylenders often lend to people banks decline, though they charge more and lend less.",
          ],
        },
      ],
    },
    {
      id: "applying",
      title: "Applying",
      entries: [
        {
          question: "Am I eligible?",
          answer: [
            "Most lenders on our panel lend to Singapore citizens and permanent residents aged 21 and over with a regular income, and some lend to foreigners on a valid employment pass. You only see offers from lenders whose criteria you meet.",
          ],
        },
        {
          question: "What do I need to apply?",
          answer: [
            "A few details and around two minutes. No documents at this stage.",
            {
              list: [
                "The amount, what it's for and how long you'd like to repay",
                "Your name, mobile number and email",
                "Your residency status",
                "How you earn your income, and your monthly income before tax",
              ],
            },
            "The lender you choose may ask for documents, such as payslips or your Notice of Assessment, before approving your loan.",
          ],
          link: { label: "Start an application", href: routes.apply },
        },
        {
          question: "Can I use Singpass to apply?",
          answer: [
            "Yes. Myinfo fills in your name, contact details, residency and income from government records, so you don't have to type them. You can check and change anything before you send it.",
            "You can also fill in the form yourself.",
          ],
        },
        {
          question: "How much can I borrow?",
          answer: [
            "You can ask for S$1,000 to S$500,000 through Lendingvolt. How much a lender offers depends on your income and the kind of lender.",
            {
              text: "Banks usually lend up to 4 times your monthly income, or up to 10 times if you earn S$120,000 a year or more. Licensed moneylenders can lend up to 6 times your monthly income if you earn at least S$20,000 a year, and up to S$3,000 below that.",
              footnote: "market-typical",
            },
          ],
          link: { label: "Check what you can afford", href: routes.affordability },
        },
        {
          question: "How long can I take to repay?",
          answer: [
            "Choose 12, 24, 36, 48 or 60 months when you apply. Each lender sets the tenures it offers, and your offers show the monthly repayment for each.",
            "A longer tenure lowers the monthly repayment but raises the total interest you pay.",
          ],
        },
        {
          question: "Does applying commit me to a loan?",
          answer: [
            "No. Sending your application doesn't commit you to anything. If none of the offers suit you, you don't have to accept any, and there's nothing to pay.",
          ],
        },
      ],
    },
    {
      id: "offers",
      title: "Offers and funds",
      entries: [
        {
          question: "How do I compare my offers?",
          answer: [
            "Your offers appear side by side, each with its monthly repayment, total payable, tenure and EIR. Sort them by monthly repayment, total interest or how fast funds arrive.",
          ],
        },
        {
          question: "What happens after I choose an offer?",
          answer: [
            "You finish the application with that lender directly. They confirm the final rate and fees, run a full credit search if they need one, and ask you to sign a loan agreement.",
            "Check the rate, fees and repayment schedule in the agreement before you sign.",
          ],
        },
        {
          question: "Why do some lenders ask me to visit in person?",
          answer: [
            "Licensed moneylenders must verify your identity face to face before they release a loan. Once you choose one, you can book a visit to their office through Lendingvolt. Bring your NRIC or work pass.",
            "Banks usually verify you online and don't need a visit.",
          ],
        },
        {
          question: "How fast can I get funds?",
          answer: [
            {
              text: "It depends on the lender. Some transfer funds the same day once you complete their checks; others take a few business days. Each offer shows the lender's typical funding time before you choose.",
              footnote: "funding-time",
            },
          ],
        },
        {
          question: "Can I repay early?",
          answer: [
            "Usually, yes. Some banks charge an early settlement fee, often around 3% of the outstanding balance, and flat-rate loans may use the Rule of 78, which reduces the interest you save. Check the terms in your offer before you accept.",
          ],
        },
      ],
    },
    {
      id: "tools",
      title: "Calculators",
      entries: [
        {
          question: "Are the calculator figures a quote?",
          answer: [
            {
              text: "No. The loan calculator uses the rate and fee you enter. Each lender sets its own after assessing your application, and your matched offers show their real figures.",
              footnote: "calculator",
            },
          ],
          link: { label: "Open the loan calculator", href: routes.loanCalculator },
        },
        {
          question: "How does the affordability check work?",
          answer: [
            {
              text: "It starts from your income, living costs and existing repayments, and finds the largest loan that keeps all your debt repayments at or below 40% of your gross income while leaving at least 20% of it spare each month.",
              footnote: "affordability-method",
            },
          ],
          link: { label: "Open the affordability check", href: routes.affordability },
        },
        {
          question: "Is anything I enter in the calculators saved?",
          answer: [
            "No. Nothing you enter leaves your browser, and no credit search is made. If you choose to see offers, the amount carries over to your application so you don't have to type it again.",
          ],
        },
      ],
    },
    {
      id: "data",
      title: "Your data",
      entries: [
        {
          question: "What happens to my data?",
          answer: [
            "We collect only what lenders need to assess your application and share it only with the lenders matched to you, with your consent. We handle it under Singapore's Personal Data Protection Act (PDPA).",
          ],
          link: { label: "Read our PDPA Notice", href: routes.pdpa },
        },
        {
          question: "Who can see my application?",
          answer: [
            "Only the lenders on our panel that may lend to you, and only after you agree. Nobody else sees it.",
          ],
        },
        {
          question: "Do you ask for my NRIC?",
          answer: [
            "No. Lendingvolt doesn't ask for your NRIC number or date of birth. The lender you choose verifies your identity when you proceed with them.",
          ],
        },
        {
          question: "Will you send me marketing emails?",
          answer: [
            "No. We don't collect marketing consent as part of the application, and we don't send marketing email.",
          ],
        },
        {
          question: "How can I see, correct or delete my data?",
          answer: [
            `Email ${contact.email}. Under the PDPA you can ask to see the personal data we hold about you, correct it, or withdraw your consent.`,
            "Withdrawing consent stops us using your data from then on. Lenders you've already applied to hold their own copy under their own policies.",
          ],
        },
        {
          question: "How do I spot a loan scam?",
          answer: [
            "Lendingvolt will never ask you to pay a fee, or to transfer money before a loan is released. Licensed moneylenders aren't allowed to ask for your Singpass password or keep your NRIC.",
            "If you're unsure about a lender, look it up on the Ministry of Law's Registry of Moneylenders. To report a scam, call the ScamShield Helpline on 1799.",
          ],
        },
      ],
    },
  ] satisfies FaqCategory[],
  contact: {
    title: "Still have a question?",
    body: "Email us and we'll get back to you.",
    link: { label: contact.email, href: `mailto:${contact.email}` },
  },
  closing: {
    title: "Ready when you are.",
    body: "One application, every matched offer, and the total cost of each before you commit.",
    cta: "See my offers",
    secondary: "Talk to us on WhatsApp",
  },
};

function blockText(block: FaqBlock): string {
  if (typeof block === "string") return block;
  if ("list" in block) {
    return block.list.map((item) => (typeof item === "string" ? item : `${item.link.label} ${item.text}`)).join("; ") + ".";
  }
  return block.text;
}

/** An answer as plain text, for structured data. */
export function faqAnswerText(entry: FaqEntry): string {
  return entry.answer.map(blockText).join(" ");
}
