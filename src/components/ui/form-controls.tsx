import type { CSSProperties, ChangeEvent, ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type InputProps = Omit<ComponentPropsWithoutRef<"input">, "className" | "prefix"> & {
  id: string;
  label: string;
  /** Hide the label visually while keeping it for screen readers. */
  hideLabel?: boolean;
  prefix?: string;
  hint?: string;
  error?: string;
  className?: string;
};

/**
 * 52px text input with a real label above it. Font size stays at 16px or
 * more so iOS Safari does not zoom on focus.
 */
export function Input({ id, label, hideLabel, prefix, hint, error, className, ...props }: InputProps) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className={cn("text-body-sm font-medium text-fg", hideLabel && "sr-only")}>
        {label}
      </label>
      <div
        className={cn(
          "flex h-13 items-center rounded-md border bg-field transition-colors focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-cta",
          error ? "border-negative" : "border-line-strong",
        )}
      >
        {prefix && (
          <span aria-hidden className="pl-4 text-body-md text-fg-muted tabular">
            {prefix}
          </span>
        )}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-full w-full min-w-0 bg-transparent px-4 text-[16px] text-fg tabular outline-none placeholder:text-fg-faint md:text-body-md",
            prefix && "pl-2",
          )}
          {...props}
        />
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="text-caption text-fg-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-caption text-negative" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type SegmentedOption = { value: string; label: string };

type SegmentedControlProps = {
  name: string;
  legend: string;
  hideLegend?: boolean;
  options: readonly SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
};

/**
 * Pill-shaped radio group for four options or fewer. Built on native
 * radios, so it works in a plain form and with arrow-key navigation.
 */
export function SegmentedControl({
  name,
  legend,
  hideLegend,
  options,
  value,
  defaultValue,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className={cn("mb-2 text-body-sm font-medium text-fg", hideLegend && "sr-only")}>
        {legend}
      </legend>
      <div
        className={cn(
          "grid gap-1 rounded-[26px] border border-line-strong p-1 sm:flex sm:rounded-pill",
          options.length % 2 === 0 ? "grid-cols-2" : "grid-cols-1",
        )}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="relative flex h-11 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-pill px-3 text-body-sm whitespace-nowrap sm:px-4 font-medium text-fg-muted transition-colors hover:text-fg has-[:checked]:bg-fg has-[:checked]:text-bg has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cta"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              className="sr-only"
              {...(value !== undefined
                ? {
                    checked: value === option.value,
                    onChange: (event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value),
                  }
                : { defaultChecked: defaultValue === option.value })}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

type SliderProps = Omit<ComponentPropsWithoutRef<"input">, "type" | "className" | "value" | "onChange"> & {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
  /** Live readout shown above the track in tabular figures. */
  readout: ReactNode;
  className?: string;
};

/** 4px track, 24px thumb, with a live numeric readout above. */
export function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  onValueChange,
  readout,
  className,
  ...props
}: SliderProps) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-body-sm font-medium text-fg-muted">
          {label}
        </label>
        <output htmlFor={id} className="text-numeric text-fg">
          {readout}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onValueChange(Number(event.target.value))}
        className="range-input"
        style={{ "--fill": `${fill}%` } as CSSProperties}
        {...props}
      />
    </div>
  );
}
