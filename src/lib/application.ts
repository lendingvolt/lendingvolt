import { z } from "zod";
import type { LoanPurpose } from "@/content/home";
import { intentSchema, parseAmount, tenureOptions, type ApplicationIntent, type Tenure } from "./application-intent";

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

export const stepIds = [
  "loan",
  "soft-check",
  "singpass",
  "about",
  "income",
  "review",
  "consent",
  "matching",
  "choose",
  "book",
  "booked",
] as const;

export type StepId = (typeof stepIds)[number];

/** Screens the borrower moves through; everything from matching on sits after submission. */
const progressSteps = stepIds.slice(0, stepIds.indexOf("matching"));

export function stepProgress(step: StepId): { current: number; total: number } | null {
  const index = progressSteps.indexOf(step);
  return index === -1 ? null : { current: index + 1, total: progressSteps.length };
}

/* ------------------------------------------------------------------ */
/* Draft and schemas                                                   */
/* ------------------------------------------------------------------ */

export const residencyOptions = [
  { value: "citizen", label: "Citizen" },
  { value: "pr", label: "PR" },
  { value: "foreigner", label: "Foreigner" },
] as const;

export const employmentOptions = [
  { value: "salaried", label: "Salaried" },
  { value: "self-employed", label: "Self-employed" },
  { value: "other", label: "Other" },
] as const;

export type Residency = (typeof residencyOptions)[number]["value"];
export type Employment = (typeof employmentOptions)[number]["value"];

/** Everything the form holds, as the inputs hold it (strings, not parsed numbers). */
export type ApplicationDraft = {
  amount: string;
  purpose: LoanPurpose;
  tenure: Tenure;
  fullName: string;
  mobile: string;
  email: string;
  residency: Residency | "";
  employment: Employment | "";
  monthlyIncome: string;
  pdpaConsent: boolean;
  marketingConsent: boolean;
  /** Visit to the chosen lender: a Singapore date "YYYY-MM-DD" and a start time "HH:MM". */
  visitDate: string;
  visitTime: string;
};

export type DraftField = keyof ApplicationDraft;
export type FieldErrors = Partial<Record<DraftField, string>>;

const enumOf = <T extends readonly { value: string }[]>(options: T) =>
  options.map((option) => option.value) as unknown as [T[number]["value"], ...T[number]["value"][]];

export const loanSchema = z.object({
  amount: intentSchema.shape.amount,
  purpose: intentSchema.shape.purpose,
  tenure: z.enum(tenureOptions, { error: "Choose how long you want to repay over." }),
});

export const aboutSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name as it appears on your NRIC or pass."),
  mobile: z.string().regex(/^[689]\d{7}$/, "Enter an 8-digit Singapore number, like 9123 4567."),
  email: z.email("Enter an email address, like name@example.com."),
  residency: z.enum(enumOf(residencyOptions), { error: "Choose your residency status." }),
});

export const incomeSchema = z.object({
  employment: z.enum(enumOf(employmentOptions), { error: "Choose how you earn your income." }),
  monthlyIncome: z
    .number({ error: "Enter your monthly income in dollars." })
    .int("Enter a whole dollar amount.")
    .min(1, "Enter your monthly income in dollars.")
    .max(1_000_000, "Enter your monthly income, not your annual income."),
});

export const consentSchema = z.object({
  pdpaConsent: z.literal(true, { error: "Tick the box to agree before we send your application." }),
  marketingConsent: z.boolean(),
});

export const bookingSchema = z.object({
  visitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a day for your visit."),
  visitTime: z.string().regex(/^\d{2}:\d{2}$/, "Choose a time for your visit."),
});

/** Parse the draft fields a step owns. Steps without fields always pass. */
function schemaInput(step: StepId, draft: ApplicationDraft) {
  switch (step) {
    case "loan":
      return { schema: loanSchema, input: { amount: parseAmount(draft.amount), purpose: draft.purpose, tenure: draft.tenure } };
    case "about":
      return {
        schema: aboutSchema,
        input: {
          fullName: draft.fullName,
          mobile: draft.mobile.replace(/\s/g, ""),
          email: draft.email.trim(),
          residency: draft.residency,
        },
      };
    case "income":
      return {
        schema: incomeSchema,
        input: { employment: draft.employment, monthlyIncome: parseAmount(draft.monthlyIncome) },
      };
    case "consent":
      return {
        schema: consentSchema,
        input: { pdpaConsent: draft.pdpaConsent, marketingConsent: draft.marketingConsent },
      };
    case "book":
      return { schema: bookingSchema, input: { visitDate: draft.visitDate, visitTime: draft.visitTime } };
    default:
      return null;
  }
}

/** Field errors for a step, keyed by draft field. Empty when the step is valid. */
export function validateStep(step: StepId, draft: ApplicationDraft): FieldErrors {
  const entry = schemaInput(step, draft);
  if (!entry) return {};
  const result = entry.schema.safeParse(entry.input);
  if (result.success) return {};
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as DraftField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

/* ------------------------------------------------------------------ */
/* Reducer                                                             */
/* ------------------------------------------------------------------ */

export type FlowState = {
  step: StepId;
  draft: ApplicationDraft;
  errors: FieldErrors;
  /** Where the details came from, so screens can label prefilled fields. */
  source: "manual" | "myinfo" | null;
  /** Set when editing from the review screen, so Continue returns there. */
  returnTo: StepId | null;
  lenderId: string | null;
  /** Singapore date the lender was chosen on; bookable days start the day after. */
  bookingFrom: string | null;
};

export type FlowAction =
  | { type: "next" }
  | { type: "back" }
  | { type: "goTo"; step: StepId }
  | { type: "update"; patch: Partial<ApplicationDraft> }
  | { type: "fillFromMyinfo"; profile: Partial<ApplicationDraft> }
  | { type: "submit" }
  | { type: "matched" }
  | { type: "chooseLender"; lenderId: string; today: string }
  | { type: "confirmBooking" };

/** Steps that move only through their own actions, never Continue or Back. */
const lockedForNext: readonly StepId[] = ["consent", "matching", "choose", "book", "booked"];
const lockedForBack: readonly StepId[] = ["loan", "matching", "choose", "booked"];

const amountFormat = new Intl.NumberFormat("en-SG", { maximumFractionDigits: 0 });

export function formatDigits(value: number): string {
  return Number.isFinite(value) ? amountFormat.format(value) : "";
}

export function createInitialState(intent?: Partial<ApplicationIntent> | null): FlowState {
  return {
    step: "loan",
    draft: {
      amount: intent?.amount ? formatDigits(intent.amount) : "",
      purpose: (intent?.purpose as LoanPurpose | undefined) ?? "personal",
      tenure: intent?.tenure ?? "36",
      fullName: "",
      mobile: "",
      email: "",
      residency: "",
      employment: "",
      monthlyIncome: "",
      pdpaConsent: false,
      marketingConsent: false,
      visitDate: "",
      visitTime: "",
    },
    errors: {},
    source: null,
    returnTo: null,
    lenderId: null,
    bookingFrom: null,
  };
}

const offset = (step: StepId, by: number): StepId => stepIds[stepIds.indexOf(step) + by] ?? step;

/** Whether Back does anything here: always when editing from review, otherwise per step. */
export function canGoBack(state: FlowState): boolean {
  return state.returnTo !== null || !lockedForBack.includes(state.step);
}

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "next": {
      if (lockedForNext.includes(state.step)) return state;
      const errors = validateStep(state.step, state.draft);
      if (Object.keys(errors).length > 0) return { ...state, errors };
      if (state.returnTo) return { ...state, step: state.returnTo, errors: {}, returnTo: null };
      const step = offset(state.step, 1);
      return { ...state, step, errors: {}, source: state.step === "singpass" ? "manual" : state.source };
    }

    case "back": {
      if (!canGoBack(state)) return state;
      if (state.returnTo) return { ...state, step: state.returnTo, errors: {}, returnTo: null };
      return { ...state, step: offset(state.step, -1), errors: {} };
    }

    case "goTo": {
      if (state.step !== "review" || stepProgress(action.step) === null) return state;
      return { ...state, step: action.step, errors: {}, returnTo: "review" };
    }

    case "update": {
      const errors = { ...state.errors };
      for (const key of Object.keys(action.patch) as DraftField[]) delete errors[key];
      return { ...state, draft: { ...state.draft, ...action.patch }, errors };
    }

    case "fillFromMyinfo": {
      if (state.step !== "singpass") return state;
      return {
        ...state,
        step: "about",
        draft: { ...state.draft, ...action.profile },
        errors: {},
        source: "myinfo",
      };
    }

    case "submit": {
      if (state.step !== "consent") return state;
      const errors = validateStep("consent", state.draft);
      if (Object.keys(errors).length > 0) return { ...state, errors };
      return { ...state, step: "matching", errors: {} };
    }

    case "matched":
      return state.step === "matching" ? { ...state, step: "choose" } : state;

    case "chooseLender": {
      if (state.step !== "choose") return state;
      const isSameLender = state.lenderId === action.lenderId && state.bookingFrom === action.today;
      return {
        ...state,
        step: "book",
        lenderId: action.lenderId,
        bookingFrom: action.today,
        draft: isSameLender ? state.draft : { ...state.draft, visitDate: "", visitTime: "" },
        errors: {},
      };
    }

    case "confirmBooking": {
      if (state.step !== "book") return state;
      const errors = validateStep("book", state.draft);
      if (Object.keys(errors).length > 0) return { ...state, errors };
      return { ...state, step: "booked", errors: {} };
    }
  }
}
