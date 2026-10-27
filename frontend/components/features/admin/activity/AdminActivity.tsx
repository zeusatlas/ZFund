"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Pagination from "@/components/ui/Pagination";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatMoney } from "@/lib/format";
import { format } from "date-fns";
import { useFunds, useTransactions, type Fund, type Transaction } from "../admin-api";

type View = "funds" | "transactions";

const fundStatus: Record<string, { label: string; className: string }> = {
  PUBLISHED: { label: "Published", className: "bg-[#e9f4ef] text-[#287754]" },
  DRAFT: { label: "Draft", className: "bg-[#fff4dc] text-[#a26c12]" },
  SUSPENDED: { label: "Suspended", className: "bg-[#fbeaea] text-[#a13d3d]" },
};

const transactionStatus: Record<string, { label: string; className: string }> = {
  CONFIRMED: { label: "Completed", className: "bg-[#e9f4ef] text-[#287754]" },
  PENDING: { label: "Pending", className: "bg-[#fff4dc] text-[#a26c12]" },
  INITIATED: { label: "Pending", className: "bg-[#fff4dc] text-[#a26c12]" },
  FAILED: { label: "Failed", className: "bg-[#fbeaea] text-[#a13d3d]" },
  REFUNDED: { label: "Refunded", className: "bg-[#eaf0f8] text-[#315b8a]" },
  PARTIALLY_REFUNDED: { label: "Part refunded", className: "bg-[#eaf0f8] text-[#315b8a]" },
};

function Badge({ map, status }: { map: typeof fundStatus; status: string }) {
  const { label, className } = map[status] ?? { label: status, className: "bg-stone text-steel" };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>{label}</span>;
}

const formatDate = (iso: string) => format(new Date(iso), "MMM d, yyyy, HH:mm");
const th = "px-4 py-3 font-medium";

function FundsTable({ rows }: { rows: Fund[] }) {
  return (
    <table className="w-full min-w-[650px] text-left">
      <thead className="bg-stone-light text-xs uppercase tracking-wide text-steel">
        <tr>
          <th className="px-5 py-3 font-medium">Fund</th>
          <th className={th}>Host</th>
          <th className={th}>Raised</th>
          <th className={th}>Status</th>
          <th className={th}>Created</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-navy/10">
        {rows.map((fund) => (
          <tr key={fund.id} className="text-sm">
            <td className="px-5 py-4">
              <p className="font-medium text-ink">{fund.name}</p>
              <p className="mt-0.5 text-xs text-steel">{fund.eventCode}</p>
            </td>
            <td className="px-4 py-4">
              <Link href={`/admin/users/${fund.hostId}`} className="text-ink hover:text-gold">{fund.hostName}</Link>
            </td>
            <td className="px-4 py-4 font-medium text-ink">{formatMoney(fund.raised)}</td>
            <td className="px-4 py-4"><Badge map={fundStatus} status={fund.status} /></td>
            <td className="px-4 py-4 text-xs text-steel">{formatDate(fund.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TransactionsTable({ rows }: { rows: Transaction[] }) {
  return (
    <table className="w-full min-w-[650px] text-left">
      <thead className="bg-stone-light text-xs uppercase tracking-wide text-steel">
        <tr>
          <th className="px-5 py-3 font-medium">Transaction</th>
          <th className={th}>Fund</th>
          <th className={th}>Amount</th>
          <th className={th}>Status</th>
          <th className={th}>Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-navy/10">
        {rows.map((tx) => (
          <tr key={tx.id} className="text-sm">
            <td className="px-5 py-4">
              <p className="font-medium text-ink">{tx.reference}</p>
              <p className="mt-0.5 text-xs text-steel">{tx.contributorName ?? "Anonymous contributor"}</p>
            </td>
            <td className="px-4 py-4">
              <p className="text-ink">{tx.projectName}</p>
              <p className="mt-0.5 text-xs text-steel">{tx.hostName}</p>
            </td>
            <td className="px-4 py-4 font-medium text-ink">{formatMoney(tx.amount)}</td>
            <td className="px-4 py-4"><Badge map={transactionStatus} status={tx.status} /></td>
            <td className="px-4 py-4 text-xs text-steel">{formatDate(tx.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AdminActivity() {
  const [view, setView] = useState<View>("funds");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const params = { page, search: debouncedSearch };
  const funds = useFunds(params, view === "funds");
  const transactions = useTransactions(params, view === "transactions");
  const active = view === "funds" ? funds : transactions;
  const { data, isPending, isError, error, refetch, isPlaceholderData } = active;

  function switchView(next: View) {
    setView(next);
    setPage(1);
  }

  const tab = (name: View, label: string) => (
    <button
      type="button"
      onClick={() => switchView(name)}
      className={`rounded-lg px-4 py-2 text-sm font-medium ${view === name ? "bg-navy text-white" : "text-steel hover:bg-stone"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-navy md:text-3xl">Activity</h1>
        <p className="mt-2 text-sm text-steel">See the funds created and transactions completed across your network.</p>
      </section>

      <section className="overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-navy/10 p-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex">{tab("funds", "Funds")}{tab("transactions", "Transactions")}</div>
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder={view === "funds" ? "Search funds" : "Search transactions"}
              aria-label="Search"
              className="w-full rounded-lg border border-navy/15 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-gold"
            />
          </div>
        </div>

        {isPending ? (
          <div className="space-y-3 p-5">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : isError ? (
          <div className="p-5"><ErrorNote message={(error as { message?: string }).message} onRetry={() => refetch()} /></div>
        ) : data.items.length === 0 ? (
          <p className="p-8 text-center text-sm text-steel">
            {view === "funds" ? "No funds have been created yet." : "No transactions yet."}
          </p>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
            {view === "funds" ? <FundsTable rows={funds.data?.items ?? []} /> : <TransactionsTable rows={transactions.data?.items ?? []} />}
          </div>
        )}

        {data && (
          <Pagination
            page={page}
            totalPages={data.meta.totalPages}
            total={data.meta.total}
            label={view === "funds" ? "funds" : "transactions"}
            onPageChange={setPage}
          />
        )}
      </section>
    </div>
  );
}
