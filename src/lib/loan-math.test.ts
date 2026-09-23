import {
  LoanInputError,
  formatPercent,
  formatSGD,
  formatTenure,
  quoteFlatRate,
  solveMonthlyRate,
} from "./loan-math";

describe("quoteFlatRate", () => {
  it("charges flat interest on the original principal", () => {
    const quote = quoteFlatRate(20_000, 36, 0.0388);
    expect(quote.totalInterest).toBeCloseTo(2_328, 6);
    expect(quote.totalPayable).toBeCloseTo(22_328, 6);
    expect(quote.monthlyRepayment).toBeCloseTo(620.2222, 3);
  });

  it("reports an EIR close to double the flat rate with no fee", () => {
    const { eir } = quoteFlatRate(20_000, 36, 0.0388);
    expect(eir).toBeGreaterThan(0.0388 * 1.8);
    expect(eir).toBeLessThan(0.0388 * 2.1);
  });

  it("raises the EIR when a processing fee is deducted", () => {
    const withoutFee = quoteFlatRate(20_000, 36, 0.0348).eir;
    const withFee = quoteFlatRate(20_000, 36, 0.0348, 0.01).eir;
    expect(withFee).toBeGreaterThan(withoutFee);
  });

  it("returns a zero EIR for a zero rate and no fee", () => {
    expect(quoteFlatRate(10_000, 12, 0).eir).toBe(0);
  });

  it("rejects invalid input", () => {
    expect(() => quoteFlatRate(0, 12, 0.03)).toThrow(LoanInputError);
    expect(() => quoteFlatRate(10_000, -1, 0.03)).toThrow(LoanInputError);
    expect(() => quoteFlatRate(10_000, 12, -0.01)).toThrow(LoanInputError);
    expect(() => quoteFlatRate(10_000, 12, 0.03, 1)).toThrow(LoanInputError);
  });
});

describe("solveMonthlyRate", () => {
  it("recovers a known monthly rate from its annuity payment", () => {
    const i = 0.005;
    const months = 60;
    const principal = 50_000;
    const payment = (principal * i) / (1 - Math.pow(1 + i, -months));
    expect(solveMonthlyRate(principal, payment, months)).toBeCloseTo(i, 9);
  });
});

describe("formatters", () => {
  it("formats Singapore dollars", () => {
    expect(formatSGD(20_000)).toBe("S$20,000");
    expect(formatSGD(620.2222, true)).toBe("S$620.22");
  });

  it("formats percentages and tenures", () => {
    expect(formatPercent(0.0388)).toBe("3.88%");
    expect(formatTenure(36)).toBe("3 years");
    expect(formatTenure(12)).toBe("1 year");
    expect(formatTenure(18)).toBe("18 months");
  });
});
