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
} from "lucide-react";
import { dateLabel, money, type CampaignStatus } from "@/components/features/host/shared/demo";
import {
  useCampaignsList,
  useUpdateProjectStatusMutation,
} from "@/components/features/host/campaigns/use-campaigns";
import CreateCampaignModal from "@/components/features/host/campaigns/CreateCampaignModal";
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
    style = "bg-warning-soft text-warning border border-warning/20";
  } else if (rawStatus === "SUSPENDED") {
    label = "Suspended";
    style = "bg-danger-soft text-crimson";
  } else if (status === "Active" || rawStatus === "PUBLISHED" || rawStatus === "APPROVED") {
    label = "Active";
    style = "bg-success-soft text-success";
  } else if (status === "Completed" || rawStatus === "COMPLETED") {
    label = "Completed";
    style = "bg-navy/10 text-navy";
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

  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopyUssd(e: React.MouseEvent, id: string, code: string) {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`*920*969*${code}#`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handlePublishDraft(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await updateStatusMutation.mutateAsync({ id, status: "PUBLISHED" });
      setNotice("Campaign published successfully! It is now active and ready for contributions.");
    } catch {
      // If direct transition requires review, try PENDING_REVIEW
      try {
        await updateStatusMutation.mutateAsync({ id, status: "PENDING_REVIEW" });
        setNotice("Campaign submitted for review.");
      } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apiErr = err as any;
        setNotice(apiErr?.response?.data?.message || "Failed to update campaign status.");
      }
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
              onCreated={(name) => {
                setQuery("");
                setStatus("All");
                setSort("newest");
                setNotice(`"${name}" was created successfully and saved in the database.`);
                refetch();
              }}
            />
          </div>

          {notice && (
            <p
              role="status"
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-success/20 bg-success-soft p-3 text-sm text-success"
            >
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice("")}
                className="text-xs font-semibold underline hover:no-underline"
              >
                Dismiss
              </button>
            </p>
          )}

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

          <div className="flex flex-col gap-3 sm:flex-row">
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
            <div className="w-full sm:w-52">
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
          </div>

          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by campaign status"
          >
            {["All", "Active", "Completed", "Draft"].map((filter) => {
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

          <p role="status" className="text-sm text-steel">
            Showing {filtered.length} of {campaigns.length} campaigns
          </p>
        </div>
      )}

      {/* Main Campaign List Content */}
      <div className="surface-card overflow-hidden">
        {isLoading && campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-14 text-center text-steel">
            <Loader2 size={32} className="animate-spin text-navy" />
            <p className="mt-3 text-sm font-medium text-navy">Loading campaigns from database...</p>
            <p className="mt-1 text-xs text-steel">Querying PostgreSQL project records</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FolderPlus aria-hidden="true" size={36} className="mx-auto mb-3 text-gold" />
            <h3 className="text-lg font-medium text-navy">No campaigns found in database</h3>
            <p className="mt-1.5 text-sm text-steel max-w-md mx-auto">
              You haven&apos;t created any campaigns yet. Start a campaign to generate a dedicated USSD dial code and begin collecting Mobile Money contributions.
            </p>
            <div className="mt-5">
              <CreateCampaignModal
                onCreated={(name) => {
                  setNotice(`"${name}" was created successfully and saved in the database.`);
                  refetch();
                }}
              />
            </div>
          </div>
        ) : visible.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Search aria-hidden="true" size={28} className="mx-auto mb-4 text-steel" />
            <h3 className="text-lg font-medium text-navy">No campaigns match your search</h3>
            <p className="mt-2 text-sm text-steel">
              Try another name, USSD code, or choose a different status filter.
            </p>
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
          </div>
        ) : (
          visible.map((campaign) => {
            const raised = campaign.raised ?? 0;
            const contributors = campaign.contributors ?? 0;
            const hasGoal = campaign.goal > 0;
            const percent = hasGoal
              ? Math.min(100, Math.round((raised / campaign.goal) * 100))
              : 0;

            return (
              <details
                key={campaign.id}
                className="group border-b border-navy/10 last:border-b-0"
              >
                <summary className="cursor-pointer list-none p-5 transition-colors hover:bg-stone-light [&::-webkit-details-marker]:hidden md:p-6">
                  <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(180px,1fr)_120px]">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone text-navy sm:flex">
                        <FolderHeart aria-hidden="true" size={21} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-navy truncate">{campaign.name}</h3>
                        <p className="mt-0.5 text-xs text-steel">
                          {campaign.category}
                        </p>

                        {/* USSD Dial String Badge */}
                        {campaign.eventCode && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy/5 px-2.5 py-1 text-xs font-mono font-medium text-navy">
                              <PhoneCall size={12} className="text-gold" />
                              *920*969*{campaign.eventCode}#
                            </span>
                            <button
                              type="button"
                              onClick={(e) =>
                                handleCopyUssd(e, campaign.id, campaign.eventCode!)
                              }
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-steel hover:text-navy"
                              title="Copy USSD Code"
                            >
                              {copiedId === campaign.id ? (
                                <span className="flex items-center gap-0.5 font-semibold text-success">
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

                    {/* Progress & Raised from Database */}
                    <div>
                      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                        <span className="text-sm font-medium tabular-nums text-navy">
                          {money(raised)}
                        </span>
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

                    {/* Status & Toggle */}
                    <div className="flex items-center justify-between gap-3 lg:block lg:text-right">
                      <StatusBadge
                        status={campaign.status}
                        rawStatus={campaign.rawStatus}
                      />
                      <span className="mt-3 text-xs text-steel group-open:hidden lg:block">
                        View details +
                      </span>
                      <span className="mt-3 hidden text-xs text-steel group-open:block">
                        Close details −
                      </span>
                    </div>
                  </div>
                </summary>

                <div className="grid gap-6 border-t border-navy/10 bg-stone-light p-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-steel">
                      About this Campaign
                    </h4>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-steel">
                      {campaign.description || "No description provided for this campaign."}
                    </p>
                    {campaign.rawStatus === "DRAFT" && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={(e) => handlePublishDraft(e, campaign.id)}
                          disabled={updateStatusMutation.isPending}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-1.5 text-xs font-medium text-white hover:bg-steel transition-colors disabled:opacity-50"
                        >
                          {updateStatusMutation.isPending ? "Updating..." : "Publish Campaign to USSD"}
                        </button>
                      </div>
                    )}
                  </div>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-steel">USSD Dial Code</dt>
                      <dd className="mt-1 font-mono font-medium text-navy">
                        {campaign.eventCode ? `*920*969*${campaign.eventCode}#` : "Not assigned"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-steel">Database ID</dt>
                      <dd className="mt-1 font-mono text-xs text-steel truncate" title={campaign.id}>
                        {campaign.id}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-steel">Created Date</dt>
                      <dd className="mt-1 font-medium text-navy">
                        {campaign.created ? dateLabel(campaign.created) : "Recently"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-steel">
                        {campaign.status === "Completed" ? "Closed Date" : "Closing Date"}
                      </dt>
                      <dd className="mt-1 font-medium text-navy">
                        {campaign.closing ? dateLabel(campaign.closing) : "Open-ended"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </details>
            );
          })
        )}
      </div>
    </div>
  );
}
