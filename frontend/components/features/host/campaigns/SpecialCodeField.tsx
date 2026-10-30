"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { checkCodeAvailability } from "@/lib/api/projects";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export type CodeStatus = "idle" | "invalid" | "checking" | "available" | "taken" | "error";

const CODE_PATTERN = /^\d{2,4}$/;

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onStatusChange: (status: CodeStatus) => void;
  disabled?: boolean;
  label?: string;
  hint?: string;
};

/** Optional 2-4 digit code input that tells the user live whether the code is still free. */
export function SpecialCodeField({
  id,
  value,
  onChange,
  onStatusChange,
  disabled,
  label = "Special code",
  hint,
}: Props) {
  const debounced = useDebouncedValue(value);
  const isValid = CODE_PATTERN.test(value);

  const availability = useQuery({
    queryKey: ["projects", "code-availability", debounced],
    queryFn: () => checkCodeAvailability(debounced),
    enabled: CODE_PATTERN.test(debounced),
    staleTime: 0,
    retry: false,
  });

  let status: CodeStatus = "idle";
  if (value) {
    if (!isValid) status = "invalid";
    else if (debounced !== value || availability.isFetching) status = "checking";
    else if (availability.isError) status = "error";
    else if (availability.data === true) status = "available";
    else if (availability.data === false) status = "taken";
  }

  useEffect(() => {
    onStatusChange(status);
  }, [status, onStatusChange]);

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        maxLength={4}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
        placeholder="e.g. 777"
        aria-describedby={`${id}-status`}
        aria-invalid={status === "taken" || status === "invalid"}
        className="mt-2 w-36 rounded-lg border border-navy/20 bg-white px-3 py-2 font-mono text-sm font-semibold tracking-wider text-navy focus:border-navy focus:outline-none"
      />
      <p id={`${id}-status`} role="status" aria-live="polite" className="mt-1.5 min-h-5 text-xs">
        {status === "checking" && (
          <span className="inline-flex items-center gap-1.5 text-steel">
            <Loader2 size={13} className="animate-spin" /> Checking availability...
          </span>
        )}
        {status === "available" && (
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
            <CheckCircle2 size={13} /> Code {value} is available.
          </span>
        )}
        {status === "taken" && (
          <span className="inline-flex items-center gap-1.5 font-medium text-crimson">
            <XCircle size={13} /> Code {value} is already taken. Please choose another.
          </span>
        )}
        {status === "invalid" && (
          <span className="text-crimson">The code must be 2 to 4 digits.</span>
        )}
        {status === "error" && (
          <span className="text-crimson">Could not check this code. Please try again.</span>
        )}
        {status === "idle" && hint && <span className="text-steel">{hint}</span>}
      </p>
    </div>
  );
}
