"use client";

import { FormEvent } from "react";
import { X } from "lucide-react";
import type { HostAccount } from "./data";

export function AddHostModal({ onClose, onAdd }: { onClose: () => void; onAdd: (host: HostAccount) => void }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "New host");
    const phone = String(form.get("phone") || "");
    const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    onAdd({ id: `USR-${Date.now().toString().slice(-4)}`, name, phone, initials, status: "Pending", fundsIssued: "GHS 0.00", lastActive: "Awaiting invite" });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/45 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
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
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              Host access
            </p>
            <h2 id="add-host-title" className="mt-1 text-xl font-semibold text-navy">
              Add a host account
            </h2>
            <p className="mt-1 text-sm text-steel">
              Send an invitation to a trusted fund host.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-steel hover:bg-stone"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-ink">
            Full name
            <input
              required
              name="name"
              className="mt-1.5 w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-gold"
              placeholder="e.g. Jordan Lee"
            />
          </label>

          <label className="block text-sm font-medium text-ink">
            Phone number
            <input
              required
              type="tel"
              name="phone"
              pattern="[+]?[0-9 ()-]{8,}"
              className="mt-1.5 w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-gold"
              placeholder="+233 24 000 0000"
            />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-steel hover:bg-stone"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-steel"
            >
              Send invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
