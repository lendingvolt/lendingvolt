import {
  createInitialState,
  flowReducer,
  stepProgress,
  validateStep,
  type ApplicationDraft,
  type FlowAction,
  type FlowState,
} from "./application";

const complete: Partial<ApplicationDraft> = {
  amount: "20,000",
  fullName: "Tan Mei Ling",
  mobile: "9123 4567",
  email: "meiling@example.com",
  residency: "citizen",
  employment: "salaried",
  monthlyIncome: "6,500",
};

const run = (state: FlowState, ...actions: FlowAction[]) => actions.reduce(flowReducer, state);

describe("validateStep", () => {
  it("rejects an empty amount and accepts a formatted one", () => {
    const draft = createInitialState().draft;
    expect(validateStep("loan", draft).amount).toBe("Enter an amount in dollars.");
    expect(validateStep("loan", { ...draft, amount: "20,000" })).toEqual({});
  });

  it("checks Singapore mobile numbers with or without spaces", () => {
    const draft = { ...createInitialState().draft, ...complete };
    expect(validateStep("about", draft)).toEqual({});
    expect(validateStep("about", { ...draft, mobile: "1234 5678" }).mobile).toMatch(/8-digit/);
  });

  it("requires residency and employment choices", () => {
    const draft = createInitialState().draft;
    expect(validateStep("about", draft).residency).toBe("Choose your residency status.");
    expect(validateStep("income", draft).employment).toBe("Choose how you earn your income.");
  });

  it("requires PDPA consent but not marketing consent", () => {
    const draft = { ...createInitialState().draft, ...complete };
    expect(validateStep("consent", draft).pdpaConsent).toMatch(/Tick the box/);
    expect(validateStep("consent", { ...draft, pdpaConsent: true })).toEqual({});
  });

  it("passes screens without fields", () => {
    expect(validateStep("soft-check", createInitialState().draft)).toEqual({});
  });
});

describe("flowReducer", () => {
  it("prefills amount, purpose and tenure from the saved intent", () => {
    const { draft } = createInitialState({ amount: 25000, purpose: "renovate" });
    expect(draft).toMatchObject({ amount: "25,000", purpose: "renovate", tenure: "36" });
  });

  it("stays on a step and shows errors until it validates", () => {
    const state = flowReducer(createInitialState(), { type: "next" });
    expect(state.step).toBe("loan");
    expect(state.errors.amount).toBeDefined();

    const fixed = run(state, { type: "update", patch: { amount: "20,000" } });
    expect(fixed.errors.amount).toBeUndefined();
    expect(flowReducer(fixed, { type: "next" }).step).toBe("soft-check");
  });

  it("fills sample Myinfo details from the Singpass screen", () => {
    const atSingpass = run(
      createInitialState({ amount: 20000, purpose: "personal" }),
      { type: "next" },
      { type: "next" },
    );
    expect(atSingpass.step).toBe("singpass");
    const filled = flowReducer(atSingpass, { type: "fillFromMyinfo", profile: complete });
    expect(filled).toMatchObject({ step: "about", source: "myinfo" });
    expect(filled.draft.fullName).toBe("Tan Mei Ling");
  });

  it("returns to review after editing a step from it", () => {
    let state = run(
      createInitialState({ amount: 20000, purpose: "personal" }),
      { type: "next" },
      { type: "next" },
      { type: "fillFromMyinfo", profile: complete },
      { type: "next" },
      { type: "next" },
    );
    expect(state.step).toBe("review");

    state = flowReducer(state, { type: "goTo", step: "loan" });
    expect(state).toMatchObject({ step: "loan", returnTo: "review" });
    expect(flowReducer(state, { type: "back" })).toMatchObject({ step: "review", returnTo: null });
    state = run(state, { type: "update", patch: { tenure: "48" } }, { type: "next" });
    expect(state).toMatchObject({ step: "review", returnTo: null });
    expect(state.draft.tenure).toBe("48");
  });

  it("only submits with consent, then moves to matching and choose", () => {
    let state: FlowState = { ...createInitialState(), step: "consent", draft: { ...createInitialState().draft, ...complete } };
    state = flowReducer(state, { type: "submit" });
    expect(state.step).toBe("consent");
    state = run(state, { type: "update", patch: { pdpaConsent: true } }, { type: "submit" });
    expect(state.step).toBe("matching");
    expect(flowReducer(state, { type: "back" }).step).toBe("matching");
    expect(flowReducer(state, { type: "matched" }).step).toBe("choose");
  });

  it("books a visit with the chosen lender", () => {
    const atChoose: FlowState = { ...createInitialState(), step: "choose" };
    expect(flowReducer(atChoose, { type: "next" }).step).toBe("choose");
    expect(flowReducer(atChoose, { type: "back" }).step).toBe("choose");

    let state = flowReducer(atChoose, { type: "chooseLender", lenderId: "crawfort", today: "2026-09-23" });
    expect(state).toMatchObject({ step: "book", lenderId: "crawfort", bookingFrom: "2026-09-23" });

    state = flowReducer(state, { type: "confirmBooking" });
    expect(state.step).toBe("book");
    expect(state.errors).toMatchObject({ visitDate: expect.any(String), visitTime: expect.any(String) });

    expect(flowReducer(state, { type: "back" }).step).toBe("choose");

    state = run(
      state,
      { type: "update", patch: { visitDate: "2026-09-24", visitTime: "10:30" } },
      { type: "confirmBooking" },
    );
    expect(state.step).toBe("booked");
    expect(flowReducer(state, { type: "back" }).step).toBe("booked");
    expect(flowReducer(state, { type: "next" }).step).toBe("booked");
  });

  it("keeps a chosen slot when the same lender is chosen again the same day", () => {
    const booked: FlowState = {
      ...createInitialState(),
      step: "choose",
      lenderId: "crawfort",
      bookingFrom: "2026-09-23",
      draft: { ...createInitialState().draft, visitDate: "2026-09-24", visitTime: "11:00" },
    };
    const again = flowReducer(booked, { type: "chooseLender", lenderId: "crawfort", today: "2026-09-23" });
    expect(again.draft.visitTime).toBe("11:00");
    const nextDay = flowReducer(booked, { type: "chooseLender", lenderId: "crawfort", today: "2026-09-24" });
    expect(nextDay.draft.visitTime).toBe("");
  });

  it("counts progress across the seven screens before submission", () => {
    expect(stepProgress("loan")).toEqual({ current: 1, total: 7 });
    expect(stepProgress("consent")).toEqual({ current: 7, total: 7 });
    expect(stepProgress("matching")).toBeNull();
  });
});
