"use client";

import { useState } from "react";
import {
  Search,
  FolderHeart,
  MapPin,
  PhoneCall,
  Copy,
  Check,
  RotateCcw,
  Loader2,
  FolderPlus,
  Pencil,
  Trash2,
  Eye,
  SlidersHorizontal,
  Send,
  LayoutGrid,
  List,
} from "lucide-react";
import { toast } from "sonner";
import {
  dateLabel,
  money,
  type Campaign,
  type CampaignStatus,
} from "@/components/features/host/shared/demo";
import {
  useCampaignsList,
  useUpdateProjectStatusMutation,
  useDeleteProjectMutation,
} from "@/components/features/host/campaigns/use-campaigns";
import CreateCampaignModal from "@/components/features/host/campaigns/CreateCampaignModal";
import EditCampaignDrawer from "@/components/features/host/campaigns/EditCampaignModal";
import { ConfigureStepsDrawer } from "@/components/features/host/campaigns/ConfigureStepsDrawer";
import Modal from "@/components/ui/Modal";
import RowMenu, { type RowMenuItem } from "@/components/ui/RowMenu";
import Select from "react-select";
import { getSelectStyles } from "@/components/ui/selectStyles";

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "raised", label: "Most raised" },
  { value: "name", label: "Campaign name" },
];

function StatusBadge({
  status,
  rawStatus,
}: {
  status: CampaignStatus;
  rawStatus?: string;
}) {
  let label: string = status;
  let style = "bg-stone text-steel";

  if (rawStatus === "PENDING_REVIEW") {
    label = "In Review";
    style = "bg-amber-50 text-amber-800 border border-amber-200/50";
  } else if (rawStatus === "REJECTED") {
    label = "Rejected";
    style = "bg-crimson/10 text-crimson border border-crimson/20";
  } else if (rawStatus === "SUSPENDED") {
    label = "Suspended";
    style = "bg-crimson/10 text-crimson";
  } else if (status === "Upcoming" || rawStatus === "SCHEDULED") {
    label = "Upcoming";
    style = "bg-sky-50 text-sky-800 border border-sky-200/60";
  } else if (status === "Active" || rawStatus === "PUBLISHED" || rawStatus === "APPROVED") {
    label = "Active";
    style = "bg-success-soft text-success";
  } else if (status === "Completed" || rawStatus === "COMPLETED") {
    label = "Completed";
    style = "bg-navy/10 text-navy";
  } else if (status === "Draft" || rawStatus === "DRAFT") {
    label = "Draft";
    style = "bg-stone text-steel border border-navy/10";
  }

  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium " +
        style
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export default function CampaignList({ compact = false }: { compact?: boolean }) {
  const { campaigns, isLoading, isError, error, refetch } = useCampaignsList();
  const updateStatusMutation = useUpdateProjectStatusMutation();
  const deleteMutation = useDeleteProjectMutation();

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);
  const [configuringFlowCampaign, setConfiguringFlowCampaign] = useState<Campaign | null>(null);

  function getCampaignMenuItems(campaign: Campaign): RowMenuItem[] {
    const isDraftOrRejected =
      campaign.status === "Draft" ||
      campaign.rawStatus === "DRAFT" ||
      campaign.rawStatus === "REJECTED";

    const items: RowMenuItem[] = [
      {
        label: "View details",
        icon: <Eye size={14} className="text-steel" />,
        onSelect: () => setViewingCampaign(campaign),
      },
      {
        label: "Configure steps",
        icon: <SlidersHorizontal size={14} className="text-steel" />,
        onSelect: () => setConfiguringFlowCampaign(campaign),
      },
    ];

    if (isDraftOrRejected) {
      items.push(
        {
          label: "Submit for review",
          icon: <Send size={14} className="text-steel" />,
          onSelect: () => handleSubmitForReview(campaign),
        },
        {
          label: "Edit campaign",
          icon: <Pencil size={14} className="text-steel" />,
          onSelect: () => setEditingCampaign(campaign),
        },
        {
          label: "Delete campaign",
          icon: <Trash2 size={14} className="text-crimson" />,
          danger: true,
          onSelect: () => setDeletingCampaign(campaign),
        }
      );
    }

    return items;
  }

  function handleCopyUssd(e: React.MouseEvent, id: string, code: string) {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`*920*969*${code}#`);
    setCopiedId(id);
    toast.success(`Copied dial string *920*969*${code}# to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleSubmitForReview(campaign: Campaign) {
    try {
      await updateStatusMutation.mutateAsync({
        id: campaign.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        status: "PENDING_REVIEW" as any,
      });
      toast.success(
        `Campaign "${campaign.name}" submitted for admin review! You'll be notified when approved.`
      );
      refetch();
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiErr = err as any;
      const msg =
        apiErr?.response?.data?.message ||
        apiErr?.message ||
        "Failed to submit campaign for review.";
      toast.error(msg);
    }
  }

  async function confirmDelete() {
    if (!deletingCampaign) return;
    try {
      await deleteMutation.mutateAsync(deletingCampaign.id);
      toast.success(`Campaign "${deletingCampaign.name}" deleted successfully.`);
      setDeletingCampaign(null);
      refetch();
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiErr = err as any;
      const msg =
        apiErr?.response?.data?.message ||
        apiErr?.message ||
        "Failed to delete campaign from database.";
      toast.error(msg);
    }
  }

  const filtered = campaigns
    .filter(
      (campaign) =>
        (status === "All" || campaign.status === status) &&
        [
          campaign.name,
          campaign.location,
          campaign.id,
          campaign.category,
          campaign.eventCode || "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "raised") {
        return (b.raised || 0) - (a.raised || 0);
      }
      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }
      return (b.created || "").localeCompare(a.created || "");
    });

  const visible = compact
    ? campaigns.filter((campaign) => campaign.status === "Active")
    : filtered;

  return (
    <div>
      {!compact && (
        <div className="mb-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium text-navy">All Campaigns</h2>
              <p className="text-sm text-steel">
                Every campaign stored in your database. Dial strings connect directly to live USSD mobile money routing.
              </p>
            </div>
            <CreateCampaignModal
              onCreated={() => {
                setQuery("");
                setStatus("All");
                setSort("newest");
                refetch();
              }}
            />
          </div>

          {isError && (
            <div className="rounded-xl border border-crimson/20 bg-crimson/5 p-4 text-sm text-crimson flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Database connection error</p>
                <p className="text-xs text-crimson/80 mt-0.5">
                  {(error as Error)?.message || "Failed to communicate with the database."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-crimson px-3 py-1.5 text-xs font-medium text-white hover:bg-crimson/90"
              >
                <RotateCcw size={13} />
                Retry
              </button>
            </div>
          )}

          {/* Search, Sort and View Mode Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute left-4 top-3.5 text-steel"
              />
              <label htmlFor="campaign-search" className="sr-only">
                Search campaigns
              </label>
              <input
                id="campaign-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, location, category or USSD code"
                className="field py-3 pl-11 pr-4"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-full sm:w-48">
                <label htmlFor="campaign-sort" className="sr-only">
                  Sort campaigns
                </label>
                <Select
                  inputId="campaign-sort"
                  instanceId="campaign-sort-select"
                  value={sortOptions.find((opt) => opt.value === sort)}
                  onChange={(opt) => {
                    if (opt) setSort(opt.value);
                  }}
                  options={sortOptions}
                  isSearchable={false}
                  styles={getSelectStyles({ minHeight: "46px" })}
                  aria-label="Sort campaigns"
                />
              </div>

              {/* Grid vs List View Toggle */}
              <div
                className="flex items-center rounded-xl border border-navy/15 bg-white p-1 shrink-0"
                role="group"
                aria-label="Toggle view mode"
              >
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${viewMode === "list"
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
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${viewMode === "grid"
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
            </div>
          </div>

          <div
            className="flex flex-wrap items-center justify-center gap-2"
            role="group"
            aria-label="Filter by campaign status"
          >
            {["All", "Active", "Upcoming", "Completed", "Draft"].map((filter) => {
              const count =
                filter === "All"
                  ? campaigns.length
                  : campaigns.filter((c) => c.status === filter).length;
              return (
                <button
                  type="button"
                  key={filter}
                  aria-pressed={status === filter}
                  onClick={() => setStatus(filter)}
                  className={
                    "rounded-full px-4 py-2 text-sm transition-colors " +
                    (status === filter
                      ? "bg-navy text-white shadow-sm"
                      : "border border-navy/10 bg-white text-steel hover:bg-stone hover:text-navy")
                  }
                >
                  {filter} <span className="ml-2 opacity-75">{count}</span>
                </button>
              );
            })}
          </div>

          <p role="status" className="text-center text-sm text-steel">
            Showing {filtered.length} of {campaigns.length} campaigns
          </p>
        </div>
      )}

      {/* Main Campaign Content (Loading / Empty / List / Grid) */}
      {isLoading && campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-navy/10 bg-white p-14 text-center text-steel shadow-xs">
          <Loader2 size={32} className="animate-spin text-navy" />
          <p className="mt-3 text-sm font-medium text-navy">Loading campaigns from database...</p>
          <p className="mt-1 text-xs text-steel">Querying PostgreSQL project records</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-2xl border border-navy/10 bg-white px-6 py-16 text-center shadow-xs">
          <FolderPlus aria-hidden="true" size={36} className="mx-auto mb-3 text-gold" />
          <h3 className="text-lg font-medium text-navy">No campaigns found in database</h3>
          <p className="mt-1.5 text-sm text-steel max-w-md mx-auto">
            You haven&apos;t created any campaigns yet. Start a campaign to generate a dedicated USSD dial code and begin collecting Mobile Money contributions.
          </p>
          <div className="mt-5">
            <CreateCampaignModal
              onCreated={() => {
                refetch();
              }}
            />
          </div>
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-navy/10 bg-white px-6 py-16 text-center shadow-xs">
          {compact ? (
            <FolderPlus aria-hidden="true" size={32} className="mx-auto mb-3 text-gold" />
          ) : (
            <Search aria-hidden="true" size={28} className="mx-auto mb-4 text-steel" />
          )}
          <h3 className="text-lg font-medium text-navy">
            {compact
              ? "No active campaigns currently in motion"
              : "No campaigns match your search"}
          </h3>
          <p className="mt-2 text-sm text-steel">
            {compact
              ? "You have campaigns in your database, but none are currently collecting contributions. Publish a draft or start a new campaign."
              : "Try another name, USSD code, or choose a different status filter."}
          </p>
          {!compact && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStatus("All");
              }}
              className="mt-5 btn-primary"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* Grid List View */
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((campaign) => {
            const raised = campaign.raised ?? 0;
            const contributors = campaign.contributors ?? 0;
            const hasGoal = campaign.goal > 0;
            const percent = hasGoal
              ? Math.min(100, Math.round((raised / campaign.goal) * 100))
              : 0;

            return (
              <div
                key={campaign.id}
                onClick={() => setViewingCampaign(campaign)}
                className="group flex flex-col justify-between rounded-0 border border-navy/10 bg-white p-5 shadow-xs hover:border-navy/25 hover:shadow-md transition-all cursor-pointer"
              >
                <div>
                  {/* Card Top: Category, Status & Ellipsis Menu */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-steel uppercase tracking-wider truncate max-w-[140px]">
                      {campaign.category}
                    </span>
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <StatusBadge
                        status={campaign.status}
                        rawStatus={campaign.rawStatus}
                      />
                      <RowMenu
                        label={`Actions for ${campaign.name}`}
                        items={getCampaignMenuItems(campaign)}
                      />
                    </div>
                  </div>

                  {/* Title & USSD Code */}
                  <h3 className="font-semibold text-navy group-hover:text-gold transition-colors text-base line-clamp-1">
                    {campaign.name}
                  </h3>

                  {campaign.location && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-steel">
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate">{campaign.location}</span>
                    </p>
                  )}

                  {campaign.eventCode && (
                    <div
                      className="mt-3 flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy/5 px-2.5 py-1 text-xs font-mono font-medium text-navy border border-navy/10">
                        <PhoneCall size={12} className="text-gold" />
                        *920*969*{campaign.eventCode}#
                      </span>
                      <button
                        type="button"
                        onClick={(e) =>
                          handleCopyUssd(e, campaign.id, campaign.eventCode!)
                        }
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-steel hover:text-navy transition-colors"
                        title="Copy USSD Code"
                      >
                        {copiedId === campaign.id ? (
                          <span className="text-emerald-700 flex items-center gap-0.5 font-semibold">
                            <Check size={12} /> Copied!
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            <Copy size={12} /> Copy
                          </span>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Financial Stats in Card */}
                  <div className="mt-5">
                    <div className="flex items-baseline justify-between">
                      <p className="text-2xl font-bold tracking-tight text-navy">
                        {money(raised)}
                      </p>
                      <span className="text-xs font-semibold text-success">
                        Net: {money(Math.round(raised * 0.86))}
                      </span>
                    </div>
                    <p className="text-[11px] text-steel">Gross raised · 86% net payout</p>
                    <div className="mt-2">
                      <progress
                        aria-label={campaign.name + " progress"}
                        value={raised}
                        max={hasGoal ? campaign.goal : 100}
                        className="block h-1.5 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-stone [&::-webkit-progress-value]:bg-gold [&::-moz-progress-bar]:bg-gold"
                      />
                      <p className="mt-1.5 text-xs text-steel">
                        {hasGoal ? `${percent}% of ${money(campaign.goal)}` : "Open goal"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Contributors count and created date */}
                <div className="mt-5 pt-3.5 border-t border-navy/10 flex items-center justify-between text-xs text-steel">
                  <span>
                    {contributors} {contributors === 1 ? "contributor" : "contributors"}
                  </span>
                  <span className="text-[11px]">
                    {campaign.created ? dateLabel(campaign.created) : "Recently"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Regular List View */
        <div className="overflow-hidden rounded-0 border border-navy/10 bg-white shadow-xs">
          {visible.map((campaign) => {
            const raised = campaign.raised ?? 0;
            const contributors = campaign.contributors ?? 0;
            const hasGoal = campaign.goal > 0;
            const percent = hasGoal
              ? Math.min(100, Math.round((raised / campaign.goal) * 100))
              : 0;

            return (
              <div
                key={campaign.id}
                onClick={() => setViewingCampaign(campaign)}
                className="group border-b border-navy/10 last:border-b-0 p-5 transition-colors hover:bg-stone-light/60 cursor-pointer md:p-6"
              >
                <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(180px,1fr)_160px]">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone text-navy sm:flex">
                      <FolderHeart aria-hidden="true" size={21} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-navy truncate group-hover:text-gold transition-colors">
                        {campaign.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-steel">{campaign.category}</p>

                      {/* USSD Dial String Badge */}
                      {campaign.eventCode && (
                        <div
                          className="mt-2 flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy/5 px-2.5 py-1 text-xs font-mono font-medium text-navy border border-navy/10">
                            <PhoneCall size={12} className="text-gold" />
                            *920*969*{campaign.eventCode}#
                          </span>
                          <button
                            type="button"
                            onClick={(e) =>
                              handleCopyUssd(e, campaign.id, campaign.eventCode!)
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-steel hover:text-navy transition-colors"
                            title="Copy USSD Code"
                          >
                            {copiedId === campaign.id ? (
                              <span className="text-emerald-700 flex items-center gap-0.5 font-semibold">
                                <Check size={12} /> Copied!
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5">
                                <Copy size={12} /> Copy
                              </span>
                            )}
                          </button>
                        </div>
                      )}

                      {campaign.location && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-steel">
                          <MapPin aria-hidden="true" size={12} />
                          {campaign.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress & Raised */}
                  <div>
                    <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <span className="text-sm font-semibold tabular-nums text-navy">
                          {money(raised)}
                        </span>
                        <span className="ml-2 text-xs font-medium text-success">
                          Net: {money(Math.round(raised * 0.86))}
                        </span>
                      </div>
                      {hasGoal && (
                        <span className="text-xs tabular-nums text-steel">{percent}%</span>
                      )}
                    </div>
                    <progress
                      aria-label={campaign.name + " fundraising progress"}
                      value={raised}
                      max={hasGoal ? campaign.goal : 100}
                      className="block h-1.5 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-stone [&::-webkit-progress-value]:bg-gold [&::-moz-progress-bar]:bg-gold"
                    />
                    <p className="mt-2 text-xs text-steel">
                      {hasGoal ? `of ${money(campaign.goal)} goal` : "Open goal"} ·{" "}
                      {contributors} {contributors === 1 ? "contributor" : "contributors"}
                    </p>
                  </div>

                  {/* Status & Ellipsis Menu */}
                  <div
                    className="flex items-center justify-between gap-3 lg:flex lg:items-center lg:justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <StatusBadge
                      status={campaign.status}
                      rawStatus={campaign.rawStatus}
                    />
                    <RowMenu
                      label={`Actions for ${campaign.name}`}
                      items={getCampaignMenuItems(campaign)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Campaign Details Modal (Replaces previous inline details card) */}
      {viewingCampaign && (
        <Modal
          title={viewingCampaign.name}
          eyebrow={viewingCampaign.category}
          onClose={() => setViewingCampaign(null)}
          footer={
            <div className="flex justify-between items-center w-full">
              <button
                type="button"
                onClick={() => {
                  const camp = viewingCampaign;
                  setViewingCampaign(null);
                  setConfiguringFlowCampaign(camp);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-navy/20 bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-stone transition-colors shadow-2xs"
              >
                <SlidersHorizontal size={14} className="text-steel" />
                Configure USSD steps
              </button>
              <button
                type="button"
                onClick={() => setViewingCampaign(null)}
                className="rounded-xl border border-navy/20 bg-white px-5 py-2 text-sm font-medium hover:bg-stone transition-colors"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Status & USSD Pill */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/10 pb-4">
              <StatusBadge
                status={viewingCampaign.status}
                rawStatus={viewingCampaign.rawStatus}
              />
              {viewingCampaign.eventCode && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy/5 px-2.5 py-1 text-xs font-mono font-medium text-navy border border-navy/10">
                    <PhoneCall size={12} className="text-gold" />
                    *920*969*{viewingCampaign.eventCode}#
                  </span>
                  <button
                    type="button"
                    onClick={(e) =>
                      handleCopyUssd(e, viewingCampaign.id, viewingCampaign.eventCode!)
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-steel hover:text-navy transition-colors"
                  >
                    {copiedId === viewingCampaign.id ? (
                      <span className="text-emerald-700 flex items-center gap-0.5 font-semibold">
                        <Check size={12} /> Copied!
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5">
                        <Copy size={12} /> Copy code
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Financial Stat Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-none bg-stone-light p-3 border border-navy/10">
                <p className="text-xs text-steel">Gross Raised</p>
                <p className="mt-1 text-lg font-semibold text-navy">
                  {money(viewingCampaign.raised ?? 0)}
                </p>
              </div>
              <div className="rounded-none bg-stone-light p-3 border border-navy/10">
                <p className="text-xs text-warning">Platform Fee (14%)</p>
                <p className="mt-1 text-lg font-semibold text-warning">
                  - {money(Math.round((viewingCampaign.raised ?? 0) * 0.14))}
                </p>
              </div>
              <div className="rounded-none bg-stone-light p-3 border border-navy/10">
                <p className="text-xs text-success">Net Proceeds (86%)</p>
                <p className="mt-1 text-lg font-semibold text-success">
                  {money((viewingCampaign.raised ?? 0) - Math.round((viewingCampaign.raised ?? 0) * 0.14))}
                </p>
              </div>
              <div className="rounded-none bg-stone-light p-3 border border-navy/10">
                <p className="text-xs text-steel">Target Goal</p>
                <p className="mt-1 text-lg font-semibold text-navy">
                  {viewingCampaign.goal > 0
                    ? money(viewingCampaign.goal)
                    : "Open goal"}
                </p>
              </div>
              <div className="rounded-none bg-stone-light p-3 border border-navy/10">
                <p className="text-xs text-steel">Contributors</p>
                <p className="mt-1 text-lg font-semibold text-navy">
                  {viewingCampaign.contributors ?? 0}
                </p>
              </div>
              <div className="rounded-none bg-stone-light p-3 border border-navy/10 flex items-center">
                <p className="text-[11px] leading-relaxed text-steel">
                  A 14% platform commission applies to all donations to maintain USSD routing.
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="mb-1.5 flex justify-between text-xs text-steel">
                <span>Progress to goal</span>
                <span className="font-semibold text-navy">
                  {viewingCampaign.goal > 0
                    ? `${Math.min(
                      100,
                      Math.round(
                        ((viewingCampaign.raised ?? 0) / viewingCampaign.goal) * 100
                      )
                    )}%`
                    : "Open target"}
                </span>
              </div>
              <progress
                aria-label={viewingCampaign.name + " progress"}
                value={viewingCampaign.raised ?? 0}
                max={viewingCampaign.goal > 0 ? viewingCampaign.goal : 100}
                className="block h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-stone [&::-webkit-progress-value]:bg-gold [&::-moz-progress-bar]:bg-gold"
              />
            </div>

            {/* About Campaign Description */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-steel mb-1">
                About this Campaign
              </h4>
              <p className="text-sm text-steel leading-relaxed">
                {viewingCampaign.description ||
                  "No description provided for this campaign."}
              </p>
            </div>

            {/* Metadata DL */}
            <dl className="grid grid-cols-2 gap-4 border-t border-navy/10 pt-4 text-xs">
              <div>
                <dt className="text-steel">Location</dt>
                <dd className="mt-0.5 font-medium text-navy">
                  {viewingCampaign.location || "Not specified"}
                </dd>
              </div>
              <div>
                <dt className="text-steel">Currency</dt>
                <dd className="mt-0.5 font-medium text-navy">
                  {viewingCampaign.currency || "GHS"}
                </dd>
              </div>
              <div>
                <dt className="text-steel">Created Date</dt>
                <dd className="mt-0.5 font-medium text-navy">
                  {viewingCampaign.created
                    ? dateLabel(viewingCampaign.created)
                    : "Recently"}
                </dd>
              </div>
              {viewingCampaign.startDate && (
                <div>
                  <dt className="text-steel">Start Date</dt>
                  <dd className="mt-0.5 font-medium text-navy">
                    {dateLabel(viewingCampaign.startDate)}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-steel">Closing Date</dt>
                <dd className="mt-0.5 font-medium text-navy">
                  {viewingCampaign.closing
                    ? dateLabel(viewingCampaign.closing)
                    : "Open-ended"}
                </dd>
              </div>
            </dl>
          </div>
        </Modal>
      )}

      {/* Edit Draft Campaign Drawer */}
      <EditCampaignDrawer
        campaign={editingCampaign}
        open={Boolean(editingCampaign)}
        onClose={() => setEditingCampaign(null)}
        onUpdated={() => {
          refetch();
        }}
      />

      {/* Delete Draft Campaign Confirmation Modal */}
      {deletingCampaign && (
        <Modal
          title="Delete draft campaign"
          eyebrow="Confirm Deletion"
          onClose={() => {
            if (!deleteMutation.isPending) setDeletingCampaign(null);
          }}
          footer={
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingCampaign(null)}
                disabled={deleteMutation.isPending}
                className="rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-sm font-medium hover:bg-stone disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-crimson px-4 py-2.5 text-sm font-medium text-white hover:bg-crimson/90 disabled:opacity-50 transition-colors shadow-sm"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete campaign
                  </>
                )}
              </button>
            </div>
          }
        >
          <div className="space-y-3">
            <p className="text-sm text-steel">
              Are you sure you want to permanently delete{" "}
              <strong className="text-navy">{deletingCampaign.name}</strong>?
            </p>
            <p className="text-xs text-steel leading-relaxed">
              This campaign is currently in <span className="font-semibold text-navy">Draft</span> status. Deleting it will permanently remove the record from PostgreSQL.
            </p>
          </div>
        </Modal>
      )}

      {/* Configure USSD Dial Steps Drawer */}
      <ConfigureStepsDrawer
        campaign={configuringFlowCampaign}
        open={Boolean(configuringFlowCampaign)}
        onClose={() => setConfiguringFlowCampaign(null)}
      />
    </div>
  );
}
