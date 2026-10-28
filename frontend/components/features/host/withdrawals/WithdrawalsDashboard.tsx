"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Wallet,
  WalletCards,
  X,
} from "lucide-react";
import { toast } from "sonner";
import HostHeading from "@/components/features/host/shared/HostHeading";
import MetricCard from "@/components/ui/MetricCard";
import WithdrawalRequest from "@/components/features/host/withdrawals/WithdrawalRequest";
import { dateLabel, money } from "@/components/features/host/shared/demo";
import { useCampaigns } from "@/components/features/host/campaigns/use-campaigns";
import {
  useDeleteWithdrawalMutation,
  useWithdrawalsQuery,
} from "@/components/features/host/withdrawals/use-withdrawals";
import {
  withdrawalBalances,
  withdrawalStatuses,
  type Withdrawal,
} from "@/components/features/host/withdrawals/withdrawals";

function Status({ status }: { status: Withdrawal["status"] }) {
  const colour =
    status === "Paid"
      ? "bg-emerald-50 text-emerald-800"
      : status === "Rejected"
        ? "bg-crimson/10 text-crimson"
        : status === "Processing"
          ? "bg-violet-50 text-violet-800"
          : "bg-amber-50 text-amber-900";
  return (
    <span className={"inline-flex rounded-full px-3 py-1 text-xs font-medium " + colour}>
      {status}
    </span>
  );
}

function WithdrawalSheet({
  item,
  campaignName,
  onClose,
  onCancel,
  isCancelling,
}: {
  item: Withdrawal | null;
  campaignName: string;
  onClose: () => void;
  onCancel: (item: Withdrawal) => void;
  isCancelling: boolean;
}) {
  useEffect(() => {
    if (!item) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  if (!item) return null;

  const canCancel = item.status === "In review";

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button
        type="button"
        aria-label="Close withdrawal details"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-midnight/55 backdrop-blur-[1px]"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="withdrawal-sheet-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-white text-navy shadow-2xl motion-safe:animate-[slide-in-right_180ms_ease-out]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-navy/10 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-medium text-steel">Withdrawal request</p>
            <h2 id="withdrawal-sheet-title" className="mt-1 text-2xl font-medium tracking-tight">
              {campaignName}
            </h2>
            <p className="mt-2 text-xs text-steel">
              {item.reference || (item.id.startsWith("WD-LOCAL-") ? "WD-" + item.id.slice(-8).toUpperCase() : item.id)} · {dateLabel(item.date)}
            </p>
          </div>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            aria-label="Close withdrawal details"
            className="rounded-lg p-2 text-steel hover:bg-stone"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-stone p-5">
            <div>
              <p className="text-xs text-steel">Requested amount</p>
              <p className="mt-1 text-3xl font-medium tabular-nums">{money(item.amount)}</p>
            </div>
            <Status status={item.status} />
          </div>

          <dl className="mt-7 divide-y divide-navy/10">
            {[
              ["Reference", item.reference || item.id],
              ["Recipient", item.recipient],
              ["Network / bank", item.institution],
              ["Destination", item.destination],
              ["Payout method", item.method],
              ["Purpose", item.purpose],
            ].map(([label, value]) => (
              <div key={label} className="grid gap-1 py-4 sm:grid-cols-[140px_1fr]">
                <dt className="text-sm text-steel">{label}</dt>
                <dd className="text-sm font-medium leading-relaxed">{value}</dd>
              </div>
            ))}
          </dl>

          <div
            className={
              "mt-6 rounded-2xl p-5 " +
              (item.status === "Rejected"
                ? "bg-crimson/10 text-crimson"
                : "bg-teal-50 text-teal-900")
            }
          >
            <h3 className="text-sm font-medium">Latest update</h3>
            <p className="mt-2 text-sm leading-relaxed">{item.note}</p>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-steel">
            Destination numbers are masked for security. Payouts require administrator review before funds are released.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-navy/10 px-6 py-4 sm:flex-row sm:px-8">
          {canCancel && (
            <button
              type="button"
              disabled={isCancelling}
              onClick={() => onCancel(item)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-crimson/30 bg-crimson/10 px-5 py-3 text-sm font-medium text-crimson hover:bg-crimson/20 disabled:opacity-50"
            >
              {isCancelling ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 size={16} aria-hidden="true" />
              )}
              Cancel request
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-steel"
          >
            Close details
          </button>
        </div>
      </aside>
    </div>
  );
}

export default function WithdrawalsDashboard() {
  const campaigns = useCampaigns();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Withdrawal | null>(null);

  const deleteMutation = useDeleteWithdrawalMutation();

  const names = useMemo(
    () => Object.fromEntries(campaigns.map((c) => [c.id, c.name])),
    [campaigns]
  );

  // Live database query for withdrawals
  const { data, isLoading, isFetching, refetch } = useWithdrawalsQuery({
    page,
    limit: 7,
    search: query.trim() || undefined,
    status: status !== "All" ? status : undefined,
  });

  const withdrawals = useMemo(() => data?.items || [], [data?.items]);
  const total = data?.total ?? withdrawals.length;
  const pages = Math.max(1, data?.meta?.totalPages ?? Math.ceil(total / 7));
  const current = Math.min(page, pages);
  const offset = (current - 1) * 7;

  // Real database balances or fallback
  const totalRaisedFromCampaigns = useMemo(
    () => campaigns.reduce((sum, c) => sum + (c.raised || 0), 0),
    [campaigns]
  );

  const balances =
    data?.balance ?? withdrawalBalances(withdrawals, totalRaisedFromCampaigns);

  async function handleCancelRequest(item: Withdrawal) {
    if (item.status !== "In review") {
      toast.error("Only pending withdrawal requests can be cancelled.");
      return;
    }

    const confirmCancel = window.confirm(
      `Are you sure you want to cancel withdrawal request ${item.reference || item.id} for ${money(item.amount)}? The reserved funds will be returned to your available balance.`
    );
    if (!confirmCancel) return;

    try {
      await deleteMutation.mutateAsync(item.id);
      toast.success("Withdrawal request cancelled successfully. Funds returned to available balance.");
      if (selected?.id === item.id) {
        setSelected(null);
      }
      refetch();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err instanceof Error ? err.message : "Could not cancel withdrawal request. Please try again.");
      toast.error(msg);
    }
  }

  // Stat cards matching HostOverview MetricCard design
  const cards = [
    {
      label: "Available to withdraw",
      value: money(balances.available),
      detail: "After paid and reserved amounts",
      icon: Wallet,
      accent: "green" as const,
    },
    {
      label: "Awaiting payout",
      value: money(balances.reserved),
      detail: "In review and processing",
      icon: Clock3,
      accent: "gold" as const,
    },
    {
      label: "Completed payouts",
      value: money(balances.paid),
      detail: "Successfully paid out",
      icon: CheckCircle2,
      accent: "blue" as const,
    },
    {
      label: "Total raised",
      value: money(balances.raised),
      detail: "Successful contributions only",
      icon: WalletCards,
      accent: "purple" as const,
    },
  ];

  return (
    <div className="w-full space-y-7">
      <HostHeading
        title="Put your funds to work."
        description="Request campaign funds, follow each payout, and keep a clear record of where the money goes."
      />

      {/* Summary Stat Cards matching HostOverview styling */}
      <section
        aria-label="Withdrawal balances"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {cards.map(({ label, value, detail, icon: Icon, accent }) => (
          <MetricCard
            key={label}
            label={label}
            value={value}
            detail={detail}
            icon={Icon}
            accent={accent}
          />
        ))}
      </section>

      {/* Review Information Banner */}
      <div className="my-7 flex flex-col justify-between gap-5 rounded-2xl border border-navy/10 bg-white p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={23}
            aria-hidden="true"
            className="mt-1 shrink-0 text-teal-700"
          />
          <div>
            <h2 className="font-medium text-navy">Every request has a review step</h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-steel">
              Requested funds are reserved until the request is paid or rejected. Rejected or cancelled requests leave your available balance unchanged.
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <WithdrawalRequest
            campaigns={campaigns}
            withdrawals={withdrawals}
            onRequested={() => {
              setQuery("");
              setStatus("All");
              setPage(1);
              refetch();
            }}
          />
        </div>
      </div>

      {/* Withdrawal History Section */}
      <section aria-labelledby="withdrawal-history-title">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2
              id="withdrawal-history-title"
              className="text-xl font-medium tracking-tight text-navy"
            >
              Withdrawal history
            </h2>
            <p className="mt-1 text-sm text-steel">
              Open a request to see the recipient, purpose, and latest update.
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-xl border border-navy/15 bg-white px-3 py-2 text-xs font-medium text-navy hover:bg-stone disabled:opacity-50"
          >
            <RefreshCw
              size={13}
              aria-hidden="true"
              className={isFetching ? "animate-spin text-navy" : ""}
            />
            {isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="my-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <label htmlFor="withdrawal-search" className="sr-only">
              Search withdrawal history
            </label>
            <Search
              size={18}
              aria-hidden="true"
              className="absolute left-4 top-3.5 text-steel"
            />
            <input
              id="withdrawal-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search by reference, campaign, recipient or account"
              className="w-full rounded-xl border border-navy/15 bg-white py-3 pl-11 pr-4 text-sm text-navy"
            />
          </div>
          <div>
            <label htmlFor="withdrawal-status" className="sr-only">
              Filter by withdrawal status
            </label>
            <select
              id="withdrawal-status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy"
            >
              <option value="All">All statuses</option>
              {withdrawalStatuses.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p role="status" className="mb-3 text-xs text-steel">
          Showing {total ? offset + 1 : 0}–{Math.min(offset + withdrawals.length, total)} of {total} requests
        </p>

        {/* Withdrawals List */}
        <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 size={32} className="animate-spin text-navy/40" aria-hidden="true" />
              <p className="mt-4 text-sm font-medium text-navy">Loading withdrawals…</p>
              <p className="mt-1 text-xs text-steel">Fetching real records from database</p>
            </div>
          ) : total === 0 ? (
            <div className="p-12 text-center">
              <h3 className="font-medium text-navy">No matching withdrawals</h3>
              <p className="mt-2 text-sm text-steel">
                Try another search or status filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setStatus("All");
                  setPage(1);
                }}
                className="mt-4 text-sm text-navy underline underline-offset-4"
              >
                Clear filters
              </button>
            </div>
          ) : (
            withdrawals.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                className="group block w-full cursor-pointer border-b border-navy/10 p-5 text-left transition-colors last:border-0 hover:bg-stone-light focus-visible:bg-stone-light"
              >
                <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_150px_160px]">
                  <div>
                    <h3 className="font-medium text-navy">
                      {item.campaignName || names[item.campaignId] || "Campaign Withdrawal"}
                    </h3>
                    <p className="mt-1 break-all text-xs text-steel">
                      {item.reference || (item.id.startsWith("WD-LOCAL-") ? "WD-" + item.id.slice(-8).toUpperCase() : item.id)} · {dateLabel(item.date)}
                    </p>
                    <p className="mt-2 text-xs text-steel">
                      {item.method} · {item.destination} ({item.recipient})
                    </p>
                  </div>
                  <p className="font-medium tabular-nums text-navy">{money(item.amount)}</p>
                  <div className="flex items-center justify-between gap-3 md:block md:text-right">
                    <Status status={item.status} />
                    <div className="mt-2 flex items-center justify-end gap-2 text-xs">
                      {item.status === "In review" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelRequest(item);
                          }}
                          className="font-medium text-crimson hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                      <span className="text-steel">View details →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {total > 0 && (
          <nav
            aria-label="Withdrawal pagination"
            className="mt-4 flex items-center justify-between gap-3"
          >
            <p className="text-sm text-steel">
              Page {current} of {pages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={current === 1 || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-xl border border-navy/15 bg-white px-4 py-2 text-sm text-navy disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={current === pages || isLoading}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="rounded-xl border border-navy/15 bg-white px-4 py-2 text-sm text-navy disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </section>

      {/* Withdrawal Details Drawer */}
      <WithdrawalSheet
        item={selected}
        campaignName={
          selected
            ? selected.campaignName || names[selected.campaignId] || "Campaign Withdrawal"
            : ""
        }
        onClose={() => setSelected(null)}
        onCancel={handleCancelRequest}
        isCancelling={deleteMutation.isPending}
      />
    </div>
  );
}
