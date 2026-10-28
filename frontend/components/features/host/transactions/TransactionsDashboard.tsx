"use client";
import { useState } from "react";
import { CheckCircle2, Clock3, Download, Search, Wallet, XCircle } from "lucide-react";
import HostHeading from "@/components/features/host/shared/HostHeading";
import TransactionDetails from "@/components/features/host/transactions/TransactionDetails";
import { dateLabel, money } from "@/components/features/host/shared/demo";
import RefreshData from "@/components/features/host/shared/RefreshData";
import { useCampaigns } from "@/components/features/host/campaigns/use-campaigns";
import { emptyFilters, filterTransactions, transactionSummary, transactions, transactionsCsv, type Transaction } from "@/components/features/host/transactions/transactions";

const PAGE_SIZE = 7;
const controlClass = "mt-2 w-full rounded-xl border border-navy/15 bg-white px-3 py-2.5 text-sm text-navy";
function PaymentStatus({ status }: { status: Transaction["status"] }) {
  const Icon = status === "Paid" ? CheckCircle2 : status === "Pending" ? Clock3 : XCircle;
  const colour = status === "Paid" ? "bg-emerald-50 text-emerald-800" : status === "Pending" ? "bg-amber-50 text-amber-900" : "bg-crimson/10 text-crimson";
  return <span className={"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium " + colour}><Icon size={13} aria-hidden="true" />{status === "Paid" ? "Successful" : status}</span>;
}

export default function TransactionsDashboard() {
  const campaigns = useCampaigns();
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [exportMessage, setExportMessage] = useState("");
  const campaignNames = Object.fromEntries(campaigns.map(campaign => [campaign.id, campaign.name]));
  const visible = filterTransactions(transactions, filters);
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * PAGE_SIZE;
  const pageTransactions = visible.slice(offset, offset + PAGE_SIZE);
  const totals = transactionSummary(visible);
  const invalidDates = Boolean(filters.from && filters.to && filters.from > filters.to);
  const isFiltered = Boolean(filters.query.trim() || filters.campaignId !== "All" || filters.status !== "All" || filters.from || filters.to);
  function updateFilter(key: keyof typeof filters, value: string) {
    setFilters(current => ({ ...current, [key]: value }));
    setPage(1);
    setExportMessage("");
  }
  function clearFilters() { setFilters(emptyFilters); setPage(1); setExportMessage(""); }
  function exportCsv() {
    try {
      const blob = new Blob([transactionsCsv(visible, campaignNames)], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "raisefundz-transactions-" + new Date().toISOString().slice(0, 10) + ".csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExportMessage("CSV download started for " + visible.length + " transactions.");
    } catch { setExportMessage("The export could not be started. Please try again."); }
  }
  const cards = [
    { label: "Total received", value: money(totals.received), note: "Successful payments only", icon: Wallet },
    { label: "Successful payments", value: totals.paid, note: "Confirmed contributions", icon: CheckCircle2 },
    { label: "Pending payments", value: totals.pending, note: "Awaiting confirmation", icon: Clock3 },
    { label: "Failed payments", value: totals.failed, note: "No funds received", icon: XCircle },
  ];
  return <div className="mx-auto min-w-0 max-w-[1400px] py-3 md:py-5">
    <HostHeading title="Your transactions" description="Follow every donation, from the first payment request to a confirmed contribution." />
    <section aria-label="Transaction summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, note, icon: Icon }, index) => <article key={label} className={"min-w-0 rounded-2xl border p-5 lg:p-6 " + (index === 0 ? "border-navy bg-navy text-white" : "border-navy/10 bg-white text-navy")}>
      <div className="mb-7 flex items-center justify-between gap-3"><h2 className={"text-sm " + (index === 0 ? "text-white/85" : "text-steel")}>{label}</h2><Icon size={20} aria-hidden="true" className={index === 0 ? "text-gold" : "text-steel"} /></div>
      <p className="break-words text-[clamp(24px,2.4vw,34px)] font-medium leading-tight tracking-tight tabular-nums">{value}</p><p className={"mt-3 text-xs " + (index === 0 ? "text-white/70" : "text-steel")}>{note}</p>
    </article>)}</section>
    <p className="mt-3 text-xs text-steel">{isFiltered ? "Summary reflects the current filters." : "Summary covers all transactions."} Amounts are in Ghana cedis.</p>
    <section className="mt-10" aria-labelledby="payment-history-title">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div><h2 id="payment-history-title" className="text-xl font-medium tracking-tight text-navy">Payment history</h2><p className="mt-1 text-sm text-steel">Select a transaction to view its payment details.</p></div><div className="flex flex-wrap items-center gap-3"><RefreshData /><button type="button" onClick={exportCsv} disabled={!visible.length || invalidDates} className="inline-flex items-center gap-2 rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-sm font-medium text-navy hover:bg-stone disabled:cursor-not-allowed disabled:opacity-40"><Download size={17} aria-hidden="true" />Export CSV</button></div></div>
      <div className="mb-6 rounded-2xl border border-navy/10 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_minmax(180px,1fr)_150px]">
          <div><label htmlFor="transaction-search" className="text-xs font-medium text-steel">Search transactions</label><div className="relative"><Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-5 text-steel" /><input id="transaction-search" value={filters.query} onChange={event => updateFilter("query", event.target.value)} placeholder="Reference or visible phone digits" className={controlClass + " pl-10"} /></div></div>
          <div><label htmlFor="transaction-campaign" className="text-xs font-medium text-steel">Campaign</label><select id="transaction-campaign" value={filters.campaignId} onChange={event => updateFilter("campaignId", event.target.value)} className={controlClass}><option value="All">All campaigns</option>{campaigns.map(campaign => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}</select></div>
          <div><label htmlFor="transaction-status" className="text-xs font-medium text-steel">Payment status</label><select id="transaction-status" value={filters.status} onChange={event => updateFilter("status", event.target.value)} className={controlClass}><option value="All">All statuses</option><option value="Paid">Successful</option><option value="Pending">Pending</option><option value="Failed">Failed</option></select></div>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-4"><div className="min-w-0 flex-1 sm:max-w-56"><label htmlFor="transaction-from" className="text-xs font-medium text-steel">From date</label><input id="transaction-from" type="date" value={filters.from} max={filters.to || undefined} onChange={event => updateFilter("from", event.target.value)} aria-invalid={invalidDates} aria-describedby={invalidDates ? "date-range-error" : undefined} className={controlClass} /></div><div className="min-w-0 flex-1 sm:max-w-56"><label htmlFor="transaction-to" className="text-xs font-medium text-steel">To date</label><input id="transaction-to" type="date" value={filters.to} min={filters.from || undefined} onChange={event => updateFilter("to", event.target.value)} aria-invalid={invalidDates} aria-describedby={invalidDates ? "date-range-error" : undefined} className={controlClass} /></div><button type="button" onClick={clearFilters} className="rounded-lg px-3 py-3 text-sm font-medium text-steel underline underline-offset-4 hover:text-navy">Clear filters</button></div>
        {invalidDates && <p id="date-range-error" role="alert" className="mt-3 text-sm text-crimson">The end date must be on or after the start date.</p>}
      </div>
      <div className="mb-3 flex flex-wrap justify-between gap-2 text-xs text-steel"><p role="status">Showing {visible.length ? offset + 1 : 0}–{offset + pageTransactions.length} of {visible.length} transactions</p><p>Newest first · Ghana time (GMT)</p></div>
      <p role="status" className={exportMessage ? "mb-4 text-sm text-steel" : "sr-only"}>{exportMessage}</p>
      <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white">
        {!visible.length ? <div className="px-6 py-16 text-center"><Search size={28} aria-hidden="true" className="mx-auto mb-4 text-steel" /><h3 className="text-lg font-medium text-navy">{invalidDates ? "Check your date range" : "No transactions found"}</h3><p className="mt-2 text-sm text-steel">{invalidDates ? "Choose a valid range to see matching payments." : "Try another search or clear your filters to see all payments."}</p><button type="button" onClick={clearFilters} className="mt-5 rounded-xl bg-navy px-4 py-2.5 text-sm text-white">Clear filters</button></div> : <>\n          <div className="divide-y divide-navy/10 md:hidden">{pageTransactions.map(item=><button type="button" key={item.id} onClick={()=>setSelected(item)} className="block w-full p-5 text-left hover:bg-stone-light focus-visible:bg-stone-light"><div className="flex items-start justify-between gap-4"><div><span className="font-medium text-navy">{item.id}</span><span className="mt-1 block text-xs text-steel">{item.phone}</span></div><span className="font-medium tabular-nums text-navy">{money(item.amount)}</span></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-steel">{campaignNames[item.campaignId] ?? item.campaignId}</span><PaymentStatus status={item.status}/></div><p className="mt-3 text-xs text-steel">{dateLabel(item.date)} · {item.time.slice(0,5)} GMT · View details →</p></button>)}</div><div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[1050px] text-left text-sm"><caption className="sr-only">Filtered donation transactions. Open a reference for full payment details.</caption><thead className="border-b border-navy/10 bg-stone/50 text-xs text-steel"><tr>{["Reference / donor", "Campaign", "Amount", "Payment method", "Status", "Date and time"].map(label => <th key={label} scope="col" className={"px-5 py-4 font-medium " + (label === "Amount" ? "text-right" : "")}>{label}</th>)}</tr></thead><tbody>{pageTransactions.map(item => <tr key={item.id} onClick={() => setSelected(item)} className="cursor-pointer border-b border-navy/10 transition-colors last:border-0 hover:bg-stone-light"><td className="px-5 py-4"><button type="button" onClick={event => { event.stopPropagation(); setSelected(item); }} aria-label={"View transaction " + item.reference} className="rounded text-left font-medium text-navy underline decoration-navy/30 underline-offset-4">{item.id}</button><span className="mt-1 block text-xs text-steel">{item.phone}</span></td><td className="max-w-56 px-5 py-4 text-steel">{campaignNames[item.campaignId] ?? item.campaignId}</td><td className="whitespace-nowrap px-5 py-4 text-right font-medium tabular-nums text-navy">{money(item.amount)}</td><td className="px-5 py-4 text-steel">{item.method}</td><td className="px-5 py-4"><PaymentStatus status={item.status} /></td><td className="whitespace-nowrap px-5 py-4 text-steel">{dateLabel(item.date)}<span className="mt-1 block text-xs">{item.time.slice(0,5)} GMT</span></td></tr>)}</tbody></table></div></>}
      </div>
      {visible.length > 0 && <nav aria-label="Transaction pagination" className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-sm text-steel">Page {currentPage} of {totalPages}</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} className="rounded-xl border border-navy/20 bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-stone disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
          <button type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-xl border border-navy/20 bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-stone disabled:cursor-not-allowed disabled:opacity-40">Next</button>
        </div>
      </nav>}
      <p className="mt-5 text-xs leading-relaxed text-steel">Pending and failed payments never count towards total received. Donor numbers stay masked in the table, details, and export.</p>
    </section>
    <TransactionDetails transaction={selected} campaignName={selected ? campaignNames[selected.campaignId] ?? selected.campaignId : ""} onClose={() => setSelected(null)} />
  </div>;
}
