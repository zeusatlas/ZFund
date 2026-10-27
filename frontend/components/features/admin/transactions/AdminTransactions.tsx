"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { transactions, type TransactionStatus } from "./data";

function StatusBadge({ status }: { status: TransactionStatus }) {
  const styles = { Completed: "bg-[#e9f4ef] text-[#287754]", Pending: "bg-[#fff4dc] text-[#a26c12]", Failed: "bg-[#fbeaea] text-[#a13d3d]" };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>{status}</span>;
}

export default function AdminTransactions() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const filteredTransactions = useMemo(() => transactions.filter((transaction) => {
    const matchesQuery = !query || `${transaction.id} ${transaction.fundId} ${transaction.host}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === "All statuses" || transaction.status === status);
  }), [query, status]);

  return (
    <div className="w-full space-y-6">
      <section><h1 className="text-2xl font-semibold tracking-tight text-navy md:text-3xl">Transactions</h1><p className="mt-2 text-sm text-steel">Track settlements and payment activity across the fund network.</p></section>
      <section className="grid gap-4 sm:grid-cols-3"><article className="rounded-xl border border-navy/10 border-t-4 border-t-gold bg-white p-5 shadow-sm"><p className="text-sm text-steel">Total processed</p><p className="mt-3 text-2xl font-semibold text-navy">GHS 20,700.00</p></article><article className="rounded-xl border border-navy/10 border-t-4 border-t-gold bg-white p-5 shadow-sm"><p className="text-sm text-steel">Completed</p><p className="mt-3 text-2xl font-semibold text-navy">38</p></article><article className="rounded-xl border border-navy/10 border-t-4 border-t-gold bg-white p-5 shadow-sm"><p className="text-sm text-steel">Needs attention</p><p className="mt-3 text-2xl font-semibold text-navy">03</p></article></section>
      <section className="overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-navy/10 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5"><div className="relative w-full sm:max-w-xs"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search transactions" className="w-full rounded-lg border border-navy/15 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-gold" /></div><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-navy/15 bg-white px-3 py-2.5 text-sm text-steel outline-none focus:border-gold"><option>All statuses</option><option>Completed</option><option>Pending</option><option>Failed</option></select></div><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="bg-stone-light text-xs uppercase tracking-wide text-steel"><tr><th className="px-5 py-3 font-medium">Transaction</th><th className="px-4 py-3 font-medium">Fund</th><th className="px-4 py-3 font-medium">Host</th><th className="px-4 py-3 font-medium">Amount</th><th className="px-4 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Date</th></tr></thead><tbody className="divide-y divide-navy/10">{filteredTransactions.map((transaction) => <tr key={transaction.id} className="text-sm"><td className="px-5 py-4 font-medium text-navy">{transaction.id}</td><td className="px-4 py-4 text-steel">{transaction.fundId}</td><td className="px-4 py-4 text-ink">{transaction.host}</td><td className="px-4 py-4 font-medium text-ink">{transaction.amount}</td><td className="px-4 py-4"><StatusBadge status={transaction.status} /></td><td className="px-5 py-4 text-xs text-steel">{transaction.date}</td></tr>)}</tbody></table></div>{filteredTransactions.length === 0 && <p className="p-8 text-center text-sm text-steel">No transactions found.</p>}</section>
    </div>
  );
}
