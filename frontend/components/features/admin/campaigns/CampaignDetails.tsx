"use client";

import { format } from "date-fns";
import { ArrowLeft, CircleDollarSign, ReceiptText, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MetricCard from "@/components/ui/MetricCard";
import Pagination from "@/components/ui/Pagination";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatCount, formatMoney } from "@/lib/format";
import { useQueryClient } from "@tanstack/react-query";
import { updateProjectStatus } from "@/lib/api/projects";
import { adminRoot, useCampaign, useCampaignContributions } from "../admin-api";
import ListToolbar from "../ListToolbar";
import { CampaignStatusBadge, progressPercent, ProgressBar } from "./campaign-status";

type Tab = "overview" | "contributions";

const contributionStatus: Record<string, { label: string; className: string }> = {
  CONFIRMED: { label: "Paid", className: "bg-success-soft text-success" },
  PENDING: { label: "Pending", className: "bg-warning-soft text-warning" },
  INITIATED: { label: "Pending", className: "bg-warning-soft text-warning" },
  FAILED: { label: "Failed", className: "bg-danger-soft text-crimson" },
  REFUNDED: { label: "Refunded", className: "bg-navy/8 text-steel" },
  PARTIALLY_REFUNDED: { label: "Part refunded", className: "bg-navy/8 text-steel" },
};

function Contributions({ campaignId }: Readonly<{ campaignId: string }>) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useCampaignContributions(campaignId, { page, search: debouncedSearch, status });

  return (
    <section className="overflow-hidden surface-card">
      <ListToolbar
        search={search}
        onSearch={(value) => { setSearch(value); setPage(1); }}
        searchLabel="Search by name, phone or reference"
        status={status}
        onStatus={(value) => { setStatus(value); setPage(1); }}
        statuses={[
          { value: "CONFIRMED", label: "Paid" },
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
        <p className="p-8 text-center text-sm text-steel">
          {search || status ? "No contributions match your search." : "Nobody has contributed to this campaign yet."}
        </p>
      ) : (
        <div className={`overflow-x-auto transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
          <table className="w-full min-w-[680px] text-left">
            <thead className="border-b border-navy/10 bg-stone-light text-[10px] font-semibold uppercase tracking-[0.1em] text-steel">
              <tr>
                <th className="px-5 py-3 font-medium">Contributor</th>
                <th className="px-4 py-3 font-medium">Amount paid</th>
                <th className="px-4 py-3 font-medium">Purpose</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/10">
              {data.items.map((row) => {
                const badge = contributionStatus[row.status] ?? { label: row.status, className: "bg-stone text-steel" };
                return (
                  <tr key={row.id} className="text-sm">
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">{row.contributorName ?? "Anonymous contributor"}</p>
                      <p className="mt-0.5 text-xs text-steel">{row.msisdn ?? row.reference}</p>
                    </td>
                    <td className="px-4 py-4 font-medium text-ink">{formatMoney(row.amount)}</td>
                    <td className="px-4 py-4 text-ink">{row.purposeName ?? "General"}</td>
                    <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}>{badge.label}</span></td>
                    <td className="px-4 py-4 text-xs text-steel">{format(new Date(row.createdAt), "MMM d, yyyy, HH:mm")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={page} totalPages={data.meta.totalPages} total={data.meta.total} label="contributions" onPageChange={setPage} />}
    </section>
  );
}

export default function CampaignDetails({ campaignId }: Readonly<{ campaignId: string }>) {
  const { data: campaign, isPending, isError, error, refetch } = useCampaign(campaignId);
  const [tab, setTab] = useState<Tab>("overview");
  const queryClient = useQueryClient();
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState("");

  async function review(status: "PUBLISHED" | "DRAFT") {
    setReviewing(true);
    setReviewError("");
    try {
      await updateProjectStatus(campaignId, status);
      await queryClient.invalidateQueries({ queryKey: adminRoot });
    } catch (err) {
      setReviewError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Could not update this campaign.");
    } finally {
      setReviewing(false);
    }
  }

  const back = (
    <Link href="/admin/campaigns" className="inline-flex items-center gap-2 text-sm font-medium text-steel hover:text-navy">
      <ArrowLeft size={16} />
      Back to campaigns
    </Link>
  );

  if (isPending) {
    return <div className="w-full space-y-6">{back}<Skeleton className="h-28 rounded-xl" /><Skeleton className="h-64 rounded-xl" /></div>;
  }
  if (isError) {
    const notFound = (error as { status?: number }).status === 404;
    return (
      <div className="w-full space-y-6">
        {back}
        <ErrorNote message={notFound ? "This campaign could not be found." : (error as { message?: string }).message} onRetry={notFound ? undefined : () => refetch()} />
      </div>
    );
  }

  const percent = progressPercent(campaign.raised, campaign.targetAmount);
  const tabButton = (name: Tab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(name)}
      className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium ${tab === name ? "border-gold text-navy" : "border-transparent text-steel hover:text-navy"}`}
    >
      {label}
    </button>
  );

  const details: [string, string][] = [
    ["Host", campaign.hostName],
    ["Event code", campaign.eventCode],
    ["Created", format(new Date(campaign.createdAt), "MMM d, yyyy, HH:mm")],
    ...(campaign.startDate ? ([["Starts", format(new Date(campaign.startDate), "MMM d, yyyy")]] as [string, string][]) : []),
    ...(campaign.endDate ? ([["Ends", format(new Date(campaign.endDate), "MMM d, yyyy")]] as [string, string][]) : []),
    ["Currency", campaign.currency],
  ];

  return (
    <div className="w-full space-y-6">
      {back}

      <section className="surface-card p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-navy">{campaign.name}</h1>
              <CampaignStatusBadge status={campaign.status} />
            </div>
            <p className="mt-1 text-sm text-steel">
              Created by{" "}
              <Link href={`/admin/users/${campaign.hostId}`} className="font-medium text-ink hover:text-gold">{campaign.hostName}</Link>
            </p>
          </div>
        </div>
        {campaign.status === "PENDING_REVIEW" && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#f0d3ae] bg-[#fdf6ea] p-4">
            <p className="text-sm text-ink">This campaign is waiting for your approval before it can accept contributions.</p>
            <div className="flex gap-2">
              <button type="button" disabled={reviewing} onClick={() => review("DRAFT")} className="rounded-lg border border-navy/15 px-4 py-2 text-sm font-medium text-navy hover:bg-white disabled:opacity-50">Send back</button>
              <button type="button" disabled={reviewing} onClick={() => review("PUBLISHED")} className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90 disabled:opacity-50">Approve &amp; publish</button>
            </div>
            {reviewError && <p className="w-full text-sm text-crimson">{reviewError}</p>}
          </div>
        )}
        {percent !== null && (
          <div className="mt-5 max-w-xl">
            <ProgressBar percent={percent} />
            <p className="mt-1.5 text-xs text-steel">{percent}% of {formatMoney(campaign.targetAmount!)} target</p>
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total raised" value={formatMoney(campaign.raised)} icon={CircleDollarSign} accent="green" />
        <MetricCard label="Contributors" value={formatCount(campaign.contributors)} icon={Users} accent="blue" />
        <MetricCard label="Contributions" value={formatCount(campaign.transactions)} icon={ReceiptText} accent="purple" />
        <MetricCard label="Average gift" value={formatMoney(campaign.averageAmount)} icon={TrendingUp} accent="gold" />
      </section>

      <nav aria-label="Campaign sections" className="flex gap-6 border-b border-navy/10">
        {tabButton("overview", "Overview")}
        {tabButton("contributions", "Contributions")}
      </nav>

      {tab === "overview" ? (
        <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <article className="surface-card p-5 shadow-sm md:p-6">
            <h2 className="font-semibold text-navy">About this campaign</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-ink">{campaign.description || "The host has not added a description."}</p>
          </article>
          <article className="self-start surface-card p-5 shadow-sm md:p-6">
            <h2 className="font-semibold text-navy">Details</h2>
            <dl className="mt-3 divide-y divide-navy/10 text-sm">
              {details.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-3">
                  <dt className="text-steel">{label}</dt>
                  <dd className="text-right font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </article>
        </section>
      ) : (
        <Contributions campaignId={campaignId} />
      )}
    </div>
  );
}
