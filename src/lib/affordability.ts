/**
 * Affordability: work backwards from a budget to a loan amount. The rules
 * are deliberately simple and shown to the borrower in full:
 *
 * 1. All debt repayments, old and new, stay at or below 40% of gross income.
 * 2. After expenses and every repayment, at least 20% of income is left over.
 * 3. The amount stays within the typical bank limit for unsecured loans:
 *    4× monthly income, or 10× from S$120,000 a year.
 */

export const DEBT_SHARE_LIMIT = 0.4;
export const BUFFER_SHARE = 0.2;
const HIGH_INCOME_ANNUAL = 120_000;

export type Budget = {
  /** Gross monthly income in S$. */
  income: number;
  /** Monthly living costs: housing, bills, food, transport. */
  expenses: number;
  /** Monthly repayments on existing loans and card minimums. */
  existingRepayments: number;
};

export type AffordabilityLimit = "debt-share" | "buffer" | "bank-cap" | "none";

const clean = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0);

/** The largest new monthly repayment both budget rules allow, and which rule binds. */
export function affordablePayment(budget: Budget): { payment: number; limit: AffordabilityLimit } {
  const income = clean(budget.income);
  const expenses = clean(budget.expenses);
  const existing = clean(budget.existingRepayments);
  if (income === 0) return { payment: 0, limit: "none" };

  const byDebtShare = income * DEBT_SHARE_LIMIT - existing;
  const byBuffer = income * (1 - BUFFER_SHARE) - expenses - existing;
  const payment = Math.max(0, Math.min(byDebtShare, byBuffer));
  return { payment, limit: byDebtShare <= byBuffer ? "debt-share" : "buffer" };
}

/** The principal whose flat-rate monthly repayment over `months` equals `payment`. */
export function principalForPayment(payment: number, months: number, flatRate: number): number {
  if (!(payment > 0) || !(months > 0)) return 0;
  return (payment * months) / (1 + (Math.max(0, flatRate) * months) / 12);
}

/** Typical bank ceiling for an unsecured personal loan. */
export function bankLimit(monthlyIncome: number): number {
  const income = clean(monthlyIncome);
  return income * (income * 12 >= HIGH_INCOME_ANNUAL ? 10 : 4);
}

export type AffordabilityResult = {
  /** Largest loan amount within every rule, rounded down to the nearest S$100. */
  amount: number;
  /** Monthly repayment on that amount. */
  payment: number;
  /** What is left each month after expenses and all repayments. */
  leftOver: number;
  limit: AffordabilityLimit;
};

/** Everything the affordability screen shows, for one tenure and assumed flat rate. */
export function affordability(budget: Budget, months: number, flatRate: number): AffordabilityResult {
  const { payment: maxPayment, limit: budgetLimit } = affordablePayment(budget);
  const byBudget = principalForPayment(maxPayment, months, flatRate);
  const cap = bankLimit(budget.income);
  const isCapped = cap > 0 && cap < byBudget;
  const amount = Math.floor((isCapped ? cap : byBudget) / 100) * 100;
  const payment = amount > 0 ? (amount * (1 + (flatRate * months) / 12)) / months : 0;
  const leftOver = clean(budget.income) - clean(budget.expenses) - clean(budget.existingRepayments) - payment;
  return {
    amount,
    payment,
    leftOver,
    limit: amount === 0 ? (clean(budget.income) === 0 ? "none" : budgetLimit) : isCapped ? "bank-cap" : budgetLimit,
  };
}
