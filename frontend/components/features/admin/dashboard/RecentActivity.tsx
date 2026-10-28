"use client";

import Link from "next/link";
import { Check, ChevronRight, CircleDollarSign, Clock3 } from "lucide-react";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { formatMoney, timeAgo } from "@/lib/format";
import type { ActivityEntry } from "./types";
import { useRecentActivity } from "./use-admin-dashboard";

const humanize = (code: string) => {
  const text = code.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

function tone(entry: ActivityEntry) {
  if (entry.amount) return "success" as const;
  if (/REJECT|SUSPEND|FAIL|DENIED|REVOKE/.test(entry.action)) return "warning" as const;
  return "neutral" as const;
}

export function RecentActivity() {
  const { data, isPending, isError, error, refetch } = useRecentActivity(3);

  return (
    <article className="surface-card p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-navy">Recent activity</h2>
          <p className="mt-1 text-sm text-steel">Latest events requiring your attention</p>
        </div>
        <Link href="/admin/activity" className="shrink-0 text-xs font-semibold text-gold transition-colors hover:text-navy">View all</Link>
      </div>

      <div className="mt-5 space-y-4">
        {isPending ? (
          Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-10" />)
        ) : isError ? (
          <ErrorNote message={(error as { message?: string }).message} onRetry={() => refetch()} />
        ) : data.length === 0 ? (
          <p className="text-sm text-steel">No activity yet.</p>
        ) : (
          data.map((item) => {
            const t = tone(item);
            const icon = t === "warning" ? <Clock3 size={14} /> : t === "success" ? <CircleDollarSign size={14} /> : <Check size={14} />;
            const iconStyle =
              t === "success" ? "bg-success-soft text-success" : t === "warning" ? "bg-warning-soft text-warning" : "bg-navy/8 text-steel";
            return (
              <div key={item.id} className="flex gap-3">
                <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconStyle}`}>{icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="text-sm font-medium text-ink">{humanize(item.action)}</p>
                    <span className="shrink-0 text-[11px] text-steel">{timeAgo(item.createdAt)}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-steel">{item.actorName ?? "System"} · {humanize(item.entityType)}</p>
                  {item.amount && <p className="mt-1 text-xs font-semibold text-success">{formatMoney(item.amount)}</p>}
                </div>
              </div>
            );
          })
        )}
      </div>

      <Link href="/admin/activity" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-gold transition-colors hover:text-navy">
        Open activity log
        <ChevronRight size={14} />
      </Link>
    </article>
  );
}
