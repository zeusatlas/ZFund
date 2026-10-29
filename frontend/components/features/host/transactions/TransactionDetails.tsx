"use client";
import { useEffect, useRef } from "react";
import { X, Info } from "lucide-react";
import { dateLabel, money } from "@/components/features/host/shared/demo";
import type { Transaction } from "@/components/features/host/transactions/transactions";

export default function TransactionDetails({
  transaction,
  campaignName,
  onClose,
}: {
  transaction: Transaction | null;
  campaignName: string;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!transaction) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [transaction]);

  const commission = transaction ? Math.round(transaction.amount * 0.14) : 0;
  const netAmount = transaction ? transaction.amount - commission : 0;

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      aria-labelledby="transaction-details-title"
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-none border border-navy/15 bg-white p-0 text-navy shadow-xl backdrop:bg-midnight/60"
    >
      <div className="flex items-start justify-between gap-4 border-b border-navy/10 p-6">
        <div>
          <h2 id="transaction-details-title" className="text-2xl font-medium tracking-tight">
            Transaction details
          </h2>
          <p className="mt-1 text-sm text-steel">Donation breakdown & record</p>
        </div>
        <button
          type="button"
          autoFocus
          onClick={() => dialog.current?.close()}
          aria-label="Close transaction details"
          className="rounded-none p-2 text-steel hover:bg-stone"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {transaction && (
        <div className="p-6">
          {/* Transparent Commission & Payout Breakdown */}
          <div className="border border-navy/10 bg-stone/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-steel">
              Payment & Commission Breakdown
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-steel">Gross donor payment:</span>
                <span className="text-lg font-bold tabular-nums text-navy">{money(transaction.amount)}</span>
              </div>
              <div className="flex items-baseline justify-between text-warning">
                <span>Platform commission (14%):</span>
                <span className="font-semibold tabular-nums">- {money(commission)}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-navy/10 pt-2 text-success">
                <span className="font-medium">Net proceeds to campaign (86%):</span>
                <span className="text-lg font-bold tabular-nums">{money(netAmount)}</span>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-1.5 text-[11px] text-steel">
              <Info size={13} className="shrink-0 mt-0.5" />
              <span>The 14% platform commission covers USSD channel uptime and payment processing.</span>
            </div>
          </div>

          <p className="mt-4 text-sm font-medium">
            Status:{" "}
            <span className={transaction.status === "Paid" ? "text-success font-semibold" : "text-steel"}>
              {transaction.status === "Paid" ? "Successful payment" : transaction.status + " payment"}
            </span>
          </p>

          <dl className="mt-5 divide-y divide-navy/10">
            {[
              ["Full reference", transaction.reference],
              ["Campaign", campaignName],
              ["Donor phone", transaction.phone],
              ["Payment method", transaction.method],
              ["Date and time", dateLabel(transaction.date) + ", " + transaction.time + " GMT"],
              ["Currency", "Ghana cedi (GHS)"],
            ].map(([label, value]) => (
              <div key={label} className="grid gap-1 py-3 sm:grid-cols-[140px_1fr]">
                <dt className="text-sm text-steel">{label}</dt>
                <dd className="break-words text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          <div
            className={
              "mt-5 rounded-none p-4 " +
              (transaction.status === "Failed" ? "bg-crimson/10 text-crimson" : "bg-stone text-steel")
            }
          >
            <h3 className="text-sm font-medium">
              {transaction.status === "Failed" ? "Failure reason" : "Payment update"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed">{transaction.note}</p>
          </div>

          <div className="mt-6 flex justify-end">
            <button type="button" onClick={() => dialog.current?.close()} className="btn-primary">
              Done
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
