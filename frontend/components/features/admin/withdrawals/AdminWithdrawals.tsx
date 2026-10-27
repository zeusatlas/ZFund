"use client";

import { Check, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { withdrawalRequests, type WithdrawalRequest, type WithdrawalStatus } from "./data";

function StatusBadge({ status }: { status: WithdrawalStatus }) {
  const styles = {
    Pending: "bg-[#fff4dc] text-[#8b5d0d]",
    Approved: "bg-[#e9f4ef] text-[#216746]",
    Rejected: "bg-[#fbeaea] text-[#a13d3d]",
  };

  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>{status}</span>;
}

export default function AdminWithdrawals() {
  const [requests, setRequests] = useState(withdrawalRequests);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [notice, setNotice] = useState("");

  const visibleRequests = useMemo(() => requests.filter((request) => {
    const matchesQuery = !query || `${request.id} ${request.host}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === "All statuses" || request.status === status);
  }), [query, requests, status]);

  function updateStatus(request: WithdrawalRequest, nextStatus: WithdrawalStatus) {
    setRequests((current) => current.map((item) => item.id === request.id ? { ...item, status: nextStatus } : item));
    setNotice(`${request.id} was ${nextStatus.toLowerCase()}.`);
  }

  const pendingCount = requests.filter((request) => request.status === "Pending").length;
  const pendingAmount = requests.filter((request) => request.status === "Pending").reduce((total, request) => total + Number(request.amount.replace("GHS ", "").replace(/,/g, "")), 0);

  return (
    <div className="w-full space-y-6">
      <section>
        <h1 className="text-2xl font-semibold uppercase tracking-tight text-navy md:text-3xl">Withdrawals</h1>
        <p className="mt-2 text-sm text-steel">Review and manage withdrawal requests from your hosts.</p>
      </section>

      <section className="grid overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm sm:grid-cols-3">
        <div className="border-b border-navy/10 p-5 sm:border-b-0 sm:border-r"><p className="text-sm text-steel">Pending requests</p><p className="mt-2 text-2xl font-bold text-navy">{pendingCount}</p></div>
        <div className="border-b border-navy/10 p-5 sm:border-b-0 sm:border-r"><p className="text-sm text-steel">Pending amount</p><p className="mt-2 text-2xl font-bold text-navy">GHS {pendingAmount.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</p></div>
        <div className="p-5"><p className="text-sm text-steel">Review queue</p><p className="mt-2 text-2xl font-bold text-navy">{pendingCount ? "Needs attention" : "All clear"}</p></div>
      </section>

      {notice && <div className="flex items-center gap-2 rounded-lg border border-[#cfe6d9] bg-[#f1faf4] px-4 py-3 text-sm text-[#287754]"><Check size={16} />{notice}</div>}

      <section className="overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-navy/10 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5"><div className="relative w-full sm:max-w-xs"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search requests" className="w-full rounded-lg border border-navy/15 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-gold" /></div><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-navy/15 bg-white px-3 py-2.5 text-sm text-steel outline-none focus:border-gold"><option>All statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option></select></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-stone-light text-xs uppercase tracking-wide text-steel"><tr><th className="px-5 py-3 font-medium">Host</th><th className="px-4 py-3 font-medium">Amount</th><th className="px-4 py-3 font-medium">Destination</th><th className="px-4 py-3 font-medium">Requested</th><th className="px-4 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Action</th></tr></thead><tbody className="divide-y divide-navy/10">{visibleRequests.map((request) => <tr key={request.id} className="text-sm"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-medium text-white">{request.initials}</span><div><p className="font-medium text-ink">{request.host}</p><p className="text-xs text-steel">{request.id}</p></div></div></td><td className="px-4 py-4 font-semibold text-navy">{request.amount}</td><td className="px-4 py-4 font-mono text-xs text-steel">{request.destination}</td><td className="px-4 py-4 text-xs text-steel">{request.requestedAt}</td><td className="px-4 py-4"><StatusBadge status={request.status} /></td><td className="px-5 py-4">{request.status === "Pending" ? <div className="flex gap-2"><button type="button" onClick={() => updateStatus(request, "Approved")} className="inline-flex items-center gap-1 rounded-md bg-navy px-2.5 py-1.5 text-xs font-medium text-white hover:bg-steel"><Check size={13} /> Approve</button><button type="button" onClick={() => updateStatus(request, "Rejected")} className="inline-flex items-center gap-1 rounded-md border border-[#e8bcbc] px-2.5 py-1.5 text-xs font-medium text-crimson hover:bg-[#fbeaea]"><X size={13} /> Reject</button></div> : <span className="text-xs text-steel">Reviewed</span>}</td></tr>)}</tbody></table></div>{visibleRequests.length === 0 && <p className="p-8 text-center text-sm text-steel">No withdrawal requests found.</p>}
      </section>
    </div>
  );
}
