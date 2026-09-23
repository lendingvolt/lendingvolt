import Link from "next/link";
import { applyCopy } from "@/content/apply";
import { routes } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/form-controls";
import { FlowScreen } from "./flow-screen";
import { RenderCard } from "./render-card";
import type { StepProps } from "./types";

const copy = applyCopy.consent;

export function ConsentStep({ state, dispatch, nav }: StepProps) {
  const { draft, errors } = state;
  return (
    <FlowScreen
      {...nav}
      title={copy.title}
      body={<p>{copy.body}</p>}
      visual={<RenderCard scene="consent-toggles" />}
      onSubmit={() => dispatch({ type: "submit" })}
      actions={
        <>
          <Button type="submit" className="w-full">
            {copy.submit}
          </Button>
          <p className="text-center text-caption text-fg-muted">{copy.note}</p>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <Checkbox
          id="apply-pdpa"
          checked={draft.pdpaConsent}
          error={errors.pdpaConsent}
          onChange={(event) => dispatch({ type: "update", patch: { pdpaConsent: event.target.checked } })}
        >
          {copy.pdpaBefore}
          <Link href={routes.pdpa} target="_blank" className="text-link underline underline-offset-2">
            {copy.pdpaLink}
          </Link>
          {copy.pdpaAfter}
        </Checkbox>
        <Checkbox
          id="apply-marketing"
          checked={draft.marketingConsent}
          onChange={(event) => dispatch({ type: "update", patch: { marketingConsent: event.target.checked } })}
        >
          {copy.marketing}
        </Checkbox>
      </div>
    </FlowScreen>
  );
}
