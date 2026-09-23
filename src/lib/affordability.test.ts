import { affordability, affordablePayment, bankLimit, principalForPayment } from "./affordability";
import { quoteFlatRate } from "./loan-math";

describe("affordablePayment", () => {
  it("keeps all repayments within 40% of income", () => {
    const { payment, limit } = affordablePayment({ income: 6_000, expenses: 2_000, existingRepayments: 500 });
    expect(payment).toBeCloseTo(1_900, 6);
    expect(limit).toBe("debt-share");
  });

  it("keeps 20% of income spare after expenses", () => {
    const { payment, limit } = affordablePayment({ income: 6_000, expenses: 3_800, existingRepayments: 0 });
    expect(payment).toBeCloseTo(1_000, 6);
    expect(limit).toBe("buffer");
  });

  it("never goes below zero and handles an empty budget", () => {
    expect(affordablePayment({ income: 4_000, expenses: 4_500, existingRepayments: 0 }).payment).toBe(0);
    expect(affordablePayment({ income: 0, expenses: 0, existingRepayments: 0 })).toEqual({ payment: 0, limit: "none" });
  });
});

describe("principalForPayment", () => {
  it("inverts the flat-rate repayment", () => {
    const principal = principalForPayment(620.2222, 36, 0.0388);
    expect(principal).toBeCloseTo(20_000, 0);
    expect(quoteFlatRate(principal, 36, 0.0388).monthlyRepayment).toBeCloseTo(620.2222, 3);
  });
});

describe("bankLimit", () => {
  it("is 4× monthly income, or 10× from S$120,000 a year", () => {
    expect(bankLimit(6_000)).toBe(24_000);
    expect(bankLimit(10_000)).toBe(100_000);
  });
});

describe("affordability", () => {
  it("caps the amount at the typical bank limit", () => {
    const result = affordability({ income: 6_000, expenses: 1_500, existingRepayments: 0 }, 60, 0.0388);
    expect(result.amount).toBe(24_000);
    expect(result.limit).toBe("bank-cap");
  });

  it("uses the budget when it binds first, rounded down to S$100", () => {
    const result = affordability({ income: 6_000, expenses: 3_800, existingRepayments: 400 }, 12, 0.0388);
    expect(result.limit).toBe("buffer");
    expect(result.amount % 100).toBe(0);
    expect(result.payment).toBeLessThanOrEqual(600 + 1e-6);
    expect(result.leftOver).toBeGreaterThanOrEqual(1_200 - 1e-6);
  });

  it("returns nothing to borrow when the budget has no room", () => {
    const result = affordability({ income: 5_000, expenses: 4_500, existingRepayments: 300 }, 36, 0.0388);
    expect(result).toMatchObject({ amount: 0, payment: 0 });
  });
});
