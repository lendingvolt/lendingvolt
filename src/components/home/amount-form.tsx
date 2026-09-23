"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { loanPurposes, type LoanPurpose } from "@/content/home";
import { routes } from "@/content/site";
import { intentSchema, parseAmount, saveIntent } from "@/lib/application-intent";
import { Button } from "@/components/ui/button";
import { Input, SegmentedControl } from "@/components/ui/form-controls";
import { cn } from "@/lib/cn";

const amountFormat = new Intl.NumberFormat("en-SG", { maximumFractionDigits: 0 });

type AmountFormProps = {
  cta: string;
  /** Show the loan-purpose control (hero) or amount only (closing CTA). */
  withPurpose?: boolean;
  /** Purpose saved when the control is hidden, and the one selected first when shown. */
  defaultPurpose?: LoanPurpose;
  secondary?: ReactNode;
  className?: string;
};

/**
 * Amount (and optionally purpose) capture. Validates with zod, keeps the
 * result in sessionStorage, and continues to the apply page.
 */
export function AmountForm({
  cta,
  withPurpose = false,
  defaultPurpose = "personal",
  secondary,
  className,
}: AmountFormProps) {
  const router = useRouter();
  const id = useId();
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState<LoanPurpose>(defaultPurpose);
  const [error, setError] = useState<string>();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = intentSchema.safeParse({ amount: parseAmount(amount), purpose });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Check the amount.");
      return;
    }
    setError(undefined);
    saveIntent(result.data);
    router.push(routes.apply);
  };

  return (
    <form noValidate onSubmit={onSubmit} className={cn("flex flex-col gap-4", className)}>
      {withPurpose && (
        <SegmentedControl
          name={`${id}-purpose`}
          legend="What is the loan for?"
          hideLegend
          options={loanPurposes}
          value={purpose}
          onChange={(value) => setPurpose(value as LoanPurpose)}
          className="max-w-[520px]"
        />
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Input
          id={`${id}-amount`}
          label="Loan amount"
          hideLabel
          prefix="S$"
          inputMode="numeric"
          autoComplete="off"
          placeholder="20,000"
          value={amount}
          error={error}
          onChange={(event) => {
            const value = parseAmount(event.target.value);
            setAmount(Number.isNaN(value) ? "" : amountFormat.format(value));
            if (error) setError(undefined);
          }}
          className="sm:w-60"
        />
        <Button type="submit" className="w-full sm:w-auto">
          {cta}
        </Button>
        {secondary && <div className="flex min-h-12 items-center sm:min-h-13 sm:pl-2">{secondary}</div>}
      </div>
    </form>
  );
}
