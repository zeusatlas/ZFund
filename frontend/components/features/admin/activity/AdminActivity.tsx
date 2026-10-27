"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { funds } from "../funds/data";
import { transactions } from "../transactions/data";

export default function AdminActivity() {
  const [view, setView] = useState<"funds" | "transactions">("funds");
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const records = view === "funds" ? funds : transactions;
  const pageCount = Math.max(1, Math.ceil(records.length / pageSize));
  const start = (page - 1) * pageSize;

  return (
    <div className="w-full space-y-6">
      <section><h1 className="text-2xl font-semibold tracking-tight text-navy md:text-3xl">Activity</h1><p className="mt-2 text-sm text-steel">See the funds created and transactions completed across your network.</p></section>
      <section className="rounded-xl border border-navy/10 bg-white shadow-sm">
        <div className="flex border-b border-navy/10 p-2">
          <button type="button" onClick={() => { setView("funds"); setPage(1); }} className={`rounded-lg px-4 py-2 text-sm font-medium ${view === "funds" ? "bg-navy text-white" : "text-steel hover:bg-stone"}`}>Funds</button>
          <button type="button" onClick={() => { setView("transactions"); setPage(1); }} className={`rounded-lg px-4 py-2 text-sm font-medium ${view === "transactions" ? "bg-navy text-white" : "text-steel hover:bg-stone"}`}>Transactions</button>
        </div>
        {view === "funds" ? (
          <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="bg-stone-light text-xs uppercase tracking-wide text-steel"><tr><th className="px-5 py-3 font-medium">Fund</th><th className="px-4 py-3 font-medium">Host</th><th className="px-4 py-3 font-medium">Purpose</th><th className="px-4 py-3 font-medium">Amount</th><th className="px-5 py-3 font-medium">Status</th></tr></thead><tbody className="divide-y divide-navy/10">{funds.slice(start, start + pageSize).map((fund) => <tr key={fund.id} className="text-sm"><td className="px-5 py-4 font-medium text-navy">{fund.id}</td><td className="px-4 py-4 text-ink">{fund.host}</td><td className="px-4 py-4 text-steel">{fund.purpose}</td><td className="px-4 py-4 font-medium text-ink">{fund.amount}</td><td className="px-5 py-4 text-sm text-steel">{fund.status}</td></tr>)}</tbody></table></div>
        ) : (
          <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="bg-stone-light text-xs uppercase tracking-wide text-steel"><tr><th className="px-5 py-3 font-medium">Transaction</th><th className="px-4 py-3 font-medium">Fund</th><th className="px-4 py-3 font-medium">Host</th><th className="px-4 py-3 font-medium">Amount</th><th className="px-5 py-3 font-medium">Status</th></tr></thead><tbody className="divide-y divide-navy/10">{transactions.slice(start, start + pageSize).map((transaction) => <tr key={transaction.id} className="text-sm"><td className="px-5 py-4 font-medium text-navy">{transaction.id}</td><td className="px-4 py-4 text-steel">{transaction.fundId}</td><td className="px-4 py-4 text-ink">{transaction.host}</td><td className="px-4 py-4 font-medium text-ink">{transaction.amount}</td><td className="px-5 py-4 text-sm text-steel">{transaction.status}</td></tr>)}</tbody></table></div>
        )}
        <div className="flex items-center justify-between border-t border-navy/10 px-4 py-3 text-xs text-steel md:px-5">
          <span>Page {page} of {pageCount}</span>
          <div className="flex gap-2">
            <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="inline-flex items-center gap-1 rounded-md border border-navy/15 px-2.5 py-1.5 hover:bg-stone disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={14} /> Previous</button>
            <button type="button" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)} className="inline-flex items-center gap-1 rounded-md border border-navy/15 px-2.5 py-1.5 hover:bg-stone disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight size={14} /></button>
          </div>
        </div>
      </section>
    </div>
  );
}
