"use client";
import { useEffect, useRef, useState } from "react";
import { X, Info, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { dateLabel, money } from "@/components/features/host/shared/demo";
import type { Transaction } from "@/components/features/host/transactions/transactions";
import { useVerifyPaymentMutation } from "@/components/features/host/transactions/use-transactions";

export default function TransactionDetails({
  transaction,
  campaignName,
  onClose,
  onTransactionUpdated,
}: {
  transaction: Transaction | null;
  campaignName: string;
  onClose: () => void;
  onTransactionUpdated?: (updated: Transaction) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [currentTx, setCurrentTx] = useState<Transaction | null>(transaction);
  const [verifyFeedback, setVerifyFeedback] = useState<{
    type: "success" | "info" | "error";
    text: string;
  } | null>(null);

  const verifyMutation = useVerifyPaymentMutation();

  useEffect(() => {
    setCurrentTx(transaction);
    setVerifyFeedback(null);
  }, [transaction]);

  useEffect(() => {
    if (!transaction) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [transaction]);

  const commission = currentTx ? Math.round(currentTx.amount * 0.14) : 0;
  const netAmount = currentTx ? currentTx.amount - commission : 0;

  async function handleVerify() {
    if (!currentTx) return;
    setVerifyFeedback(null);
    try {
      const targetRef = currentTx.paymentReference || currentTx.reference;
      const res = await verifyMutation.mutateAsync(targetRef);

      const status = res.data?.status;
      const isConfirmed = status === "SUCCESSFUL" || res.data?.contribution?.status === "CONFIRMED";
      const isFailed = status === "FAILED" || res.data?.contribution?.status === "FAILED";

      if (isConfirmed) {
        const updated: Transaction = {
          ...currentTx,
          status: "Paid",
          rawStatus: "CONFIRMED",
          note: "Payment confirmed with Paystack. Included in your total received.",
        };
        setCurrentTx(updated);
        onTransactionUpdated?.(updated);
        setVerifyFeedback({
          type: "success",
          text: "Payment successfully verified and confirmed by Paystack! The transaction is now marked as Successful.",
        });
      } else if (isFailed) {
        const updated: Transaction = {
          ...currentTx,
          status: "Failed",
          rawStatus: "FAILED",
          note: "Paystack reported this transaction as failed or cancelled by the mobile money provider.",
        };
        setCurrentTx(updated);
        onTransactionUpdated?.(updated);
        setVerifyFeedback({
          type: "error",
          text: "Paystack reported that this transaction failed or was declined.",
        });
      } else {
        setVerifyFeedback({
          type: "info",
          text: "Paystack reports this payment is still awaiting donor authorization with their MoMo PIN on their handset.",
        });
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not verify transaction with Paystack. Please ensure your network connection is active and try again.";
      setVerifyFeedback({
        type: "error",
        text: errorMsg,
      });
    }
  }

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

      {currentTx && (
        <div className="p-6">
          {/* Transparent Commission & Payout Breakdown */}
          <div className="border border-navy/10 bg-stone/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-steel">
              Payment & Commission Breakdown
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-steel">Gross donor payment:</span>
                <span className="text-lg font-bold tabular-nums text-navy">{money(currentTx.amount)}</span>
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

          {/* Pending Verification Card */}
          {currentTx.status === "Pending" && (
            <div className="mt-4 border border-amber-300 bg-amber-50/70 p-4 text-amber-900">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-amber-950">Awaiting donor authorization</h3>
                  <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                    If the donor has already entered their MoMo PIN or if you want to sync the latest payment status directly with Paystack, click below.
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={verifyMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-none bg-navy px-4 py-2 text-xs font-medium text-white hover:bg-navy/90 disabled:opacity-50"
                >
                  {verifyMutation.isPending ? (
                    <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <RefreshCw size={14} aria-hidden="true" />
                  )}
                  {verifyMutation.isPending ? "Checking Paystack…" : "Check Paystack Status"}
                </button>
              </div>
            </div>
          )}

          {/* Verification Feedback Banner */}
          {verifyFeedback && (
            <div
              className={
                "mt-4 flex items-start gap-2.5 p-3 text-xs leading-relaxed " +
                (verifyFeedback.type === "success"
                  ? "border border-emerald-300 bg-emerald-50 text-emerald-900"
                  : verifyFeedback.type === "error"
                  ? "border border-crimson/30 bg-crimson/10 text-crimson"
                  : "border border-amber-300 bg-amber-50 text-amber-900")
              }
            >
              {verifyFeedback.type === "success" ? (
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
              )}
              <span>{verifyFeedback.text}</span>
            </div>
          )}

          <p className="mt-4 text-sm font-medium">
            Status:{" "}
            <span className={currentTx.status === "Paid" ? "text-success font-semibold" : "text-steel"}>
              {currentTx.status === "Paid" ? "Successful payment" : currentTx.status + " payment"}
            </span>
          </p>

          <dl className="mt-5 divide-y divide-navy/10">
            {[
              ["Full reference", currentTx.reference],
              ["Campaign", campaignName],
              ["Donor phone", currentTx.phone],
              ["Payment method", currentTx.method],
              ["Date and time", dateLabel(currentTx.date) + ", " + currentTx.time + " GMT"],
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
              (currentTx.status === "Failed" ? "bg-crimson/10 text-crimson" : "bg-stone text-steel")
            }
          >
            <h3 className="text-sm font-medium">
              {currentTx.status === "Failed" ? "Failure reason" : "Payment update"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed">{currentTx.note}</p>
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
