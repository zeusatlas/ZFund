"use client";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Search,
  ShieldCheck,
  Wallet,
  WalletCards,
  X,
} from "lucide-react";
import HostHeading from "@/components/features/host/shared/HostHeading";
import WithdrawalRequest from "@/components/features/host/withdrawals/WithdrawalRequest";
import { dateLabel, money } from "@/components/features/host/shared/demo";
import RefreshData from "@/components/features/host/shared/RefreshData";
import { useCampaigns } from "@/components/features/host/campaigns/use-campaigns";
import { useWithdrawals } from "@/components/features/host/withdrawals/use-withdrawals";
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
    <span
      className={
        "inline-flex rounded-full px-3 py-1 text-xs font-medium " + colour
      }
    >
      {status}
    </span>
  );
}
function WithdrawalSheet({
  item,
  campaignName,
  onClose,
}: {
  item: Withdrawal | null;
  campaignName: string;
  onClose: () => void;
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
            <h2
              id="withdrawal-sheet-title"
              className="mt-1 text-2xl font-medium tracking-tight"
            >
              {campaignName}
            </h2>
            <p className="mt-2 text-xs text-steel">
              {item.id.startsWith("WD-LOCAL-")
                ? "WD-" + item.id.slice(-8).toUpperCase()
                : item.id}{" "}
              · {dateLabel(item.date)}
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
              <p className="mt-1 text-3xl font-medium tabular-nums">
                {money(item.amount)}
              </p>
            </div>
            <Status status={item.status} />
          </div>
          <dl className="mt-7 divide-y divide-navy/10">
            {[
              ["Recipient", item.recipient],
              ["Network / bank", item.institution],
              ["Destination", item.destination],
              ["Payout method", item.method],
              ["Purpose", item.purpose],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid gap-1 py-4 sm:grid-cols-[140px_1fr]"
              >
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
            Only the last four destination digits are shown here. Payouts
            require administrator review before funds are released.
          </p>
        </div>
        <div className="border-t border-navy/10 px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-steel"
          >
            Close details
          </button>
        </div>
      </aside>
    </div>
  );
}
export default function WithdrawalsDashboard() {
  const campaigns = useCampaigns(),
    withdrawals = useWithdrawals();
  const balances = withdrawalBalances(withdrawals);
  const [query, setQuery] = useState(""),
    [status, setStatus] = useState("All"),
    [page, setPage] = useState(1),
    [notice, setNotice] = useState(""),
    [selected, setSelected] = useState<Withdrawal | null>(null);
  const names = Object.fromEntries(
    campaigns.map((campaign) => [campaign.id, campaign.name]),
  );
  const filtered = withdrawals
    .filter(
      (item) =>
        (status === "All" || item.status === status) &&
        [item.id, names[item.campaignId], item.recipient, item.destination]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const pages = Math.max(1, Math.ceil(filtered.length / 7)),
    current = Math.min(page, pages),
    offset = (current - 1) * 7;
  const cards = [
    {
      label: "Available to withdraw",
      value: balances.available,
      note: "After paid and reserved amounts",
      icon: Wallet,
    },
    {
      label: "Awaiting payout",
      value: balances.reserved,
      note: "In review and processing",
      icon: Clock3,
    },
    {
      label: "Completed payouts",
      value: balances.paid,
      note: "Successfully paid out",
      icon: CheckCircle2,
    },
    {
      label: "Total raised",
      value: balances.raised,
      note: "Successful contributions only",
      icon: WalletCards,
    },
  ];
  return (
    <div className="mx-auto min-w-0 max-w-[1400px] py-3 md:py-5">
      <HostHeading
        title="Put your funds to work."
        description="Request campaign funds, follow each payout, and keep a clear record of where the money goes."
      />
      <section
        aria-label="Withdrawal balances"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {cards.map(({ label, value, note, icon: Icon }, index) => (
          <article
            key={label}
            className={
              "min-w-0 rounded-2xl border p-5 " +
              (index === 0
                ? "border-navy bg-navy text-white"
                : "border-navy/10 bg-white text-navy")
            }
          >
            <div className="mb-7 flex items-center justify-between gap-3">
              <h2
                className={
                  "text-sm " + (index === 0 ? "text-white/80" : "text-steel")
                }
              >
                {label}
              </h2>
              <Icon
                size={20}
                aria-hidden="true"
                className={index === 0 ? "text-gold" : "text-steel"}
              />
            </div>
            <p className="break-words text-[clamp(24px,2.4vw,34px)] font-medium leading-tight tracking-tight tabular-nums">
              {money(value)}
            </p>
            <p
              className={
                "mt-3 text-xs " + (index === 0 ? "text-white/70" : "text-steel")
              }
            >
              {note}
            </p>
          </article>
        ))}
      </section>
      <div className="my-7 flex flex-col justify-between gap-5 rounded-2xl border border-navy/10 bg-white p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={23}
            aria-hidden="true"
            className="mt-1 shrink-0 text-teal-700"
          />
          <div>
            <h2 className="font-medium text-navy">
              Every request has a review step
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-steel">
              Requested funds are reserved until the request is paid or
              rejected. Rejected requests leave your available balance
              unchanged.
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
              setNotice(
                "Withdrawal request saved in this browser as In review. Your available balance has been updated.",
              );
            }}
          />
        </div>
      </div>
      <p
        role="status"
        className={
          notice
            ? "mb-6 rounded-xl bg-teal-50 p-4 text-sm text-teal-900"
            : "sr-only"
        }
      >
        {notice}
      </p>
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
          <RefreshData />
        </div>
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
              placeholder="Search by reference, campaign or recipient"
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
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>
        <p role="status" className="mb-3 text-xs text-steel">
          Showing {filtered.length ? offset + 1 : 0}–
          {Math.min(offset + 7, filtered.length)} of {filtered.length} requests
        </p>
        <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white">
          {!filtered.length ? (
            <div className="p-12 text-center">
              <h3 className="font-medium text-navy">No matching withdrawals</h3>
              <p className="mt-2 text-sm text-steel">
                Try another search or status.
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
            filtered.slice(offset, offset + 7).map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelected(item)}
                className="group block w-full border-b border-navy/10 p-5 text-left transition-colors last:border-0 hover:bg-stone-light focus-visible:bg-stone-light"
              >
                <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_150px_120px]">
                  <div>
                    <h3 className="font-medium text-navy">
                      {names[item.campaignId] ?? item.campaignId}
                    </h3>
                    <p className="mt-1 break-all text-xs text-steel">
                      {item.id.startsWith("WD-LOCAL-")
                        ? "WD-" + item.id.slice(-8).toUpperCase()
                        : item.id}{" "}
                      · {dateLabel(item.date)}
                    </p>
                    <p className="mt-2 text-xs text-steel">
                      {item.method} · {item.destination}
                    </p>
                  </div>
                  <p className="font-medium tabular-nums text-navy">
                    {money(item.amount)}
                  </p>
                  <div className="flex items-center justify-between gap-3 md:block md:text-right">
                    <Status status={item.status} />
                    <p className="mt-2 text-xs text-steel">View details →</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
        {filtered.length > 0 && (
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
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
                className="rounded-xl border border-navy/15 bg-white px-4 py-2 text-sm text-navy disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={current === pages}
                onClick={() => setPage(current + 1)}
                className="rounded-xl border border-navy/15 bg-white px-4 py-2 text-sm text-navy disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </section>
      <WithdrawalSheet
        item={selected}
        campaignName={
          selected ? (names[selected.campaignId] ?? selected.campaignId) : ""
        }
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
