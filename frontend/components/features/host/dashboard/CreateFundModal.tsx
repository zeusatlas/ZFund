"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";

export type NewFund = {
  reference: string;
  description: string;
  amount: string;
  status: "Pending";
  date: string;
};

export default function CreateFundModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (fund: NewFund) => void;
}) {
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericAmount = Number(amount);

    if (!purpose.trim()) {
      setError("Enter a purpose for this fund.");
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    onCreate({
      reference: `FND-${Date.now().toString().slice(-5)}`,
      description: purpose.trim(),
      amount: `GHS ${numericAmount.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`,
      status: "Pending",
      date: "Just now",
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/45 p-4"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="create-fund-title" className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">New request</p>
            <h2 id="create-fund-title" className="mt-1 text-xl font-semibold text-navy">Generate a fund</h2>
            <p className="mt-1 text-sm text-steel">Submit a fund request for admin review.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1.5 text-steel hover:bg-stone"><X size={18} /></button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-ink">
            Fund purpose
            <input value={purpose} onChange={(event) => setPurpose(event.target.value)} placeholder="e.g. Partner settlement" className="mt-1.5 w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </label>
          <label className="block text-sm font-medium text-ink">
            Amount (GHS)
            <input required type="number" min="1" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" className="mt-1.5 w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </label>
          {error && <p className="text-sm text-crimson">{error}</p>}
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-steel hover:bg-stone">Cancel</button><button type="submit" className="rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-steel">Submit request</button></div>
        </form>
      </div>
    </div>
  );
}
