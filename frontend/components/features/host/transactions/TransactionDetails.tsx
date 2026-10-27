"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { dateLabel, money } from "@/components/features/host/shared/demo";
import type { Transaction } from "@/components/features/host/transactions/transactions";

export default function TransactionDetails({ transaction, campaignName, onClose }: { transaction: Transaction | null; campaignName: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!transaction) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => { document.body.style.overflow = previous; };
  }, [transaction]);
  return <dialog ref={dialog} onClose={onClose} aria-labelledby="transaction-details-title" className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border-0 bg-white p-0 text-navy shadow-xl backdrop:bg-midnight/60">
    <div className="flex items-start justify-between gap-4 border-b border-navy/10 p-6">
      <div><h2 id="transaction-details-title" className="text-2xl font-medium tracking-tight">Transaction details</h2><p className="mt-2 text-sm text-steel">Donation record</p></div>
      <button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label="Close transaction details" className="rounded-lg p-2 text-steel hover:bg-stone"><X size={20} aria-hidden="true" /></button>
    </div>
    {transaction && <div className="p-6">
      <p className="text-3xl font-medium tracking-tight tabular-nums">{money(transaction.amount)}</p>
      <p className="mt-2 text-sm font-medium">{transaction.status === "Paid" ? "Successful payment" : transaction.status + " payment"}</p>
      <dl className="mt-6 divide-y divide-navy/10">{[
        ["Full reference", transaction.reference], ["Campaign", campaignName], ["Donor phone", transaction.phone], ["Payment method", transaction.method], ["Date and time", dateLabel(transaction.date) + ", " + transaction.time + " GMT"], ["Currency", "Ghana cedi (GHS)"],
      ].map(([label, value]) => <div key={label} className="grid gap-1 py-3 sm:grid-cols-[140px_1fr]"><dt className="text-sm text-steel">{label}</dt><dd className="break-words text-sm font-medium">{value}</dd></div>)}</dl>
      <div className={"mt-5 rounded-xl p-4 " + (transaction.status === "Failed" ? "bg-crimson/10 text-crimson" : "bg-stone text-steel")}><h3 className="text-sm font-medium">{transaction.status === "Failed" ? "Failure reason" : "Payment update"}</h3><p className="mt-2 text-sm leading-relaxed">{transaction.note}</p></div>
      <div className="mt-6 flex justify-end"><button type="button" onClick={() => dialog.current?.close()} className="rounded-xl bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-steel">Done</button></div>
    </div>}
  </dialog>;
}
