import type { Dispatch } from "react";
import type { FlowAction, FlowState } from "@/lib/application";

/** Back link and progress shared by every screen before submission. */
export type ScreenNav = {
  progress: { current: number; total: number } | null;
  onBack?: () => void;
  backLabel?: string;
};

export type StepProps = {
  state: FlowState;
  dispatch: Dispatch<FlowAction>;
  nav: ScreenNav;
};
