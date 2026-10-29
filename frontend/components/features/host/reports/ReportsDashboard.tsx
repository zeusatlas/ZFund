"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Download,
  HeartHandshake,
  Info,
  Loader2,
  Percent,
  Repeat2,
  RotateCcw,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import HostHeading from "@/components/features/host/shared/HostHeading";
import { TrendChart, OutcomeChart, chartColours } from "@/components/features/host/reports/ReportCharts";
import { money } from "@/components/features/host/shared/demo";
import RefreshData from "@/components/features/host/shared/RefreshData";
import { useCampaignsList } from "@/components/features/host/campaigns/use-campaigns";
import {
  contributionToTransaction,
  useTransactionsQuery,
} from "@/components/features/host/transactions/use-transactions";
import { transactionsCsv, type Transaction } from "@/components/features/host/transactions/transactions";
import { buildReport, monthLabel } from "@/components/features/host/reports/reports";

const panel = "min-w-0 surface-card p-5 sm:p-7";

export default function ReportsDashboard() {
  const queryClient = useQueryClient();
  const [month, setMonth] = useState("All");
  const [campaignId, setCampaignId] = useState("All");
  const [exportMessage, setExportMessage] = useState("");

  // Live real campaigns from PostgreSQL database
  const {
    campaigns,
    isLoading: isLoadingCampaigns,
    isError: isErrorCampaigns,
    error: campaignsError,
    refetch: refetchCampaigns,
  } = useCampaignsList();

  // Live real transactions/contributions from PostgreSQL database
  const {
    data: contributionsData,
    isLoading: isLoadingContributions,
    isError: isErrorContributions,
    error: contributionsError,
    refetch: refetchContributions,
  } = useTransactionsQuery({ limit: 1000 });

  const liveTransactions: Transaction[] = useMemo(() => {
    return (contributionsData?.contributions || []).map(contributionToTransaction);
  }, [contributionsData?.contributions]);

  const handleRefresh = async () => {
    await Promise.all([
      refetchCampaigns(),
      refetchContributions(),
      queryClient.invalidateQueries({ queryKey: ["contributions"] }),
      queryClient.invalidateQueries({ queryKey: ["projects"] }),
    ]);
  };

  const isInitialLoading =
    isLoadingCampaigns && isLoadingContributions && campaigns.length === 0;

  // Real months extracted from live records
  const months = useMemo(() => {
    const set = new Set(
      liveTransactions
        .map((item) => item.date?.slice(0, 7))
        .filter((d): d is string => Boolean(d && /^\d{4}-\d{2}$/.test(d)))
    );
    const currentMonth = new Date().toISOString().slice(0, 7);
    set.add(currentMonth);
    return [...set].sort().reverse();
  }, [liveTransactions]);

  // Aggregate live statistics across filters
  const report = useMemo(() => {
    return buildReport(liveTransactions, campaigns, month, campaignId);
  }, [liveTransactions, campaigns, month, campaignId]);

  const period = month === "All" ? "All recorded months" : monthLabel(month);
  const best = report.performance.find((campaign) => campaign.raised > 0);
  const highest = Math.max(...report.performance.map((campaign) => campaign.raised), 1);

  const commission = Math.round(report.raised * 0.14);
  const netRaised = report.raised - commission;

  const cards = [
    {
      label: "Total gross raised",
      value: isInitialLoading ? (
        <span className="inline-block animate-pulse opacity-60">···</span>
      ) : (
        money(report.raised)
      ),
      note: "Gross contributions before deductions",
      icon: Wallet,
      colour: "#0b2545",
      tint: "#eef2f6",
    },
    {
      label: "Commission (14%)",
      value: isInitialLoading ? (
        <span className="inline-block animate-pulse opacity-60">···</span>
      ) : (
        money(commission)
      ),
      note: "14% Commission fee",
      icon: Percent,
      colour: "#8a5a10",
      tint: "#fdf3e1",
    },
    {
      label: "Net credited (86%)",
      value: isInitialLoading ? (
        <span className="inline-block animate-pulse opacity-60">···</span>
      ) : (
        money(netRaised)
      ),
      note: "86% net credited for project execution",
      icon: CheckCircle2,
      colour: "#256b4a",
      tint: "#e9f2ec",
    },
    {
      label: "Paid contributors",
      value: isInitialLoading ? (
        <span className="inline-block animate-pulse opacity-60">···</span>
      ) : (
        report.donors.toLocaleString("en-GH")
      ),
      note: "Unique people who completed a payment",
      icon: Users,
      colour: "#c08a2e",
      tint: "#fdf3e1",
    },
    {
      label: "Average donation",
      value: isInitialLoading ? (
        <span className="inline-block animate-pulse opacity-60">···</span>
      ) : (
        money(report.average)
      ),
      note: "Per successful payment (gross)",
      icon: HeartHandshake,
      colour: "#2e4c6d",
      tint: "#eaf0f5",
    },
    {
      label: "Payment success rate",
      value: isInitialLoading ? (
        <span className="inline-block animate-pulse opacity-60">···</span>
      ) : report.successRate === null ? (
        "—"
      ) : (
        `${report.successRate.toFixed(1)}%`
      ),
      note: `${report.paid.length} of ${report.scoped.length} payment attempts`,
      icon: CheckCircle2,
      colour: "#256b4a",
      tint: "#e9f2ec",
    },
  ];

  function exportData() {
    try {
      const names = Object.fromEntries(campaigns.map((c) => [c.id, c.name]));
      const url = URL.createObjectURL(
        new Blob([transactionsCsv(report.scoped, names)], { type: "text/csv;charset=utf-8;" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `raisefundz-report-transactions-${month === "All" ? "all-months" : month}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExportMessage(`Download started: ${report.scoped.length} transactions exported.`);
    } catch {
      setExportMessage("The download could not be started. Please try again.");
    }
  }

  return (
    <div className="mx-auto min-w-0 max-w-[1400px] py-3 md:py-5 space-y-6">
      <HostHeading
        title="See the bigger picture."
        description="Understand how your community gives, track platform commissions, and analyze live campaign performance."
      >
        <RefreshData onRefresh={handleRefresh} />
      </HostHeading>

      {/* Database Error Banner if queries fail */}
      {(isErrorCampaigns || isErrorContributions) && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 border border-crimson/20 bg-crimson/5 p-4 text-sm text-crimson"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="shrink-0" />
            <span>
              Failed to load live database metrics:{" "}
              {((contributionsError || campaignsError) as Error)?.message ||
                "Database connection error."}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 rounded-lg bg-crimson px-3 py-1.5 text-xs font-medium text-white hover:bg-crimson/90 transition-colors"
          >
            <RotateCcw size={13} />
            Retry
          </button>
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1 sm:max-w-56">
          <label htmlFor="report-month" className="text-xs font-medium text-steel">
            Reporting period
          </label>
          <select
            id="report-month"
            value={month}
            onChange={(event) => {
              setMonth(event.target.value);
              setExportMessage("");
            }}
            className="field mt-2"
          >
            <option value="All">All recorded months</option>
            {months.map((value) => (
              <option key={value} value={value}>
                {monthLabel(value)}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0 flex-1 sm:max-w-80">
          <label htmlFor="report-campaign" className="text-xs font-medium text-steel">
            Campaign
          </label>
          <select
            id="report-campaign"
            value={campaignId}
            onChange={(event) => {
              setCampaignId(event.target.value);
              setExportMessage("");
            }}
            className="field mt-2"
          >
            <option value="All">All campaigns</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:ml-auto sm:w-auto">
          <button
            type="button"
            onClick={exportData}
            disabled={!report.scoped.length}
            className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={17} aria-hidden="true" />
            Export transactions
          </button>
        </div>
      </div>

      <p role="status" className={exportMessage ? "mb-2 text-sm text-steel" : "sr-only"}>
        {exportMessage}
      </p>

      {/* Commission Transparency Banner */}
      <div className="flex items-start gap-3 border border-navy/10 bg-white p-4 text-xs text-navy leading-relaxed shadow-xs">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-gold/15 text-gold font-bold text-xs">
          %
        </div>
        <div>
          <span className="font-semibold text-navy">14% Platform Commission Transparency:</span>{" "}
          <span className="text-steel">
            A standard 14% commission applies to all received donations to support secure USSD channels and payment gateway infrastructure. 86% of every contribution is credited directly to your campaigns.
          </span>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <section aria-label="Report summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, value, note, icon: Icon, colour, tint }) => (
          <article
            key={label}
            className="min-w-0 surface-card rounded-none p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-steel">
                {label}
              </h2>
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none"
                style={{ backgroundColor: tint, color: colour }}
              >
                <Icon size={18} aria-hidden="true" />
              </span>
            </div>
            <p className="break-words text-[clamp(22px,2vw,30px)] font-bold leading-tight tracking-tight tabular-nums text-navy">
              {value}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-steel">{note}</p>
          </article>
        ))}
      </section>

      <p role="status" className="text-xs text-steel">
        {period} · {report.scoped.length} matching payment {report.scoped.length === 1 ? "attempt" : "attempts"}. All charts reflect these filters.
      </p>

      {/* Empty State */}
      {!isInitialLoading && !report.scoped.length && (
        <div className="surface-card p-6 border border-navy/10 text-center">
          <p className="font-semibold text-navy">No payments recorded in this selection</p>
          <p className="mt-1 text-sm text-steel">
            Choose another reporting period or campaign to explore your contributions.
          </p>
          <button
            type="button"
            onClick={() => {
              setMonth("All");
              setCampaignId("All");
              setExportMessage("");
            }}
            className="mt-4 rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-steel transition-colors"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
        <section className={panel} aria-labelledby="donation-trend-title">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="donation-trend-title" className="text-lg font-semibold tracking-tight text-navy">
                The rhythm of giving
              </h2>
              <p className="mt-1 text-sm text-steel">
                {month === "All" ? "Monthly" : "Daily"} successful donations · {period}
              </p>
            </div>
            <span className="rounded-full bg-gold/15 px-3 py-1.5 text-xs font-semibold text-warning">
              {money(report.raised)}
            </span>
          </div>
          <TrendChart points={report.trend} daily={month !== "All"} />
        </section>

        <section className={panel} aria-labelledby="payment-outcomes-title">
          <h2 id="payment-outcomes-title" className="text-lg font-semibold tracking-tight text-navy">
            Payment outcomes
          </h2>
          <p className="mt-1 text-sm text-steel">A breakdown by number of attempts.</p>
          <div className="mt-5">
            <OutcomeChart outcomes={report.outcomes} />
          </div>
        </section>
      </div>

      {/* Campaign Performance & Insights */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
        <section className={panel} aria-labelledby="campaign-performance-title">
          <div className="mb-7 flex flex-wrap justify-between gap-4">
            <div>
              <h2 id="campaign-performance-title" className="text-lg font-semibold tracking-tight text-navy">
                Campaign performance
              </h2>
              <p className="mt-1 text-sm text-steel">
                Live donations in the selected period (Gross vs 86% Net).
              </p>
            </div>
            <Link
              href="/host/campaigns"
              className="inline-flex items-center gap-1 self-start text-sm font-medium text-navy hover:text-gold transition-colors"
            >
              View campaigns <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>

          {report.performance.length === 0 ? (
            <p className="text-sm text-steel py-8 text-center">No campaigns found in your account.</p>
          ) : (
            <ul className="space-y-6">
              {report.performance.map((campaign, index) => {
                const campCommission = Math.round(campaign.raised * 0.14);
                const campNet = campaign.raised - campCommission;
                return (
                  <li key={campaign.id}>
                    <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-sm font-medium text-navy">{campaign.name}</h3>
                      <div className="text-right">
                        <span className="text-sm font-medium tabular-nums text-navy">
                          {money(campaign.raised)}
                        </span>
                        <span className="ml-2 text-xs font-medium text-success">
                          Net: {money(campNet)}
                        </span>
                      </div>
                    </div>
                    <div
                      className="h-3 overflow-hidden rounded-full bg-stone"
                      role="img"
                      aria-label={`${campaign.name}: ${money(campaign.raised)}`}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.round((campaign.raised / highest) * 100))}%`,
                          backgroundColor: chartColours[index % chartColours.length],
                        }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-steel">
                      {campaign.gifts} successful {campaign.gifts === 1 ? "payment" : "payments"} ·{" "}
                      {campaign.donors} paid {campaign.donors === 1 ? "contributor" : "contributors"} · 14% commission: {money(campCommission)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-6 border-t border-navy/10 pt-4 text-xs text-steel">
            Bars compare gross amounts raised, relative to the leading campaign in this selection.
          </p>
        </section>

        {/* Live Insights Aside */}
        <aside
          className="min-w-0 rounded-none bg-navy p-6 text-white sm:p-7 flex flex-col justify-between"
          aria-labelledby="report-insights-title"
        >
          <div>
            <div className="mb-7 flex items-center gap-2">
              <Sparkles size={19} aria-hidden="true" className="text-gold" />
              <h2 id="report-insights-title" className="text-xl font-medium tracking-tight">
                Worth a closer look
              </h2>
            </div>
            <div className="space-y-7">
              <div>
                <p className="text-xs text-white/65 uppercase tracking-wider">Leading campaign</p>
                <h3 className="mt-2 text-lg font-medium">
                  {best ? best.name : "Your next contribution starts here"}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {best
                    ? `${report.raised > 0 ? Math.round((best.raised / report.raised) * 100) : 0}% of the amount raised in this selection. Share a progress update with the people behind it.`
                    : "There are no successful contributions in this selection yet."}
                </p>
              </div>

              <div className="border-t border-white/15 pt-6">
                <div className="flex items-center gap-2 text-gold">
                  <Repeat2 size={17} aria-hidden="true" />
                  <h3 className="text-sm font-medium">People who gave again</h3>
                </div>
                <p className="mt-3 text-3xl font-medium tabular-nums">
                  {report.repeatDonors}
                  <span className="ml-2 text-sm font-normal text-white/65">
                    of {report.donors} paid contributors
                  </span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  Contributors with more than one successful contribution in this period.
                </p>
              </div>

              <div className="border-t border-white/15 pt-6">
                <h3 className="text-sm font-medium text-gold">Awaiting confirmation</h3>
                <p className="mt-3 text-2xl font-medium tabular-nums">
                  {money(report.pendingAmount)}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  Pending payments are excluded from the raised total until confirmed.
                </p>
                <Link
                  href="/host/transactions"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-white hover:text-gold transition-colors underline underline-offset-4"
                >
                  Review transactions <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <p className="text-xs leading-relaxed text-steel">
        Based on live database transaction records. Average donation uses successful payments; success rate uses all payment attempts. Gross amounts are shown before 14% platform commission. Dates use Ghana time (GMT).
      </p>
    </div>
  );
}
