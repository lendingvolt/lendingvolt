import { applyCopy } from "@/content/apply";
import { employmentOptions, type Employment } from "@/lib/application";
import { Button } from "@/components/ui/button";
import { Input, SegmentedControl } from "@/components/ui/form-controls";
import { Badge } from "@/components/ui/layout";
import { FlowScreen } from "./flow-screen";
import { formatAmountInput } from "./format";
import type { StepProps } from "./types";

const copy = applyCopy.income;

export function IncomeStep({ state, dispatch, nav }: StepProps) {
  const { draft, errors } = state;
  return (
    <FlowScreen
      {...nav}
      title={copy.title}
      body={
        <p>
          {copy.body}
          <br />
          {copy.noDocuments}
        </p>
      }
      onSubmit={() => dispatch({ type: "next" })}
      actions={
        <Button type="submit" className="w-full">
          {applyCopy.actions.continue}
        </Button>
      }
    >
      {state.source === "myinfo" && (
        <Badge tone="accent" className="self-start">
          {applyCopy.about.myinfoBadge}
        </Badge>
      )}
      <SegmentedControl
        name="apply-employment"
        legend={copy.employmentLegend}
        options={employmentOptions}
        columns={2}
        value={draft.employment}
        error={errors.employment}
        onChange={(value) => dispatch({ type: "update", patch: { employment: value as Employment } })}
      />
      <Input
        id="apply-income"
        label={copy.incomeLabel}
        hint={copy.incomeHint}
        prefix="S$"
        inputMode="numeric"
        autoComplete="off"
        placeholder="6,500"
        value={draft.monthlyIncome}
        error={errors.monthlyIncome}
        onChange={(event) =>
          dispatch({ type: "update", patch: { monthlyIncome: formatAmountInput(event.target.value) } })
        }
      />
    </FlowScreen>
  );
}
