"use client";

import { useState } from "react";
import {
  CreditCard,
  Smartphone,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import { formatMoney, formatPersonName } from "@/lib/format";
import { openPaystackInline } from "@/lib/paystack-inline";
import {
  initiatePublicDonation,
  verifyDonationPayment,
  type PublicCampaign,
} from "@/lib/api/public";

interface DonationModalProps {
  campaign: PublicCampaign;
  open: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = ["50", "100", "200", "500", "1000"];
const GHS_TO_USD_ESTIMATE = 14.5; // Approximate conversion rate for diaspora donors

export default function DonationModal({ campaign, open, onClose }: DonationModalProps) {
  const [amount, setAmount] = useState<string>("100");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedPurposeId, setSelectedPurposeId] = useState<string>(
    campaign.purposes?.[0]?.id || ""
  );
  const [channel, setChannel] = useState<"card" | "mobile_money">("card");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    reference: string;
    amount: string;
    channel: string;
  } | null>(null);
  // True while Paystack Inline is on screen: our modal is hidden, but the donor's entries are kept.
  const [paystackOpen, setPaystackOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const finalAmount = customAmount ? customAmount : amount;
  const numAmount = parseFloat(finalAmount || "0");
  const usdEstimate = numAmount > 0 ? (numAmount / GHS_TO_USD_ESTIMATE).toFixed(2) : "0.00";

  function handleSelectPreset(val: string) {
    setAmount(val);
    setCustomAmount("");
  }

  function handleCustomChange(val: string) {
    const cleaned = val.replace(/[^0-9.]/g, "");
    setCustomAmount(cleaned);
  }

  // Paystack Inline reports back first; the backend re-checks the transaction with Paystack before we
  // call it a success. Mobile money can take a moment to settle, so keep checking briefly.
  function confirmPayment(ref: string, paidAmount: string, paidChannel: "card" | "mobile_money") {
    setConfirming(true);
    let attempts = 0;
    const stop = () => {
      clearInterval(interval);
      setConfirming(false);
    };
    const check = async () => {
      attempts++;
      try {
        const verification = await verifyDonationPayment(ref);
        const status = String(verification?.status || "").toUpperCase();
        if (status === "SUCCESSFUL" || status === "SUCCESS") {
          stop();
          setSuccessData({ reference: ref, amount: paidAmount, channel: paidChannel });
          return;
        }
        if (status === "FAILED" || status === "EXPIRED") {
          stop();
          setErrorMessage("Your payment was not completed and you have not been charged. Please try again.");
          return;
        }
      } catch {
        // Ignore transient verification errors and try again.
      }
      if (attempts >= 10) {
        stop();
        setNoticeMessage(
          "We have not received confirmation of your payment yet. If you were charged, it will appear on the campaign shortly. Your reference is " +
            ref +
            "."
        );
      }
    };
    const interval = setInterval(check, 3000);
    check();
  }

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setNoticeMessage(null);

    if (!numAmount || numAmount <= 0) {
      setErrorMessage("Please enter a valid donation amount.");
      return;
    }

    if (numAmount < parseFloat(campaign.minAmount)) {
      setErrorMessage(
        `Minimum donation is ${campaign.currency} ${campaign.minAmount}.`
      );
      return;
    }

    if (numAmount > parseFloat(campaign.maxAmount)) {
      setErrorMessage(
        `Maximum donation is ${campaign.currency} ${campaign.maxAmount}.`
      );
      return;
    }

    if (!isAnonymous && !fullName.trim()) {
      setErrorMessage("Please enter your name, or tick the anonymous option if you prefer not to share it.");
      return;
    }

    if (channel === "card") {
      if (!email || !email.includes("@")) {
        setErrorMessage("Please enter a valid email address for your payment receipt.");
        return;
      }
    }

    if (channel === "mobile_money" && phone.trim() && phone.trim().length < 9) {
      setErrorMessage("Please enter a valid 10-digit Ghana Mobile Money phone number, or leave it blank.");
      return;
    }

    setIsSubmitting(true);

    try {
      const callbackUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/payment/callback`
          : undefined;

      const result = await initiatePublicDonation({
        projectId: campaign.id,
        purposeId: selectedPurposeId || undefined,
        amount: numAmount.toFixed(2),
        channel,
        email: email.trim() || undefined,
        msisdn: phone.trim() || undefined,
        // The name is only a public display name; anonymity is applied by the server.
        name: formatPersonName(fullName) || undefined,
        isAnonymous,
        callbackUrl,
      });

      const ref = result.paymentAttempt.reference;
      const paidAmount = numAmount.toFixed(2);

      if (result.accessCode) {
        // Hide our modal and open Paystack Inline on this page with the chosen channel already selected.
        setPaystackOpen(true);
        try {
          await openPaystackInline(result.accessCode, {
            onSuccess: () => {
              setPaystackOpen(false);
              confirmPayment(ref, paidAmount, channel);
            },
            onCancel: () => {
              setPaystackOpen(false);
              setNoticeMessage("Payment cancelled. You have not been charged. You can try again whenever you are ready.");
            },
            onError: (error) => {
              setPaystackOpen(false);
              setErrorMessage(error?.message || "The payment could not be completed. Please try again.");
            },
          });
        } catch {
          setPaystackOpen(false);
          setErrorMessage("We could not open the secure payment window. Please check your connection and try again.");
        }
        return;
      }

      // Only reachable when Paystack returns no access code (e.g. a simulated/test setup).
      if (result.authorizationUrl) {
        window.location.href = result.authorizationUrl;
        return;
      }
      setErrorMessage("Payment could not be started. Please try again.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Payment initiation failed. Please check your details and try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setSuccessData(null);
    setPaystackOpen(false);
    setConfirming(false);
    setErrorMessage(null);
    setNoticeMessage(null);
    onClose();
  }

  if (!open || paystackOpen) return null;

  return (
    <Modal onClose={handleReset} title={successData ? "Donation Confirmed" : `Support ${campaign.name}`}>
      {successData ? (
        <div className="text-center py-6 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={36} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-navy">Thank You for Your Support!</h3>
            <p className="mt-1 text-sm text-steel">
              Your contribution has been received and credited to{" "}
              <span className="font-semibold text-navy">{campaign.name}</span>.
            </p>
          </div>

          <div className="rounded-xl border border-navy/10 bg-navy/5 p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-steel">Amount Paid:</span>
              <span className="font-bold text-navy">
                {formatMoney(successData.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-steel">Transaction Ref:</span>
              <span className="font-mono text-navy">{successData.reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-steel">Beneficiary Host:</span>
              <span className="font-medium text-navy">{campaign.host.name}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-xl bg-navy py-3 text-sm font-semibold text-white hover:bg-navy/90 transition-colors"
          >
            Done
          </button>
        </div>
      ) : confirming ? (
        <div className="text-center py-8 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-navy">Payment received</h3>
          <div className="flex items-center justify-center gap-2 text-xs text-steel">
            <Loader2 size={16} className="animate-spin" />
            <span>Confirming your contribution...</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleDonate} className="space-y-5 text-navy">
          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-steel mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setChannel("card")}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3.5 text-center transition-all ${channel === "card"
                  ? "border-navy bg-navy/5 ring-2 ring-navy/20"
                  : "border-navy/10 hover:border-navy/20"
                  }`}
              >
                <div className="flex items-center gap-1.5 text-navy font-semibold text-sm">
                  <CreditCard size={18} className="text-navy" />
                  <span>Card</span>
                </div>
                <span className="text-[11px] text-steel">
                  Visa, Mastercard, Apple Pay
                </span>
              </button>

              <button
                type="button"
                onClick={() => setChannel("mobile_money")}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3.5 text-center transition-all ${channel === "mobile_money"
                  ? "border-navy bg-navy/5 ring-2 ring-navy/20"
                  : "border-navy/10 hover:border-navy/20"
                  }`}
              >
                <div className="flex items-center gap-1.5 text-navy font-semibold text-sm">
                  <Smartphone size={18} className="text-navy" />
                  <span>Mobile Money</span>
                </div>
                <span className="text-[11px] text-steel">
                  MTN, Telecel, AirtelTigo
                </span>
              </button>
            </div>
          </div>

          {/* Amount Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-steel">
                Select Amount ({campaign.currency})
              </label>
              <span className="text-xs text-steel">
                ~ ${usdEstimate} USD
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-3">
              {PRESET_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleSelectPreset(val)}
                  className={`rounded-lg border py-2 text-xs font-bold transition-all ${amount === val && !customAmount
                    ? "border-navy bg-navy text-white shadow-xs"
                    : "border-navy/15 bg-white text-navy hover:bg-navy/5"
                    }`}
                >
                  {val}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-steel">
                {campaign.currency}
              </span>
              <input
                type="text"
                placeholder="Or enter custom amount"
                value={customAmount}
                onChange={(e) => handleCustomChange(e.target.value)}
                className="w-full rounded-xl border border-navy/20 bg-white pl-14 pr-4 py-2.5 text-sm font-semibold text-navy placeholder:text-steel/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
            </div>
          </div>

          {/* Contribution Purpose Tiers (if configured) */}
          {campaign.purposes && campaign.purposes.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-steel mb-2">
                Allocate Contribution
              </label>
              <select
                value={selectedPurposeId}
                onChange={(e) => setSelectedPurposeId(e.target.value)}
                className="w-full rounded-xl border border-navy/20 bg-white px-3.5 py-2.5 text-xs font-medium text-navy focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              >
                {campaign.purposes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.description ? `(${p.description})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Donor Contact Details */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-steel mb-1">
                Your name (required unless anonymous)
              </label>
              <input
                type="text"
                placeholder="e.g. Kwame Mensah"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isAnonymous}
                disabled={isAnonymous}
                className="w-full rounded-xl border border-navy/20 bg-white px-3.5 py-2 text-xs text-navy placeholder:text-steel/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy disabled:bg-navy/5 disabled:opacity-50"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-steel">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => {
                  setIsAnonymous(e.target.checked);
                  if (e.target.checked) setFullName("");
                }}
                className="rounded border-navy/30 text-navy focus:ring-navy"
              />
              <span>Keep my donation anonymous on the supporter wall (shown as &quot;Anonymous&quot;)</span>
            </label>

            <div>
              <label className="block text-xs font-medium text-steel mb-1">
                Email Address {channel === "card" ? "(required for receipt)" : "(optional)"}
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={channel === "card"}
                className="w-full rounded-xl border border-navy/20 bg-white px-3.5 py-2 text-xs text-navy placeholder:text-steel/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
            </div>

            {/* Mobile Money Details */}
            {channel === "mobile_money" && (
              <div>
                <label className="block text-xs font-medium text-steel mb-1">
                  Mobile Money Phone Number (optional)
                </label>
                <input
                  type="tel"
                  placeholder="0244123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-navy/20 bg-white px-3.5 py-2 text-xs text-navy placeholder:text-steel/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                />
                <p className="mt-1.5 text-[11px] text-steel">
                  You will choose your network and confirm your number securely on Paystack.
                </p>
              </div>
            )}

          </div>

          {errorMessage && (
            <div className="flex items-start gap-2 rounded-xl border border-crimson/30 bg-crimson/5 p-3 text-xs text-crimson">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {noticeMessage && !errorMessage && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{noticeMessage}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-navy py-3 text-sm font-semibold text-white shadow-md hover:bg-navy/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing Securely...</span>
              </>
            ) : (
              <>
                <span>
                  Proceed to Payment · {campaign.currency} {finalAmount || "0"}
                </span>
                <ExternalLink size={14} />
              </>
            )}
          </button>
        </form>
      )}
    </Modal>
  );
}

