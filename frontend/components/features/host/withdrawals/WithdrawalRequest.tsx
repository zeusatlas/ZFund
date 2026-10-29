"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, ArrowUpRight, Loader2, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import { money, type Campaign } from "@/components/features/host/shared/demo";
import { availableForCampaign, type Withdrawal } from "@/components/features/host/withdrawals/withdrawals";
import { useCreateWithdrawalMutation } from "@/components/features/host/withdrawals/use-withdrawals";
import { useHostSettings } from "@/components/features/host/settings/use-settings";
import { useMe } from "@/lib/auth/auth";

const field =
  "mt-2 w-full rounded-none border border-navy/20 bg-white px-3 py-2.5 text-sm text-navy placeholder:text-steel/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";

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

  const { data: me } = useMe();
  const settings = useHostSettings(me?.id);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [campaignId, setCampaignId] = useState("");

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

  const hasConfiguredPayout = Boolean(
    settings.defaultAccount && settings.defaultRecipient && settings.defaultInstitution
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

    if (!hasConfiguredPayout) {
      const msg = "Please configure your default payout details in Settings before requesting a withdrawal.";
      setError(msg);
      toast.error(msg);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const targetCampaignId = String(formData.get("campaignId") || "").trim();
    const amountVal = String(formData.get("amount") || "").trim();
    const notesVal = String(formData.get("notes") || "").trim();

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

    const institution =
      settings.preferredPayout === "Bank transfer" && settings.defaultBranch
        ? `${settings.defaultInstitution} (${settings.defaultBranch})`
        : settings.defaultInstitution;

    const finalPurpose = notesVal || (
      settings.preferredPayout === "Bank transfer" && settings.defaultBranch
        ? `Withdrawal to ${settings.defaultInstitution} (${settings.defaultBranch})`
        : `Withdrawal request for ${selectedCampaign?.name || "Campaign"}`
    );

    const hostName = [me?.firstName, me?.lastName].filter(Boolean).join(" ");

    try {
      await createMutation.mutateAsync({
        campaignId: targetCampaignId,
        amount: numericAmount.toFixed(2),
        method: settings.preferredPayout === "Bank transfer" ? "Bank transfer" : "Mobile money",
        recipientName: settings.defaultRecipient || hostName || "Campaign Host",
        institution,
        accountNumber: settings.defaultAccount,
        purpose: finalPurpose,
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
        className="inline-flex items-center gap-2 rounded-none bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-steel disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
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
                    Select a campaign and enter the amount. Payment destination details are automatically loaded from your host settings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close withdrawal drawer"
                  className="shrink-0 rounded-none p-2 text-steel hover:bg-stone transition-colors"
                  disabled={createMutation.isPending}
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form ref={form} onSubmit={submit} className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-5 p-6">
                  <p className="rounded-none bg-gold/10 p-3 text-xs leading-relaxed text-steel border border-gold/20">
                    Submitted requests undergo administrator review before funds are released to your destination account.
                  </p>

                  {/* Campaign Selector */}
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

                    {/* Transparent Balance Calculation Card */}
                    <div className="mt-3 border border-navy/10 bg-white p-3.5 text-xs rounded-none">
                      <p className="font-semibold text-navy mb-2 flex items-center justify-between">
                        <span>Campaign Balance Breakdown</span>
                        <span className="text-[11px] font-normal text-steel">14% platform commission</span>
                      </p>
                      <div className="space-y-1.5 text-steel">
                        <div className="flex justify-between">
                          <span>Gross donations raised:</span>
                          <span className="font-medium text-navy">{money(selectedCampaign?.raised || 0)}</span>
                        </div>
                        <div className="flex justify-between text-warning">
                          <span>Platform commission (14%):</span>
                          <span className="font-medium">- {money(Math.round((selectedCampaign?.raised || 0) * 0.14))}</span>
                        </div>
                        <div className="flex justify-between border-t border-navy/10 pt-1 font-medium text-navy">
                          <span>Net campaign proceeds (86%):</span>
                          <span>{money((selectedCampaign?.raised || 0) - Math.round((selectedCampaign?.raised || 0) * 0.14))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Already withdrawn / reserved:</span>
                          <span>- {money(Math.max(0, ((selectedCampaign?.raised || 0) - Math.round((selectedCampaign?.raised || 0) * 0.14)) - available))}</span>
                        </div>
                        <div className="flex justify-between border-t border-navy/15 pt-1.5 font-bold text-success text-sm">
                          <span>Available to request now:</span>
                          <span>{money(available)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Automatically Loaded Payout Details Card */}
                  {hasConfiguredPayout ? (
                    <div className="border border-navy/15 bg-white p-4 rounded-none space-y-3">
                      <div className="flex items-center justify-between border-b border-navy/10 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center bg-navy/10 text-navy">
                            <Wallet size={14} />
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-wider text-navy">
                            Payout Destination (Auto-Loaded from Settings)
                          </span>
                        </div>
                        <Link
                          href="/dashboard/settings"
                          className="inline-flex items-center gap-1 text-xs font-medium text-navy hover:text-gold transition-colors"
                        >
                          Edit in Settings <ArrowUpRight size={13} />
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-steel block">Channel</span>
                          <span className="font-semibold text-navy">{settings.preferredPayout}</span>
                        </div>
                        <div>
                          <span className="text-steel block">
                            {settings.preferredPayout === "Mobile money" ? "Network" : "Bank"}
                          </span>
                          <span className="font-semibold text-navy">{settings.defaultInstitution}</span>
                        </div>
                        {settings.preferredPayout === "Bank transfer" && settings.defaultBranch && (
                          <div>
                            <span className="text-steel block">Branch</span>
                            <span className="font-semibold text-navy">{settings.defaultBranch}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-steel block">Recipient Name</span>
                          <span className="font-semibold text-navy">{settings.defaultRecipient}</span>
                        </div>
                        <div>
                          <span className="text-steel block">Destination Number</span>
                          <span className="font-semibold font-mono text-navy">{settings.defaultAccount}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-warning/30 bg-warning-soft/20 p-4 text-xs text-navy rounded-none space-y-2">
                      <div className="flex items-center gap-2 font-semibold text-warning">
                        <AlertCircle size={16} />
                        <span>Payout destination not configured</span>
                      </div>
                      <p className="text-steel">
                        Please configure your default Mobile Money or Bank account in Settings before submitting a withdrawal request.
                      </p>
                      <Link
                        href="/dashboard/settings"
                        className="inline-flex items-center gap-1.5 font-medium text-navy underline hover:text-gold"
                      >
                        Configure Payout Defaults in Settings <ArrowUpRight size={13} />
                      </Link>
                    </div>
                  )}

                  {/* Amount Field */}
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
                    <p className="mt-1 text-xs text-steel">
                      Maximum available for this campaign is {money(available)}.
                    </p>
                  </div>

                  {/* Additional Notes (Optional) */}
                  <div>
                    <label htmlFor="withdraw-notes" className="text-sm font-medium flex items-center justify-between">
                      <span>Additional Notes</span>
                      <span className="text-xs font-normal text-steel">Optional</span>
                    </label>
                    <textarea
                      id="withdraw-notes"
                      name="notes"
                      maxLength={500}
                      rows={3}
                      placeholder="Add any internal context or references for this request (optional)."
                      className={field + " resize-y"}
                      disabled={createMutation.isPending}
                    />
                  </div>

                  {/* Authorization Confirmation Checkbox */}
                  <label className="flex items-start gap-3 text-sm leading-relaxed text-steel cursor-pointer">
                    <input
                      required
                      type="checkbox"
                      className="mt-1 accent-navy rounded-none"
                      disabled={createMutation.isPending}
                    />
                    I confirm this withdrawal request. Funds will be disbursed to the configured account above upon administrator review.
                  </label>

                  {error && (
                    <p
                      ref={errorRef}
                      tabIndex={-1}
                      role="alert"
                      className="rounded-none border border-crimson/20 bg-white p-3 text-sm text-crimson"
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
                    className="rounded-none border border-navy/20 bg-white px-5 py-3 text-sm font-medium hover:bg-stone disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || available < 100 || !hasConfiguredPayout}
                    className="inline-flex items-center gap-2 rounded-none bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-steel disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
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
