"use client";

import { Download } from "lucide-react";
import { useState, type ReactNode } from "react";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { formatCount, formatMoney } from "@/lib/format";
import { useCampaigns, useTransactions, useWithdrawals } from "../admin-api";
import { StatCards } from "../dashboard/StatCards";
import type { TrendPeriod } from "../dashboard/types";
import { useDashboardOverview, useFundTrend } from "../dashboard/use-admin-dashboard";
import { BarList, TrendChart, type BarRow } from "./charts";
import { downloadCsv } from "./csv";

// Status colours carry a fixed meaning (done / waiting / problem); every bar is also labelled.
const GOOD = "#287754";
const WAITING = "#a26c12";
const BAD = "#a13d3d";
const NEUTRAL = "#2e4c6d";

const PERIODS: { value: TrendPeriod; label: string; every: number; text: string }[] = [
  { value: "30d", label: "30 days", every: 5, text: "last 30 days" },
  { value: "3m", label: "3 months", every: 2, text: "last 3 months" },
  { value: "6m", label: "6 months", every: 4, text: "last 6 months" },
  { value: "12m", label: "12 months", every: 1, text: "last 12 months" },
];

function PeriodTabs({ value, onChange }: { value: TrendPeriod; onChange: (period: TrendPeriod) => void }) {
  return (
    <div role="group" aria-label="Report period" className="inline-flex shrink-0 rounded-lg bg-navy/[0.06] p-0.5">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          type="button"
          aria-pressed={value === p.value}
          onClick={() => onChange(p.value)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
            value === p.value ? "bg-white text-navy shadow-sm" : "text-steel hover:text-navy"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-navy">{title}</h2>
          <p className="mt-1 text-sm text-steel">{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </article>
  );
}

export default function AdminReports() {
  const [period, setPeriod] = useState<TrendPeriod>("12m");
  const overview = useDashboardOverview();
  const trend = useFundTrend(period);
  const transactions = useTransactions({ page: 1, limit: 1 });
  const campaigns = useCampaigns({ page: 1, limit: 100 });
  const withdrawals = useWithdrawals({ page: 1, limit: 1 });

  const trendPoints = trend.data?.buckets.map((b) => ({ key: b.key, label: b.label, amount: Number(b.amount) }));
  const periodInfo = PERIODS.find((p) => p.value === period)!;
  const trendTotal = trendPoints?.reduce((t, p) => t + p.amount, 0) ?? 0;
  const trendPeak = Math.max(...(trendPoints?.map((p) => p.amount) ?? [0]));
  const tx = transactions.data?.meta.counts;
  const wd = withdrawals.data?.meta.counts;
  const topCampaigns = (campaigns.data?.items ?? [])
    .map((c) => ({
      name: c.name,
      host: c.hostName,
      raised: Number(c.raised),
      target: c.targetAmount ? Number(c.targetAmount) : null,
    }))
    .filter((c) => c.raised > 0)
    .sort((a, b) => b.raised - a.raised)
    .slice(0, 6);

  const paymentRows: BarRow[] = tx
    ? [
        { label: "Completed", value: tx.completed, display: formatCount(tx.completed), color: GOOD },
        { label: "Pending", value: tx.pending, display: formatCount(tx.pending), color: WAITING },
        { label: "Failed", value: tx.failed, display: formatCount(tx.failed), color: BAD },
        { label: "Refunded", value: tx.refunded, display: formatCount(tx.refunded), color: NEUTRAL },
      ]
    : [];
  const withdrawalRows: BarRow[] = wd
    ? [
        { label: "Paid out", value: wd.done, display: formatCount(wd.done), color: GOOD },
        { label: "Processing", value: wd.processing, display: formatCount(wd.processing), color: NEUTRAL },
        { label: "Pending review", value: wd.pending, display: formatCount(wd.pending), color: WAITING },
        { label: "Rejected", value: wd.rejected, display: formatCount(wd.rejected), color: BAD },
      ]
    : [];

  const ready = Boolean(overview.data && trendPoints && tx && wd && campaigns.data);

  function exportCsv() {
    if (!overview.data || !trendPoints || !tx || !wd) return;
    downloadCsv(`zfund-report-${new Date().toISOString().slice(0, 10)}.csv`, [
      {
        title: "Summary",
        rows: [
          ["Metric", "Value"],
          ["Funds generated (GHS)", overview.data.fundsGenerated.value],
          ["Transactions", overview.data.transactions.value],
          ["Active hosts", overview.data.activeHosts.value],
          ["Total processed (GHS)", tx.processed],
          ["Withdrawals paid out (GHS)", wd.paidOut],
          ["Withdrawals outstanding (GHS)", wd.outstanding],
        ],
      },
      {
        title: `Fund generation (${periodInfo.text})`,
        rows: [["Period", "Amount (GHS)"], ...trendPoints.map((p) => [p.label, p.amount])],
      },
      {
        title: "Payment outcomes",
        rows: [
          ["Status", "Transactions"],
          ["Completed", tx.completed],
          ["Pending", tx.pending],
          ["Failed", tx.failed],
          ["Refunded", tx.refunded],
        ],
      },
      {
        title: "Withdrawals",
        rows: [
          ["Status", "Requests"],
          ["Paid out", wd.done],
          ["Processing", wd.processing],
          ["Pending review", wd.pending],
          ["Rejected", wd.rejected],
        ],
      },
      {
        title: "Top campaigns by amount raised",
        rows: [
          ["Campaign", "Host", "Raised (GHS)", "Target (GHS)"],
          ...topCampaigns.map((c) => [c.name, c.host, c.raised, c.target ?? ""]),
        ],
      },
    ]);
  }

  const failed = [overview, trend, transactions, campaigns, withdrawals].find((q) => q.isError);

  return (
    <div className="w-full space-y-7">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy md:text-3xl">Reports</h1>
          <p className="mt-2 text-sm text-steel">How funds, payments and payouts are performing across the platform.</p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={!ready}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-steel disabled:opacity-50"
        >
          <Download size={17} />
          Export CSV
        </button>
      </section>

      {failed && <ErrorNote message={(failed.error as { message?: string }).message} onRetry={() => failed.refetch()} />}

      <StatCards />

      <Panel
        title="Fund generation"
        subtitle="Successful contributions across all host accounts"
        action={<PeriodTabs value={period} onChange={setPeriod} />}
      >
        {trendPoints ? (
          <div className={trend.isPlaceholderData ? "opacity-50 transition-opacity" : ""}>
            <TrendChart points={trendPoints} everyNth={periodInfo.every} />
            <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-navy/10 pt-4 text-sm">
              <div>
                <dt className="text-xs text-steel">Total, {periodInfo.text}</dt>
                <dd className="mt-1 font-semibold text-navy">{formatMoney(trendTotal)}</dd>
              </div>
              <div>
                <dt className="text-xs text-steel">Average per {period === "30d" ? "day" : period === "12m" ? "month" : "week"}</dt>
                <dd className="mt-1 font-semibold text-navy">{formatMoney(trendTotal / trendPoints.length)}</dd>
              </div>
              <div>
                <dt className="text-xs text-steel">Best {period === "30d" ? "day" : period === "12m" ? "month" : "week"}</dt>
                <dd className="mt-1 font-semibold text-[#287754]">{formatMoney(trendPeak)}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <Skeleton className="h-64" />
        )}
      </Panel>

      <section className="grid gap-5 lg:grid-cols-2">
        <Panel
          title="Payment outcomes"
          subtitle={tx ? `${formatCount(tx.total)} transactions · ${formatMoney(tx.processed)} processed` : "Transactions by status"}
        >
          {tx ? <BarList rows={paymentRows} empty="No transactions yet." /> : <Skeleton className="h-44" />}
        </Panel>
        <Panel
          title="Withdrawals"
          subtitle={wd ? `${formatMoney(wd.paidOut)} paid out · ${formatMoney(wd.outstanding)} outstanding` : "Requests by status"}
        >
          {wd ? <BarList rows={withdrawalRows} empty="No withdrawal requests yet." /> : <Skeleton className="h-44" />}
        </Panel>
      </section>

      <Panel title="Top campaigns" subtitle="Ranked by amount raised">
        {campaigns.data ? (
          <BarList
            empty="No contributions have been raised yet."
            rows={topCampaigns.map((c) => ({
              label: c.name,
              value: c.raised,
              display: formatMoney(c.raised),
              hint: `${c.host}${c.target ? ` · ${Math.round((c.raised / c.target) * 100)}% of ${formatMoney(c.target)} goal` : ""}`,
            }))}
          />
        ) : (
          <Skeleton className="h-52" />
        )}
      </Panel>
    </div>
  );
}
