import { contact, routes } from "@/content/site";

/**
 * Fine-print pages. Facts match the rest of the site: Lendingvolt is a
 * comparison platform run by Lendkaki Pay Pte. Ltd., not a lender.
 * Counsel should review these before they are relied on.
 */

export type LegalInline = string | { label: string; href: string };

export type LegalBlock =
  | { type: "p"; content: readonly LegalInline[] }
  | { type: "ul"; items: readonly (readonly LegalInline[])[] };

export type LegalSection = {
  id: string;
  title: string;
  blocks: readonly LegalBlock[];
};

export type LegalPageContent = {
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: readonly LegalSection[];
};

const updated = "23 September 2026";

const company = "Lendkaki Pay Pte. Ltd.";
const uen = "202607335C";

function p(...content: LegalInline[]): LegalBlock {
  return { type: "p", content };
}

function ul(items: readonly (string | readonly LegalInline[])[]): LegalBlock {
  return { type: "ul", items: items.map((item) => (typeof item === "string" ? [item] : item)) };
}

const privacyLink = { label: "Privacy Policy", href: routes.privacy };
const pdpaLink = { label: "PDPA Notice", href: routes.pdpa };
const cookiesLink = { label: "Cookie Policy", href: routes.cookies };
const termsLink = { label: "Terms of Use", href: routes.terms };

export const termsPage: LegalPageContent = {
  title: "Terms of Use",
  description: `The terms for using Lendingvolt, a loan comparison platform run by ${company}. We are not a lender.`,
  updated,
  intro: "These terms cover your use of the Lendingvolt website and comparison service.",
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      blocks: [
        p(
          `Lendingvolt is run and managed by ${company} (UEN: ${uen}), of ${contact.address}. In these terms, "we" and "us" mean that company.`,
        ),
        p("Lendingvolt is a loan comparison platform. We are not a lender, a credit bureau, or a financial adviser."),
      ],
    },
    {
      id: "the-service",
      title: "What the service does",
      blocks: [
        p(
          "You tell us what you want to borrow. We send that application to licensed lenders on our panel that may lend to you, and we show you the offers they return.",
        ),
        p(
          "A loan, if you take one, is a contract between you and that lender. We do not approve loans, set their terms, or pay out funds.",
        ),
        p(
          "Lenders on the panel are banks and financial institutions regulated by the Monetary Authority of Singapore, or moneylenders licensed by the Ministry of Law. A licence is where our review of a lender starts. It is not an endorsement, and it does not guarantee approval, a rate, or a level of service.",
        ),
      ],
    },
    {
      id: "eligibility",
      title: "Who can use the site",
      blocks: [
        p("The site is for people aged 18 or over. Loan products have their own eligibility rules, and each lender sets those."),
        p("You may use the site only for your own borrowing, or for a business you are authorised to represent."),
      ],
    },
    {
      id: "your-application",
      title: "Your application",
      blocks: [
        p(
          "You agree that the details you give us are true, complete and your own. Lenders use them to decide whether to make an offer.",
        ),
        p(
          "The homepage asks for a loan amount and a purpose only. Your name, contact details, residency, employment and income are collected later, on the application, and only with the consent described in our ",
          pdpaLink,
          ".",
        ),
        p(
          "We keep the amount, purpose and repayment period on your device for the session so you can continue the application. We do not put them in the address bar.",
        ),
      ],
    },
    {
      id: "offers",
      title: "Offers and rates",
      blocks: [
        p(
          "Rates shown on the site are indicative. Each one states the basis it uses, such as a flat or effective rate, and the tenure it assumes. The lender confirms the actual rate, fees and total cost after its own assessment.",
        ),
        p(
          "A lender may decline your application or offer different terms. A soft search we use to match you does not affect your credit score. A lender may run a full credit bureau search once you proceed with them, and they will tell you before they do.",
        ),
        p("Nothing on the site is an offer of credit from us, or advice to take a particular loan."),
      ],
    },
    {
      id: "fees",
      title: "What it costs",
      blocks: [
        p(
          "You pay Lendingvolt nothing to compare or to apply. A lender pays us a fee when a loan completes. That fee does not change the rates or repayments you see.",
        ),
        p("Any fee a lender charges, such as an early settlement fee, is the lender's. It will be in the terms of that offer."),
      ],
    },
    {
      id: "use",
      title: "Using the site",
      blocks: [
        p("Use the site lawfully. In particular, do not:"),
        ul([
          "Give us someone else's personal data unless you have their authority.",
          "Interfere with the site, probe it for a weakness, or try to get past an access control.",
          "Copy the site, or pull offers off it in bulk, to run a competing service.",
          "Pretend an offer or a rate comes from us rather than from the lender who made it.",
        ]),
      ],
    },
    {
      id: "content",
      title: "Our content",
      blocks: [
        p(
          `The site, the Lendingvolt name and the material on these pages belong to ${company} or its licensors. You may read them and use the comparison for your own decision. You may not copy them for a commercial purpose without our written consent.`,
        ),
      ],
    },
    {
      id: "liability",
      title: "Liability",
      blocks: [
        p(
          "We take care to keep the site accurate. We do not promise that it will be uninterrupted, or that every lender and every rate will be available to you.",
        ),
        p(
          "To the extent the law allows, we are not liable for a decision you make with a lender, or for a loss that lender's product causes. Nothing in these terms limits liability that Singapore law does not allow us to limit, including liability for fraud or for death or personal injury caused by negligence.",
        ),
      ],
    },
    {
      id: "changes",
      title: "Changes",
      blocks: [
        p(
          "We may update these terms as the service changes. The date at the top of this page is the date of the current version. Continuing to use the site after an update means you accept the new terms.",
        ),
      ],
    },
    {
      id: "law",
      title: "Governing law",
      blocks: [
        p("These terms are governed by the laws of Singapore. The courts of Singapore have exclusive jurisdiction."),
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        p("Questions about these terms: ", { label: contact.email, href: `mailto:${contact.email}` }, "."),
        p("How we handle personal data is in the ", privacyLink, " and the ", pdpaLink, ". Cookies and on-device storage are in the ", cookiesLink, "."),
      ],
    },
  ],
};

export const privacyPage: LegalPageContent = {
  title: "Privacy Policy",
  description: "How Lendingvolt collects, uses and shares personal data when you use the site or send an application.",
  updated,
  intro: "This policy explains what personal data we collect and why, whether or not you go on to apply.",
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      blocks: [
        p(
          `${company} (UEN: ${uen}) operates Lendingvolt. We are the organisation responsible for personal data collected through this site. Our office is at ${contact.address}.`,
        ),
        p("We are a comparison platform, not a lender. A lender you apply to is a separate organisation with its own privacy notice."),
      ],
    },
    {
      id: "data",
      title: "Data we collect",
      blocks: [
        p("Depending on how far you go, we collect:"),
        ul([
          "A loan amount, purpose and repayment period.",
          "Your name, mobile number and email address.",
          "Your residency status, how you earn your income, and your monthly income.",
          "A date and time, if you book a visit with a lender.",
          "Details you authorise us to receive through Singpass Myinfo, such as your name, contact details, residency and income.",
          "Technical data our hosting provider records, such as your IP address, browser type and the pages you request, so the site can run and stay secure.",
        ]),
        p("We do not ask for your NRIC number, date of birth or income on the homepage, and we do not put personal data in a web address."),
      ],
    },
    {
      id: "use",
      title: "How we use it",
      blocks: [
        p("We use personal data to:"),
        ul([
          "Match you with licensed lenders on our panel.",
          "Send your application to those lenders so they can assess it and make an offer.",
          "Show you the offers and, if you choose one, help you arrange the next step with that lender.",
          "Run the site, keep it secure, and answer a question you send us.",
        ]),
      ],
    },
    {
      id: "sharing",
      title: "Who we share it with",
      blocks: [
        p("We share an application with matched lenders on our panel, and only with your consent. We do not sell personal data."),
        p("We also share data with:"),
        ul([
          "Service providers who host the site or send email for us, and only on our instructions.",
          "A professional adviser or an authority, where the law requires it or where we need to establish or defend a legal claim.",
        ]),
        p("Once a lender has your application, it handles that copy under its own policy. We do not control that."),
      ],
    },
    {
      id: "credit",
      title: "Credit checks",
      blocks: [
        p(
          "A soft search we use to match you does not affect your credit score. A lender may run a full credit bureau search once you proceed with them, and they will tell you before they do.",
        ),
      ],
    },
    {
      id: "singpass",
      title: "Singpass and Myinfo",
      blocks: [
        p(
          "If you choose to fill an application with Singpass Myinfo, we receive the details you authorise from those records. You can check and change them before you send the application. You can also fill the form in yourself.",
        ),
      ],
    },
    {
      id: "marketing",
      title: "Marketing",
      blocks: [
        p(
          "We do not collect marketing consent as part of an application, and we do not send marketing email. If that changes, we will ask first, and you will be able to opt out at any time.",
        ),
      ],
    },
    {
      id: "retention",
      title: "How long we keep it",
      blocks: [
        p(
          "We keep personal data only for as long as we need it to run the comparison, handle a question or a complaint, or meet a legal duty. After that we delete it or remove what identifies you.",
        ),
        p(
          "The loan amount and purpose you enter on the homepage stay in your browser for that session and are cleared when the session ends. They are not stored on our servers until you continue an application.",
        ),
      ],
    },
    {
      id: "storage",
      title: "Where it is stored",
      blocks: [
        p(
          "We keep personal data in Singapore where we can. If a provider we use stores it elsewhere, we take the steps the Personal Data Protection Act requires so that it stays protected.",
        ),
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      blocks: [p("Cookies and similar storage are described in the ", cookiesLink, ".")],
    },
    {
      id: "choices",
      title: "Your choices",
      blocks: [
        p(
          "You can ask to see the personal data we hold about you, ask us to correct it, or withdraw your consent. The ",
          pdpaLink,
          " explains how, and how long we take to respond.",
        ),
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        p(
          "Privacy questions: ",
          { label: contact.email, href: `mailto:${contact.email}` },
          ". Put \"Personal data\" in the subject so it reaches the right person.",
        ),
      ],
    },
  ],
};

export const pdpaPage: LegalPageContent = {
  title: "PDPA Notice",
  description:
    "What personal data Lendingvolt collects for a loan application, who it is shared with, and how to withdraw consent.",
  updated,
  intro: "This is the notice named in the consent box on the application. Please read it before you tick that box.",
  sections: [
    {
      id: "organisation",
      title: "The organisation",
      blocks: [
        p(
          `This notice is given by ${company} (UEN: ${uen}), which runs Lendingvolt, a loan comparison platform. We are not a lender. Our office is at ${contact.address}.`,
        ),
        p("It is given under Singapore's Personal Data Protection Act 2012 (PDPA)."),
      ],
    },
    {
      id: "data",
      title: "Personal data we collect",
      blocks: [
        p("To match you and send an application, we collect:"),
        ul([
          "Your name, mobile number and email address.",
          "Your residency status.",
          "How you earn your income, and your monthly income before tax.",
          "The loan amount, purpose and repayment period.",
          "A visit date and time, if you book one.",
          "Any of the above that you authorise us to receive through Singpass Myinfo.",
        ]),
        p("We collect this from you, in the form, or from Myinfo when you choose that. We do not buy lists of personal data."),
      ],
    },
    {
      id: "purposes",
      title: "Purposes",
      blocks: [
        p("We collect, use and disclose this data so that:"),
        ul([
          "We can match you with licensed lenders on our panel.",
          "Those lenders can assess your application and decide whether to make you an offer.",
          "We can show you the offers side by side, including the repayment, total payable and effective interest rate each lender provides.",
          "We can pass on a visit you book with a lender you choose.",
          "We can answer you about that application.",
        ]),
      ],
    },
    {
      id: "recipients",
      title: "Who receives it",
      blocks: [
        p(
          "We disclose your application to matched lenders on our panel: banks and financial institutions regulated by the Monetary Authority of Singapore, or moneylenders licensed by the Ministry of Law. We do not send it to every lender, and we do not send it to anyone outside that match.",
        ),
        p(
          "Those lenders receive it so they can assess the application and contact you about an offer. From then on they are responsible for their own copy.",
        ),
        p("We may also disclose data to a service provider acting for us, or where Singapore law requires it."),
      ],
    },
    {
      id: "consent",
      title: "Consent",
      blocks: [
        p(
          "We ask you to agree before we send an application. The box is not ticked in advance. Ticking it means you agree to the collection, use and disclosure described in this notice.",
        ),
        p(
          "A soft search we use to match you does not affect your credit score. A lender may run a full credit bureau search once you proceed with them, and they will tell you before they do. That search is the lender's, under its own notice.",
        ),
      ],
    },
    {
      id: "withdraw",
      title: "Withdrawing consent",
      blocks: [
        p(
          "You may withdraw consent at any time by emailing ",
          { label: contact.email, href: `mailto:${contact.email}` },
          ". Put \"Withdraw consent\" in the subject.",
        ),
        p(
          "Withdrawal stops us using your data from then on. It does not affect processing we have already done, and it does not require a lender who already has your application to delete its copy. If an application is still open, withdrawal may mean we cannot complete it.",
        ),
      ],
    },
    {
      id: "access",
      title: "Access and correction",
      blocks: [
        p(
          "You may ask for a copy of the personal data we hold about you, and ask us to correct it if it is wrong or incomplete. Email ",
          { label: contact.email, href: `mailto:${contact.email}` },
          " with \"Personal data\" in the subject. We will respond as soon as reasonably possible, and within 30 days.",
        ),
        p(
          "We may have to check that the request comes from you. If we cannot give you something, we will tell you why, unless the law says we should not.",
        ),
      ],
    },
    {
      id: "protection",
      title: "Protection and retention",
      blocks: [
        p(
          "We limit access to people who need it to run the comparison, and we use service providers who are bound to protect it. We keep it only as long as the purposes above, or a legal duty, require, and then we delete it or remove what identifies you.",
        ),
      ],
    },
    {
      id: "complaints",
      title: "Complaints",
      blocks: [
        p("Write to us first and we will look into it. If you are not satisfied, you can contact the Personal Data Protection Commission at ", {
          label: "pdpc.gov.sg",
          href: "https://www.pdpc.gov.sg",
        }, "."),
      ],
    },
    {
      id: "more",
      title: "More detail",
      blocks: [
        p("The ", privacyLink, " covers the website as well as applications. The ", cookiesLink, " covers cookies and storage on your device. The ", termsLink, " cover use of the service."),
      ],
    },
  ],
};

export const cookiesPage: LegalPageContent = {
  title: "Cookie Policy",
  description: "The cookies and on-device storage Lendingvolt uses, and how to control them.",
  updated,
  intro: "This policy describes what the site stores on your device, and what it does not.",
  sections: [
    {
      id: "covers",
      title: "What this covers",
      blocks: [
        p(
          "A cookie is a small file a site stores on your device. This policy also covers similar storage the site uses, such as session storage in your browser.",
        ),
        p(`The site is run by ${company} (UEN: ${uen}).`),
      ],
    },
    {
      id: "cookies",
      title: "Cookies we use",
      blocks: [
        p(
          "Lendingvolt does not use advertising cookies, and it does not use analytics cookies that follow you across other sites.",
        ),
        p(
          "We do not drop a cookie to remember a marketing preference or to build a profile of you. If that changes, we will update this page before we start, and we will not use a non-essential cookie without asking.",
        ),
      ],
    },
    {
      id: "storage",
      title: "Storage on your device",
      blocks: [
        p("The site uses your browser's session storage for two things, and both stay on your device:"),
        ul([
          "The loan amount, purpose and repayment period you enter, so they carry into the application. They are cleared when the session ends, and they are never put in the web address.",
          "The application you are filling in, so a refresh does not wipe the form. It stays in that browser until you finish or the session ends.",
        ]),
        p("This storage is not sent to other websites. It is not used to advertise to you."),
      ],
    },
    {
      id: "others",
      title: "Other sites",
      blocks: [
        p(
          "A lender you go on to has its own website, cookies and privacy notice. Once you leave Lendingvolt, this policy no longer applies. The same is true of Singpass, if you choose to use it.",
        ),
      ],
    },
    {
      id: "control",
      title: "How to control cookies",
      blocks: [
        p(
          "You can block or delete cookies in your browser settings. Blocking them should not stop the comparison from working, because the site does not rely on an advertising or analytics cookie.",
        ),
        p(
          "Session storage is separate from cookies. You can clear it in your browser's site-data settings. Clearing it removes an application that you have not yet sent.",
        ),
      ],
    },
    {
      id: "changes",
      title: "Changes",
      blocks: [
        p("If we start using a cookie we do not use today, we will update the date at the top of this page and describe it here first."),
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        p("Questions: ", { label: contact.email, href: `mailto:${contact.email}` }, ". How we handle personal data is in the ", privacyLink, " and the ", pdpaLink, "."),
      ],
    },
  ],
};
