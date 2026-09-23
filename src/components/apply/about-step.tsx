import { applyCopy } from "@/content/apply";
import { residencyOptions, type Residency } from "@/lib/application";
import { Button } from "@/components/ui/button";
import { Input, SegmentedControl } from "@/components/ui/form-controls";
import { Badge } from "@/components/ui/layout";
import { FlowScreen } from "./flow-screen";
import { formatMobileInput } from "./format";
import type { StepProps } from "./types";

const copy = applyCopy.about;

export function AboutStep({ state, dispatch, nav }: StepProps) {
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
      {state.source === "myinfo" && (
        <Badge tone="accent" className="self-start">
          {copy.myinfoBadge}
        </Badge>
      )}
      <Input
        id="apply-name"
        label={copy.nameLabel}
        hint={copy.nameHint}
        autoComplete="name"
        value={draft.fullName}
        error={errors.fullName}
        onChange={(event) => dispatch({ type: "update", patch: { fullName: event.target.value } })}
      />
      <Input
        id="apply-mobile"
        label={copy.mobileLabel}
        prefix="+65"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="9123 4567"
        value={draft.mobile}
        error={errors.mobile}
        onChange={(event) => dispatch({ type: "update", patch: { mobile: formatMobileInput(event.target.value) } })}
      />
      <Input
        id="apply-email"
        label={copy.emailLabel}
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="name@example.com"
        value={draft.email}
        error={errors.email}
        onChange={(event) => dispatch({ type: "update", patch: { email: event.target.value } })}
      />
      <SegmentedControl
        name="apply-residency"
        legend={copy.residencyLegend}
        options={residencyOptions}
        layout="row"
        value={draft.residency}
        error={errors.residency}
        onChange={(value) => dispatch({ type: "update", patch: { residency: value as Residency } })}
      />
    </FlowScreen>
  );
}
