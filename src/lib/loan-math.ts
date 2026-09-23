/**
 * Loan arithmetic for flat-rate instalment loans, the way Singapore lenders
 * quote personal loans: a flat annual rate on the original principal, equal
 * monthly repayments, and an effective interest rate (EIR) that reflects the
 * true cost including any processing fee.
 */

export class LoanInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoanInputError";
  }
}

export type FlatRateQuote = {
  principal: number;
  months: number;
  flatRate: number;
  fee: number;
  totalInterest: number;
  totalPayable: number;
  monthlyRepayment: number;
  /** Effective annual rate, compounded monthly, as a decimal. */
  eir: number;
};

function assertPositive(value: number, name: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new LoanInputError(`${name} must be a positive number`);
  }
}

/** Present value of `months` equal payments at monthly rate `i`. */
function annuityValue(payment: number, i: number, months: number): number {
  if (i === 0) return payment * months;
  return (payment * (1 - Math.pow(1 + i, -months))) / i;
}

/**
 * Monthly rate at which `months` payments of `payment` repay `netPrincipal`.
 * Newton's method from a close first guess, with bisection as a fallback.
 */
export function solveMonthlyRate(netPrincipal: number, payment: number, months: number): number {
  assertPositive(netPrincipal, "netPrincipal");
  assertPositive(payment, "payment");
  assertPositive(months, "months");
  if (payment * months <= netPrincipal) return 0;

  const f = (i: number) => annuityValue(payment, i, months) - netPrincipal;

  let i = (2 * (payment * months - netPrincipal)) / (netPrincipal * (months + 1));
  for (let step = 0; step < 50; step++) {
    const h = Math.max(i * 1e-6, 1e-10);
    const derivative = (f(i + h) - f(i - h)) / (2 * h);
    if (!Number.isFinite(derivative) || derivative === 0) break;
    const next = i - f(i) / derivative;
    if (!Number.isFinite(next) || next <= 0) break;
    if (Math.abs(next - i) < 1e-12) return next;
    i = next;
  }

  let lo = 1e-12;
  let hi = 1;
  for (let step = 0; step < 200; step++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Quote a flat-rate instalment loan.
 * @param principal amount borrowed in S$
 * @param months tenure in months
 * @param flatRate flat annual rate as a decimal (0.0388 = 3.88% p.a.)
 * @param feeRate one-off processing fee as a share of principal, deducted at disbursement
 */
export function quoteFlatRate(
  principal: number,
  months: number,
  flatRate: number,
  feeRate = 0,
): FlatRateQuote {
  assertPositive(principal, "principal");
  assertPositive(months, "months");
  if (!Number.isFinite(flatRate) || flatRate < 0) {
    throw new LoanInputError("flatRate must be zero or positive");
  }
  if (!Number.isFinite(feeRate) || feeRate < 0 || feeRate >= 1) {
    throw new LoanInputError("feeRate must be between 0 and 1");
  }

  const totalInterest = (principal * flatRate * months) / 12;
  const totalPayable = principal + totalInterest;
  const monthlyRepayment = totalPayable / months;
  const fee = principal * feeRate;
  const monthlyRate = solveMonthlyRate(principal - fee, monthlyRepayment, months);

  return {
    principal,
    months,
    flatRate,
    fee,
    totalInterest,
    totalPayable,
    monthlyRepayment,
    eir: Math.pow(1 + monthlyRate, 12) - 1,
  };
}

export type ScheduleRow = {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  /** Principal still owed after this payment. */
  balance: number;
};

/**
 * The first `rows` months of a flat-rate schedule. Interest is split evenly
 * across the tenure, which is how flat-rate loans are usually illustrated;
 * a lender's own statement may allocate it differently (e.g. Rule of 78).
 */
export function repaymentSchedule(quote: FlatRateQuote, rows = quote.months): ScheduleRow[] {
  const count = Math.min(Math.max(0, Math.floor(rows)), quote.months);
  const interest = quote.totalInterest / quote.months;
  const principal = quote.principal / quote.months;
  return Array.from({ length: count }, (_, index) => ({
    month: index + 1,
    payment: quote.monthlyRepayment,
    interest,
    principal,
    balance: Math.max(0, quote.principal - principal * (index + 1)),
  }));
}

const sgd0 = new Intl.NumberFormat("en-SG", {
  style: "currency",
  currency: "SGD",
  currencyDisplay: "code",
  maximumFractionDigits: 0,
});

const sgd2 = new Intl.NumberFormat("en-SG", {
  style: "currency",
  currency: "SGD",
  currencyDisplay: "code",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** "S$20,000" or "S$612.22". */
export function formatSGD(value: number, cents = false): string {
  return (cents ? sgd2 : sgd0).format(value).replace(/^SGD\s?/, "S$");
}

/** "3.88%" from 0.0388. */
export function formatPercent(value: number, digits = 2): string {
  return `${(value * 100).toFixed(digits)}%`;
}

/** "3 years" or "18 months". */
export function formatTenure(months: number): string {
  if (months % 12 === 0) {
    const years = months / 12;
    return `${years} ${years === 1 ? "year" : "years"}`;
  }
  return `${months} months`;
}
