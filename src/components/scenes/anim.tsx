import type { ReactNode } from "react";
import { propTransform, type PropState } from "./actors";

/** Wraps a prop so a scene timeline can move, scale and fade it. Renders the final state. */
export function Anim({ id, state, children }: { id: string; state: PropState; children: ReactNode }) {
  return (
    <g data-anim={id} style={{ transform: propTransform(state), opacity: state.opacity }}>
      {children}
    </g>
  );
}
