"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { adminRoles, useRequestOtp, useVerifyOtp } from "@/lib/auth/auth";
import type { ApiError } from "@/lib/api/client";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold";
const buttonClass =
  "w-full rounded-xl bg-navy px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-steel disabled:opacity-60";
const RESEND_SECONDS = 30;

const messageOf = (err: unknown) => (err as ApiError).errors
  ? Object.values((err as ApiError).errors!)[0][0]
  : (err as ApiError).message;

export default function LoginPage() {
  const router = useRouter();
  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();
  const [identity, setIdentity] = useState<{ email: string; phone: string } | null>(null);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

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
        setCooldown(RESEND_SECONDS);
      },
      onError: (err) => setError(messageOf(err)),
    });
  }

  function submitIdentity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    sendCode({ email: String(form.get("email")).trim(), phone: String(form.get("phone")).trim() });
  }

  function submitCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!identity) return;
    setError("");
    const code = String(new FormData(event.currentTarget).get("code")).trim();
    verifyOtp.mutate(
      { ...identity, code },
      {
        onSuccess: ({ user }) => router.replace(adminRoles.includes(user.role) ? "/admin" : "/host"),
        onError: (err) => setError(messageOf(err)),
      },
    );
  }

  return (
    <AuthShell>
      {identity ? (
        <>
          <h1 className="text-[30px] font-medium tracking-tight text-navy">Enter your code</h1>
          <p className="mt-2 text-sm text-steel">
            We sent a 6-digit code to <span className="font-medium text-navy">{identity.phone}</span>.
          </p>

          <form onSubmit={submitCode} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-ink">
              Verification code
              <input
                required
                autoFocus
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                className={`${inputClass} text-center text-lg tracking-[0.5em]`}
              />
            </label>
            {error && <p role="alert" className="text-sm text-[#a13d3d]">{error}</p>}
            <button type="submit" disabled={verifyOtp.isPending} className={buttonClass}>
              {verifyOtp.isPending ? "Verifying…" : "Verify and sign in"}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-steel">
            <button
              type="button"
              disabled={cooldown > 0 || requestOtp.isPending}
              onClick={() => sendCode(identity)}
              className="font-medium text-navy underline decoration-gold decoration-2 underline-offset-4 disabled:no-underline disabled:opacity-50"
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIdentity(null);
                setError("");
              }}
              className="hover:text-navy"
            >
              Use different details
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-[30px] font-medium tracking-tight text-navy">Welcome back</h1>
          <p className="mt-2 text-sm text-steel">
            Enter the email and phone number your administrator registered. We&apos;ll text you a code.
          </p>

          <form onSubmit={submitIdentity} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-ink">
              Email
              <input required type="email" name="email" autoComplete="email" className={inputClass} />
            </label>
            <label className="block text-sm font-medium text-ink">
              Phone number
              <input required type="tel" name="phone" autoComplete="tel" placeholder="+233 24 000 0000" className={inputClass} />
            </label>
            {error && <p role="alert" className="text-sm text-[#a13d3d]">{error}</p>}
            <button type="submit" disabled={requestOtp.isPending} className={buttonClass}>
              {requestOtp.isPending ? "Sending code…" : "Send code"}
            </button>
          </form>

          <p className="mt-8 text-sm text-steel">
            Accounts are created by your ZFund administrator. Need access? Contact them to be added.
          </p>
        </>
      )}
    </AuthShell>
  );
}
