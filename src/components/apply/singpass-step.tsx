import { applyCopy, sampleMyinfo } from "@/content/apply";
import { Button } from "@/components/ui/button";
import { FlowScreen } from "./flow-screen";
import { RenderCard } from "./render-card";
import { SingpassButton } from "./singpass-button";
import type { StepProps } from "./types";

const copy = applyCopy.singpass;

export function SingpassStep({ dispatch, nav }: StepProps) {
  return (
    <FlowScreen
      {...nav}
      title={copy.title}
      body={<p>{copy.body}</p>}
      visual={<RenderCard scene="fingerprint" />}
      onSubmit={() => dispatch({ type: "next" })}
      actions={
        <>
          <SingpassButton
            label={copy.myinfo}
            onClick={() => dispatch({ type: "fillFromMyinfo", profile: sampleMyinfo })}
          />
          <Button type="submit" variant="text" arrow={false} className="w-full">
            {copy.manual}
          </Button>
          <p className="text-center text-caption text-fg-muted">{copy.prototypeNote}</p>
        </>
      }
    />
  );
}
