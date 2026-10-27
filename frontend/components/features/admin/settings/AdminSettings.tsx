"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/QueryState";
import { api, type ApiError } from "@/lib/api/client";
import { tokenStorage } from "@/lib/api/token-storage";
import { authKeys, useMe } from "@/lib/auth/auth";

type SettingsTab = "profile" | "security";

const inputClass = "mt-1.5 w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-gold disabled:bg-stone-light disabled:text-steel";
const errorOf = (error: unknown) => (error as ApiError | null)?.message;

function ProfileForm() {
  const queryClient = useQueryClient();
  const { data: me, isPending } = useMe();

  const save = useMutation({
    mutationFn: ({ firstName, lastName }: { firstName: string; lastName: string }) =>
      api.put(`/users/${me!.id}`, { firstName, lastName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me });
      toast.success("Changes saved successfully.");
    },
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    save.mutate({ firstName: String(form.get("firstName")).trim(), lastName: String(form.get("lastName")).trim() });
  }

  if (isPending || !me) return <div className="space-y-4 p-5 md:p-6"><Skeleton className="h-10" /><Skeleton className="h-10" /></div>;

  return (
    <form onSubmit={submit} key={me.id + me.firstName + me.lastName}>
      <div className="border-b border-navy/10 p-5 md:p-6">
        <h2 className="font-semibold text-navy">Profile</h2>
        <p className="mt-1 text-sm text-steel">These details identify you as an administrator.</p>
      </div>
      <div className="space-y-5 p-5 md:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-ink">
            First name
            <input required minLength={2} name="firstName" defaultValue={me.firstName} className={inputClass} />
          </label>
          <label className="block text-sm font-medium text-ink">
            Last name
            <input required minLength={2} name="lastName" defaultValue={me.lastName} className={inputClass} />
          </label>
        </div>
        <label className="block text-sm font-medium text-ink">
          Email address
          <input type="email" value={me.email} disabled readOnly className={inputClass} />
        </label>
        {save.isError && <p role="alert" className="text-sm text-[#a13d3d]">{errorOf(save.error)}</p>}
        <button type="submit" disabled={save.isPending} className="rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-steel disabled:opacity-60">
          {save.isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function SecurityForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const change = useMutation({
    mutationFn: (body: { oldPassword: string; newPassword: string }) => api.post("/auth/change-password", body),
    onSuccess: () => {
      // The backend revokes existing sessions, so sign in again.
      toast.success("Password changed. Please sign in again.");
      tokenStorage.clear();
      queryClient.clear();
      router.replace("/login");
    },
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    change.mutate({ oldPassword: String(form.get("oldPassword")), newPassword: String(form.get("newPassword")) });
  }

  return (
    <form onSubmit={submit}>
      <div className="border-b border-navy/10 p-5 md:p-6">
        <h2 className="font-semibold text-navy">Security</h2>
        <p className="mt-1 text-sm text-steel">Keep your administrator account secure.</p>
      </div>
      <div className="space-y-5 p-5 md:p-6">
        <label className="block text-sm font-medium text-ink">
          Current password
          <input required type="password" name="oldPassword" autoComplete="current-password" className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-ink">
          New password
          <input required type="password" name="newPassword" minLength={8} autoComplete="new-password" className={inputClass} />
          <span className="mt-1 block text-xs font-normal text-steel">At least 8 characters, with an uppercase letter and a number.</span>
        </label>
        {change.isError && <p role="alert" className="text-sm text-[#a13d3d]">{errorOf(change.error)}</p>}
        <button type="submit" disabled={change.isPending} className="rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-steel disabled:opacity-60">
          {change.isPending ? "Updating…" : "Change password"}
        </button>
      </div>
    </form>
  );
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const tab = (name: SettingsTab, label: string) => (
    <button
      type="button"
      onClick={() => setActiveTab(name)}
      className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium ${activeTab === name ? "border-gold text-navy" : "border-transparent text-steel hover:text-navy"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-4xl">
      <nav aria-label="Settings sections" className="flex gap-6 overflow-x-auto border-b border-navy/10">
        {tab("profile", "Profile")}
        {tab("security", "Security")}
      </nav>
      <section className="mt-5 rounded-xl border border-navy/10 bg-white shadow-sm">
        {activeTab === "profile" ? <ProfileForm /> : <SecurityForm />}
      </section>
    </div>
  );
}
