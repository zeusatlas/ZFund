"use client";

import { format } from "date-fns";
import { CircleDollarSign, FilePenLine, Layers, Megaphone, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MetricCard from "@/components/ui/MetricCard";
import Pagination from "@/components/ui/Pagination";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatCount, formatMoney } from "@/lib/format";
import { useCampaigns } from "../admin-api";
import ListToolbar from "../ListToolbar";
import { CampaignStatusBadge, progressPercent, ProgressBar } from "./campaign-status";

/** Three cards per row on wide screens, so page in threes. */
const CARDS_PER_PAGE = 9;

export default function AdminCampaigns() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useCampaigns({ page, search: debouncedSearch, status, limit: CARDS_PER_PAGE });
  const counts = data?.meta.counts;
  const dash = "–";

  return (
    <div className="w-full space-y-6">
      <section>
        <h1 className="page-title">Campaigns</h1>
        <p className="mt-2 text-sm text-steel">Every campaign your hosts have created, and how much each has raised.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total raised" value={counts ? formatMoney(counts.raised) : dash} icon={CircleDollarSign} accent="green" />
        <MetricCard label="Campaigns" value={counts ? formatCount(counts.total) : dash} icon={Layers} accent="blue" />
        <MetricCard label="Published" value={counts ? formatCount(counts.published) : dash} icon={Megaphone} accent="purple" />
        <MetricCard label="Drafts" value={counts ? formatCount(counts.draft) : dash} icon={FilePenLine} accent="gold" />
      </section>

      <section className="overflow-hidden surface-card">
        <ListToolbar
          search={search}
          onSearch={(value) => { setSearch(value); setPage(1); }}
          searchLabel="Search by name or event code"
          status={status}
          onStatus={(value) => { setStatus(value); setPage(1); }}
          statuses={[
            { value: "PUBLISHED", label: "Published" },
            { value: "DRAFT", label: "Draft" },
            { value: "SUSPENDED", label: "Suspended" },
          ]}
        />

        <div className="p-4 md:p-5">
          {isPending ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}</div>
          ) : isError ? (
            <ErrorNote message={(error as { message?: string }).message} onRetry={() => refetch()} />
          ) : data.items.length === 0 ? (
            <p className="py-8 text-center text-sm text-steel">
              {search || status ? "No campaigns match your search." : "No campaigns yet. Campaigns created by hosts will appear here."}
            </p>
          ) : (
            <div className={`grid gap-4 transition-opacity md:grid-cols-2 xl:grid-cols-3 ${isPlaceholderData ? "opacity-60" : ""}`}>
              {data.items.map((campaign) => {
                const percent = progressPercent(campaign.raised, campaign.targetAmount);
                return (
                  <Link
                    key={campaign.id}
                    href={`/admin/campaigns/${campaign.id}`}
                    className="flex flex-col surface-card p-5 transition hover:border-navy/25 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate font-semibold text-navy">{campaign.name}</h2>
                        <p className="mt-0.5 text-xs text-steel">Code {campaign.eventCode}</p>
                      </div>
                      <CampaignStatusBadge status={campaign.status} />
                    </div>

                    <p className="mt-4 flex items-center gap-2 text-sm text-ink">
                      <UserRound size={15} className="text-steel" />
                      <span className="truncate">{campaign.hostName}</span>
                    </p>

                    <p className="mt-4 text-2xl font-semibold tracking-tight text-navy">{formatMoney(campaign.raised)}</p>
                    <div className="mt-2">
                      {percent === null ? (
                        <p className="text-xs text-steel">No target set</p>
                      ) : (
                        <>
                          <ProgressBar percent={percent} />
                          <p className="mt-1.5 text-xs text-steel">{percent}% of {formatMoney(campaign.targetAmount!)}</p>
                        </>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-navy/10 pt-3 text-xs text-steel">
                      <span>{formatCount(campaign.transactions)} contributions</span>
                      <span>{format(new Date(campaign.createdAt), "MMM d, yyyy")}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {data && (
          <Pagination page={page} totalPages={data.meta.totalPages} total={data.meta.total} pageSize={CARDS_PER_PAGE} label="campaigns" onPageChange={setPage} />
        )}
      </section>
    </div>
  );
}
