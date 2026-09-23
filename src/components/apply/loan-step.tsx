import { applyCopy } from "@/content/apply";
import { loanPurposes, type LoanPurpose } from "@/content/home";
import { tenureOptions, type Tenure } from "@/lib/application-intent";
import { Button } from "@/components/ui/button";
import { Input, SegmentedControl } from "@/components/ui/form-controls";
import { FlowScreen } from "./flow-screen";
import { formatAmountInput } from "./format";
import type { StepProps } from "./types";

const copy = applyCopy.loan;
const tenures = tenureOptions.map((value) => ({ value, label: value }));

export function LoanStep({ state, dispatch, nav }: StepProps) {
  const { draft, errors } = state;
  return (
    <FlowScreen
      {...nav}
      title={copy.title}
      body={<p>{copy.body}</p>}
      onSubmit={() => dispatch({ type: "next" })}
      actions={
        <Button type="submit" className="w-full">
          {applyCopy.actions.continue}
        </Button>
      }
    >
      <Input
        id="apply-amount"
        label={copy.amountLabel}
        prefix="S$"
        inputMode="numeric"
        autoComplete="off"
        placeholder="20,000"
        value={draft.amount}
        error={errors.amount}
        onChange={(event) => dispatch({ type: "update", patch: { amount: formatAmountInput(event.target.value) } })}
      />
      <SegmentedControl
        name="apply-purpose"
        legend={copy.purposeLegend}
        options={loanPurposes}
        value={draft.purpose}
        error={errors.purpose}
        onChange={(value) => dispatch({ type: "update", patch: { purpose: value as LoanPurpose } })}
      />
      <SegmentedControl
        name="apply-tenure"
        legend={copy.tenureLegend}
        options={tenures}
        layout="row"
        value={draft.tenure}
        error={errors.tenure}
        onChange={(value) => dispatch({ type: "update", patch: { tenure: value as Tenure } })}
      />
    </FlowScreen>
  );
}
