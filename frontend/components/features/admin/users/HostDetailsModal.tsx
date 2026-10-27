"use client";

import { format } from "date-fns";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { formatCount, formatMoney, timeAgo } from "@/lib/format";
import { useHostDetail } from "../admin-api";
import StatusBadge from "./StatusBadge";

export default function HostDetailsModal({ hostId, onClose }: Readonly<{ hostId: string; onClose: () => void }>) {
  const { data, isPending, isError, error, refetch } = useHostDetail(hostId);

  const rows: [string, string][] = data
    ? [
        ["Email", data.host.email],
        ["Phone", data.host.phone ?? "Not provided"],
        ["Account created", format(new Date(data.host.createdAt), "MMM d, yyyy, HH:mm")],
        ["Last active", data.host.lastActiveAt ? timeAgo(data.host.lastActiveAt) : "Has not signed in yet"],
        ["Campaigns created", formatCount(data.funds.length)],
        ["Contributions received", formatCount(data.stats.transactions)],
        ["Raised this month", formatMoney(data.stats.fundsThisMonth)],
      ]
    : [];

  return (
    <Modal
      eyebrow="Host account"
      title={data ? `${data.host.firstName} ${data.host.lastName}` : "Host details"}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-steel hover:bg-stone">
            Close
          </button>
          <Link href={`/admin/users/${hostId}`} className="rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-steel">
            Open full profile
          </Link>
        </div>
      }
    >
      {isPending ? (
        <div className="space-y-3"><Skeleton className="h-16" /><Skeleton className="h-40" /></div>
      ) : isError ? (
        <ErrorNote message={(error as { message?: string }).message} onRetry={() => refetch()} />
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-steel">Total raised</p>
              <p className="mt-1 text-2xl font-semibold text-navy">{formatMoney(data.stats.totalFunds)}</p>
            </div>
            <StatusBadge status={data.host.status} />
          </div>
          <dl className="mt-4 divide-y divide-navy/10 text-sm">
            {rows.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-2.5">
                <dt className="shrink-0 text-steel">{label}</dt>
                <dd className="text-right font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </Modal>
  );
}
