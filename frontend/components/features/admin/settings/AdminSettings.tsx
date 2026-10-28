"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import FilterSelect from "@/components/ui/FilterSelect";
import Modal from "@/components/ui/Modal";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { api, type ApiError } from "@/lib/api/client";
import { authKeys, useMe } from "@/lib/auth/auth";
import { timeAgo } from "@/lib/format";
import { useAddAdmin, useAdmins, type AdminAccount } from "../admin-api";
import type { HostStatus } from "../dashboard/types";
import StatusBadge from "../users/StatusBadge";

const inputClass = "mt-1.5 w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-gold disabled:bg-stone-light disabled:text-steel";
const errorOf = (error: unknown) => (error as ApiError | null)?.message;

const roleLabels: Record<AdminAccount["role"], string> = {
  SUPER_ADMIN: "Super admin",
  PLATFORM_ADMIN: "Platform admin",
};

type Tab = "profile" | "admins";

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
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-ink">
            Email address
            <input type="email" value={me.email} disabled readOnly className={inputClass} />
          </label>
          <label className="block text-sm font-medium text-ink">
            Phone number
            <input type="tel" value={me.phone ?? "Not provided"} disabled readOnly className={inputClass} />
          </label>
        </div>
        <p className="text-xs text-steel">You sign in with this email and phone number, so they can&apos;t be changed here.</p>
        {save.isError && <p role="alert" className="text-sm text-[#a13d3d]">{errorOf(save.error)}</p>}
        <button type="submit" disabled={save.isPending} className="rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-steel disabled:opacity-60">
          {save.isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function AddAdminModal({ onClose }: Readonly<{ onClose: () => void }>) {
  const addAdmin = useAddAdmin();
  const [role, setRole] = useState<AdminAccount["role"]>("PLATFORM_ADMIN");
  const apiError = addAdmin.error as unknown as ApiError | null;
  const fieldError = (field: string) => apiError?.errors?.[field]?.[0];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    addAdmin.mutate(
      {
        firstName: String(form.get("firstName")).trim(),
        lastName: String(form.get("lastName")).trim(),
        email: String(form.get("email")).trim(),
        phone: String(form.get("phone")).trim(),
        role,
      },
      { onSuccess: onClose },
    );
  }

  return (
    <Modal eyebrow="Administrators" title="Add an administrator" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-ink">
            First name
            <input required minLength={2} name="firstName" autoComplete="off" className={inputClass} />
            {fieldError("firstName") && <span className="mt-1 block text-xs text-[#a13d3d]">{fieldError("firstName")}</span>}
          </label>
          <label className="block text-sm font-medium text-ink">
            Last name
            <input required minLength={2} name="lastName" autoComplete="off" className={inputClass} />
            {fieldError("lastName") && <span className="mt-1 block text-xs text-[#a13d3d]">{fieldError("lastName")}</span>}
          </label>
        </div>
        <label className="block text-sm font-medium text-ink">
          Email address
          <input required type="email" name="email" autoComplete="off" className={inputClass} />
          {fieldError("email") && <span className="mt-1 block text-xs text-[#a13d3d]">{fieldError("email")}</span>}
        </label>
        <label className="block text-sm font-medium text-ink">
          Phone number
          <input required type="tel" name="phone" autoComplete="off" pattern="[+]?[0-9 ()-]{9,}" className={inputClass} placeholder="0541234567" />
          {fieldError("phone") && <span className="mt-1 block text-xs text-[#a13d3d]">{fieldError("phone")}</span>}
          <span className="mt-1 block text-xs font-normal text-steel">They sign in with this email and phone number, plus a code sent by SMS.</span>
        </label>
        <div className="text-sm font-medium text-ink">
          Role
          <div className="mt-1.5">
            <FilterSelect
              label="Role"
              minHeight="46px"
              value={role}
              onChange={(value) => setRole(value as AdminAccount["role"])}
              options={[
                { value: "PLATFORM_ADMIN", label: "Platform admin" },
                { value: "SUPER_ADMIN", label: "Super admin" },
              ]}
            />
          </div>
        </div>

        {apiError && !apiError.errors && (
          <p role="alert" className="rounded-lg bg-[#fbeaea] px-3 py-2 text-sm text-[#a13d3d]">{apiError.message}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} disabled={addAdmin.isPending} className="rounded-lg px-4 py-2.5 text-sm font-medium text-steel hover:bg-stone">Cancel</button>
          <button type="submit" disabled={addAdmin.isPending} className="rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-steel disabled:opacity-60">
            {addAdmin.isPending ? "Adding…" : "Add administrator"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Administrators() {
  const { data, isPending, isError, error, refetch } = useAdmins();
  const [adding, setAdding] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/10 p-5 md:p-6">
        <div>
          <h2 className="font-semibold text-navy">Administrators</h2>
          <p className="mt-1 text-sm text-steel">People who can sign in to this admin dashboard.</p>
        </div>
        <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-steel">
          <UserPlus size={16} />
          Add administrator
        </button>
      </div>

      {isPending ? (
        <div className="space-y-3 p-5">{Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-12" />)}</div>
      ) : isError ? (
        <div className="p-5"><ErrorNote message={errorOf(error)} onRetry={() => refetch()} /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-stone-light text-xs uppercase tracking-wide text-steel">
              <tr>
                <th className="px-5 py-3 font-medium">Administrator</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last sign-in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/10">
              {data.map((admin) => (
                <tr key={admin.id} className="text-sm">
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink">{admin.firstName} {admin.lastName}</p>
                    <p className="mt-0.5 text-xs text-steel">{[admin.email, admin.phone].filter(Boolean).join(" · ")}</p>
                  </td>
                  <td className="px-4 py-4 text-ink">{roleLabels[admin.role] ?? admin.role}</td>
                  <td className="px-4 py-4"><StatusBadge status={admin.status as HostStatus} /></td>
                  <td className="px-4 py-4 text-xs text-steel">{admin.lastLoginAt ? timeAgo(admin.lastLoginAt) : "Not signed in yet"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {adding && <AddAdminModal onClose={() => setAdding(false)} />}
    </>
  );
}

export default function AdminSettings() {
  const [tab, setTab] = useState<Tab>("profile");
  const tabButton = (name: Tab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(name)}
      className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium ${tab === name ? "border-gold text-navy" : "border-transparent text-steel hover:text-navy"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-4xl space-y-6">
      <nav aria-label="Settings sections" className="flex gap-6 border-b border-navy/10">
        {tabButton("profile", "Profile")}
        {tabButton("admins", "Administrators")}
      </nav>
      <section className="rounded-xl border border-navy/10 bg-white shadow-sm">
        {tab === "profile" ? <ProfileForm /> : <Administrators />}
      </section>
    </div>
  );
}
