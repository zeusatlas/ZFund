"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { money, type Campaign } from "@/components/features/host/shared/demo";
import { availableForCampaign, type Withdrawal } from "@/components/features/host/withdrawals/withdrawals";
import { useCreateWithdrawalMutation } from "@/components/features/host/withdrawals/use-withdrawals";

const field =
  "mt-2 w-full rounded-xl border border-navy/20 bg-white px-3 py-2.5 text-sm text-navy placeholder:text-steel/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";

export function WithdrawalRequestDrawer({
  campaigns,
  withdrawals,
  onRequested,
}: {
  campaigns: Campaign[];
  withdrawals: Withdrawal[];
  onRequested: () => void;
}) {
  const form = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [method, setMethod] = useState<"Mobile money" | "Bank transfer">("Mobile money");

  const createMutation = useCreateWithdrawalMutation();

  const eligible = campaigns.filter(
    (campaign) => availableForCampaign(campaign.id, withdrawals, campaign.raised) >= 100
  );

  const selectedCampaign = campaigns.find((c) => c.id === campaignId);
  const available = availableForCampaign(
    campaignId,
    withdrawals,
    selectedCampaign?.raised
  );

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!createMutation.isPending) setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, createMutation.isPending]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  function openDrawer() {
    form.current?.reset();
    setError("");
    const initialCampaign = eligible[0]?.id ?? campaigns[0]?.id ?? "";
    setCampaignId(initialCampaign);
    setMethod("Mobile money");
    setOpen(true);
  }

  function closeDrawer() {
    if (createMutation.isPending) return;
    setOpen(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (createMutation.isPending) return;
    setError("");

    const formData = new FormData(event.currentTarget);
    const targetCampaignId = String(formData.get("campaignId") || "").trim();
    const amountVal = String(formData.get("amount") || "").trim();
    const recipient = String(formData.get("recipient") || "").trim();
    const institution = String(formData.get("institution") || "").trim();
    const account = String(formData.get("account") || "").trim();
    const purpose = String(formData.get("purpose") || "").trim();

    if (!targetCampaignId) {
      const msg = "Please select a campaign.";
      setError(msg);
      toast.error(msg);
      return;
    }

    const numericAmount = parseFloat(amountVal);
    if (isNaN(numericAmount) || numericAmount < 1) {
      const msg = "Please enter an amount of at least GH₵ 1.00.";
      setError(msg);
      toast.error(msg);
      return;
    }

    const requestedPesewas = Math.round(numericAmount * 100);
    if (requestedPesewas > available) {
      const msg = "This amount exceeds the campaign’s available funds. Reduce the amount and try again.";
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      await createMutation.mutateAsync({
        campaignId: targetCampaignId,
        amount: numericAmount.toFixed(2),
        method,
        recipientName: recipient,
        institution,
        accountNumber: account,
        purpose,
      });

      toast.success("Withdrawal request submitted for administrator review!");
      onRequested();
      closeDrawer();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err instanceof Error ? err.message : "Could not save your request. Please try again.");
      setError(msg);
      toast.error(msg);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openDrawer}
        disabled={!campaigns.length}
        className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-steel disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
      >
        Request withdrawal
        <ArrowUpRight size={17} aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="presentation">
          {/* Backdrop overlay */}
          <button
            type="button"
            aria-label="Close withdrawal drawer"
            onClick={closeDrawer}
            className="fixed inset-0 h-full w-full cursor-default bg-midnight/55 backdrop-blur-[1px] transition-opacity duration-300"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full">
            <aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="withdrawal-drawer-title"
              aria-describedby="withdrawal-drawer-description"
              className="flex w-screen max-w-4xl flex-col bg-stone-light text-navy shadow-2xl animate-drawer border-l border-navy/10"
            >
              {/* Drawer Header */}
              <div className="flex items-start justify-between gap-4 border-b border-navy/10 bg-white p-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Host Console</span>
                    <span className="text-xs text-steel">·</span>
                    <span className="text-xs font-medium text-steel">Payouts</span>
                  </div>
                  <h2 id="withdrawal-drawer-title" className="text-2xl font-medium tracking-tight">
                    Request a withdrawal
                  </h2>
                  <p id="withdrawal-drawer-description" className="mt-1 text-sm leading-relaxed text-steel">
                    Choose a campaign and specify payout details to request funds from your database balance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close withdrawal drawer"
                  className="shrink-0 rounded-lg p-2 text-steel hover:bg-stone transition-colors"
                  disabled={createMutation.isPending}
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form ref={form} onSubmit={submit} className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-5 p-6">
                  <p className="rounded-xl bg-gold/10 p-3 text-xs leading-relaxed text-steel">
                    Submitted requests undergo administrator review before funds are released to the recipient.
                  </p>

                  <div>
                    <label htmlFor="withdraw-campaign" className="text-sm font-medium">
                      Campaign <span className="text-crimson">*</span>
                    </label>
                    <select
                      autoFocus
                      required
                      id="withdraw-campaign"
                      name="campaignId"
                      value={campaignId}
                      onChange={(event) => setCampaignId(event.target.value)}
                      className={field}
                      disabled={createMutation.isPending}
                    >
                      {campaigns.map((campaign) => (
                        <option key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-steel">
                      Available to request: <strong>{money(available)}</strong>
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="withdraw-amount" className="text-sm font-medium">
                        Amount (GH₵) <span className="text-crimson">*</span>
                      </label>
                      <input
                        required
                        id="withdraw-amount"
                        name="amount"
                        type="number"
                        min="1"
                        max={available > 0 ? (available / 100).toFixed(2) : undefined}
                        step="0.01"
                        inputMode="decimal"
                        placeholder="500.00"
                        className={field}
                        disabled={createMutation.isPending}
                      />
                    </div>
                    <div>
                      <label htmlFor="withdraw-method" className="text-sm font-medium">
                        Payout method <span className="text-crimson">*</span>
                      </label>
                      <select
                        id="withdraw-method"
                        name="method"
                        value={method}
                        onChange={(event) =>
                          setMethod(event.target.value as "Mobile money" | "Bank transfer")
                        }
                        className={field}
                        disabled={createMutation.isPending}
                      >
                        <option>Mobile money</option>
                        <option>Bank transfer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="withdraw-recipient" className="text-sm font-medium">
                      Recipient / account name <span className="text-crimson">*</span>
                    </label>
                    <input
                      required
                      id="withdraw-recipient"
                      name="recipient"
                      minLength={3}
                      maxLength={100}
                      placeholder="e.g. Community project committee"
                      className={field}
                      disabled={createMutation.isPending}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="withdraw-institution" className="text-sm font-medium">
                        {method === "Mobile money" ? "Mobile money network" : "Bank name"}{" "}
                        <span className="text-crimson">*</span>
                      </label>
                      <input
                        required
                        id="withdraw-institution"
                        name="institution"
                        minLength={2}
                        maxLength={100}
                        placeholder={
                          method === "Mobile money"
                            ? "e.g. MTN, Telecel, AT"
                            : "e.g. GCB Bank, Ecobank"
                        }
                        className={field}
                        disabled={createMutation.isPending}
                      />
                    </div>
                    <div>
                      <label htmlFor="withdraw-account" className="text-sm font-medium">
                        {method === "Mobile money" ? "Mobile money number" : "Account number"}{" "}
                        <span className="text-crimson">*</span>
                      </label>
                      <input
                        key={method}
                        required
                        id="withdraw-account"
                        name="account"
                        type="tel"
                        maxLength={30}
                        autoComplete="off"
                        placeholder={
                          method === "Mobile money" ? "024 000 0000" : "Account number"
                        }
                        className={field}
                        disabled={createMutation.isPending}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="withdraw-purpose" className="text-sm font-medium">
                      What will the funds cover? <span className="text-crimson">*</span>
                    </label>
                    <textarea
                      required
                      id="withdraw-purpose"
                      name="purpose"
                      minLength={10}
                      maxLength={500}
                      rows={3}
                      placeholder="Describe the project expenses this withdrawal will pay for."
                      className={field + " resize-y"}
                      disabled={createMutation.isPending}
                    />
                  </div>

                  <label className="flex items-start gap-3 text-sm leading-relaxed text-steel">
                    <input
                      required
                      type="checkbox"
                      className="mt-1 accent-navy"
                      disabled={createMutation.isPending}
                    />
                    I confirm that the recipient and account details are correct and authorized for this campaign.
                  </label>

                  {error && (
                    <p
                      ref={errorRef}
                      tabIndex={-1}
                      role="alert"
                      className="rounded-xl border border-crimson/20 bg-white p-3 text-sm text-crimson"
                    >
                      {error}
                    </p>
                  )}
                </div>

                {/* Drawer Footer Actions */}
                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-navy/10 bg-white p-5">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    disabled={createMutation.isPending}
                    className="rounded-xl border border-navy/20 bg-white px-5 py-3 text-sm font-medium hover:bg-stone disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || available < 100}
                    className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-steel disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                  >
                    {createMutation.isPending && (
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    )}
                    {createMutation.isPending ? "Submitting request…" : "Submit request"}
                  </button>
                </div>
              </form>
            </aside>
          </div>
        </div>
      )}
    </>
  );
}

export default WithdrawalRequestDrawer;
