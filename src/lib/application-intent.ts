import { z } from "zod";
import { loanPurposes } from "@/content/home";

/**
 * The only data the homepage collects: amount and purpose. It is kept in
 * sessionStorage for the apply page and never placed in a URL.
 */
export const intentSchema = z.object({
  amount: z
    .number({ error: "Enter an amount in dollars." })
    .int("Enter a whole dollar amount.")
    .min(1_000, "The smallest loan on our panel is S$1,000.")
    .max(500_000, "For more than S$500,000, talk to us directly."),
  purpose: z.enum(loanPurposes.map((purpose) => purpose.value) as [string, ...string[]]),
});

export type ApplicationIntent = z.infer<typeof intentSchema>;

const STORAGE_KEY = "lendingvolt:intent";

/** Parse "20,000" or "S$20000" into a number, or NaN. */
export function parseAmount(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? Number(digits) : Number.NaN;
}

export function saveIntent(intent: ApplicationIntent): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(intent));
  } catch {
    // Storage can be unavailable (private mode, quota); the apply page asks again.
  }
}
