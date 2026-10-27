"use client";

import { format } from "date-fns";
import { useState } from "react";
import Pagination from "@/components/ui/Pagination";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { formatMoney, timeAgo } from "@/lib/format";
import { useActivity } from "../admin-api";

const humanize = (code: string) => {
  const text = code.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export default function AdminActivity() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useActivity(page);

  return (
    <div className="w-full space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-navy md:text-3xl">Activity logs</h1>
        <p className="mt-2 text-sm text-steel">A log of what has happened on the platform, newest first.</p>
      </section>

      <section className="overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm">
        {isPending ? (
          <div className="space-y-3 p-5">{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : isError ? (
          <div className="p-5"><ErrorNote message={(error as { message?: string }).message} onRetry={() => refetch()} /></div>
        ) : data.items.length === 0 ? (
          <p className="p-8 text-center text-sm text-steel">No activity yet.</p>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[620px] text-left">
              <thead className="bg-stone-light text-xs uppercase tracking-wide text-steel">
                <tr>
                  <th className="px-5 py-3 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium">By</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                {data.items.map((entry) => (
                  <tr key={entry.id} className="text-sm">
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">{humanize(entry.action)}</p>
                      <p className="mt-0.5 text-xs text-steel">{humanize(entry.entityType)}</p>
                    </td>
                    <td className="px-4 py-4 text-ink">{entry.actorName ?? "System"}</td>
                    <td className="px-4 py-4 font-medium text-ink">{entry.amount ? formatMoney(entry.amount) : "–"}</td>
                    <td className="px-4 py-4">
                      <p className="text-xs text-ink">{timeAgo(entry.createdAt)}</p>
                      <p className="mt-0.5 text-xs text-steel">{format(new Date(entry.createdAt), "MMM d, yyyy, HH:mm")}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && <Pagination page={page} totalPages={data.meta.totalPages} total={data.meta.total} label="events" onPageChange={setPage} />}
      </section>
    </div>
  );
}
