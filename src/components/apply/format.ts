import { loanPurposes } from "@/content/home";
import {
  employmentOptions,
  formatDigits,
  residencyOptions,
  type ApplicationDraft,
} from "@/lib/application";
import { parseAmount } from "@/lib/application-intent";
import { formatSGD } from "@/lib/loan-math";

const labelOf = (options: readonly { value: string; label: string }[], value: string) =>
  options.find((option) => option.value === value)?.label ?? "—";

/** Keep only digits and regroup them, so "20000" reads "20,000" as it is typed. */
export function formatAmountInput(raw: string): string {
  return formatDigits(parseAmount(raw));
}

/** "91234567" → "9123 4567"; anything else is left as typed. */
export function formatMobileInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  return digits.length > 4 ? `${digits.slice(0, 4)} ${digits.slice(4)}` : digits;
}

/** The draft as the review screen shows it, grouped by the step that owns each field. */
export function describeDraft(draft: ApplicationDraft) {
  const amount = parseAmount(draft.amount);
  const income = parseAmount(draft.monthlyIncome);
  return [
    {
      step: "loan",
      title: "Loan",
      rows: [
        { term: "Amount", value: Number.isFinite(amount) ? formatSGD(amount) : "—" },
        { term: "Purpose", value: labelOf(loanPurposes, draft.purpose) },
        { term: "Repayment period", value: `${draft.tenure} months` },
      ],
    },
    {
      step: "about",
      title: "About you",
      rows: [
        { term: "Full name", value: draft.fullName || "—" },
        { term: "Mobile", value: draft.mobile ? `+65 ${draft.mobile}` : "—" },
        { term: "Email", value: draft.email || "—" },
        { term: "Residency", value: labelOf(residencyOptions, draft.residency) },
      ],
    },
    {
      step: "income",
      title: "Income",
      rows: [
        { term: "Employment", value: labelOf(employmentOptions, draft.employment) },
        { term: "Monthly income", value: Number.isFinite(income) ? `${formatSGD(income)} a month` : "—" },
      ],
    },
  ] as const;
}
