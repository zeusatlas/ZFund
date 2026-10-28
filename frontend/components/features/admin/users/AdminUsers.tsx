"use client";

import { Search, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import Pagination from "@/components/ui/Pagination";
import RowMenu, { type RowMenuItem } from "@/components/ui/RowMenu";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatMoney, timeAgo } from "@/lib/format";
import { useHosts, useUpdateHostStatus } from "../admin-api";
import { AddHostModal } from "../dashboard/AddHostModal";
import type { HostAccount, HostStatus } from "../dashboard/types";
import HostDetailsModal from "./HostDetailsModal";
import StatusBadge from "./StatusBadge";
import UserStats from "./UserStats";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [showAddHost, setShowAddHost] = useState(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const router = useRouter();

  const debouncedSearch = useDebouncedValue(search);
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useHosts({ page, search: debouncedSearch, status });
  const updateStatus = useUpdateHostStatus();

  function changeStatus(host: HostAccount, next: HostStatus) {
    updateStatus.mutate({ id: host.id, status: next, name: `${host.firstName} ${host.lastName}` });
  }

  function menuItems(host: HostAccount): RowMenuItem[] {
    const items: RowMenuItem[] = [
      { label: "View details", onSelect: () => setDetailsId(host.id) },
      { label: "Open full profile", onSelect: () => router.push(`/admin/users/${host.id}`) },
    ];
    // Accounts turn active on their first sign-in, so pending hosts cannot be approved by hand.
    if (host.status === "SUSPENDED") {
      items.push({ label: "Reactivate access", onSelect: () => changeStatus(host, "ACTIVE") });
    } else {
      items.push({ label: "Suspend access", danger: true, onSelect: () => changeStatus(host, "SUSPENDED") });
    }
    return items;
  }

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="page-title">Host accounts</h1>
          <p className="mt-2 text-sm text-steel">Manage the users who are allowed to generate funds.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddHost(true)}
          className="btn-primary w-fit"
        >
          <UserPlus size={17} />
          Add host
        </button>
      </section>

      <UserStats counts={data?.meta.counts} />

      <section className="overflow-hidden surface-card">
        <div className="flex flex-col gap-3 border-b border-navy/10 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search hosts"
              aria-label="Search host accounts"
              className="field pl-9"
            />
          </div>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by status"
            className="field w-auto"
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING_VERIFICATION">Pending</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        {isPending ? (
          <div className="space-y-3 p-5">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : isError ? (
          <div className="p-5"><ErrorNote message={(error as { message?: string }).message} onRetry={() => refetch()} /></div>
        ) : data.items.length === 0 ? (
          <p className="p-8 text-center text-sm text-steel">No host accounts found.</p>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[680px] text-left">
              <thead className="border-b border-navy/10 bg-stone-light text-[10px] font-semibold uppercase tracking-[0.1em] text-steel">
                <tr>
                  <th className="px-5 py-3 font-medium">Host</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Funds issued</th>
                  <th className="px-4 py-3 font-medium">Last active</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                {data.items.map((host) => {
                  const name = `${host.firstName} ${host.lastName}`;
                  const initials = `${host.firstName[0] ?? ""}${host.lastName[0] ?? ""}`.toUpperCase();
                  return (
                    <tr key={host.id} className="text-sm">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-medium text-white">{initials}</span>
                          <div>
                            <Link href={`/admin/users/${host.id}`} className="font-medium text-ink hover:text-gold">{name}</Link>
                            <p className="mt-0.5 text-xs text-steel">{host.phone ?? host.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4"><StatusBadge status={host.status} /></td>
                      <td className="px-4 py-4 font-medium text-ink">{formatMoney(host.fundsIssued)}</td>
                      <td className="px-4 py-4 text-xs text-steel">{host.lastActiveAt ? timeAgo(host.lastActiveAt) : "Not signed in yet"}</td>
                      <td className="px-5 py-4 text-right">
                        <RowMenu label={`More actions for ${name}`} items={menuItems(host)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {data && <Pagination page={page} totalPages={data.meta.totalPages} total={data.meta.total} label="hosts" onPageChange={setPage} />}
      </section>

      {showAddHost && <AddHostModal onClose={() => setShowAddHost(false)} />}
      {detailsId && <HostDetailsModal hostId={detailsId} onClose={() => setDetailsId(null)} />}
    </div>
  );
}
