"use client";

import { format } from "date-fns";
import { Banknote, CheckCircle2, Clock3, Loader } from "lucide-react";
import { useState } from "react";
import MetricCard from "@/components/ui/MetricCard";
import Pagination from "@/components/ui/Pagination";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import RowMenu, { type RowMenuItem } from "@/components/ui/RowMenu";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatCount, formatMoney } from "@/lib/format";
import { useUpdateWithdrawalStatus, useWithdrawals, type Withdrawal } from "../admin-api";
import ListToolbar from "../ListToolbar";
import WithdrawalDetailsModal from "./WithdrawalDetailsModal";
import { actionLabel, methodLabel, nextStatuses, WithdrawalStatusBadge } from "./withdrawal-status";

export default function AdminWithdrawals() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search);

  const { data, isPending, isError, error, refetch, isPlaceholderData } = useWithdrawals({ page, search: debouncedSearch, status });
  const update = useUpdateWithdrawalStatus();
  const counts = data?.meta.counts;
  const selected = data?.items.find((item) => item.id === selectedId) ?? null;
  const dash = "–";

  function menuItems(item: Withdrawal): RowMenuItem[] {
    const moves: RowMenuItem[] = nextStatuses[item.status].map((next) => ({
      label: actionLabel[next],
      danger: next === "REJECTED",
      // Rejecting opens the details so a reason can be written first.
      onSelect: () => (next === "REJECTED" ? setSelectedId(item.id) : update.mutate({ id: item.id, status: next })),
    }));
    return [{ label: "View details", onSelect: () => setSelectedId(item.id) }, ...moves];
  }

  return (
    <div className="w-full space-y-6">
      <section>
        <h1 className="page-title">Withdrawal requests</h1>
        <p className="mt-2 text-sm text-steel">Review payout requests from hosts and move them along as you attend to them.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Pending requests" value={counts ? formatCount(counts.pending) : dash} icon={Clock3} accent="gold" />
        <MetricCard label="Processing" value={counts ? formatCount(counts.processing) : dash} icon={Loader} accent="blue" />
        <MetricCard label="Amount outstanding" value={counts ? formatMoney(counts.outstanding) : dash} icon={Banknote} accent="purple" />
        <MetricCard label="Paid out" value={counts ? formatMoney(counts.paidOut) : dash} icon={CheckCircle2} accent="green" />
      </section>

      <section className="overflow-hidden surface-card">
        <ListToolbar
          search={search}
          onSearch={(value) => { setSearch(value); setPage(1); }}
          searchLabel="Search by reference, host or recipient"
          status={status}
          onStatus={(value) => { setStatus(value); setPage(1); }}
          statuses={[
            { value: "PENDING", label: "Pending" },
            { value: "PROCESSING", label: "Processing" },
            { value: "DONE", label: "Done" },
            { value: "REJECTED", label: "Rejected" },
          ]}
        />

        {isPending ? (
          <div className="space-y-3 p-5">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : isError ? (
          <div className="p-5"><ErrorNote message={(error as { message?: string }).message} onRetry={() => refetch()} /></div>
        ) : data.items.length === 0 ? (
          <p className="p-8 text-center text-sm text-steel">
            {search || status ? "No requests match your search." : "No withdrawal requests yet. Requests from hosts will appear here."}
          </p>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[720px] text-left">
              <thead className="border-b border-navy/10 bg-stone-light text-[10px] font-semibold uppercase tracking-[0.1em] text-steel">
                <tr>
                  <th className="px-5 py-3 font-medium">Request</th>
                  <th className="px-4 py-3 font-medium">Host</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Payout to</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                {data.items.map((item) => (
                  <tr key={item.id} className="text-sm">
                    <td className="px-5 py-4">
                      <button type="button" onClick={() => setSelectedId(item.id)} className="font-medium text-ink hover:text-gold">{item.reference}</button>
                      <p className="mt-0.5 text-xs text-steel">{format(new Date(item.createdAt), "MMM d, yyyy, HH:mm")}</p>
                    </td>
                    <td className="px-4 py-4 text-ink">{item.hostName}</td>
                    <td className="px-4 py-4 font-medium text-ink">{formatMoney(item.amount)}</td>
                    <td className="px-4 py-4">
                      <p className="text-ink">{item.recipientName}</p>
                      <p className="mt-0.5 text-xs text-steel">{methodLabel[item.method]} · {item.institution}</p>
                    </td>
                    <td className="px-4 py-4"><WithdrawalStatusBadge status={item.status} /></td>
                    <td className="px-5 py-4 text-right">
                      <RowMenu label={`More actions for ${item.reference}`} items={menuItems(item)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && <Pagination page={page} totalPages={data.meta.totalPages} total={data.meta.total} label="requests" onPageChange={setPage} />}
      </section>

      {selected && <WithdrawalDetailsModal withdrawal={selected} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
