"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useLogin } from "@/lib/auth/auth";
import type { ApiError } from "@/lib/api/client";

const adminRoles = ["SUPER_ADMIN", "PLATFORM_ADMIN"];
const inputClass = "mt-1.5 w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-gold";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    login.mutate(
      { email: String(form.get("email")), password: String(form.get("password")) },
      {
        onSuccess: ({ user }) => router.replace(adminRoles.includes(user.role) ? "/admin" : "/host"),
        onError: (err) => setError((err as unknown as ApiError).message),
      },
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-light p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-navy">Sign in to ZFund</h1>
          <p className="mt-1 text-sm text-steel">Use your account email and password.</p>
        </div>
        <label className="block text-sm font-medium text-ink">
          Email
          <input required type="email" name="email" autoComplete="email" className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-ink">
          Password
          <input required type="password" name="password" autoComplete="current-password" className={inputClass} />
        </label>
        {error && <p role="alert" className="text-sm text-[#a13d3d]">{error}</p>}
        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-steel disabled:opacity-60"
        >
          {login.isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
