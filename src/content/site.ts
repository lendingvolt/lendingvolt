/**
 * Site map, navigation and footer structure.
 * Every route in the Phase 1 sitemap lives here so links never drift.
 */

export type NavItem = {
  title: string;
  href: string;
  description: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const routes = {
  home: "/",
  personal: "/loans/personal",
  debtConsolidation: "/loans/debt-consolidation",
  renovation: "/loans/renovation",
  business: "/loans/business",
  compare: "/compare",
  apply: "/apply",
  howItWorks: "/how-it-works",
  lenders: "/lenders",
  about: "/about",
  loanCalculator: "/tools/loan-calculator",
  affordability: "/tools/affordability",
  faq: "/faq",
  contact: "/contact",
  terms: "/legal/terms",
  privacy: "/legal/privacy",
  pdpa: "/legal/pdpa",
  cookies: "/legal/cookies",
  disclaimers: "/legal/disclaimers",
  login: "/account/login",
  applications: "/account/applications",
} as const;

export const navGroups: NavGroup[] = [
  {
    label: "Loans",
    items: [
      {
        title: "Personal loans",
        href: routes.personal,
        description: "Fixed monthly repayments for planned costs.",
      },
      {
        title: "Debt consolidation",
        href: routes.debtConsolidation,
        description: "Combine card balances into one repayment.",
      },
      {
        title: "Renovation loans",
        href: routes.renovation,
        description: "Fund works on an HDB flat or private home.",
      },
      {
        title: "Business loans",
        href: routes.business,
        description: "Working capital for SMEs and the self-employed.",
      },
    ],
  },
  {
    label: "Tools",
    items: [
      {
        title: "Loan calculator",
        href: routes.loanCalculator,
        description: "Monthly repayment, total payable and EIR.",
      },
      {
        title: "Affordability check",
        href: routes.affordability,
        description: "See what repayment fits your budget.",
      },
    ],
  },
  {
    label: "Company",
    items: [
      {
        title: "How it works",
        href: routes.howItWorks,
        description: "One application, every matched offer.",
      },
      {
        title: "Our lenders",
        href: routes.lenders,
        description: "The licensed lenders on our panel.",
      },
      {
        title: "About",
        href: routes.about,
        description: "Who runs Lendingvolt and how we are paid.",
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        title: "FAQ",
        href: routes.faq,
        description: "Credit checks, eligibility, fees and data.",
      },
      {
        title: "Disclaimers",
        href: routes.disclaimers,
        description: "How rates and examples are calculated.",
      },
    ],
  },
];

export type FooterLink = { label: string; href?: string };
export type FooterColumn = { heading: string; links: FooterLink[] };

/** Contact details to confirm before launch. */
export const contact = {
  email: "support@lendingvolt.sg",
  phone: "+65 [XXXX XXXX]",
  address: "[Registered address], Singapore [XXXXXX]",
  whatsapp: "https://wa.me/65XXXXXXXX",
};

export const footerColumns: FooterColumn[] = [
  {
    heading: "Loans",
    links: navGroups[0].items.map(({ title, href }) => ({ label: title, href })),
  },
  {
    heading: "Tools",
    links: [
      ...navGroups[1].items.map(({ title, href }) => ({ label: title, href })),
      { label: "Compare offers", href: routes.compare },
    ],
  },
  {
    heading: "Company",
    links: navGroups[2].items.map(({ title, href }) => ({ label: title, href })),
  },
  {
    heading: "Resources",
    links: [
      { label: "FAQ", href: routes.faq },
      { label: "Disclaimers", href: routes.disclaimers },
      { label: "Contact", href: routes.contact },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: contact.email, href: `mailto:${contact.email}` },
      { label: contact.phone },
      { label: contact.address },
    ],
  },
  {
    heading: "Follow",
    links: [{ label: "LinkedIn" }, { label: "Instagram" }, { label: "Facebook" }],
  },
];

export const legalLinks: FooterLink[] = [
  { label: "Terms of Use", href: routes.terms },
  { label: "Privacy Policy", href: routes.privacy },
  { label: "PDPA Notice", href: routes.pdpa },
  { label: "Cookie Policy", href: routes.cookies },
];

export const entityDisclosure = {
  copyright: "© 2026 Lendingvolt. All rights reserved.",
  statement:
    "Lendingvolt is run and managed by Lendkaki Pay Pte. Ltd. (UEN: 202607335C). Lendingvolt is a loan comparison platform. We are not a lender. All loan products are offered by licensed banks and financial institutions regulated by the Monetary Authority of Singapore (MAS) and/or licensed by the Ministry of Law (MinLaw). Rates shown are indicative and subject to change.",
};

/** Placeholder pages: one per Phase 1 route that is not yet built. */
export const stubPages = {
  personal: { title: "Personal loans", group: "Loans" },
  debtConsolidation: { title: "Debt consolidation", group: "Loans" },
  renovation: { title: "Renovation loans", group: "Loans" },
  business: { title: "Business loans", group: "Loans" },
  compare: { title: "Compare offers", group: "Compare" },
  apply: { title: "Apply", group: "Apply" },
  howItWorks: { title: "How it works", group: "Company" },
  lenders: { title: "Our lenders", group: "Company" },
  about: { title: "About", group: "Company" },
  loanCalculator: { title: "Loan calculator", group: "Tools" },
  affordability: { title: "Affordability check", group: "Tools" },
  faq: { title: "Frequently asked questions", group: "Resources" },
  contact: { title: "Contact", group: "Contact" },
  terms: { title: "Terms of Use", group: "Legal" },
  privacy: { title: "Privacy Policy", group: "Legal" },
  pdpa: { title: "PDPA Notice", group: "Legal" },
  cookies: { title: "Cookie Policy", group: "Legal" },
  disclaimers: { title: "Disclaimers", group: "Legal" },
  login: { title: "Log in", group: "Account" },
  applications: { title: "My applications", group: "Account" },
} as const satisfies Partial<Record<keyof typeof routes, { title: string; group: string }>>;
