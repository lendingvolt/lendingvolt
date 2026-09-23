import type { SceneTone } from "../scene-ids";
import { mix, rgba } from "./color";

/**
 * The colours a render may use, resolved from the CSS tokens so the
 * renders always match the build. Each render picks two or three of these.
 */
export type Palette = {
  isDark: boolean;
  ground: string;
  /** Neutral form colour, with its lit and shaded sides. */
  form: string;
  formLight: string;
  formShade: string;
  /** The one accent, with its lit and shaded sides. */
  accent: string;
  accentLight: string;
  accentShade: string;
  /** Hairlines and plane edges. */
  line: string;
  /** Specular highlight. */
  highlight: string;
  /** Cast-shadow colour at full strength; scale with globalAlpha. */
  shadow: string;
  /** Card surface and its 1px border, for renders of product UI. */
  card: string;
  cardLine: string;
};

const cache = new Map<SceneTone, Palette>();

const fallbacks: Record<string, string> = {
  "--ink-900": "#171721",
  "--ink-800": "#272735",
  "--ink-600": "#535461",
  "--ink-300": "#b4b5be",
  "--surface-0": "#fbfcfd",
  "--surface-1": "#f6f5f2",
  "--surface-2": "#eeede9",
  "--accent": "#5266eb",
  "--accent-on-light": "#3441a6",
  "--on-dark-900": "#ededf4",
  "--on-dark-500": "#9a9aab",
  "--dark-control": "#323649",
  "--dark-surface-1": "#1e1e2a",
};

function token(styles: CSSStyleDeclaration | null, name: string): string {
  return styles?.getPropertyValue(name).trim() || fallbacks[name];
}

/** Resolve the palette for a tone once, then serve it from cache. */
export function getPalette(tone: SceneTone): Palette {
  const cached = cache.get(tone);
  if (cached) return cached;

  const styles = typeof document === "undefined" ? null : getComputedStyle(document.documentElement);
  const t = (name: string) => token(styles, name);

  const palette: Palette =
    tone === "dark"
      ? {
          isDark: true,
          ground: t("--ink-900"),
          form: mix(t("--on-dark-500"), t("--dark-control"), 0.25),
          formLight: t("--on-dark-900"),
          formShade: t("--dark-control"),
          accent: t("--accent"),
          accentLight: mix(t("--accent"), t("--on-dark-900"), 0.55),
          accentShade: mix(t("--accent"), t("--ink-900"), 0.5),
          line: rgba(t("--on-dark-900"), 0.12),
          highlight: t("--on-dark-900"),
          shadow: "rgb(0, 0, 0)",
          card: t("--dark-surface-1"),
          cardLine: rgba(t("--on-dark-900"), 0.09),
        }
      : {
          isDark: false,
          ground: t("--surface-1"),
          form: mix(t("--ink-300"), t("--surface-2"), 0.4),
          formLight: t("--surface-0"),
          formShade: mix(t("--ink-300"), t("--ink-600"), 0.3),
          accent: t("--accent"),
          accentLight: mix(t("--accent"), t("--surface-0"), 0.6),
          accentShade: t("--accent-on-light"),
          line: rgba(t("--ink-800"), 0.14),
          highlight: t("--surface-0"),
          shadow: t("--ink-900"),
          card: t("--surface-0"),
          cardLine: rgba(t("--ink-800"), 0.09),
        };

  cache.set(tone, palette);
  return palette;
}
