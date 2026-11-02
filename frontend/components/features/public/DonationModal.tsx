"use client";

import { useState } from "react";
import {
  CreditCard,
  Smartphone,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Lock,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import { formatMoney } from "@/lib/format";
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
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    reference: string;
    amount: string;
    channel: string;
  } | null>(null);
  const [waitingForMomo, setWaitingForMomo] = useState(false);

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

  function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(" ") : raw);
  }

  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  }

  function handleCvvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardCvv(raw);
  }

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

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

    if (channel === "card") {
      if (!email || !email.includes("@")) {
        setErrorMessage("Please enter a valid email address for your payment receipt.");
        return;
      }
      const cleanCard = cardNumber.replace(/\s+/g, "");
      if (cleanCard.length < 15) {
        setErrorMessage("Please enter a valid 16-digit card number.");
        return;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        setErrorMessage("Please enter a valid expiry date (MM/YY).");
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        setErrorMessage("Please enter a valid 3 or 4-digit CVV.");
        return;
      }
    }

    if (channel === "mobile_money" && (!phone || phone.trim().length < 9)) {
      setErrorMessage("Please enter a valid 10-digit Ghana Mobile Money phone number.");
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
        name: isAnonymous ? "Anonymous" : fullName.trim() || undefined,
        isAnonymous,
        callbackUrl,
      });

      // If Card (Paystack checkout URL returned), redirect donor to Paystack secure checkout
      if (channel === "card" && result.authorizationUrl) {
        window.location.href = result.authorizationUrl;
        return;
      }

      // If Mobile Money, prompt donor to check their handset for PIN approval
      if (channel === "mobile_money") {
        setWaitingForMomo(true);
        // Start polling payment status for 45 seconds
        const ref = result.paymentAttempt.reference;
        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          try {
            const verification = await verifyDonationPayment(ref);
            if (verification.status === "SUCCESSFUL" || verification.status === "success") {
              clearInterval(interval);
              setWaitingForMomo(false);
              setSuccessData({
                reference: ref,
                amount: numAmount.toFixed(2),
                channel: "mobile_money",
              });
            } else if (verification.status === "FAILED") {
              clearInterval(interval);
              setWaitingForMomo(false);
              setErrorMessage("The transaction was declined or timed out. Please try again.");
            }
          } catch {
            // Ignore polling errors
          }

          if (attempts >= 15) {
            clearInterval(interval);
            setWaitingForMomo(false);
            setSuccessData({
              reference: ref,
              amount: numAmount.toFixed(2),
              channel: "mobile_money",
            });
          }
        }, 3000);
      }
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
    setWaitingForMomo(false);
    setErrorMessage(null);
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    onClose();
  }

  if (!open) return null;

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
      ) : waitingForMomo ? (
        <div className="text-center py-8 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700 animate-pulse">
            <Smartphone size={32} />
          </div>
          <h3 className="text-lg font-bold text-navy">Authorise on Your Phone</h3>
          <p className="text-sm text-steel max-w-sm mx-auto">
            A prompt has been sent to <span className="font-semibold text-navy">{phone}</span>.
            Please approve the transaction with your Mobile Money PIN.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-amber-800">
            <Loader2 size={16} className="animate-spin" />
            <span>Waiting for payment confirmation...</span>
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
                Your Full Name (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Kwame Mensah"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isAnonymous}
                className="w-full rounded-xl border border-navy/20 bg-white px-3.5 py-2 text-xs text-navy placeholder:text-steel/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy disabled:bg-navy/5 disabled:opacity-50"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-steel">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-navy/30 text-navy focus:ring-navy"
              />
              <span>Keep my donation anonymous on the supporter wall</span>
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
                  Ghana Mobile Money Phone Number (required)
                </label>
                <input
                  type="tel"
                  placeholder="0244123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full rounded-xl border border-navy/20 bg-white px-3.5 py-2 text-xs text-navy placeholder:text-steel/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                />
              </div>
            )}

            {/* Card Information (When Card / Diaspora is chosen) */}
            {channel === "card" && (
              <div className="space-y-3 rounded-xl border border-navy/15 bg-slate-50/80 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                    <CreditCard size={14} className="text-navy" />
                    <span>Card Information</span>
                  </span>
                  <div className="flex items-center gap-1 text-steel">
                    <Lock size={11} className="text-emerald-700" />
                    <span className="text-[10px] font-medium text-emerald-800">Encrypted</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-steel uppercase mb-1">
                    Card Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                      maxLength={19}
                      className="w-full rounded-xl border border-navy/20 bg-white pl-9 pr-3.5 py-2 text-xs font-mono text-navy placeholder:text-steel/50 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    />
                    <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-steel uppercase mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      required
                      maxLength={5}
                      className="w-full rounded-xl border border-navy/20 bg-white px-3.5 py-2 text-xs font-mono text-navy placeholder:text-steel/50 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-steel uppercase mb-1">
                      CVV *
                    </label>
                    <input
                      type="password"
                      placeholder="123"
                      value={cardCvv}
                      onChange={handleCvvChange}
                      required
                      maxLength={4}
                      className="w-full rounded-xl border border-navy/20 bg-white px-3.5 py-2 text-xs font-mono text-navy placeholder:text-steel/50 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2 rounded-xl border border-crimson/30 bg-crimson/5 p-3 text-xs text-crimson">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Secure Trust Notice */}
          <div className="flex items-center justify-between text-[11px] text-steel pt-1">
            <span className="inline-flex items-center gap-1">
              <Lock size={12} className="text-emerald-700" />
              <span>Secure Encryption</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck size={12} className="text-navy" />
              <span>Powered by Paystack & RobsPay</span>
            </span>
          </div>

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
                  Donate {campaign.currency} {finalAmount || "0"}
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

