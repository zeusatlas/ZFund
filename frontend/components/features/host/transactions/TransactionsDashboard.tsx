"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Download,
  Loader2,
  RefreshCw,
  Search,
  Percent,
  Wallet,
  XCircle,
} from "lucide-react";
import HostHeading from "@/components/features/host/shared/HostHeading";
import MetricCard from "@/components/ui/MetricCard";
import TransactionDetails from "@/components/features/host/transactions/TransactionDetails";
import { dateLabel, money } from "@/components/features/host/shared/demo";
import { useCampaigns } from "@/components/features/host/campaigns/use-campaigns";
import {
  emptyFilters,
  transactionsCsv,
  type Transaction,
} from "@/components/features/host/transactions/transactions";
import {
  contributionToTransaction,
  useTransactionsQuery,
  useVerifyPaymentMutation,
} from "@/components/features/host/transactions/use-transactions";
import { getContributions } from "@/lib/api/contributions";

const PAGE_SIZE = 7;
const controlClass =
  "mt-2 w-full rounded-xl border border-navy/15 bg-white px-3 py-2.5 text-sm text-navy";

function PaymentStatus({ status }: { status: Transaction["status"] }) {
  const Icon = status === "Paid" ? CheckCircle2 : status === "Pending" ? Clock3 : XCircle;
  const colour =
    status === "Paid"
      ? "bg-emerald-50 text-emerald-800"
      : status === "Pending"
        ? "bg-amber-50 text-amber-900"
        : "bg-crimson/10 text-crimson";
  return (
    <span className={"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium " + colour}>
      <Icon size={13} aria-hidden="true" />
      {status === "Paid" ? "Successful" : status}
    </span>
  );
}

export default function TransactionsDashboard() {
  const campaigns = useCampaigns();
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [exportMessage, setExportMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [isVerifyingBatch, setIsVerifyingBatch] = useState(false);
  const [verificationNotice, setVerificationNotice] = useState<{
    type: "success" | "info" | "error";
    text: string;
  } | null>(null);

  const verifyMutation = useVerifyPaymentMutation();

  const campaignNames = useMemo(
    () => Object.fromEntries(campaigns.map((c) => [c.id, c.name])),
    [campaigns]
  );

  const invalidDates = Boolean(filters.from && filters.to && filters.from > filters.to);

  // Fetch real live transactions from PostgreSQL database via API
  const {
    data: queryResult,
    isLoading,
    isFetching,
    refetch,
  } = useTransactionsQuery({
    campaignId: filters.campaignId !== "All" ? filters.campaignId : undefined,
    status: filters.status !== "All" ? filters.status : undefined,
    search: filters.query.trim() || undefined,
    from: filters.from || undefined,
    to: filters.to || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const pageTransactions: Transaction[] = useMemo(() => {
    return (queryResult?.contributions || []).map(contributionToTransaction);
  }, [queryResult?.contributions]);

  const totalItems = queryResult?.total ?? 0;
  const totalPages = Math.max(1, queryResult?.meta?.totalPages ?? Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * PAGE_SIZE;

  // Real summary metrics from database
  const totals = queryResult?.meta?.summary ?? {
    received: pageTransactions
      .filter((t) => t.status === "Paid")
      .reduce((sum, t) => sum + t.amount, 0),
    paid: pageTransactions.filter((t) => t.status === "Paid").length,
    pending: pageTransactions.filter((t) => t.status === "Pending").length,
    failed: pageTransactions.filter((t) => t.status === "Failed").length,
  };

  const isFiltered = Boolean(
    filters.query.trim() ||
    filters.campaignId !== "All" ||
    filters.status !== "All" ||
    filters.from ||
    filters.to
  );

  function updateFilter(key: keyof typeof filters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
    setExportMessage("");
    setVerificationNotice(null);
  }

  function clearFilters() {
    setFilters(emptyFilters);
    setPage(1);
    setExportMessage("");
    setVerificationNotice(null);
  }

  async function handleVerify(item: Transaction) {
    setVerifyingId(item.id);
    setVerificationNotice(null);
    try {
      const targetRef = item.paymentReference || item.reference;
      const res = await verifyMutation.mutateAsync(targetRef);

      const status = res.data?.status;
      const isConfirmed = status === "SUCCESSFUL" || res.data?.contribution?.status === "CONFIRMED";
      const isFailed = status === "FAILED" || res.data?.contribution?.status === "FAILED";

      if (isConfirmed) {
        setVerificationNotice({
          type: "success",
          text: `Payment ${item.id} verified and confirmed as Successful by Paystack! Included in your total received.`,
        });
        if (selected?.id === item.id) {
          setSelected((prev) =>
            prev ? { ...prev, status: "Paid", rawStatus: "CONFIRMED", note: "Payment confirmed with Paystack." } : null
          );
        }
      } else if (isFailed) {
        setVerificationNotice({
          type: "error",
          text: `Payment ${item.id}: Paystack reported transaction as failed or cancelled by provider.`,
        });
        if (selected?.id === item.id) {
          setSelected((prev) =>
            prev ? { ...prev, status: "Failed", rawStatus: "FAILED" } : null
          );
        }
      } else {
        setVerificationNotice({
          type: "info",
          text: `Payment ${item.id}: Paystack reports this transaction is still awaiting donor authorization with their MoMo PIN on their handset.`,
        });
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not verify transaction with Paystack. Please try again.";
      setVerificationNotice({
        type: "error",
        text: `Error verifying ${item.id}: ${errorMsg}`,
      });
    } finally {
      setVerifyingId(null);
    }
  }

  async function handleVerifyAllPending() {
    const pendingItems = pageTransactions.filter((t) => t.status === "Pending");
    if (!pendingItems.length) return;

    setIsVerifyingBatch(true);
    setVerificationNotice(null);
    let confirmedCount = 0;

    for (const item of pendingItems) {
      try {
        const targetRef = item.paymentReference || item.reference;
        const res = await verifyMutation.mutateAsync(targetRef);
        if (res.data?.status === "SUCCESSFUL" || res.data?.contribution?.status === "CONFIRMED") {
          confirmedCount++;
        }
      } catch {
        // continue verifying remaining items
      }
    }

    setIsVerifyingBatch(false);
    refetch();

    if (confirmedCount > 0) {
      setVerificationNotice({
        type: "success",
        text: `${confirmedCount} pending payment${confirmedCount > 1 ? "s were" : " was"} verified and confirmed as Successful with Paystack!`,
      });
    } else {
      setVerificationNotice({
        type: "info",
        text: "Paystack verification completed. All checked payments are still awaiting donor MoMo authorization.",
      });
    }
  }

  async function exportCsv() {
    try {
      setIsExporting(true);
      setExportMessage("Preparing CSV export from database...");

      // Fetch all matching real records for CSV export (up to 1,000)
      const res = await getContributions({
        campaignId: filters.campaignId !== "All" ? filters.campaignId : undefined,
        status: filters.status !== "All" ? filters.status : undefined,
        search: filters.query.trim() || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
        page: 1,
        limit: 1000,
      });

      const exportItems = (res.contributions || []).map(contributionToTransaction);

      if (!exportItems.length) {
        setExportMessage("No transactions found to export.");
        setIsExporting(false);
        return;
      }

      const blob = new Blob([transactionsCsv(exportItems, campaignNames)], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "raisefundz-transactions-" + new Date().toISOString().slice(0, 10) + ".csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExportMessage(`CSV download started for ${exportItems.length} transactions.`);
    } catch {
      setExportMessage("The export could not be started. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  // Stat cards matching HostOverview MetricCard design
  const totalCommission = Math.round(totals.received * 0.14);
  const totalNet = totals.received - totalCommission;
  const cards = [
    {
      label: "Total gross received",
      value: money(totals.received),
      detail: "Gross contributions collected",
      icon: Wallet,
      accent: "blue" as const,
    },
    {
      label: "Platform fee (14%)",
      value: money(totalCommission),
      detail: "14% commission fee",
      icon: Percent,
      accent: "gold" as const,
    },
    {
      label: "Net credited (86%)",
      value: money(totalNet),
      detail: "86% net credited to host",
      icon: CheckCircle2,
      accent: "green" as const,
    },
    {
      label: "Successful payments",
      value: totals.paid,
      detail: "Confirmed contributions",
      icon: CheckCircle2,
      accent: "blue" as const,
    },
    {
      label: "Pending payments",
      value: totals.pending,
      detail: "Awaiting confirmation",
      icon: Clock3,
      accent: "gold" as const,
    },
    {
      label: "Failed payments",
      value: totals.failed,
      detail: "No funds received",
      icon: XCircle,
      accent: "purple" as const,
    },
  ];

  return (
    <div className="w-full space-y-7">
      <HostHeading
        title="Your transactions"
        description="Follow every donation, from the first payment request to a confirmed contribution."
      />

      {/* Summary Stat Cards matching HostOverview styling */}
      <section
        aria-label="Transaction summary"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
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

      <p className="mt-3 text-xs text-steel">
        {isFiltered ? "Summary reflects the current filters." : "Summary covers all transactions."} Amounts are in Ghana cedis.
      </p>

      {/* Payment History Section */}
      <section className="mt-10" aria-labelledby="payment-history-title">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="payment-history-title" className="text-xl font-medium tracking-tight text-navy">
              Payment history
            </h2>
            <p className="mt-1 text-sm text-steel">
              Select a transaction to view its payment details or sync pending payments with Paystack.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {totals.pending > 0 && (
              <button
                type="button"
                onClick={handleVerifyAllPending}
                disabled={isVerifyingBatch || isFetching || verifyMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-none border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-50"
              >
                <RefreshCw
                  size={13}
                  aria-hidden="true"
                  className={isVerifyingBatch ? "animate-spin text-amber-900" : ""}
                />
                {isVerifyingBatch ? "Checking pending…" : `Verify pending (${totals.pending})`}
              </button>
            )}
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-navy/15 bg-white px-3 py-2 text-xs font-medium text-navy hover:bg-stone disabled:opacity-50"
              disabled={isFetching}
            >
              <RefreshCw
                size={13}
                aria-hidden="true"
                className={isFetching ? "animate-spin text-navy" : ""}
              />
              {isFetching ? "Refreshing…" : "Refresh"}
            </button>
            <button
              type="button"
              onClick={exportCsv}
              disabled={totalItems === 0 || invalidDates || isExporting}
              className="inline-flex items-center gap-2 rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-sm font-medium text-navy hover:bg-stone disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isExporting ? (
                <Loader2 size={17} className="animate-spin" aria-hidden="true" />
              ) : (
                <Download size={17} aria-hidden="true" />
              )}
              Export CSV
            </button>
          </div>
        </div>

        {/* Verification Status Alert Banner */}
        {verificationNotice && (
          <div
            className={
              "mb-5 flex items-start justify-between gap-3 p-3.5 text-xs leading-relaxed rounded-none border " +
              (verificationNotice.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                : verificationNotice.type === "error"
                ? "border-crimson/30 bg-crimson/10 text-crimson"
                : "border-amber-300 bg-amber-50 text-amber-950")
            }
          >
            <div className="flex items-start gap-2.5">
              {verificationNotice.type === "success" ? (
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
              )}
              <span className="font-medium">{verificationNotice.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setVerificationNotice(null)}
              className="font-medium underline underline-offset-2 hover:opacity-80"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mb-6 rounded-2xl border border-navy/10 bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_minmax(180px,1fr)_150px]">
            <div>
              <label htmlFor="transaction-search" className="text-xs font-medium text-steel">
                Search transactions
              </label>
              <div className="relative">
                <Search
                  size={17}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-5 text-steel"
                />
                <input
                  id="transaction-search"
                  value={filters.query}
                  onChange={(event) => updateFilter("query", event.target.value)}
                  placeholder="Reference or visible phone digits"
                  className={controlClass + " pl-10"}
                />
              </div>
            </div>
            <div>
              <label htmlFor="transaction-campaign" className="text-xs font-medium text-steel">
                Campaign
              </label>
              <select
                id="transaction-campaign"
                value={filters.campaignId}
                onChange={(event) => updateFilter("campaignId", event.target.value)}
                className={controlClass}
              >
                <option value="All">All campaigns</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="transaction-status" className="text-xs font-medium text-steel">
                Payment status
              </label>
              <select
                id="transaction-status"
                value={filters.status}
                onChange={(event) => updateFilter("status", event.target.value)}
                className={controlClass}
              >
                <option value="All">All statuses</option>
                <option value="Paid">Successful</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <div className="min-w-0 flex-1 sm:max-w-56">
              <label htmlFor="transaction-from" className="text-xs font-medium text-steel">
                From date
              </label>
              <input
                id="transaction-from"
                type="date"
                value={filters.from}
                max={filters.to || undefined}
                onChange={(event) => updateFilter("from", event.target.value)}
                aria-invalid={invalidDates}
                aria-describedby={invalidDates ? "date-range-error" : undefined}
                className={controlClass}
              />
            </div>
            <div className="min-w-0 flex-1 sm:max-w-56">
              <label htmlFor="transaction-to" className="text-xs font-medium text-steel">
                To date
              </label>
              <input
                id="transaction-to"
                type="date"
                value={filters.to}
                min={filters.from || undefined}
                onChange={(event) => updateFilter("to", event.target.value)}
                aria-invalid={invalidDates}
                aria-describedby={invalidDates ? "date-range-error" : undefined}
                className={controlClass}
              />
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg px-3 py-3 text-sm font-medium text-steel underline underline-offset-4 hover:text-navy"
            >
              Clear filters
            </button>
          </div>
          {invalidDates && (
            <p id="date-range-error" role="alert" className="mt-3 text-sm text-crimson">
              The end date must be on or after the start date.
            </p>
          )}
        </div>

        <div className="mb-3 flex flex-wrap justify-between gap-2 text-xs text-steel">
          <p role="status">
            Showing {totalItems ? offset + 1 : 0}–{Math.min(offset + pageTransactions.length, totalItems)} of {totalItems} transactions
          </p>
          <p>Newest first · Ghana time (GMT)</p>
        </div>

        <p role="status" className={exportMessage ? "mb-4 text-sm text-steel" : "sr-only"}>
          {exportMessage}
        </p>

        {/* Transactions Table / List */}
        <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 size={32} className="animate-spin text-navy/40" aria-hidden="true" />
              <p className="mt-4 text-sm font-medium text-navy">Loading transactions…</p>
              <p className="mt-1 text-xs text-steel">Fetching real records from database</p>
            </div>
          ) : totalItems === 0 ? (
            <div className="px-6 py-16 text-center">
              <Search size={28} aria-hidden="true" className="mx-auto mb-4 text-steel" />
              <h3 className="text-lg font-medium text-navy">
                {invalidDates ? "Check your date range" : "No transactions found"}
              </h3>
              <p className="mt-2 text-sm text-steel">
                {invalidDates
                  ? "Choose a valid range to see matching payments."
                  : "Try another search or clear your filters to see all payments."}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-navy px-4 py-2.5 text-sm text-white"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="divide-y divide-navy/10 md:hidden">
                {pageTransactions.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className="block w-full p-5 text-left hover:bg-stone-light focus-visible:bg-stone-light"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-medium text-navy">{item.id}</span>
                        <span className="mt-1 block text-xs text-steel">{item.phone}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium tabular-nums text-navy block">
                          {money(item.amount)}
                        </span>
                        <span className="text-[11px] font-normal text-success">
                          Net: {money(Math.round(item.amount * 0.86))}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs text-steel">
                        {campaignNames[item.campaignId] ?? item.campaignName ?? item.campaignId}
                      </span>
                      <div className="flex items-center gap-2">
                        <PaymentStatus status={item.status} />
                        {item.status === "Pending" && (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleVerify(item);
                            }}
                            disabled={verifyingId === item.id || verifyMutation.isPending}
                            className="inline-flex items-center gap-1.5 rounded-none border border-navy/20 bg-stone/70 px-2.5 py-1 text-xs font-medium text-navy hover:bg-stone disabled:opacity-50"
                          >
                            <RefreshCw
                              size={12}
                              className={verifyingId === item.id ? "animate-spin text-navy" : "text-navy"}
                            />
                            <span>{verifyingId === item.id ? "Checking…" : "Verify"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-steel">
                      {dateLabel(item.date)} · {item.time.slice(0, 5)} GMT · View details →
                    </p>
                  </button>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[1050px] text-left text-sm">
                  <caption className="sr-only">
                    Filtered donation transactions. Open a reference for full payment details.
                  </caption>
                  <thead className="border-b border-navy/10 bg-stone/50 text-xs text-steel">
                    <tr>
                      {[
                        "Reference/Donor",
                        "Campaign",
                        "Amount",
                        "Payment method",
                        "Status",
                        "Date and time",
                      ].map((label) => (
                        <th
                          key={label}
                          scope="col"
                          className={"px-5 py-4 font-medium " + (label === "Amount" ? "text-right" : "")}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageTransactions.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelected(item)}
                        className="cursor-pointer border-b border-navy/10 transition-colors last:border-0 hover:bg-stone-light"
                      >
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelected(item);
                            }}
                            aria-label={"View transaction " + item.phone}
                            className="rounded text-left font-medium text-navy underline decoration-navy/30 underline-offset-4"
                          >
                            {item.id}
                          </button>
                          <span className="mt-1 block text-xs text-steel">{item.reference}</span>
                        </td>
                        <td className="max-w-56 px-5 py-4 text-steel">
                          {campaignNames[item.campaignId] ?? item.campaignName ?? item.campaignId}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-right font-medium tabular-nums text-navy">
                          <div>{money(item.amount)}</div>
                          <div className="text-[11px] font-normal text-success">
                            Net: {money(Math.round(item.amount * 0.86))}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-steel">{item.method}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <PaymentStatus status={item.status} />
                            {item.status === "Pending" && (
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleVerify(item);
                                }}
                                disabled={verifyingId === item.id || verifyMutation.isPending}
                                title="Check status directly with Paystack"
                                className="inline-flex items-center gap-1 rounded-none border border-navy/20 bg-stone/70 px-2 py-0.5 text-xs font-medium text-navy hover:bg-stone disabled:opacity-50"
                              >
                                <RefreshCw
                                  size={11}
                                  className={verifyingId === item.id ? "animate-spin text-navy" : "text-navy"}
                                />
                                <span>{verifyingId === item.id ? "Checking…" : "Verify"}</span>
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-steel">
                          {dateLabel(item.date)}
                          <span className="mt-1 block text-xs">{item.time.slice(0, 5)} GMT</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Pagination Controls */}
        {totalItems > 0 && (
          <nav
            aria-label="Transaction pagination"
            className="mt-4 flex flex-wrap items-center justify-between gap-3"
          >
            <p role="status" className="text-sm text-steel">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
                className="rounded-xl border border-navy/20 bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-stone disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || isLoading}
                className="rounded-xl border border-navy/20 bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-stone disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </nav>
        )}

        <p className="mt-5 text-xs leading-relaxed text-steel">
          Pending and failed payments never count towards total received. Donor numbers stay masked in the table, details, and export.
        </p>
      </section>

      {/* Transaction Details Drawer / Modal */}
      <TransactionDetails
        transaction={selected}
        campaignName={
          selected
            ? campaignNames[selected.campaignId] ?? selected.campaignName ?? selected.campaignId
            : ""
        }
        onClose={() => setSelected(null)}
        onTransactionUpdated={(updated) => setSelected(updated)}
      />
    </div>
  );
}
