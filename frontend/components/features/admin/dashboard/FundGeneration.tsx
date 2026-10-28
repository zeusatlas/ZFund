"use client";

import { useState } from "react";
import FilterSelect from "@/components/ui/FilterSelect";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { formatMoney } from "@/lib/format";
import type { TrendPeriod } from "./types";
import { useFundTrend } from "./use-admin-dashboard";

const copy = {
  "12m": { average: "Average monthly generation", current: "This month" },
  "6m": { average: "Average weekly generation", current: "This week" },
  "3m": { average: "Average weekly generation", current: "This week" },
  "30d": { average: "Average daily generation", current: "Today" },
} as const;

const periods = [
  { value: "30d", label: "Last 30 days" },
  { value: "3m", label: "Last 3 months" },
  { value: "6m", label: "Last 6 months" },
  { value: "12m", label: "Last 12 months" },
];

/** Bars between labels, so the axis stays readable at every range. */
const labelEvery = { "30d": 5, "3m": 2, "6m": 4, "12m": 1 } as const;

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
        <FilterSelect
          label="Fund generation period"
          className="w-40 shrink-0"
          minHeight="36px"
          value={period}
          onChange={(value) => setPeriod(value as TrendPeriod)}
          options={periods}
        />
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
              const showLabel = index % labelEvery[data.period] === 0;
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
