"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { format } from "date-fns";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  HelpCircle,
  Info,
  Loader2,
  LockKeyhole,
  LogOut,
  Percent,
  PhoneCall,
  Save,
  ShieldCheck,
  Smartphone,
  UserCheck,
  UserRound,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import HostHeading from "@/components/features/host/shared/HostHeading";
import MetricCard from "@/components/ui/MetricCard";
import {
  defaultHostSettings,
  GHANA_BANKS,
  hostSettingsSchema,
  type HostSettings,
} from "@/components/features/host/settings/settings";
import {
  saveHostSettings,
  useHostSettings,
} from "@/components/features/host/settings/use-settings";
import { useLogout, useMe } from "@/lib/auth/auth";
import { api } from "@/lib/api/client";

type Tab = "profile" | "payout" | "fees" | "security";

const inputClass =
  "mt-2 w-full rounded-none border border-navy/20 bg-white px-3.5 py-2.5 text-sm text-navy placeholder:text-steel/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy disabled:bg-stone/50 disabled:cursor-not-allowed";

export default function SettingsDashboard() {
  const { data: me, isLoading: isLoadingMe, isError: isErrorMe, error: meError } = useMe();
  const logoutMutation = useLogout();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const storedSettings = useHostSettings(me?.id);

  // Local form state and baseline snapshot for dirty-checking
  const [form, setForm] = useState<HostSettings>(storedSettings);
  const [baseline, setBaseline] = useState<HostSettings>(storedSettings);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Synchronize form & baseline when storedSettings loads from server
  useEffect(() => {
    if (storedSettings) {
      if (!hasInitialized || JSON.stringify(baseline) === JSON.stringify(defaultHostSettings)) {
        setBaseline(storedSettings);
        setForm(storedSettings);
        setHasInitialized(true);
      }
    }
  }, [storedSettings, hasInitialized, baseline]);

  // Dirty check: only activate save button when a change has been made
  const isDirty = useMemo(() => {
    return (
      form.preferredPayout !== baseline.preferredPayout ||
      form.defaultInstitution !== baseline.defaultInstitution ||
      (form.defaultBranch || "") !== (baseline.defaultBranch || "") ||
      form.defaultRecipient !== baseline.defaultRecipient ||
      form.defaultAccount !== baseline.defaultAccount ||
      form.contributionAlerts !== baseline.contributionAlerts ||
      form.withdrawalUpdates !== baseline.withdrawalUpdates ||
      form.campaignDigest !== baseline.campaignDigest
    );
  }, [form, baseline]);

  function update<K extends keyof HostSettings>(key: K, value: HostSettings[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setNotice("");
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (activeTab === "profile" || activeTab === "fees" || !isDirty || isSaving) {
      return;
    }

    const parsed = hostSettingsSchema.safeParse(form);
    if (!parsed.success) {
      const firstMsg =
        parsed.error.issues[0]?.message || "Please check your inputs and try again.";
      setError(firstMsg);
      toast.error(firstMsg);
      return;
    }

    try {
      setIsSaving(true);
      // Persist to backend database and local cache
      await saveHostSettings(parsed.data, me?.id);

      // Immediately reset baseline to newly saved data so isDirty becomes false
      setBaseline(parsed.data);
      setForm(parsed.data);

      const successMsg =
        activeTab === "payout"
          ? "Default payout preferences saved successfully to database!"
          : "Notification preferences saved successfully to database!";
      setNotice(successMsg);
      toast.success(successMsg);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not save settings. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  }

  // Revoke all active sessions
  async function handleLogoutAll() {
    const confirmLogout = window.confirm(
      "Are you sure you want to sign out of all active sessions across all devices? You will need to sign in again with an SMS OTP."
    );
    if (!confirmLogout) return;

    try {
      setIsLoggingOutAll(true);
      await api.post("/auth/logout-all");
      toast.success("All sessions have been revoked. Signing out...");
      await logoutMutation.mutateAsync();
      window.location.href = "/login";
    } catch {
      toast.error("Could not revoke all sessions. Please try again.");
    } finally {
      setIsLoggingOutAll(false);
    }
  }

  return (
    <div className="w-full space-y-7">
      <HostHeading
        title="Settings & Preferences"
        description="Review your verified host profile, configure default payout accounts, check 14% platform fees, and customize notification alerts."
      />

      {/* Database Error Banner if profile fetch fails */}
      {isErrorMe && (
        <div
          role="alert"
          className="flex items-center gap-3 border border-crimson/20 bg-crimson/5 p-4 text-sm text-crimson rounded-none"
        >
          <AlertCircle size={18} className="shrink-0" />
          <span>Failed to load profile details: {(meError as Error)?.message || "Network error"}</span>
        </div>
      )}

      {/* Tab Navigation Controls */}
      <div className="border-b border-navy/10 flex flex-wrap gap-2 sm:gap-6">
        {[
          { id: "profile", label: "Profile & Account", icon: UserRound },
          { id: "payout", label: "Payout Defaults", icon: Wallet },
          { id: "fees", label: "Platform Fees (14%)", icon: Percent },
          { id: "security", label: "Notifications & Security", icon: ShieldCheck },
        ].map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActiveTab(id as Tab);
                setError("");
                setNotice("");
              }}
              className={`inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-navy text-navy"
                  : "border-transparent text-steel hover:border-steel/30 hover:text-navy"
              }`}
            >
              <Icon size={16} aria-hidden="true" className={isActive ? "text-gold" : ""} />
              {label}
            </button>
          );
        })}
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* ========================================================
            TAB 1: Profile & Account Information (Fetched from users table)
            ======================================================== */}
        {activeTab === "profile" && (
          <section
            className="surface-card rounded-none p-6 sm:p-8 space-y-6"
            aria-labelledby="profile-title"
          >
            <div className="flex items-start justify-between gap-4 border-b border-navy/10 pb-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-navy/10 text-navy">
                  <UserRound size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2 id="profile-title" className="text-lg font-semibold tracking-tight text-navy">
                    Host Profile
                  </h2>
                  <p className="mt-0.5 text-sm text-steel">
                    Information fetched directly from your verified host record in the user table.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-navy/5 border border-navy/10 px-2.5 py-1 text-xs font-semibold text-navy">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                {me?.role === "ACCOUNT_OWNER"
                  ? "Host Account Owner"
                  : me?.role === "HOST"
                    ? "Campaign Host"
                    : "Verified User"}
              </span>
            </div>

            {/* Read-Only Notice Banner */}
            <div className="border border-navy/10 bg-stone/40 p-4 text-xs text-steel flex items-start gap-3">
              <LockKeyhole size={18} className="shrink-0 text-navy mt-0.5" />
              <div>
                <p className="font-semibold text-navy">Profile Details Are Verified & Locked</p>
                <p className="mt-0.5">
                  Your identity details (Legal Name, Phone Number, Email Address, and Organization) are verified directly from the user table and locked to comply with financial and telecom regulatory standards (KYC). To request an update, please contact platform administration.
                </p>
              </div>
            </div>

            {isLoadingMe ? (
              <div className="flex items-center justify-center py-12 text-sm text-steel">
                <Loader2 size={20} className="animate-spin text-navy/40 mr-2" />
                Fetching host details from user table…
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="settings-firstname"
                      className="text-xs font-semibold uppercase tracking-wider text-steel flex items-center justify-between"
                    >
                      <span>First Name</span>
                      <span className="text-[10px] text-steel/70 flex items-center gap-1">
                        <LockKeyhole size={10} /> Locked
                      </span>
                    </label>
                    <input
                      id="settings-firstname"
                      value={me?.firstName || ""}
                      readOnly
                      disabled
                      className="mt-2 w-full rounded-none border border-navy/15 bg-stone/50 px-3.5 py-2.5 text-sm text-navy font-medium cursor-not-allowed select-text"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="settings-lastname"
                      className="text-xs font-semibold uppercase tracking-wider text-steel flex items-center justify-between"
                    >
                      <span>Last Name</span>
                      <span className="text-[10px] text-steel/70 flex items-center gap-1">
                        <LockKeyhole size={10} /> Locked
                      </span>
                    </label>
                    <input
                      id="settings-lastname"
                      value={me?.lastName || ""}
                      readOnly
                      disabled
                      className="mt-2 w-full rounded-none border border-navy/15 bg-stone/50 px-3.5 py-2.5 text-sm text-navy font-medium cursor-not-allowed select-text"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="settings-email"
                      className="text-xs font-semibold uppercase tracking-wider text-steel flex items-center justify-between"
                    >
                      <span>Email Address (Login Identity)</span>
                      <span className="text-[10px] text-steel/70 flex items-center gap-1">
                        <LockKeyhole size={10} /> Locked
                      </span>
                    </label>
                    <input
                      id="settings-email"
                      type="email"
                      value={me?.email || ""}
                      readOnly
                      disabled
                      className="mt-2 w-full rounded-none border border-navy/15 bg-stone/50 px-3.5 py-2.5 text-sm text-navy font-medium cursor-not-allowed select-text"
                    />
                    <p className="mt-1.5 text-xs text-steel">
                      Verified email identity associated with your account.
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="settings-phone"
                      className="text-xs font-semibold uppercase tracking-wider text-steel flex items-center justify-between"
                    >
                      <span>Ghana Mobile Number</span>
                      <span className="text-[10px] text-steel/70 flex items-center gap-1">
                        <LockKeyhole size={10} /> Locked
                      </span>
                    </label>
                    <input
                      id="settings-phone"
                      type="tel"
                      value={me?.phone || "Not provided"}
                      readOnly
                      disabled
                      className="mt-2 w-full rounded-none border border-navy/15 bg-stone/50 px-3.5 py-2.5 text-sm text-navy font-medium cursor-not-allowed select-text"
                    />
                    <p className="mt-1.5 text-xs text-steel">
                      Receives login OTPs and SMS transaction notifications.
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="settings-organisation"
                    className="text-xs font-semibold uppercase tracking-wider text-steel flex items-center justify-between"
                  >
                    <span>Organisation or Community Group Name</span>
                    <span className="text-[10px] text-steel/70 flex items-center gap-1">
                      <LockKeyhole size={10} /> Locked
                    </span>
                  </label>
                  <input
                    id="settings-organisation"
                    value={me?.organisation || me?.memberships?.[0]?.organization?.name || "Independent Campaign Host"}
                    readOnly
                    disabled
                    className="mt-2 w-full rounded-none border border-navy/15 bg-stone/50 px-3.5 py-2.5 text-sm text-navy font-medium cursor-not-allowed select-text"
                  />
                  <p className="mt-1.5 text-xs text-steel">
                    Public organization name associated with your campaigns and receipts.
                  </p>
                </div>

                {/* Additional Verified User Account Details from User Table */}
                <div className="border border-navy/10 bg-white p-4 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-steel block border-b border-navy/10 pb-2">
                    Verified User Account Metadata
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-steel block">Account Role</span>
                      <span className="font-semibold text-navy">
                        {me?.role === "ACCOUNT_OWNER"
                          ? "Host Account Owner"
                          : me?.role === "HOST"
                            ? "Campaign Host"
                            : me?.role || "Verified User"}
                      </span>
                    </div>
                    <div>
                      <span className="text-steel block">Account Status</span>
                      <span className="font-semibold text-emerald-700 capitalize">
                        {me?.status?.toLowerCase() || "active"}
                      </span>
                    </div>
                    <div>
                      <span className="text-steel block">Member Since</span>
                      <span className="font-semibold text-navy">
                        {me?.createdAt ? format(new Date(me.createdAt), "MMM d, yyyy") : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-steel block">Last Signed In</span>
                      <span className="font-semibold text-navy">
                        {me?.lastLoginAt ? format(new Date(me.lastLoginAt), "MMM d, yyyy, HH:mm") : "Current Session"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ========================================================
            TAB 2: Default Payout Preferences
            ======================================================== */}
        {activeTab === "payout" && (
          <section
            className="surface-card rounded-none p-6 sm:p-8 space-y-6"
            aria-labelledby="payout-title"
          >
            <div className="flex items-start gap-3 border-b border-navy/10 pb-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-gold/15 text-gold">
                <Wallet size={20} aria-hidden="true" />
              </span>
              <div>
                <h2 id="payout-title" className="text-lg font-semibold tracking-tight text-navy">
                  Payout Defaults
                </h2>
                <p className="mt-0.5 text-sm text-steel">
                  Save your default destination account so withdrawal requests are automatically pre-loaded.
                </p>
              </div>
            </div>

            <div className="border border-navy/10 bg-stone/40 p-4 text-xs text-steel flex items-start gap-2.5">
              <Info size={16} className="shrink-0 text-navy mt-0.5" />
              <span>
                Configuring these default payout settings automatically populates your payment destination whenever you request campaign funds on the Withdrawals Dashboard.
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="settings-payout-method"
                  className="text-xs font-semibold uppercase tracking-wider text-steel"
                >
                  Preferred Payout Channel
                </label>
                <select
                  id="settings-payout-method"
                  value={form.preferredPayout}
                  onChange={(event) => {
                    const nextMethod = event.target.value as HostSettings["preferredPayout"];
                    setForm((current) => {
                      let inst = current.defaultInstitution;
                      if (nextMethod === "Bank transfer" && (!inst || !GHANA_BANKS.includes(inst as any))) {
                        inst = GHANA_BANKS[0];
                      } else if (nextMethod === "Mobile money" && !["MTN Mobile Money", "Telecel Cash", "AT Money"].includes(inst)) {
                        inst = "MTN Mobile Money";
                      }
                      return { ...current, preferredPayout: nextMethod, defaultInstitution: inst };
                    });
                    setNotice("");
                    setError("");
                  }}
                  className={inputClass}
                >
                  <option value="Mobile money">Mobile Money (MTN, Telecel, AT)</option>
                  <option value="Bank transfer">Bank Transfer (Ghana Commercial Banks)</option>
                </select>
              </div>

              {form.preferredPayout === "Mobile money" ? (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="settings-institution"
                        className="text-xs font-semibold uppercase tracking-wider text-steel"
                      >
                        Mobile Network <span className="text-crimson">*</span>
                      </label>
                      <select
                        id="settings-institution"
                        value={form.defaultInstitution}
                        onChange={(event) => update("defaultInstitution", event.target.value)}
                        className={inputClass}
                      >
                        <option value="MTN Mobile Money">MTN Mobile Money</option>
                        <option value="Telecel Cash">Telecel Cash</option>
                        <option value="AT Money">AT Money</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="settings-recipient"
                        className="text-xs font-semibold uppercase tracking-wider text-steel"
                      >
                        Account Name <span className="text-crimson">*</span>
                      </label>
                      <input
                        id="settings-recipient"
                        value={form.defaultRecipient}
                        onChange={(event) => update("defaultRecipient", event.target.value)}
                        placeholder="e.g. Kwame Mensah"
                        className={inputClass}
                      />
                      <p className="mt-1.5 text-xs text-steel">
                        The registered subscriber or organization name on the wallet.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="settings-account"
                      className="text-xs font-semibold uppercase tracking-wider text-steel"
                    >
                      Default Wallet Number <span className="text-crimson">*</span>
                    </label>
                    <input
                      id="settings-account"
                      value={form.defaultAccount}
                      onChange={(event) => update("defaultAccount", event.target.value)}
                      placeholder="e.g. 0241234567"
                      className={inputClass}
                    />
                    <p className="mt-1.5 text-xs text-steel">
                      The 10-digit mobile number registered with the selected telecom network.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="settings-institution"
                        className="text-xs font-semibold uppercase tracking-wider text-steel"
                      >
                        Bank Name <span className="text-crimson">*</span>
                      </label>
                      <select
                        id="settings-institution"
                        value={form.defaultInstitution}
                        onChange={(event) => update("defaultInstitution", event.target.value)}
                        className={inputClass}
                      >
                        <option value="" disabled>Select Bank...</option>
                        {GHANA_BANKS.map((bank) => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1.5 text-xs text-steel">
                        Select from Bank of Ghana licensed universal banks.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="settings-branch"
                        className="text-xs font-semibold uppercase tracking-wider text-steel"
                      >
                        Bank Branch
                      </label>
                      <input
                        id="settings-branch"
                        value={form.defaultBranch || ""}
                        onChange={(event) => update("defaultBranch", event.target.value)}
                        placeholder="e.g. Accra Main, Osu, Ridge, Kumasi Central"
                        className={inputClass}
                      />
                      <p className="mt-1.5 text-xs text-steel">
                        The specific branch where the bank account was opened.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="settings-recipient"
                        className="text-xs font-semibold uppercase tracking-wider text-steel"
                      >
                        Account Name <span className="text-crimson">*</span>
                      </label>
                      <input
                        id="settings-recipient"
                        value={form.defaultRecipient}
                        onChange={(event) => update("defaultRecipient", event.target.value)}
                        placeholder="e.g. Aburi Community Project / Kwame Mensah"
                        className={inputClass}
                      />
                      <p className="mt-1.5 text-xs text-steel">
                        The official registered name on the bank account.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="settings-account"
                        className="text-xs font-semibold uppercase tracking-wider text-steel"
                      >
                        Bank Account Number <span className="text-crimson">*</span>
                      </label>
                      <input
                        id="settings-account"
                        value={form.defaultAccount}
                        onChange={(event) => update("defaultAccount", event.target.value)}
                        placeholder="e.g. 1041010029381"
                        className={inputClass}
                      />
                      <p className="mt-1.5 text-xs text-steel">
                        Direct bank account number containing 6 to 24 digits.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* ========================================================
            TAB 3: Platform Fees (14%) & Settlement Terms
            ======================================================== */}
        {activeTab === "fees" && (
          <section
            className="surface-card rounded-none p-6 sm:p-8 space-y-6"
            aria-labelledby="fees-title"
          >
            <div className="flex items-start justify-between gap-4 border-b border-navy/10 pb-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-gold/15 text-gold">
                  <Percent size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2 id="fees-title" className="text-lg font-semibold tracking-tight text-navy">
                    Platform Fee & Settlement Transparency
                  </h2>
                  <p className="mt-0.5 text-sm text-steel">
                    Clear, transparent fee breakdown for all donations processed through RaiseFundz.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/20 px-2.5 py-1 text-xs font-semibold text-gold">
                Fixed 14% Fee Structure
              </span>
            </div>

            {/* Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Platform Commission"
                value="14.0%"
                detail="Telecom & gateway processing fee"
                icon={Percent}
                accent="gold"
              />
              <MetricCard
                label="Host Net Proceeds"
                value="86.0%"
                detail="Direct net disbursement to host"
                icon={CheckCircle2}
                accent="green"
              />
              <MetricCard
                label="Account Fee"
                value="GH₵ 0.00"
                detail="No setup or monthly charges"
                icon={ShieldCheck}
                accent="blue"
              />
              <MetricCard
                label="Disbursement Surcharge"
                value="GH₵ 0.00"
                detail="Direct mobile money or bank payout"
                icon={Wallet}
                accent="blue"
              />
            </div>

            {/* Fee Breakdown Details */}
            <div className="border border-navy/10 bg-white p-5 space-y-4">
              <h3 className="text-sm font-semibold text-navy">How your 14% platform fee works</h3>
              <p className="text-xs text-steel leading-relaxed">
                When a supporter makes a contribution to your campaign (via USSD or online checkout), a total commission of 14% is deducted at settlement. The remaining 86% is credited in full to your available withdrawal balance:
              </p>

              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                <div className="border border-navy/10 bg-stone/30 p-3.5 space-y-1">
                  <span className="font-semibold text-navy block">Gross Donation</span>
                  <p className="text-steel">100% of the amount contributed by your supporter.</p>
                  <p className="font-mono text-navy font-bold pt-1">Example: GH₵ 100.00</p>
                </div>
                <div className="border border-gold/20 bg-gold/5 p-3.5 space-y-1">
                  <span className="font-semibold text-gold block">Platform Fee (14%)</span>
                  <p className="text-steel">Covers telecom carrier fees, USSD sessions, gateway routing & verification.</p>
                  <p className="font-mono text-gold font-bold pt-1">- GH₵ 14.00</p>
                </div>
                <div className="border border-emerald-500/20 bg-emerald-50/50 p-3.5 space-y-1">
                  <span className="font-semibold text-emerald-700 block">Host Available Balance (86%)</span>
                  <p className="text-steel">Net proceeds immediately available for payout request.</p>
                  <p className="font-mono text-emerald-700 font-bold pt-1">= GH₵ 86.00</p>
                </div>
              </div>

              <div className="border-t border-navy/10 pt-3 flex items-center justify-between text-xs text-steel">
                <span>All balances and payouts on your Reports and Withdrawals pages already reflect this transparent 14% commission.</span>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            TAB 4: Notifications & Security
            ======================================================== */}
        {activeTab === "security" && (
          <div className="space-y-6">
            {/* Notification Alerts Section */}
            <section
              className="surface-card rounded-none p-6 sm:p-8 space-y-6"
              aria-labelledby="notifications-title"
            >
              <div className="flex items-start gap-3 border-b border-navy/10 pb-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-navy/10 text-navy">
                  <Bell size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2 id="notifications-title" className="text-lg font-semibold tracking-tight text-navy">
                    Notification Alerts
                  </h2>
                  <p className="mt-0.5 text-sm text-steel">
                    Choose which SMS and system alerts are sent to your verified Ghana mobile number.
                  </p>
                </div>
              </div>

              <div className="space-y-4 divide-y divide-navy/10">
                <label className="flex items-start justify-between gap-4 pt-4 first:pt-0 cursor-pointer">
                  <div className="space-y-1 pr-6">
                    <span className="text-sm font-semibold text-navy">Contribution alerts</span>
                    <p className="text-xs text-steel leading-relaxed">
                      Receive an instant SMS notification whenever a donor completes a contribution via USSD or Web Checkout.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.contributionAlerts}
                    onChange={(event) => update("contributionAlerts", event.target.checked)}
                    className="mt-1 h-4 w-4 rounded-none border-navy/30 text-navy accent-navy focus:ring-navy"
                  />
                </label>

                <label className="flex items-start justify-between gap-4 pt-4 cursor-pointer">
                  <div className="space-y-1 pr-6">
                    <span className="text-sm font-semibold text-navy">Withdrawal updates</span>
                    <p className="text-xs text-steel leading-relaxed">
                      Receive SMS status updates when your withdrawal requests are reviewed, approved, or disbursed.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.withdrawalUpdates}
                    onChange={(event) => update("withdrawalUpdates", event.target.checked)}
                    className="mt-1 h-4 w-4 rounded-none border-navy/30 text-navy accent-navy focus:ring-navy"
                  />
                </label>

                <label className="flex items-start justify-between gap-4 pt-4 cursor-pointer">
                  <div className="space-y-1 pr-6">
                    <span className="text-sm font-semibold text-navy">Weekly campaign digest</span>
                    <p className="text-xs text-steel leading-relaxed">
                      Receive a weekly summary of total donations raised, donor counts, and available net balances.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.campaignDigest}
                    onChange={(event) => update("campaignDigest", event.target.checked)}
                    className="mt-1 h-4 w-4 rounded-none border-navy/30 text-navy accent-navy focus:ring-navy"
                  />
                </label>
              </div>
            </section>

            {/* USSD Gateway Access Card */}
            <section
              className="surface-card rounded-none p-6 sm:p-8 space-y-4"
              aria-labelledby="ussd-info-title"
            >
              <div className="flex items-start gap-3 border-b border-navy/10 pb-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-gold/15 text-gold">
                  <Smartphone size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 id="ussd-info-title" className="text-base font-semibold text-navy">
                    USSD Gateway Integration
                  </h3>
                  <p className="mt-0.5 text-xs text-steel">
                    Direct telecom dial code for all your campaigns in Ghana.
                  </p>
                </div>
              </div>

              <div className="border border-navy/10 bg-white p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-steel">Master Dial Code</span>
                  <span className="font-mono text-base font-bold text-navy bg-gold/15 px-3 py-1">
                    *920*969#
                  </span>
                </div>
                <p className="text-xs text-steel leading-relaxed">
                  Supporters on MTN, Telecel, and AT can dial this code followed by your campaign code or navigate the menu to contribute without internet connectivity.
                </p>
              </div>
            </section>

            {/* Authentication & Session Security */}
            <section
              className="surface-card rounded-none p-6 sm:p-8 space-y-5"
              aria-labelledby="session-security-title"
            >
              <div className="flex items-start gap-3 border-b border-navy/10 pb-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-crimson/10 text-crimson">
                  <LockKeyhole size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 id="session-security-title" className="text-base font-semibold text-navy">
                    Session & Authentication Security
                  </h3>
                  <p className="mt-0.5 text-xs text-steel">
                    RaiseFundz uses secure SMS OTP (One-Time Password) authentication. Passwords are not used to prevent phishing.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-navy/10 bg-white p-4">
                <div>
                  <span className="text-xs font-semibold text-navy block">Active Login Sessions</span>
                  <p className="text-xs text-steel mt-0.5">
                    Revoke all active web tokens across devices if you suspect unauthorized access.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogoutAll}
                  disabled={isLoggingOutAll}
                  className="inline-flex items-center justify-center gap-2 rounded-none border border-crimson/30 bg-crimson/5 px-4 py-2.5 text-xs font-medium text-crimson hover:bg-crimson/10 transition-colors shrink-0"
                >
                  {isLoggingOutAll ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <LogOut size={14} />
                  )}
                  Sign out all devices
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================
            Sticky Save Toolbar (Only for editable tabs)
            ======================================================== */}
        {activeTab !== "profile" && activeTab !== "fees" && (
          <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-4 border border-navy/10 bg-white/95 p-4 shadow-md backdrop-blur">
            <div>
              {notice && (
                <p role="status" className="flex items-center gap-2 text-sm font-medium text-success">
                  <CheckCircle2 size={16} aria-hidden="true" />
                  {notice}
                </p>
              )}
              {error && (
                <p role="alert" className="flex items-center gap-2 text-sm font-medium text-crimson">
                  <AlertCircle size={16} aria-hidden="true" />
                  {error}
                </p>
              )}
              {!notice && !error && (
                <p className="text-xs text-steel">
                  {isDirty
                    ? "You have unsaved changes. Click 'Save changes' to update your preferences."
                    : "All payout defaults and notification preferences are saved."}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isDirty || isSaving}
              className="btn-primary inline-flex items-center gap-2 rounded-none px-6 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <Save size={16} aria-hidden="true" />
              )}
              {isSaving ? "Saving changes…" : isDirty ? "Save changes" : "No changes to save"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
