import { applyCopy } from "@/content/apply";
import { Button } from "@/components/ui/button";
import { FootnoteRef } from "@/components/ui/footnotes";
import { FlowScreen } from "./flow-screen";
import { RenderCard } from "./render-card";
import type { StepProps } from "./types";

const copy = applyCopy.softCheck;

export function SoftCheckStep({ dispatch, nav }: StepProps) {
  return (
    <FlowScreen
      {...nav}
      title={copy.title}
      body={
        <p>
          {copy.bodyBefore}
          <FootnoteRef id="soft-search" />.{copy.bodyAfter}
        </p>
      }
      visual={<RenderCard scene="soft-check" />}
      onSubmit={() => dispatch({ type: "next" })}
      actions={
        <Button type="submit" className="w-full">
          {applyCopy.actions.continue}
        </Button>
      }
    />
  );
}
