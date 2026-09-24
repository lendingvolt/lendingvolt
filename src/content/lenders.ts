/**
 * Lenders that can be chosen and booked from the application flow.
 * Contact details are from each lender's own website; confirm before launch.
 */

export type LenderProfile = {
  id: string;
  name: string;
  kind: string;
  product: string;
  website: string;
  licence: string;
  address: { line1: string; line2: string };
  phone: { display: string; href: string };
  email: string;
  hours: { open: string; close: string; days: string; closed: string };
  /** What happens when the borrower visits, in the lender's own terms. */
  visit: string;
  loanLimit: string;
  /**
   * Terms used only to work out example figures. Not the lender's rates:
   * every place that shows them says so on the card.
   */
  exampleTerms: { flatRate: number; feeRate: number };
};

export const crawfort: LenderProfile = {
  id: "crawfort",
  name: "Crawfort",
  kind: "Licensed moneylender",
  product: "Personal loan",
  website: "https://crawfort.com/sg",
  licence: "[Licence no.]",
  address: { line1: "1 North Bridge Road #01-35", line2: "Singapore 179094" },
  phone: { display: "+65 6777 8080", href: "tel:+6567778080" },
  email: "hellosg@crawfort.com",
  hours: { open: "10:30", close: "19:30", days: "Mon–Sat, 10:30am–7:30pm", closed: "Closed Sundays and public holidays" },
  visit: "Crawfort verifies your identity face to face at its outlet, then releases your funds.",
  loanLimit: "Up to 6× your monthly income if you earn at least S$20,000 a year",
  exampleTerms: { flatRate: 0.12, feeRate: 0.05 },
};

export const lenders = [crawfort] as const;

export function findLender(id: string | null): LenderProfile | undefined {
  return lenders.find((lender) => lender.id === id);
}

export function mapsUrl(lender: LenderProfile): string {
  const query = `${lender.name}, ${lender.address.line1}, ${lender.address.line2}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
