"use client";

import {
  CircleDollarSign,
  Layers,
  Megaphone,
  UserRound,
  Clock3,
  Check,
  X,
  Loader2,
  AlertCircle,
  ExternalLink,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MetricCard from "@/components/ui/MetricCard";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatCount, formatMoney } from "@/lib/format";
import { useCampaigns, useUpdateCampaignStatus, type Fund } from "../admin-api";
import ListToolbar from "../ListToolbar";
import { CampaignStatusBadge, progressPercent, ProgressBar } from "./campaign-status";
import {
  ConfigureStepsDrawer,
  type ConfigurableCampaign,
} from "@/components/features/host/campaigns/ConfigureStepsDrawer";
import AdminCreateCampaignModal from "./AdminCreateCampaignModal";

/** Statuses where an admin can open the USSD steps editor. */
const CONFIGURABLE_STATUSES = ["PENDING_REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED"];

/** Three cards per row on wide screens, so page in threes. */
const CARDS_PER_PAGE = 9;

export default function AdminCampaigns() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [reviewingCampaign, setReviewingCampaign] = useState<Fund | null>(null);
  const [reviewAction, setReviewAction] = useState<"APPROVE" | "REJECT">("APPROVE");
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewCommission, setReviewCommission] = useState<number | string>(14);
  const [configuringCampaign, setConfiguringCampaign] = useState<ConfigurableCampaign | null>(null);
  const [creating, setCreating] = useState(false);

  const debouncedSearch = useDebouncedValue(search);
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useCampaigns({
    page,
    search: debouncedSearch,
    status,
    limit: CARDS_PER_PAGE,
  });

  const updateStatusMutation = useUpdateCampaignStatus();

  const counts = data?.meta.counts;
  const dash = "–";

  function openReview(e: React.MouseEvent, campaign: Fund, action: "APPROVE" | "REJECT") {
    e.preventDefault();
    e.stopPropagation();
    setReviewingCampaign(campaign);
    setReviewAction(action);
    setReviewNotes("");
    setReviewCommission(campaign.commissionPercentage ? Number(campaign.commissionPercentage) : 14);
  }

  async function handleConfirmReview(configureAfterApprove = false) {
    if (!reviewingCampaign) return;
    const targetCampaign = reviewingCampaign;
    try {
      await updateStatusMutation.mutateAsync({
        id: targetCampaign.id,
        status: reviewAction === "APPROVE" ? "PUBLISHED" : "REJECTED",
        notes: reviewNotes.trim() || undefined,
        commissionPercentage: reviewAction === "APPROVE" ? Number(reviewCommission) : undefined,
      });
      setReviewingCampaign(null);
      if (reviewAction === "APPROVE" && configureAfterApprove) {
        setConfiguringCampaign(targetCampaign);
      }
    } catch {
      // Error is toasted by mutation
    }
  }

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy md:text-3xl">Campaigns</h1>
          <p className="mt-2 text-sm text-steel">
            Review host campaigns, approve them for the live USSD network, and monitor overall fundraising progress.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-steel"
        >
          <Plus size={18} aria-hidden="true" />
          Create campaign
        </button>
      </section>

      {/* Metric Cards including Pending Review */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total raised"
          value={counts ? formatMoney(counts.raised) : dash}
          icon={CircleDollarSign}
          accent="green"
        />
        <MetricCard
          label="Total campaigns"
          value={counts ? formatCount(counts.total) : dash}
          icon={Layers}
          accent="blue"
        />
        <MetricCard
          label="Pending Review"
          value={counts ? formatCount(counts.pendingReview ?? 0) : dash}
          detail="Awaiting approval to go live"
          icon={Clock3}
          accent="gold"
        />
        <MetricCard
          label="Published (Live)"
          value={counts ? formatCount(counts.published) : dash}
          detail="Collecting contributions"
          icon={Megaphone}
          accent="purple"
        />
      </section>

      <section className="overflow-hidden surface-card">
        <ListToolbar
          search={search}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchLabel="Search by name or event code"
          status={status}
          onStatus={(value) => {
            setStatus(value);
            setPage(1);
          }}
          statuses={[
            { value: "PENDING_REVIEW", label: "Pending Review" },
            { value: "APPROVED", label: "Approved" },
            { value: "SCHEDULED", label: "Upcoming" },
            { value: "PUBLISHED", label: "Published" },
            { value: "REJECTED", label: "Rejected" },
            { value: "SUSPENDED", label: "Suspended" },
          ]}
          extraControls={
            <div
              className="flex items-center rounded-xl border border-navy/15 bg-white p-1 shrink-0"
              role="group"
              aria-label="Toggle view mode"
            >
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${viewMode === "list"
                    ? "bg-navy text-white shadow-xs"
                    : "text-steel hover:text-navy"
                  }`}
                aria-pressed={viewMode === "list"}
                title="List view"
              >
                <List size={15} />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${viewMode === "grid"
                    ? "bg-navy text-white shadow-xs"
                    : "text-steel hover:text-navy"
                  }`}
                aria-pressed={viewMode === "grid"}
                title="Grid view"
              >
                <LayoutGrid size={15} />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          }
        />

        <div className="p-4 md:p-5">
          {isPending ? (
            viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <Skeleton key={i} className="h-44 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            )
          ) : isError ? (
            <ErrorNote
              message={(error as { message?: string }).message}
              onRetry={() => refetch()}
            />
          ) : data.items.length === 0 ? (
            <p className="py-8 text-center text-sm text-steel">
              {search || status
                ? "No campaigns match your search."
                : "No campaigns yet. Campaigns submitted by hosts will appear here."}
            </p>
          ) : viewMode === "list" ? (
            /* Admin Campaigns List (Table) View */
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-navy/10 bg-stone-light/50 text-xs font-semibold text-steel">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">
                      Campaign
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Host
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Raised / Target
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Contributions
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/10">
                  {data.items.map((campaign) => {
                    const percent = progressPercent(campaign.raised, campaign.targetAmount);
                    const isPendingReview = campaign.status === "PENDING_REVIEW";

                    return (
                      <tr
                        key={campaign.id}
                        className={`transition-colors hover:bg-stone-light/40 ${isPendingReview ? "bg-amber-50/30" : ""
                          }`}
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/admin/campaigns/${campaign.id}`}
                            className="font-semibold text-navy hover:text-gold transition-colors block text-sm"
                          >
                            {campaign.name}
                          </Link>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="text-xs text-steel font-mono">*920*969*{campaign.eventCode}#</span>
                            <span className="inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200/60">
                              {campaign.commissionPercentage ?? "14"}% fee
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-navy">
                          <div className="flex items-center gap-1.5">
                            <UserRound size={14} className="text-steel" />
                            <span className="truncate max-w-[140px]">{campaign.hostName}</span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-semibold text-sm text-navy">
                            {formatMoney(campaign.raised)}
                          </p>
                          {percent !== null ? (
                            <div className="mt-1 flex items-center gap-2 max-w-[140px]">
                              <ProgressBar percent={percent} />
                              <span className="text-[11px] text-steel shrink-0">{percent}%</span>
                            </div>
                          ) : (
                            <span className="text-xs text-steel">No target</span>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <CampaignStatusBadge status={campaign.status} />
                        </td>

                        <td className="px-4 py-4 text-sm text-steel">
                          {formatCount(campaign.transactions)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isPendingReview && (
                              <>
                                <button
                                  type="button"
                                  onClick={(e) => openReview(e, campaign, "APPROVE")}
                                  disabled={updateStatusMutation.isPending}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-800 transition-colors shadow-xs"
                                  title="Approve campaign"
                                >
                                  <Check size={13} />
                                  <span>Approve</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => openReview(e, campaign, "REJECT")}
                                  disabled={updateStatusMutation.isPending}
                                  className="inline-flex items-center gap-1 rounded-lg border border-crimson/30 bg-white px-2.5 py-1.5 text-xs font-medium text-crimson hover:bg-crimson/5 transition-colors"
                                  title="Reject campaign"
                                >
                                  <X size={13} />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}
                            {CONFIGURABLE_STATUSES.includes(campaign.status) && (
                              <button
                                type="button"
                                onClick={() => setConfiguringCampaign(campaign)}
                                className="inline-flex items-center gap-1 rounded-lg border border-navy/15 bg-white px-2.5 py-1.5 text-xs font-medium text-navy hover:bg-stone transition-colors shadow-2xs"
                                title="Configure USSD dial flow steps"
                              >
                                <SlidersHorizontal size={12} className="text-steel" />
                                <span>Steps</span>
                              </button>
                            )}
                            <Link
                              href={`/admin/campaigns/${campaign.id}`}
                              className="inline-flex items-center gap-1 rounded-lg border border-navy/15 bg-white px-2.5 py-1.5 text-xs font-medium text-steel hover:text-navy hover:bg-stone transition-colors"
                            >
                              <span>Details</span>
                              <ExternalLink size={12} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Admin Campaigns Grid View */
            <div
              className={`grid gap-4 transition-opacity md:grid-cols-2 xl:grid-cols-3 ${isPlaceholderData ? "opacity-60" : ""
                }`}
            >
              {data.items.map((campaign) => {
                const percent = progressPercent(campaign.raised, campaign.targetAmount);
                const isPendingReview = campaign.status === "PENDING_REVIEW";

                return (
                  <div
                    key={campaign.id}
                    className={`flex flex-col rounded-xl border bg-white p-5 transition hover:shadow-md ${isPendingReview
                        ? "border-amber-300/80 bg-amber-50/20 shadow-sm"
                        : "border-navy/10 hover:border-navy/25"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/admin/campaigns/${campaign.id}`}
                          className="truncate font-semibold text-navy hover:text-gold transition-colors block"
                        >
                          {campaign.name}
                        </Link>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-xs text-steel font-mono">Code: *920*969*{campaign.eventCode}#</span>
                          <span className="inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200/60">
                            {campaign.commissionPercentage ?? "14"}% fee
                          </span>
                        </div>
                      </div>
                      <CampaignStatusBadge status={campaign.status} />
                    </div>

                    <p className="mt-4 flex items-center gap-2 text-sm text-ink">
                      <UserRound size={15} className="text-steel" />
                      <span className="truncate">{campaign.hostName}</span>
                    </p>

                    <p className="mt-4 text-2xl font-semibold tracking-tight text-navy">
                      {formatMoney(campaign.raised)}
                    </p>
                    <div className="mt-2">
                      {percent === null ? (
                        <p className="text-xs text-steel">No target set</p>
                      ) : (
                        <>
                          <ProgressBar percent={percent} />
                          <p className="mt-1.5 text-xs text-steel">
                            {percent}% of {formatMoney(campaign.targetAmount!)}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Pending Review Admin Action Banner */}
                    {isPendingReview && (
                      <div className="mt-4 rounded-lg bg-amber-100/70 p-3 border border-amber-200/60">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 mb-2">
                          <AlertCircle size={14} className="shrink-0" />
                          <span>Awaiting Admin Approval</span>
                        </div>
                        <p className="text-[11px] text-amber-800/90 leading-relaxed mb-3">
                          Review this host campaign to approve it for the live USSD network.
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => openReview(e, campaign, "APPROVE")}
                            disabled={updateStatusMutation.isPending}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-800 transition-colors shadow-sm"
                          >
                            <Check size={13} />
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={(e) => openReview(e, campaign, "REJECT")}
                            disabled={updateStatusMutation.isPending}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-crimson/30 bg-white px-3 py-1.5 text-xs font-medium text-crimson hover:bg-crimson/5 transition-colors"
                          >
                            <X size={13} />
                            Reject
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-navy/10 text-xs text-steel">
                      <span>{formatCount(campaign.transactions)} contributions</span>
                      <div className="flex items-center gap-2">
                        {CONFIGURABLE_STATUSES.includes(campaign.status) && (
                          <button
                            type="button"
                            onClick={() => setConfiguringCampaign(campaign)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-steel hover:text-navy transition-colors"
                            title="Configure USSD dial steps"
                          >
                            <SlidersHorizontal size={12} />
                            <span>Steps</span>
                          </button>
                        )}
                        <Link
                          href={`/admin/campaigns/${campaign.id}`}
                          className="inline-flex items-center gap-1 text-steel hover:text-navy transition-colors font-medium"
                        >
                          Details <ExternalLink size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {data && (
          <Pagination
            page={page}
            totalPages={data.meta.totalPages}
            total={data.meta.total}
            pageSize={CARDS_PER_PAGE}
            label="campaigns"
            onPageChange={setPage}
          />
        )}
      </section>

      {/* Review & Approve / Reject Modal */}
      {reviewingCampaign && (
        <Modal
          title={
            reviewAction === "APPROVE"
              ? "Approve Campaign & Go Live"
              : "Reject Campaign"
          }
          onClose={() => setReviewingCampaign(null)}
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => setReviewingCampaign(null)}
                disabled={updateStatusMutation.isPending}
                className="rounded-xl border border-navy/20 bg-white px-4 py-2 text-sm font-medium hover:bg-stone disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              {reviewAction === "APPROVE" ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleConfirmReview(true)}
                    disabled={updateStatusMutation.isPending}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600/40 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
                  >
                    <SlidersHorizontal size={14} className="text-emerald-700" />
                    Approve &amp; Configure Steps
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmReview(false)}
                    disabled={updateStatusMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 transition-colors shadow-sm"
                  >
                    {updateStatusMutation.isPending ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check size={15} />
                        Confirm Approval &amp; Go Live
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => handleConfirmReview(false)}
                  disabled={updateStatusMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-crimson px-4 py-2 text-sm font-medium text-white hover:bg-crimson/90 transition-colors shadow-sm"
                >
                  {updateStatusMutation.isPending ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <X size={15} />
                      Confirm Rejection
                    </>
                  )}
                </button>
              )}
            </div>
          }
        >
          <div className="space-y-4">
            <div className="rounded-xl bg-stone-light p-3.5 border border-navy/10 space-y-1.5 text-xs text-steel">
              <p>
                <strong className="text-navy">Campaign:</strong> {reviewingCampaign.name}
              </p>
              <p>
                <strong className="text-navy">Host:</strong> {reviewingCampaign.hostName}
              </p>
              <p>
                <strong className="text-navy">USSD Code:</strong> *920*969*
                {reviewingCampaign.eventCode}#
              </p>
              {reviewingCampaign.requestedCode && (
                <p>
                  <strong className="text-navy">Requested Code:</strong>{" "}
                  <span className="font-mono">{reviewingCampaign.requestedCode}</span>{" "}
                  <span className="text-steel">(host asked for a special code)</span>
                </p>
              )}
              {reviewingCampaign.targetAmount && (
                <p>
                  <strong className="text-navy">Target:</strong>{" "}
                  {formatMoney(reviewingCampaign.targetAmount)}
                </p>
              )}
              {reviewingCampaign.commissionPercentage && (
                <p>
                  <strong className="text-navy">Configured Commission:</strong>{" "}
                  {reviewingCampaign.commissionPercentage}%
                </p>
              )}
            </div>

            {reviewAction === "APPROVE" ? (
              <p className="text-xs text-steel leading-relaxed">
                Approving this campaign will set its status to{" "}
                <strong className="text-navy">Published</strong>. It will immediately begin accepting
                Mobile Money contributions on the live USSD network under code{" "}
                <strong className="text-navy font-mono">
                  *920*969*{reviewingCampaign.eventCode}#
                </strong>
                .
              </p>
            ) : (
              <p className="text-xs text-steel leading-relaxed">
                Rejecting this campaign will set its status to{" "}
                <strong className="text-navy">Rejected</strong>. The host will be notified to
                make necessary corrections before re-submitting.
              </p>
            )}

            {reviewAction === "APPROVE" && (
              <div>
                <label htmlFor="review-commission" className="text-xs font-semibold text-navy flex items-center justify-between mb-1">
                  <span>Commission Percentage (%) *</span>
                  <span className="text-[11px] font-normal text-steel">Standard default: 14%</span>
                </label>
                <div className="relative">
                  <input
                    id="review-commission"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={reviewCommission}
                    onChange={(e) => setReviewCommission(e.target.value)}
                    placeholder="14"
                    className="w-full rounded-xl border border-navy/20 bg-white px-3 py-2 pr-8 text-xs font-semibold text-navy focus:border-navy focus:outline-none"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-steel">
                    %
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-steel">
                  Platform fee charged on contributions received for this campaign. Differing rates can be specified per campaign.
                </p>
              </div>
            )}

            <div>
              <label htmlFor="review-notes" className="text-xs font-semibold text-navy block mb-1">
                {reviewAction === "APPROVE"
                  ? "Admin Notes (Optional)"
                  : "Rejection Reason / Feedback for Host *"}
              </label>
              <textarea
                id="review-notes"
                rows={3}
                placeholder={
                  reviewAction === "APPROVE"
                    ? "Optional note regarding campaign verification or approval..."
                    : "Explain what the host needs to revise or correct..."
                }
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full rounded-xl border border-navy/20 bg-white px-3 py-2 text-xs text-navy focus:border-navy focus:outline-none"
              />
            </div>
          </div>
        </Modal>
      )}

      {creating && (
        <AdminCreateCampaignModal
          onClose={() => setCreating(false)}
          onCreated={(campaign, configureSteps) => {
            setCreating(false);
            if (configureSteps) setConfiguringCampaign(campaign);
          }}
        />
      )}

      {/* Configure USSD Dial Steps Drawer for Admin */}
      <ConfigureStepsDrawer
        campaign={configuringCampaign}
        open={Boolean(configuringCampaign)}
        onClose={() => setConfiguringCampaign(null)}
      />
    </div>
  );
}
