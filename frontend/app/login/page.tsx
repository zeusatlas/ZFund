"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, Smartphone } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import AuthShell from "@/components/auth/AuthShell";
import OtpInput from "@/components/auth/OtpInput";
import { adminRoles, useRequestOtp, useVerifyOtp } from "@/lib/auth/auth";
import type { ApiError } from "@/lib/api/client";

const inputClass = "auth-input";
const buttonClass = "auth-submit";
const CODE_LENGTH = 6;
const CODE_SECONDS = 120; // matches how long the code stays valid
const formatTime = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

const messageOf = (err: unknown) => {
  const apiError = err as ApiError;
  if (apiError?.errors) {
    const firstVal = Object.values(apiError.errors)[0];
    if (Array.isArray(firstVal) && firstVal.length > 0) return firstVal[0];
    if (typeof firstVal === "string") return firstVal;
  }
  return (
    apiError?.message ||
    "Invalid or expired verification code. Please try again."
  );
};

export default function LoginPage() {
  const router = useRouter();
  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();
  const [identity, setIdentity] = useState<{
    email: string;
    phone: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [locked, setLocked] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function sendCode(next: { email: string; phone: string }) {
    setError("");
    requestOtp.mutate(next, {
      onSuccess: () => {
        setIdentity(next);
        setLocked(false);
        setCode("");
        setCooldown(CODE_SECONDS);
      },
      onError: (err) => setError(messageOf(err)),
    });
  }

  function submitIdentity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    sendCode({
      email: String(form.get("email")).trim(),
      phone: String(form.get("phone")).trim(),
    });
  }

  function submitCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!identity) return;
    setError("");
    verifyOtp.mutate(
      { ...identity, code },
      {
        onSuccess: ({ user }) =>
          router.replace(adminRoles.includes(user.role) ? "/admin" : "/host"),
        onError: (err) => {
          setError(messageOf(err));
          if ((err as unknown as ApiError).status === 429) setLocked(true);
        },
      },
    );
  }

  return (
    <AuthShell>
      {identity ? (
        <>
          <div className="auth-step">
            <span className="auth-step-icon">
              <Smartphone size={20} aria-hidden="true" />
            </span>
          </div>
          <h1>Check your phone</h1>
          <p className="auth-description">
            We sent a {CODE_LENGTH}-digit code to{" "}
            <span className="font-semibold text-navy">{identity.phone}</span>.
          </p>

          <form onSubmit={submitCode} className="mt-8 space-y-5">
            <OtpInput
              value={code}
              onChange={(val) => {
                setCode(val);
                if (error) setError("");
              }}
              disabled={locked || cooldown === 0}
            />
            {error && (
              <p role="alert" className="auth-error text-center font-medium">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={
                verifyOtp.isPending ||
                locked ||
                cooldown === 0 ||
                code.length < CODE_LENGTH
              }
              className={buttonClass}
            >
              {verifyOtp.isPending ? (
                "Verifying…"
              ) : (
                <>
                  Verify and sign in <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3 text-sm text-steel">
            <button
              type="button"
              disabled={cooldown > 0 || requestOtp.isPending}
              onClick={() => sendCode(identity)}
              className="font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4 disabled:no-underline disabled:opacity-50 hover:text-gold transition-colors"
            >
              {cooldown > 0
                ? `Resend code in ${formatTime(cooldown)}`
                : "Resend code"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="auth-step">
            <span className="auth-step-icon">
              <KeyRound size={20} aria-hidden="true" />
            </span>
          </div>
          <h1>Welcome</h1>
          <p className="auth-description">
            Complete the below to receive a secure access{" "}
          </p>

          <form onSubmit={submitIdentity} className="mt-8 space-y-5">
            <label className="block text-sm font-semibold text-ink">
              Email
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-semibold text-ink">
              Phone number
              <input
                required
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="0541234567"
                className={inputClass}
              />
            </label>
            {error && (
              <p role="alert" className="auth-error text-center font-medium">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={requestOtp.isPending}
              className={buttonClass}
            >
              {requestOtp.isPending ? (
                "Sending code…"
              ) : (
                <>
                  Send sign-in code <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <p className="auth-access-note text-center">
            Accounts are created by your RaiseFundz administrator. Need access?
            Contact us on 0303981602 / 0538826858
          </p>
        </>
      )}
    </AuthShell>
  );
}
