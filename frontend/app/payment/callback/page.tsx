"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, Heart, ArrowRight } from "lucide-react";
import { verifyDonationPayment } from "@/lib/api/public";
import { formatMoney } from "@/lib/format";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const [loading, setLoading] = useState<boolean>(() => Boolean(reference));
  const [error, setError] = useState<string | null>(() =>
    reference ? null : "No transaction reference was provided."
  );
  const [paymentData, setPaymentData] = useState<{
    reference: string;
    amount: string;
    currency: string;
    status: string;
    projectName?: string;
  } | null>(null);

  useEffect(() => {
    if (!reference) return;

    let isMounted = true;
    verifyDonationPayment(reference)
      .then((data) => {
        if (!isMounted) return;
        const isSuccess = data?.status === "SUCCESSFUL" || data?.status === "success";
        if (isSuccess) {
          setPaymentData({
            reference: data.reference,
            amount: data.amount,
            currency: data.currency || "GHS",
            status: data.status,
            projectName: data.contribution?.project?.name,
          });
        } else {
          setError("Your payment could not be confirmed. Please check your bank or card statement.");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(
          err?.response?.data?.message || "Failed to verify transaction. Please contact support."
        );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [reference]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <Loader2 size={36} className="animate-spin text-navy" />
        <h2 className="text-lg font-bold text-navy">Verifying Payment with Paystack...</h2>
        <p className="text-xs text-steel">Please wait while we confirm your contribution.</p>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-crimson/10 text-crimson">
          <XCircle size={36} />
        </div>
        <h2 className="text-xl font-bold text-navy">Payment Unsuccessful</h2>
        <p className="text-xs text-steel max-w-sm">{error || "The payment could not be verified."}</p>
        <Link
          href="/"
          className="rounded-xl bg-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-navy/90 transition-colors"
        >
          Return to RaiseFunds
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-inner">
        <CheckCircle2 size={44} />
      </div>

      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Payment Confirmed
        </span>
        <h1 className="text-2xl font-black text-navy sm:text-3xl">Thank You for Your Gift!</h1>
        <p className="text-xs text-steel max-w-sm mx-auto">
          Your donation has been successfully processed and directly credited to the campaign.
        </p>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-navy/10 bg-slate-50 p-5 text-left text-xs space-y-3">
        <div className="flex justify-between items-center border-b border-navy/10 pb-2">
          <span className="text-steel">Amount Paid:</span>
          <span className="text-base font-extrabold text-navy">
            {formatMoney(paymentData.amount)}
          </span>
        </div>
        {paymentData.projectName && (
          <div className="flex justify-between items-center">
            <span className="text-steel">Campaign:</span>
            <span className="font-bold text-navy truncate max-w-[200px]">
              {paymentData.projectName}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-steel">Reference:</span>
          <span className="font-mono text-[11px] text-navy">{paymentData.reference}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-steel">Payment Method:</span>
          <span className="font-medium text-navy">Paystack Card / International</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-navy/90 transition-all"
        >
          <Heart size={14} className="fill-gold text-gold" />
          <span>Explore More Causes</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl border border-navy/10 bg-white shadow-xl overflow-hidden">
        <Suspense
          fallback={
            <div className="p-12 text-center">
              <Loader2 size={32} className="animate-spin text-navy mx-auto" />
            </div>
          }
        >
          <PaymentCallbackContent />
        </Suspense>
      </div>
    </div>
  );
}
