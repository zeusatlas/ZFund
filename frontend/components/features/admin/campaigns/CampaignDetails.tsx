"use client";

import { format } from "date-fns";
import {
  ArrowLeft,
  CircleDollarSign,
  ReceiptText,
  TrendingUp,
  Users,
  Check,
  X,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MetricCard from "@/components/ui/MetricCard";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatCount, formatMoney } from "@/lib/format";
import { useCampaign, useCampaignContributions, useUpdateCampaignStatus } from "../admin-api";
import ListToolbar from "../ListToolbar";
import { CampaignStatusBadge, progressPercent, ProgressBar } from "./campaign-status";
import { ConfigureStepsDrawer } from "@/components/features/host/campaigns/ConfigureStepsDrawer";

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
        onSearch={(value: string) => { setSearch(value); setPage(1); }}
        searchLabel="Search by name, phone or reference"
        status={status}
        onStatus={(value: string) => { setStatus(value); setPage(1); }}
        statuses={[
          { label: "Paid", value: "CONFIRMED" },
          { label: "Pending", value: "PENDING" },
          { label: "Failed", value: "FAILED" },
          { label: "Refunded", value: "REFUNDED" },
        ]}
      />

      {isPending ? (
        <div className="space-y-3 p-4"><Skeleton className="h-10 rounded-xl" /><Skeleton className="h-10 rounded-xl" /><Skeleton className="h-10 rounded-xl" /></div>
      ) : isError ? (
        <div className="p-4"><ErrorNote message={(error as { message?: string }).message} onRetry={() => refetch()} /></div>
      ) : data.items.length === 0 ? (
        <p className="py-8 text-center text-sm text-steel">No contributions match the filter.</p>
      ) : (
        <div className={`overflow-x-auto ${isPlaceholderData ? "opacity-60" : ""}`}>
          <table className="w-full text-left">
            <thead className="border-b border-navy/10 bg-stone-light/50 text-xs font-semibold text-steel">
              <tr>
                <th scope="col" className="px-4 py-3">Reference</th>
                <th scope="col" className="px-4 py-3">Donor</th>
                <th scope="col" className="px-4 py-3">Phone</th>
                <th scope="col" className="px-4 py-3">Amount</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/10 text-sm">
              {data.items.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-stone-light/40">
                  <td className="px-4 py-3 font-mono text-xs text-navy">{row.reference}</td>
                  <td className="px-4 py-3 font-medium text-navy">{row.contributorName || "Anonymous"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-steel">{row.msisdn}</td>
                  <td className="px-4 py-3 font-semibold text-navy">{formatMoney(row.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${contributionStatus[row.status]?.className ?? "bg-navy/8 text-steel"}`}>
                      {contributionStatus[row.status]?.label ?? row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-steel">{format(new Date(row.createdAt), "MMM d, yyyy, HH:mm")}</td>
                </tr>
              ))}
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
  const updateStatusMutation = useUpdateCampaignStatus();
  const [tab, setTab] = useState<Tab>("overview");
  const [rejecting, setRejecting] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const [configuringFlow, setConfiguringFlow] = useState(false);

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

          {campaign.status === "PENDING_REVIEW" ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await updateStatusMutation.mutateAsync({ id: campaign.id, status: "PUBLISHED" });
                    setConfiguringFlow(true);
                  } catch {
                    // Handled by toast
                  }
                }}
                disabled={updateStatusMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/40 bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs disabled:opacity-50"
              >
                <SlidersHorizontal size={13} className="text-emerald-700" />
                Approve &amp; Configure Steps
              </button>
              <button
                type="button"
                onClick={() => updateStatusMutation.mutate({ id: campaign.id, status: "PUBLISHED" })}
                disabled={updateStatusMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-800 transition-colors shadow-sm disabled:opacity-50"
              >
                {updateStatusMutation.isPending ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Check size={13} />
                )}
                Approve &amp; Go Live
              </button>
              <button
                type="button"
                onClick={() => setRejecting(true)}
                disabled={updateStatusMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-crimson/30 bg-white px-4 py-2 text-xs font-medium text-crimson hover:bg-crimson/5 transition-colors disabled:opacity-50"
              >
                <X size={13} />
                Reject
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setConfiguringFlow(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-navy/15 bg-white px-3.5 py-2 text-xs font-medium text-navy hover:bg-stone hover:border-navy/30 transition-colors shadow-2xs"
              >
                <SlidersHorizontal size={13} className="text-steel" />
                Configure USSD steps
              </button>
            </div>
          )}
        </div>
        {percent !== null && (
          <div className="mt-5 max-w-xl">
            <ProgressBar percent={percent} />
            <p className="mt-1.5 text-xs text-steel">{percent}% of {formatMoney(campaign.targetAmount!)} target</p>
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total raised" value={formatMoney(campaign.raised)} icon={CircleDollarSign} accent="green" />
        <MetricCard label="Target goal" value={campaign.targetAmount ? formatMoney(campaign.targetAmount) : "None"} icon={TrendingUp} accent="blue" />
        <MetricCard label="Contributions" value={formatCount(campaign.transactions)} icon={ReceiptText} accent="gold" />
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

      {/* Reject Modal */}
      {rejecting && (
        <Modal
          title="Reject Campaign"
          onClose={() => setRejecting(false)}
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => setRejecting(false)}
                disabled={updateStatusMutation.isPending}
                className="rounded-xl border border-navy/20 bg-white px-4 py-2 text-sm font-medium hover:bg-stone disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await updateStatusMutation.mutateAsync({
                      id: campaign.id,
                      status: "REJECTED",
                      notes: rejectNotes.trim() || undefined,
                    });
                    setRejecting(false);
                    refetch();
                  } catch {
                    // Handled by mutation toast
                  }
                }}
                disabled={updateStatusMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-crimson px-4 py-2 text-sm font-medium text-white hover:bg-crimson/90 transition-colors shadow-sm disabled:opacity-50"
              >
                {updateStatusMutation.isPending && (
                  <Loader2 size={15} className="animate-spin" />
                )}
                Confirm Rejection
              </button>
            </div>
          }
        >
          <div className="space-y-3">
            <p className="text-xs text-steel leading-relaxed">
              Rejecting this campaign will set its status to <strong className="text-navy">Rejected</strong>{" "}
              so the host can revise details before resubmitting.
            </p>
            <div>
              <label htmlFor="reject-notes-detail" className="text-xs font-semibold text-navy block mb-1">
                Rejection Reason / Host Feedback
              </label>
              <textarea
                id="reject-notes-detail"
                rows={3}
                placeholder="Explain what the host needs to revise or fix..."
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                className="w-full rounded-xl border border-navy/20 bg-white px-3 py-2 text-xs text-navy focus:border-navy focus:outline-none"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Configure USSD Dial Steps Drawer for Admin */}
      <ConfigureStepsDrawer
        campaign={campaign}
        open={configuringFlow}
        onClose={() => setConfiguringFlow(false)}
      />
    </div>
  );
}
