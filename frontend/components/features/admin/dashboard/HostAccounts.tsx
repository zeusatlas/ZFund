"use client";

import Link from "next/link";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { formatMoney, timeAgo } from "@/lib/format";
import type { HostStatus } from "./types";
import { useHostAccounts } from "./use-admin-dashboard";

const statusStyle: Record<HostStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-[#e9f4ef] text-[#287754]" },
  PENDING_VERIFICATION: { label: "Pending", className: "bg-[#fff4dc] text-[#a26c12]" },
  SUSPENDED: { label: "Suspended", className: "bg-[#fbeaea] text-[#a13d3d]" },
};

function StatusPill({ status }: { status: HostStatus }) {
  const { label, className } = statusStyle[status];
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>{label}</span>;
}

export function HostAccounts() {
  const { data, isPending, isError, error, refetch } = useHostAccounts(2);

  return (
    <article className="overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-navy/10 p-5 md:p-6">
        <div>
          <h2 className="font-semibold text-navy">Host accounts</h2>
          <p className="mt-1 text-sm text-steel">Manage the people authorized to generate funds.</p>
        </div>
        <Link href="/admin/users" className="inline-flex items-center gap-1 text-xs font-medium text-gold hover:text-navy">
          View all hosts <ChevronRight size={14} />
        </Link>
      </div>

      {isPending ? (
        <div className="space-y-3 p-5">{Array.from({ length: 2 }, (_, i) => <Skeleton key={i} className="h-12" />)}</div>
      ) : isError ? (
        <div className="p-5"><ErrorNote message={(error as { message?: string }).message} onRetry={() => refetch()} /></div>
      ) : data.length === 0 ? (
        <p className="p-5 text-sm text-steel">No host accounts yet. Use the Add host account button to create one.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead className="bg-stone-light text-xs uppercase tracking-wide text-steel">
              <tr>
                <th className="px-5 py-3 font-medium">Host</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Funds issued</th>
                <th className="px-4 py-3 font-medium">Last active</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/10">
              {data.map((host) => {
                const name = `${host.firstName} ${host.lastName}`;
                const initials = `${host.firstName[0] ?? ""}${host.lastName[0] ?? ""}`.toUpperCase();
                return (
                  <tr key={host.id} className="text-sm">
                    <td className="px-5 py-4">
                      <Link href={`/admin/users/${host.id}`} className="flex items-center gap-3 rounded-md hover:text-gold">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-medium text-white">{initials}</span>
                        <div>
                          <p className="font-medium text-ink">{name}</p>
                          <p className="mt-0.5 text-xs text-steel">{host.phone ?? host.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4"><StatusPill status={host.status} /></td>
                    <td className="px-4 py-4 font-medium text-ink">{formatMoney(host.fundsIssued)}</td>
                    <td className="px-4 py-4 text-xs text-steel">{host.lastActiveAt ? timeAgo(host.lastActiveAt) : "Not signed in yet"}</td>
                    <td className="px-5 py-4 text-right">
                      <button type="button" aria-label={`More actions for ${name}`} className="rounded-md p-1.5 text-steel hover:bg-stone">
                        <MoreHorizontal size={17} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}
