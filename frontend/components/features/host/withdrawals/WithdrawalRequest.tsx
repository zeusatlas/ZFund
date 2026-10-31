"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, ArrowUpRight, Loader2, Wallet, X, RotateCcw, Pencil } from "lucide-react";
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
  resubmitItem = null,
  open: externalOpen,
  onClose: externalOnClose,
}: {
  campaigns: Campaign[];
  withdrawals: Withdrawal[];
  onRequested: () => void;
  resubmitItem?: Withdrawal | null;
  open?: boolean;
  onClose?: () => void;
}) {
  const form = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const { data: me } = useMe();
  const settings = useHostSettings(me?.id);

  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

  const [error, setError] = useState("");
  const [userCampaignId, setUserCampaignId] = useState<string | null>(null);
  const [useCustomPayout, setUseCustomPayout] = useState(false);
  const [userCustomMethod, setUserCustomMethod] = useState<"Mobile money" | "Bank transfer" | null>(null);
  const [userCustomInstitution, setUserCustomInstitution] = useState<string | null>(null);
  const [userCustomAccountNumber, setUserCustomAccountNumber] = useState<string | null>(null);
  const [userCustomRecipientName, setUserCustomRecipientName] = useState<string | null>(null);

  const createMutation = useCreateWithdrawalMutation();

  const eligible = campaigns.filter(
    (campaign) => availableForCampaign(campaign.id, withdrawals, campaign.raised) >= 100
  );

  const campaignId =
    userCampaignId !== null
      ? userCampaignId
      : (resubmitItem?.campaignId || eligible[0]?.id || campaigns[0]?.id || "");

  const customMethod =
    userCustomMethod !== null
      ? userCustomMethod
      : (resubmitItem?.method === "Bank transfer" ? "Bank transfer" : "Mobile money");

  const customInstitution =
    userCustomInstitution !== null ? userCustomInstitution : (resubmitItem?.institution || "");

  const customAccountNumber =
    userCustomAccountNumber !== null ? userCustomAccountNumber : (resubmitItem?.accountNumber || "");

  const customRecipientName =
    userCustomRecipientName !== null ? userCustomRecipientName : (resubmitItem?.recipient || "");

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
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (createMutation.isPending) return;
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalOpen(false);
    }
  }, [createMutation.isPending, externalOnClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  function handleOpen() {
    form.current?.reset();
    setError("");
    const initialCampaign = resubmitItem?.campaignId || eligible[0]?.id || campaigns[0]?.id || "";
    setUserCampaignId(initialCampaign);
    setUserCustomMethod(null);
    setUserCustomInstitution(null);
    setUserCustomAccountNumber(null);
    setUserCustomRecipientName(null);
    setUseCustomPayout(false);
    setInternalOpen(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (createMutation.isPending) return;
    setError("");

    if (!useCustomPayout && !hasConfiguredPayout) {
      const msg = "Please configure your default payout details in Settings, or enter custom destination details below.";
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

    let finalMethod: "Mobile money" | "Bank transfer";
    let finalInstitution: string;
    let finalAccount: string;
    let finalRecipient: string;

    const hostName = [me?.firstName, me?.lastName].filter(Boolean).join(" ");

    if (useCustomPayout) {
      const customAcc = String(formData.get("customAccountNumber") || "").trim();
      const customRec = String(formData.get("customRecipientName") || "").trim();
      const customInst = String(formData.get("customInstitution") || "").trim();
      const methodVal = String(formData.get("customMethod") || customMethod);

      if (!customAcc || !customRec || !customInst) {
        const msg = "Please fill in all payout destination fields (Network/Bank, Account number, Recipient name).";
        setError(msg);
        toast.error(msg);
        return;
      }

      finalMethod = methodVal === "Bank transfer" ? "Bank transfer" : "Mobile money";
      finalInstitution = customInst;
      finalAccount = customAcc;
      finalRecipient = customRec;
    } else {
      finalMethod = settings.preferredPayout === "Bank transfer" ? "Bank transfer" : "Mobile money";
      finalInstitution =
        settings.preferredPayout === "Bank transfer" && settings.defaultBranch
          ? `${settings.defaultInstitution} (${settings.defaultBranch})`
          : settings.defaultInstitution;
      finalAccount = settings.defaultAccount;
      finalRecipient = settings.defaultRecipient || hostName || "Campaign Host";
    }

    const finalPurpose = notesVal || (
      finalMethod === "Bank transfer"
        ? `Withdrawal to ${finalInstitution}`
        : `Withdrawal request for ${selectedCampaign?.name || "Campaign"}`
    );

    try {
      await createMutation.mutateAsync({
        campaignId: targetCampaignId,
        amount: numericAmount.toFixed(2),
        method: finalMethod,
        recipientName: finalRecipient,
        institution: finalInstitution,
        accountNumber: finalAccount,
        purpose: finalPurpose,
      });

      toast.success(
        resubmitItem
          ? "Withdrawal request resubmitted for administrator review!"
          : "Withdrawal request submitted for administrator review!"
      );
      onRequested();
      handleClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err instanceof Error ? err.message : "Could not save your request. Please try again.");
      setError(msg);
      toast.error(msg);
    }
  }

  const isResubmission = Boolean(resubmitItem);
  const defaultAmount = resubmitItem ? (resubmitItem.amount / 100).toFixed(2) : "";

  return (
    <>
      {externalOpen === undefined && (
        <button
          type="button"
          onClick={handleOpen}
          disabled={!campaigns.length}
          className="inline-flex items-center gap-2 rounded-none bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-steel disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
        >
          Request withdrawal
          <ArrowUpRight size={17} aria-hidden="true" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="presentation">
          {/* Backdrop overlay */}
          <button
            type="button"
            aria-label="Close withdrawal drawer"
            onClick={handleClose}
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
                    <span className="text-xs font-medium text-steel">
                      {isResubmission ? "Resubmission" : "Payouts"}
                    </span>
                  </div>
                  <h2 id="withdrawal-drawer-title" className="text-2xl font-medium tracking-tight">
                    {isResubmission ? "Resubmit withdrawal request" : "Request a withdrawal"}
                  </h2>
                  <p id="withdrawal-drawer-description" className="mt-1 text-sm leading-relaxed text-steel">
                    {isResubmission
                      ? "Review previous feedback, make any corrections, and resubmit for administrator approval."
                      : "Select a campaign and enter the amount. Payment destination details are automatically loaded from your host settings."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
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
                  {/* Resubmission Rejection Notice */}
                  {resubmitItem && (
                    <div className="border border-crimson/30 bg-crimson/5 p-4 rounded-none space-y-2">
                      <div className="flex items-center gap-2 font-semibold text-crimson text-xs">
                        <AlertCircle size={15} className="shrink-0" />
                        <span>Previous Request Rejected ({resubmitItem.reference || resubmitItem.id})</span>
                      </div>
                      <p className="text-xs text-navy">
                        <strong className="text-crimson">Reason:</strong> {resubmitItem.note}
                      </p>
                      <p className="text-[11px] text-steel leading-relaxed">
                        Funds from the rejected request were returned to your available balance. Please review the campaign balance, amount, and payout account before resubmitting.
                      </p>
                    </div>
                  )}

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
                      onChange={(event) => setUserCampaignId(event.target.value)}
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

                  {/* Payout Destination Selector: Default vs Custom */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-navy">
                        Payout Destination Account <span className="text-crimson">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setUseCustomPayout(!useCustomPayout)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-navy underline hover:text-gold"
                      >
                        <Pencil size={12} />
                        {useCustomPayout ? "Use Settings Defaults" : "Specify custom account"}
                      </button>
                    </div>

                    {!useCustomPayout ? (
                      /* Auto-Loaded from Settings Card */
                      hasConfiguredPayout ? (
                        <div className="border border-navy/15 bg-white p-4 rounded-none space-y-3">
                          <div className="flex items-center justify-between border-b border-navy/10 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center bg-navy/10 text-navy">
                                <Wallet size={14} />
                              </span>
                              <span className="text-xs font-semibold uppercase tracking-wider text-navy">
                                Default Payout Account (from Settings)
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
                            Please configure your default Mobile Money or Bank account in Settings, or click &quot;Specify custom account&quot; above.
                          </p>
                          <Link
                            href="/dashboard/settings"
                            className="inline-flex items-center gap-1.5 font-medium text-navy underline hover:text-gold"
                          >
                            Configure Payout Defaults in Settings <ArrowUpRight size={13} />
                          </Link>
                        </div>
                      )
                    ) : (
                      /* Custom Payout Destination Form */
                      <div className="border border-navy/20 bg-white p-4 rounded-none space-y-4">
                        <p className="text-xs font-semibold text-navy">Custom Destination for this Request</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label htmlFor="custom-method" className="text-xs text-steel block">
                              Payout Method
                            </label>
                            <select
                              id="custom-method"
                              name="customMethod"
                              value={customMethod}
                              onChange={(e) => setUserCustomMethod(e.target.value as "Mobile money" | "Bank transfer")}
                              className={field}
                              disabled={createMutation.isPending}
                            >
                              <option value="Mobile money">Mobile money</option>
                              <option value="Bank transfer">Bank transfer</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="custom-institution" className="text-xs text-steel block">
                              {customMethod === "Mobile money" ? "Network (MTN, Telecel, AT)" : "Bank Name"}
                            </label>
                            <input
                              id="custom-institution"
                              name="customInstitution"
                              required
                              defaultValue={customInstitution || (resubmitItem?.institution || "")}
                              placeholder={customMethod === "Mobile money" ? "e.g. MTN Mobile Money" : "e.g. GCB Bank"}
                              className={field}
                              disabled={createMutation.isPending}
                            />
                          </div>
                          <div>
                            <label htmlFor="custom-account" className="text-xs text-steel block">
                              Account / Phone Number
                            </label>
                            <input
                              id="custom-account"
                              name="customAccountNumber"
                              required
                              defaultValue={customAccountNumber || (resubmitItem?.accountNumber || "")}
                              placeholder="e.g. 0244123456"
                              className={field}
                              disabled={createMutation.isPending}
                            />
                          </div>
                          <div>
                            <label htmlFor="custom-recipient" className="text-xs text-steel block">
                              Recipient Name
                            </label>
                            <input
                              id="custom-recipient"
                              name="customRecipientName"
                              required
                              defaultValue={customRecipientName || (resubmitItem?.recipient || "")}
                              placeholder="e.g. Kwame Mensah"
                              className={field}
                              disabled={createMutation.isPending}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

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
                      defaultValue={defaultAmount}
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
                      defaultValue={resubmitItem?.purpose || ""}
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
                    I confirm this withdrawal request. Funds will be disbursed to the specified account upon administrator review.
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
                    onClick={handleClose}
                    disabled={createMutation.isPending}
                    className="rounded-none border border-navy/20 bg-white px-5 py-3 text-sm font-medium hover:bg-stone disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || available < 100 || (!useCustomPayout && !hasConfiguredPayout)}
                    className="inline-flex items-center gap-2 rounded-none bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-steel disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                  >
                    {createMutation.isPending && (
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    )}
                    {createMutation.isPending ? (
                      "Submitting request…"
                    ) : isResubmission ? (
                      <>
                        <RotateCcw size={15} />
                        Confirm &amp; Resubmit Request
                      </>
                    ) : (
                      "Submit request"
                    )}
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
