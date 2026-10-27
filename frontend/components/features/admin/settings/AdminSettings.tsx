"use client";

import { FormEvent, useState } from "react";

type SettingsTab = "profile" | "notifications" | "security";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("jane@zfund.com");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [hostAlerts, setHostAlerts] = useState(true);
  const [notice, setNotice] = useState("");

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Changes saved successfully.");
  }

  function selectTab(tab: SettingsTab) {
    setActiveTab(tab);
    setNotice("");
  }

  return (
    <div className="w-full max-w-4xl">
      <div>
        <nav aria-label="Settings sections" className="flex gap-6 overflow-x-auto border-b border-navy/10">
          <button type="button" onClick={() => selectTab("profile")} className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium ${activeTab === "profile" ? "border-gold text-navy" : "border-transparent text-steel hover:text-navy"}`}>Profile</button>
          <button type="button" onClick={() => selectTab("notifications")} className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium ${activeTab === "notifications" ? "border-gold text-navy" : "border-transparent text-steel hover:text-navy"}`}>Notifications</button>
          <button type="button" onClick={() => selectTab("security")} className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium ${activeTab === "security" ? "border-gold text-navy" : "border-transparent text-steel hover:text-navy"}`}>Security</button>
        </nav>

        <section className="mt-5 rounded-xl border border-navy/10 bg-white shadow-sm">
          {notice && <div className="border-b border-[#cfe6d9] bg-[#f1faf4] px-5 py-3 text-sm text-[#287754]">{notice}</div>}

          {activeTab === "profile" && (
            <form onSubmit={saveProfile}>
              <div className="border-b border-navy/10 p-5 md:p-6"><h2 className="font-semibold text-navy">Profile</h2><p className="mt-1 text-sm text-steel">These details identify you as an administrator.</p></div>
              <div className="space-y-5 p-5 md:p-6">
                <label className="block text-sm font-medium text-ink">Full name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-gold" /></label>
                <label className="block text-sm font-medium text-ink">Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-gold" /></label>
                <button type="submit" className="rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-steel">Save changes</button>
              </div>
            </form>
          )}

          {activeTab === "notifications" && (
            <div>
              <div className="border-b border-navy/10 p-5 md:p-6"><h2 className="font-semibold text-navy">Notifications</h2><p className="mt-1 text-sm text-steel">Choose which updates you receive.</p></div>
              <div className="divide-y divide-navy/10 px-5 md:px-6">
                <label className="flex items-center justify-between gap-4 py-5 text-sm"><span><span className="block font-medium text-ink">Email notifications</span><span className="mt-1 block text-xs text-steel">Receive important account updates.</span></span><input type="checkbox" checked={emailAlerts} onChange={(event) => setEmailAlerts(event.target.checked)} className="h-4 w-4 accent-[#0b2545]" /></label>
                <label className="flex items-center justify-between gap-4 py-5 text-sm"><span><span className="block font-medium text-ink">Host requests</span><span className="mt-1 block text-xs text-steel">Get notified when a host needs review.</span></span><input type="checkbox" checked={hostAlerts} onChange={(event) => setHostAlerts(event.target.checked)} className="h-4 w-4 accent-[#0b2545]" /></label>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div>
              <div className="border-b border-navy/10 p-5 md:p-6"><h2 className="font-semibold text-navy">Security</h2><p className="mt-1 text-sm text-steel">Keep your administrator account secure.</p></div>
              <div className="space-y-3 p-5 md:p-6"><button type="button" className="w-full rounded-lg border border-navy/15 px-4 py-3 text-left text-sm font-medium text-navy hover:bg-stone">Change password<span className="mt-1 block text-xs font-normal text-steel">Update your account password.</span></button><button type="button" className="w-full rounded-lg border border-navy/15 px-4 py-3 text-left text-sm font-medium text-navy hover:bg-stone">Active sessions<span className="mt-1 block text-xs font-normal text-steel">Review where your account is signed in.</span></button></div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
