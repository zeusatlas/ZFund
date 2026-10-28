"use client";

import { FormEvent } from "react";
import { X } from "lucide-react";
import type { ApiError } from "@/lib/api/client";
import { useAddHost } from "./use-admin-dashboard";

const inputClass = "mt-1.5 w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-gold";

export function AddHostModal({ onClose }: { onClose: () => void }) {
  const addHost = useAddHost();
  const apiError = addHost.error as unknown as ApiError | null;
  const fieldError = (field: string) => apiError?.errors?.[field]?.[0];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    addHost.mutate(
      {
        firstName: String(form.get("firstName")).trim(),
        lastName: String(form.get("lastName")).trim(),
        email: String(form.get("email")).trim(),
        phone: String(form.get("phone")).trim(),
      },
      { onSuccess: onClose },
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/45 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !addHost.isPending) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-host-title"
        className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Host access</p>
            <h2 id="add-host-title" className="mt-1 text-xl font-semibold text-navy">Add a host account</h2>
            <p className="mt-1 text-sm text-steel">Create an account for a trusted fund host.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1.5 text-steel hover:bg-stone">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-ink">
              First name
              <input required minLength={2} name="firstName" autoComplete="off" className={inputClass} placeholder="e.g. Jordan" />
              {fieldError("firstName") && <span className="mt-1 block text-xs text-[#a13d3d]">{fieldError("firstName")}</span>}
            </label>
            <label className="block text-sm font-medium text-ink">
              Last name
              <input required minLength={2} name="lastName" autoComplete="off" className={inputClass} placeholder="e.g. Lee" />
              {fieldError("lastName") && <span className="mt-1 block text-xs text-[#a13d3d]">{fieldError("lastName")}</span>}
            </label>
          </div>

          <label className="block text-sm font-medium text-ink">
            Email address
            <input required type="email" name="email" autoComplete="off" className={inputClass} placeholder="host@example.com" />
            {fieldError("email") && <span className="mt-1 block text-xs text-[#a13d3d]">{fieldError("email")}</span>}
          </label>

          <label className="block text-sm font-medium text-ink">
            Phone number
            <input required type="tel" name="phone" autoComplete="off" pattern="[+]?[0-9 ()-]{9,}" className={inputClass} placeholder="0541234567" />
            {fieldError("phone") && <span className="mt-1 block text-xs text-[#a13d3d]">{fieldError("phone")}</span>}
            <span className="mt-1 block text-xs font-normal text-steel">We&apos;ll text their email and phone number to this number. They sign in with those and a code sent by SMS.</span>
          </label>

          {apiError && !apiError.errors && (
            <p role="alert" className="rounded-lg bg-[#fbeaea] px-3 py-2 text-sm text-[#a13d3d]">{apiError.message}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={addHost.isPending} className="rounded-lg px-4 py-2.5 text-sm font-medium text-steel hover:bg-stone">
              Cancel
            </button>
            <button type="submit" disabled={addHost.isPending} className="rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-steel disabled:opacity-60">
              {addHost.isPending ? "Creating…" : "Create host"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
