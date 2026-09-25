"use client";

import { useEffect, useReducer, useRef, type ComponentType } from "react";
import { applyCopy, matchingDuration } from "@/content/apply";
import type { LoanPurpose } from "@/content/home";
import {
  canGoBack,
  createInitialState,
  flowReducer,
  formatDigits,
  stepProgress,
  type StepId,
} from "@/lib/application";
import { loadIntent, parseAmount, saveIntent } from "@/lib/application-intent";
import { AboutStep } from "./about-step";
import { BookStep } from "./book-step";
import { BookedStep } from "./booked-step";
import { ChooseStep } from "./choose-step";
import { ConsentStep } from "./consent-step";
import { FLOW_HEADING_ID } from "./flow-screen";
import { IncomeStep } from "./income-step";
import { LoanStep } from "./loan-step";
import { MatchingStep } from "./matching-step";
import { ReviewStep } from "./review-step";
import { SingpassStep } from "./singpass-step";
import { SoftCheckStep } from "./soft-check-step";
import type { ScreenNav, StepProps } from "./types";

const screens: Record<StepId, ComponentType<StepProps>> = {
  loan: LoanStep,
  "soft-check": SoftCheckStep,
  singpass: SingpassStep,
  about: AboutStep,
  income: IncomeStep,
  review: ReviewStep,
  consent: ConsentStep,
  matching: MatchingStep,
  choose: ChooseStep,
  book: BookStep,
  booked: BookedStep,
};

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * The application, one screen at a time, through to a booked visit with the
 * chosen lender. Everything stays in memory; the only thing written anywhere
 * is amount, purpose and tenure, to sessionStorage, once the offers are ready.
 */
export function ApplyFlow() {
  const [state, dispatch] = useReducer(flowReducer, undefined, () => createInitialState());
  const renderedStep = useRef(state.step);

  // The homepage leaves amount and purpose in sessionStorage; read it once on mount.
  useEffect(() => {
    const intent = loadIntent();
    if (!intent) return;
    dispatch({
      type: "update",
      patch: {
        amount: formatDigits(intent.amount),
        purpose: intent.purpose as LoanPurpose,
        ...(intent.tenure && { tenure: intent.tenure }),
      },
    });
  }, []);

  // New screen: start at the top and move focus to its heading.
  useEffect(() => {
    if (renderedStep.current === state.step) return;
    renderedStep.current = state.step;
    window.scrollTo({ top: 0 });
    document.getElementById(FLOW_HEADING_ID)?.focus({ preventScroll: true });
  }, [state.step]);

  // Failed validation: move focus to the first field that needs fixing.
  useEffect(() => {
    if (Object.keys(state.errors).length === 0) return;
    document
      .querySelector<HTMLElement>('#main input[aria-invalid="true"], #main fieldset[aria-invalid="true"] input')
      ?.focus();
  }, [state.errors]);

  useEffect(() => {
    if (state.step !== "matching") return;
    const { amount, purpose, tenure } = state.draft;
    const delay = window.matchMedia(REDUCED_MOTION).matches ? matchingDuration.reducedMotion : matchingDuration.full;
    const timer = window.setTimeout(() => {
      saveIntent({ amount: parseAmount(amount), purpose, tenure });
      dispatch({ type: "matched" });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [state.step, state.draft]);

  const progress = stepProgress(state.step);
  const back = () => dispatch({ type: "back" });
  const nav: ScreenNav = {
    progress,
    onBack: canGoBack(state) ? back : undefined,
    backLabel: state.returnTo ? applyCopy.actions.backToReview : applyCopy.actions.back,
  };
  const Screen = screens[state.step];

  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-1 flex-col px-5 pt-4 pb-10 md:px-8 md:pt-6 md:pb-12">
      <div key={state.step} className="flow-step flex flex-1 flex-col">
        <Screen state={state} dispatch={dispatch} nav={nav} />
      </div>
    </div>
  );
}
