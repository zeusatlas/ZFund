"use client";

import { useRef } from "react";

/** One box per digit; supports typing, backspace, arrow keys and pasting a full code. */
export default function OtpInput({
  value,
  onChange,
  length = 6,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const focusBox = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  function setDigits(start: number, digits: string) {
    const chars = value.padEnd(length, " ").split("");
    digits.split("").forEach((d, i) => {
      if (start + i < length) chars[start + i] = d;
    });
    onChange(chars.join("").replace(/ /g, "").slice(0, length));
    focusBox(start + digits.length);
  }

  return (
    <div role="group" aria-label="Verification code" className="flex gap-2 sm:gap-3">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          autoFocus={i === 0}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          value={value[i] ?? ""}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "");
            if (digits) setDigits(i, digits);
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              e.preventDefault();
              if (value[i]) onChange(value.slice(0, i) + value.slice(i + 1));
              else if (i > 0) {
                onChange(value.slice(0, i - 1) + value.slice(i));
                focusBox(i - 1);
              }
            } else if (e.key === "ArrowLeft") focusBox(i - 1);
            else if (e.key === "ArrowRight") focusBox(i + 1);
          }}
          onPaste={(e) => {
            e.preventDefault();
            const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
            if (digits) setDigits(0, digits);
          }}
          onFocus={(e) => e.target.select()}
          className="h-14 w-full min-w-0 rounded-xl border border-navy/15 bg-white text-center text-xl font-medium text-navy outline-none transition-colors focus:border-gold disabled:bg-stone-light disabled:opacity-60"
        />
      ))}
    </div>
  );
}
