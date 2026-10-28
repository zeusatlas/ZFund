"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/QueryState";
import { api, type ApiError } from "@/lib/api/client";
import { authKeys, useMe } from "@/lib/auth/auth";

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

export default function AdminSettings() {
  return (
    <div className="w-full max-w-4xl">
      <section className="rounded-xl border border-navy/10 bg-white shadow-sm">
        <ProfileForm />
      </section>
    </div>
  );
}
