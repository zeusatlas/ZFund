"use client";

import { format } from "date-fns";
import { CheckCircle2, CircleDollarSign, Clock3, XCircle } from "lucide-react";
import { useState } from "react";
import MetricCard from "@/components/ui/MetricCard";
import Pagination from "@/components/ui/Pagination";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatCount, formatMoney } from "@/lib/format";
import { useTransactions } from "../admin-api";
import ListToolbar from "../ListToolbar";

const statusStyle: Record<string, { label: string; className: string }> = {
  CONFIRMED: { label: "Completed", className: "bg-success-soft text-success" },
  PENDING: { label: "Pending", className: "bg-warning-soft text-warning" },
  INITIATED: { label: "Pending", className: "bg-warning-soft text-warning" },
  FAILED: { label: "Failed", className: "bg-danger-soft text-crimson" },
  REFUNDED: { label: "Refunded", className: "bg-navy/8 text-steel" },
  PARTIALLY_REFUNDED: { label: "Part refunded", className: "bg-navy/8 text-steel" },
};

export default function AdminTransactions() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useTransactions({ page, search: debouncedSearch, status });
  const counts = data?.meta.counts;
  const dash = "–";

  return (
    <div className="w-full space-y-6">
      <section>
        <h1 className="page-title">Transactions</h1>
        <p className="mt-2 text-sm text-steel">Track contributions and payment activity across the fund network.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total processed" value={counts ? formatMoney(counts.processed) : dash} icon={CircleDollarSign} accent="green" />
        <MetricCard label="Completed" value={counts ? formatCount(counts.completed) : dash} icon={CheckCircle2} accent="blue" />
        <MetricCard label="Pending" value={counts ? formatCount(counts.pending) : dash} icon={Clock3} accent="gold" />
        <MetricCard label="Failed" value={counts ? formatCount(counts.failed) : dash} icon={XCircle} accent="purple" />
      </section>

      <section className="overflow-hidden surface-card">
        <ListToolbar
          search={search}
          onSearch={(value) => { setSearch(value); setPage(1); }}
          searchLabel="Search by reference or fund"
          status={status}
          onStatus={(value) => { setStatus(value); setPage(1); }}
          statuses={[
            { value: "CONFIRMED", label: "Completed" },
            { value: "PENDING", label: "Pending" },
            { value: "FAILED", label: "Failed" },
            { value: "REFUNDED", label: "Refunded" },
          ]}
        />

        {isPending ? (
          <div className="space-y-3 p-5">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : isError ? (
          <div className="p-5"><ErrorNote message={(error as { message?: string }).message} onRetry={() => refetch()} /></div>
        ) : data.items.length === 0 ? (
          <p className="p-8 text-center text-sm text-steel">{search || status ? "No transactions match your search." : "No transactions yet."}</p>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[680px] text-left">
              <thead className="border-b border-navy/10 bg-stone-light text-[10px] font-semibold uppercase tracking-[0.1em] text-steel">
                <tr>
                  <th className="px-5 py-3 font-medium">Transaction</th>
                  <th className="px-4 py-3 font-medium">Fund</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                {data.items.map((tx) => {
                  const badge = statusStyle[tx.status] ?? { label: tx.status, className: "bg-stone text-steel" };
                  return (
                    <tr key={tx.id} className="text-sm">
                      <td className="px-5 py-4">
                        <p className="font-medium text-ink">{tx.reference}</p>
                        <p className="mt-0.5 text-xs text-steel">{tx.contributorName ?? "Anonymous contributor"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-ink">{tx.projectName}</p>
                        <p className="mt-0.5 text-xs text-steel">{tx.hostName}</p>
                      </td>
                      <td className="px-4 py-4 font-medium text-ink">{formatMoney(tx.amount)}</td>
                      <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}>{badge.label}</span></td>
                      <td className="px-4 py-4 text-xs text-steel">{format(new Date(tx.createdAt), "MMM d, yyyy, HH:mm")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {data && <Pagination page={page} totalPages={data.meta.totalPages} total={data.meta.total} label="transactions" onPageChange={setPage} />}
      </section>
    </div>
  );
}
