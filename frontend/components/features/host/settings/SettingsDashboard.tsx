"use client";

import { useState, type FormEvent } from "react";
import { Bell, CheckCircle2, LockKeyhole, Save, ShieldCheck, UserRound } from "lucide-react";
import HostHeading from "@/components/features/host/shared/HostHeading";
import { useHostSettings, saveHostSettings } from "@/components/features/host/settings/use-settings";
import { hostSettingsSchema, type HostSettings } from "@/components/features/host/settings/settings";

const inputClass = "mt-2 w-full rounded-xl border border-navy/20 bg-white px-3 py-2.5 text-sm text-navy placeholder:text-steel/60";

export default function SettingsDashboard() {
  const saved = useHostSettings();
  const [form, setForm] = useState<HostSettings>(saved);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");


  function update<K extends keyof HostSettings>(key: K, value: HostSettings[K]) {
    setForm(current => ({ ...current, [key]: value }));
    setNotice("");
    setError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    const result = hostSettingsSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    try {
      saveHostSettings(result.data);
      setNotice("Your settings were saved in this browser.");
    } catch {
      setError("We could not save these settings. Check that browser storage is available and try again.");
    }
  }

  return <div className="mx-auto min-w-0 max-w-[1000px] py-3 md:py-5">
    <HostHeading title="Settings" description="Keep your profile, updates, and payout preferences ready for the work ahead." />
    <form onSubmit={submit} className="space-y-6">
      <section className="rounded-2xl border border-navy/10 bg-white p-5 sm:p-7" aria-labelledby="profile-title">
        <div className="mb-7 flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><UserRound size={19} aria-hidden="true" /></span><div><h2 id="profile-title" className="text-xl font-medium tracking-tight text-navy">Profile</h2><p className="mt-1 text-sm text-steel">The details contributors and support teams can use to recognise your account.</p></div></div>
        <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="settings-name" className="text-sm font-medium text-navy">Full name</label><input id="settings-name" value={form.fullName} onChange={event => update("fullName", event.target.value)} className={inputClass} /></div><div><label htmlFor="settings-organisation" className="text-sm font-medium text-navy">Organisation or group</label><input id="settings-organisation" value={form.organisation} onChange={event => update("organisation", event.target.value)} className={inputClass} /></div><div><label htmlFor="settings-email" className="text-sm font-medium text-navy">Email address</label><input id="settings-email" type="email" value={form.email} onChange={event => update("email", event.target.value)} className={inputClass} /></div><div><label htmlFor="settings-phone" className="text-sm font-medium text-navy">Ghana mobile number</label><input id="settings-phone" type="tel" value={form.phone} onChange={event => update("phone", event.target.value)} className={inputClass} /></div></div>
      </section>

      <section className="rounded-2xl border border-navy/10 bg-white p-5 sm:p-7" aria-labelledby="notifications-title">
        <div className="mb-5 flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Bell size={19} aria-hidden="true" /></span><div><h2 id="notifications-title" className="text-xl font-medium tracking-tight text-navy">Notifications</h2><p className="mt-1 text-sm text-steel">Choose the updates that help you stay close to your campaigns.</p></div></div>
        <div className="divide-y divide-navy/10">{[["contributionAlerts", "New contribution alerts", "Know when a supporter completes a payment."], ["withdrawalUpdates", "Withdrawal updates", "Hear when a payout request is reviewed or updated."], ["campaignDigest", "Campaign digest", "Receive a weekly overview of campaign progress."]].map(([key, title, description]) => { const field = key as keyof HostSettings; return <label key={key} className="flex cursor-pointer items-center justify-between gap-5 py-4 first:pt-0 last:pb-0"><span><span className="block text-sm font-medium text-navy">{title}</span><span className="mt-1 block text-sm text-steel">{description}</span></span><input type="checkbox" checked={Boolean(form[field])} onChange={event => update(field, event.target.checked)} className="h-5 w-5 shrink-0 accent-navy" /></label>; })}</div>
      </section>

      <section className="rounded-2xl border border-navy/10 bg-white p-5 sm:p-7" aria-labelledby="payout-title">
        <div className="mb-6 flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><ShieldCheck size={19} aria-hidden="true" /></span><div><h2 id="payout-title" className="text-xl font-medium tracking-tight text-navy">Payout preference</h2><p className="mt-1 text-sm text-steel">Choose the method you prefer when preparing a withdrawal request.</p></div></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="settings-payout" className="block text-sm font-medium text-navy">
              Preferred payout method
            </label>
            <select
              id="settings-payout"
              value={form.preferredPayout}
              onChange={event => update("preferredPayout", event.target.value as HostSettings["preferredPayout"])}
              className={inputClass}
            >
              <option>Mobile money</option>
              <option>Bank transfer</option>
            </select>
            <p className="mt-2 text-xs leading-relaxed text-steel">
              This preference fills future withdrawal forms. It does not store account or wallet numbers.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-navy/10 bg-stone p-5 sm:p-7" aria-labelledby="security-title"><div className="flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-navy"><LockKeyhole size={19} aria-hidden="true" /></span><div><h2 id="security-title" className="text-xl font-medium tracking-tight text-navy">Account security</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-steel">You sign in with your email, your phone number and a one-time code sent by SMS, so there is no password to manage. Keep your phone number up to date with your administrator.</p></div></div></section>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-4 rounded-2xl border border-navy/10 bg-white/95 p-4 shadow-lg backdrop-blur"><p role="status" className={notice ? "mr-auto flex items-center gap-2 text-sm text-emerald-800" : "sr-only"}><CheckCircle2 size={16} aria-hidden="true" />{notice}</p>{error && <p role="alert" className="mr-auto text-sm text-crimson">{error}</p>}<button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-steel"><Save size={17} aria-hidden="true" />Save changes</button></div>
    </form>
  </div>;
}
