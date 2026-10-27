"use client";

import { useState } from "react";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { formatMoney } from "@/lib/format";
import type { TrendPeriod } from "./types";
import { useFundTrend } from "./use-admin-dashboard";

const copy = {
  "12m": { average: "Average monthly generation", current: "This month" },
  "30d": { average: "Average daily generation", current: "Today" },
} as const;

export function FundGeneration() {
  const [period, setPeriod] = useState<TrendPeriod>("12m");
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useFundTrend(period);
  const max = data ? Math.max(...data.buckets.map((b) => Number(b.amount)), 0) : 0;

  return (
    <article className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-navy">Fund generation</h2>
          <p className="mt-1 text-sm text-steel">Activity across all host accounts</p>
        </div>
        <select
          aria-label="Fund generation period"
          value={period}
          onChange={(e) => setPeriod(e.target.value as TrendPeriod)}
          className="rounded-lg border border-navy/10 bg-white px-2.5 py-2 text-xs text-steel outline-none"
        >
          <option value="12m">Last 12 months</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      {isPending ? (
        <Skeleton className="mt-7 h-44" />
      ) : isError ? (
        <div className="mt-7"><ErrorNote message={(error as { message?: string }).message} onRetry={() => refetch()} /></div>
      ) : (
        <>
          <div className={`mt-7 flex h-44 items-end gap-1 px-1 transition-opacity sm:gap-2 ${isPlaceholderData ? "opacity-50" : ""}`}>
            {data.buckets.map((bucket, index) => {
              const height = max > 0 ? Math.max((Number(bucket.amount) / max) * 100, 2) : 2;
              // On the daily view, label every 5th bar so labels stay readable.
              const showLabel = data.period === "12m" || index % 5 === 0;
              return (
                <div key={bucket.key} className="group flex h-full min-w-0 flex-1 flex-col justify-end">
                  <div className="relative w-full rounded-t-md bg-[#dce9e5] transition-colors group-hover:bg-gold" style={{ height: `${height}%` }}>
                    <span className="absolute -top-7 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-midnight px-1.5 py-1 text-[10px] text-white group-hover:block">
                      {formatMoney(bucket.amount)}
                    </span>
                  </div>
                  <span className="mt-2 h-3 text-center text-[10px] text-steel">{showLabel ? bucket.label : ""}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-navy/10 pt-4">
            <div>
              <p className="text-xs text-steel">{copy[data.period].average}</p>
              <p className="mt-1 text-lg font-semibold text-navy">{formatMoney(data.average)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-steel">{copy[data.period].current}</p>
              <p className="mt-1 text-lg font-semibold text-[#287754]">{formatMoney(data.current)}</p>
            </div>
          </div>
        </>
      )}
    </article>
  );
}
