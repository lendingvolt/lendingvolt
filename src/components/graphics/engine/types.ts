import type { SceneTone } from "../scene-ids";
import type { Palette } from "./palette";

export type SceneVariant = "hero" | "card";

export type SceneEnv = {
  palette: Palette;
  tone: SceneTone;
  variant: SceneVariant;
};

/**
 * One abstract render. `init` allocates everything the render needs;
 * `update` and `render` run every frame and must not allocate.
 */
export interface Scene {
  /** Seconds per loop for the time driver. */
  duration: number;
  /** Phase in [0, 1] drawn as the still frame under reduced motion. */
  posterT: number;
  init(env: SceneEnv): void;
  /** Called with CSS-pixel size whenever the canvas resizes. */
  resize(width: number, height: number): void;
  /**
   * @param dt fixed step in seconds (0 when drawing a still)
   * @param t loop phase (time driver) or scroll progress (scroll driver), in [0, 1]
   */
  update(dt: number, t: number): void;
  render(ctx: CanvasRenderingContext2D): void;
}

export type SceneFactory = () => Scene;
