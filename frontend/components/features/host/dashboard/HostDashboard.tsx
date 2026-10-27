"use client";

import { ArrowUpRight, CircleDollarSign, Clock3, FileText, Plus } from "lucide-react";
import { useState } from "react";
import MetricCard from "@/components/ui/MetricCard";
import CreateFundModal, { type NewFund } from "./CreateFundModal";

const stats = [
  { label: "Available funds", value: "GHS 18,240.00", detail: "Ready to issue", icon: CircleDollarSign },
  { label: "Funds issued", value: "GHS 42,850.00", detail: "+8.2% this month", icon: ArrowUpRight },
  { label: "Pending requests", value: "06", detail: "Awaiting review", icon: Clock3 },
  { label: "Total transactions", value: "63", detail: "Across all funds", icon: FileText },
];

const transactions = [
  { reference: "ZF-10482", description: "Partner settlement", amount: "GHS 8,200.00", status: "Completed", date: "Today, 09:42" },
  { reference: "ZF-10476", description: "Operating fund", amount: "GHS 3,600.00", status: "Completed", date: "Yesterday" },
  { reference: "ZF-10451", description: "Vendor allocation", amount: "GHS 1,850.00", status: "Pending", date: "Oct 24, 2026" },
];

export default function HostDashboard() {
  const [showCreateFund, setShowCreateFund] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState(transactions);

  function createFund(fund: NewFund) {
    setRecentTransactions((current) => [fund, ...current]);
    setShowCreateFund(false);
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-gold">Host workspace</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-navy md:text-3xl">Welcome back, Amelia</h1>
          <p className="mt-2 text-sm text-steel">Manage your funds and keep track of your latest activity.</p>
        </div>
        <button type="button" onClick={() => setShowCreateFund(true)} className="inline-flex w-fit items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-steel">
          <Plus size={17} />
          Generate funds
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, detail, icon: Icon }, index) => (
          <MetricCard
            key={label}
            label={label}
            value={value}
            detail={detail}
            icon={Icon}
            accent={["blue", "green", "gold", "purple"][index] as "blue" | "green" | "gold" | "purple"}
          />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <article className="overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-navy/10 p-5 md:p-6">
            <div><h2 className="font-semibold text-navy">Recent transactions</h2><p className="mt-1 text-sm text-steel">A quick look at your latest fund activity.</p></div>
          </div>
          <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left"><thead className="bg-stone-light text-xs uppercase tracking-wide text-steel"><tr><th className="px-5 py-3 font-medium">Reference</th><th className="px-4 py-3 font-medium">Description</th><th className="px-4 py-3 font-medium">Amount</th><th className="px-4 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Date</th></tr></thead><tbody className="divide-y divide-navy/10">{recentTransactions.map((transaction) => <tr key={transaction.reference} className="text-sm"><td className="px-5 py-4 font-medium text-navy">{transaction.reference}</td><td className="px-4 py-4 text-steel">{transaction.description}</td><td className="px-4 py-4 font-medium text-ink">{transaction.amount}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${transaction.status === "Completed" ? "bg-[#e9f4ef] text-[#287754]" : "bg-[#fff4dc] text-[#a26c12]"}`}>{transaction.status}</span></td><td className="px-5 py-4 text-xs text-steel">{transaction.date}</td></tr>)}</tbody></table></div>
        </article>

        <article className="rounded-xl border border-navy/10 bg-navy p-6 text-white shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-gold"><FileText size={20} /></div>
          <h2 className="mt-5 text-lg font-semibold">Need help with a fund?</h2>
          <p className="mt-2 text-sm leading-6 text-stone/70">Create a new fund request or review the guidelines before submitting your next allocation.</p>
          <button type="button" onClick={() => setShowCreateFund(true)} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-midnight hover:bg-white">Open fund request</button>
        </article>
      </section>
      {showCreateFund && <CreateFundModal onClose={() => setShowCreateFund(false)} onCreate={createFund} />}
    </div>
  );
}
