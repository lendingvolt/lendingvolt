import type { FootnoteId } from "@/content/footnotes";
import type { SceneId } from "@/components/graphics/scene-ids";
import { contact, routes } from "@/content/site";

/**
 * About page, modelled on Mercury's: a statement with the regulated
 * disclosure beneath it, the story in two rows, how we're paid, who we
 * work with, what we hold ourselves to, and how to reach us.
 */
export const about = {
  metadata: {
    title: "About",
    description:
      "Who runs Lendingvolt, how we're paid, and the licensed lenders we work with. Lendingvolt is a loan comparison platform in Singapore, not a lender.",
  },
  hero: {
    eyebrow: "About Lendingvolt",
    title: "We compare. You decide.",
    subhead:
      "Lendingvolt is a loan comparison platform for Singapore. One application goes to licensed lenders, and every offer comes back with its full cost shown, so you choose on the numbers.",
    link: { label: "How it works", href: routes.howItWorks },
    note: "Lendingvolt is a comparison platform, not a lender.",
  },
  story: {
    eyebrow: "Our story",
    title: "Loans should be compared like anything else you buy.",
    rows: [
      {
        title: "Shopping around shouldn't cost you",
        body: "Comparing loans in Singapore used to mean filling in the same form for every bank, waiting on calls, and worrying that each application would mark your credit file. So most people took the first offer they were given.",
        scene: "converge" as SceneId,
        tone: "light" as const,
      },
      {
        title: "One application, every licensed lender",
        body: "Lendingvolt sends one application to the banks and licensed moneylenders on our panel, using a soft search that leaves your credit score untouched. Offers come back side by side, each with its monthly repayment, total payable and EIR.",
        footnote: "soft-search" as FootnoteId,
        scene: "matching" as SceneId,
        tone: "dark" as const,
      },
    ],
  },
  paid: {
    eyebrow: "How we're paid",
    title: "No charge. Either kind.",
    body: "You never pay Lendingvolt, at any step. When a loan completes, the lender pays us a fee. That fee never changes the rate a lender offers you.",
    footnote: "revenue" as FootnoteId,
    facts: [
      { title: "Free for borrowers", body: "No application fee, no success fee, no subscription." },
      { title: "Ordered by your sort", body: "Offers are listed only by the sort you choose, never by what a lender pays." },
      { title: "Never a lender", body: "We don't lend, set rates or hold your money. Your loan is always with the lender." },
    ],
  },
  lenders: {
    eyebrow: "Who we work with",
    title: "Only licensed lenders.",
    groups: [
      {
        title: "Banks",
        body: "Regulated by the Monetary Authority of Singapore (MAS). Usually the lowest cost for borrowers who meet their income requirements.",
      },
      {
        title: "Licensed moneylenders",
        body: "Licensed by the Ministry of Law and listed on the Registry of Moneylenders. Lend to more people, within legal caps on interest and fees.",
        footnote: "moneylender-caps" as FootnoteId,
      },
      {
        title: "Never unlicensed lenders",
        body: "We only work with lenders we can check against MAS and Ministry of Law registers. If a lender isn't licensed, it isn't on Lendingvolt.",
      },
    ],
  },
  principles: {
    eyebrow: "What we hold ourselves to",
    title: "Calm, precise, numerate.",
    items: [
      { title: "Cost before speed", body: "We show what a loan costs before how fast it arrives." },
      { title: "No pressure", body: "No countdowns, no limited-time offers, no pre-ticked boxes." },
      {
        title: "Your data goes where you send it",
        body: "Your application goes only to matched lenders, and only with your consent under the PDPA.",
        link: { label: "PDPA Notice", href: routes.pdpa },
      },
      { title: "Plain numbers", body: "Every rate we show carries its basis, its tenure and a footnote." },
    ],
  },
  contact: {
    title: "Contact us",
    body: "We're happy to help, and to hear what we could do better.",
    cards: [
      {
        title: "Say hello",
        body: "Questions about an application, an offer or the site.",
        link: { label: contact.email, href: `mailto:${contact.email}` },
      },
      {
        title: "Lender partnerships",
        body: "Licensed banks and moneylenders who would like to join our panel.",
        link: { label: "partners@lendingvolt.sg", href: "mailto:partners@lendingvolt.sg" },
      },
      {
        title: "Press",
        body: "Get in touch with the team behind Lendingvolt.",
        link: { label: "press@lendingvolt.sg", href: "mailto:press@lendingvolt.sg" },
      },
    ],
    whatsapp: { label: "Talk to us on WhatsApp", href: contact.whatsapp },
    company: {
      title: "Company details",
      rows: [
        { term: "UEN", value: "202607335C" },
        { term: "Office", value: contact.address },
      ],
    },
  },
};
