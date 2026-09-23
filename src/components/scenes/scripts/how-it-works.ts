import { loanLimits, mockLenders } from "@/content/offers";
import { createFader } from "../actors";
import { createTimeline, GESTURE, type CompiledTimeline } from "../timeline";

const by = (id: string) => `[data-anim="${id}"]`;

/** The amount step 1 types in, and how many offer rows step 2 slides in. */
export const STEP_AMOUNT = new Intl.NumberFormat("en-SG").format(loanLimits.amount.initial);
export const STEP_OFFER_ROWS = mockLenders.length;

/** Step 1: the amount types in character by character, then Consolidate selects. */
export function amountTimeline(characters: number): CompiledTimeline {
  const tl = createTimeline();
  let t = 250;
  for (let i = 0; i < characters; i++) {
    createFader(tl, by(`amount-char-${i}`), 0).to(1, t, 60);
    t += 150;
  }
  createFader(tl, by("purpose-was-selected"), 1).to(0, t + 250, 200);
  createFader(tl, by("purpose-unselected"), 1).to(0, t + 250, 200);
  return tl.compile();
}

/** Step 2: offer rows slide in one at a time. */
export function offerRowsTimeline(rows: number): CompiledTimeline {
  const tl = createTimeline();
  for (let i = 0; i < rows; i++) {
    const at = 150 + i * 180;
    tl.start(by(`offer-row-${i}`), "transform", "translateY(12px)");
    tl.to(by(`offer-row-${i}`), "transform", "translateY(0px)", at, 360, GESTURE);
    createFader(tl, by(`offer-row-${i}`), 0).to(1, at, 240);
  }
  return tl.compile();
}

/** Step 3: the top offer is selected: a checkmark draws, then Continue presses. */
export function chooseTimeline(): CompiledTimeline {
  const tl = createTimeline();
  createFader(tl, by("choose-check"), 0).to(1, 200, 150);
  tl.start(by("choose-check-cover"), "transform", "translateX(0%)");
  tl.to(by("choose-check-cover"), "transform", "translateX(101%)", 320, 320, GESTURE);
  tl.start(by("choose-press"), "transform", "scale(1)");
  tl.to(by("choose-press"), "transform", "scale(0.99)", 900, 150, GESTURE);
  createFader(tl, by("choose-press-shade"), 0).to(1, 900, 150);
  return tl.compile();
}
