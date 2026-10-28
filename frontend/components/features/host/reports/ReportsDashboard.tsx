"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Download, HeartHandshake, Repeat2, Sparkles, Users, Wallet } from "lucide-react";
import HostHeading from "@/components/features/host/shared/HostHeading";
import { TrendChart, OutcomeChart, chartColours } from "@/components/features/host/reports/ReportCharts";
import { money } from "@/components/features/host/shared/demo";
import RefreshData from "@/components/features/host/shared/RefreshData";
import { useCampaigns } from "@/components/features/host/campaigns/use-campaigns";
import { transactions, transactionsCsv } from "@/components/features/host/transactions/transactions";
import { buildReport, monthLabel } from "@/components/features/host/reports/reports";

const panel = "min-w-0 rounded-2xl border border-navy/10 bg-white p-5 sm:p-7";
export default function ReportsDashboard() {
  const campaigns = useCampaigns();
  const [month, setMonth] = useState("All");
  const [campaignId, setCampaignId] = useState("All");
  const [exportMessage, setExportMessage] = useState("");
  const report = buildReport(transactions, campaigns, month, campaignId);
  const months = [...new Set(transactions.map(item => item.date.slice(0,7)))].sort().reverse();
  const period = month === "All" ? "All recorded months" : monthLabel(month);
  const best = report.performance.find(campaign => campaign.raised > 0);
  const highest = Math.max(...report.performance.map(campaign => campaign.raised),1);
  const cards = [
    { label: "Total raised", value: money(report.raised), note: "Confirmed donations in this period", icon: Wallet, colour:"#0d9488", tint:"#f0fdfa" },
    { label: "Paid contributors", value: report.donors.toLocaleString("en-GH"), note: "Unique people who completed a payment", icon: Users, colour:"#7c3aed", tint:"#f5f3ff" },
    { label: "Average donation", value: money(report.average), note: "Per successful payment", icon: HeartHandshake, colour:"#2563eb", tint:"#eff6ff" },
    { label: "Payment success rate", value: report.successRate === null ? "—" : report.successRate.toFixed(1) + "%", note: report.paid.length + " of " + report.scoped.length + " payment attempts", icon: CheckCircle2, colour:"#c2410c", tint:"#fff7ed" },
  ];
  function exportData() {
    try {
      const names = Object.fromEntries(campaigns.map(campaign => [campaign.id,campaign.name]));
      const url = URL.createObjectURL(new Blob([transactionsCsv(report.scoped,names)], {type:"text/csv;charset=utf-8;"}));
      const link=document.createElement("a");link.href=url;link.download="raisefundz-report-transactions-" + (month === "All" ? "all-months" : month) + ".csv";
      document.body.appendChild(link);link.click();link.remove();window.setTimeout(() => URL.revokeObjectURL(url),1000);
      setExportMessage("Download started: " + report.scoped.length + " transactions for this report.");
    } catch { setExportMessage("The download could not be started. Please try again."); }
  }
  return <div className="mx-auto min-w-0 max-w-[1400px] py-3 md:py-5">
    <HostHeading title="See the bigger picture." description="Understand how your community gives, which campaigns lead the way, and where to focus next." />
    <div className="mb-7 flex flex-wrap items-end gap-4">
      <div className="min-w-0 flex-1 sm:max-w-56"><label htmlFor="report-month" className="text-xs font-medium text-steel">Reporting period</label><select id="report-month" value={month} onChange={event => {setMonth(event.target.value);setExportMessage("");}} className="mt-2 w-full rounded-xl border border-navy/15 bg-white px-3 py-3 text-sm text-navy"><option value="All">All recorded months</option>{months.map(value => <option key={value} value={value}>{monthLabel(value)}</option>)}</select></div>
      <div className="min-w-0 flex-1 sm:max-w-80"><label htmlFor="report-campaign" className="text-xs font-medium text-steel">Campaign</label><select id="report-campaign" value={campaignId} onChange={event => {setCampaignId(event.target.value);setExportMessage("");}} className="mt-2 w-full rounded-xl border border-navy/15 bg-white px-3 py-3 text-sm text-navy"><option value="All">All campaigns</option>{campaigns.map(campaign => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}</select></div>
      <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:ml-auto sm:w-auto"><RefreshData /><button type="button" onClick={exportData} disabled={!report.scoped.length} className="inline-flex items-center gap-2 rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm font-medium text-navy hover:bg-stone disabled:cursor-not-allowed disabled:opacity-40"><Download size={17} aria-hidden="true" />Export transactions</button></div>
    </div>
    <p role="status" className={exportMessage ? "mb-5 text-sm text-steel" : "sr-only"}>{exportMessage}</p>
    <section aria-label="Report summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({label,value,note,icon:Icon,colour,tint}) => <article key={label} className="min-w-0 rounded-2xl border border-navy/10 bg-white p-5"><div className="mb-6 flex items-center justify-between gap-3"><h2 className="text-sm text-steel">{label}</h2><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{backgroundColor:tint,color:colour}}><Icon size={19} aria-hidden="true" /></span></div><p className="break-words text-[clamp(24px,2.4vw,34px)] font-medium leading-tight tracking-tight tabular-nums text-navy">{value}</p><p className="mt-3 text-xs leading-relaxed text-steel">{note}</p></article>)}</section>
    <p role="status" className="mt-3 text-xs text-steel">{period} · {report.scoped.length} matching payment attempts. All charts reflect these filters.</p>
    {!report.scoped.length && <div className="mt-6 rounded-xl border border-navy/10 bg-white p-5"><p className="font-medium text-navy">No payments in this selection</p><p className="mt-1 text-sm text-steel">Choose another period or campaign to explore your contributions.</p><button type="button" onClick={() => {setMonth("All");setCampaignId("All");setExportMessage("");}} className="mt-3 text-sm font-medium text-navy underline underline-offset-4">Reset filters</button></div>}
    <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
      <section className={panel} aria-labelledby="donation-trend-title"><div className="mb-6 flex flex-wrap items-start justify-between gap-3"><div><h2 id="donation-trend-title" className="text-xl font-medium tracking-tight text-navy">The rhythm of giving</h2><p className="mt-1 text-sm text-steel">{month === "All" ? "Monthly" : "Daily"} successful donations · {period}</p></div><span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-800">{money(report.raised)}</span></div><TrendChart points={report.trend} daily={month !== "All"} /></section>
      <section className={panel} aria-labelledby="payment-outcomes-title"><h2 id="payment-outcomes-title" className="text-xl font-medium tracking-tight text-navy">Payment outcomes</h2><p className="mt-1 text-sm text-steel">A breakdown by number of attempts.</p><div className="mt-5"><OutcomeChart outcomes={report.outcomes} /></div></section>
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
      <section className={panel} aria-labelledby="campaign-performance-title"><div className="mb-7 flex flex-wrap justify-between gap-4"><div><h2 id="campaign-performance-title" className="text-xl font-medium tracking-tight text-navy">Campaign performance</h2><p className="mt-1 text-sm text-steel">Successful donations in the selected period.</p></div><Link href="/host/campaigns" className="inline-flex items-center gap-1 self-start text-sm font-medium text-navy">View campaigns<ArrowUpRight size={15} aria-hidden="true" /></Link></div>
        <ul className="space-y-6">{report.performance.map((campaign,index) => <li key={campaign.id}><div className="mb-2 flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-sm font-medium text-navy">{campaign.name}</h3><span className="text-sm font-medium tabular-nums text-navy">{money(campaign.raised)}</span></div><div className="h-3 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={campaign.name + ": " + money(campaign.raised)}><div className="h-full rounded-full" style={{width:(campaign.raised/highest*100) + "%",backgroundColor:chartColours[index%chartColours.length]}} /></div><p className="mt-2 text-xs text-steel">{campaign.gifts} successful {campaign.gifts === 1 ? "payment" : "payments"} · {campaign.donors} paid {campaign.donors === 1 ? "contributor" : "contributors"}</p></li>)}</ul>
        <p className="mt-6 border-t border-navy/10 pt-4 text-xs text-steel">Bars compare amounts raised, relative to the leading campaign in this selection.</p>
      </section>
      <aside className="min-w-0 rounded-2xl bg-navy p-6 text-white sm:p-7" aria-labelledby="report-insights-title"><div className="mb-7 flex items-center gap-2"><Sparkles size={19} aria-hidden="true" className="text-amber-300" /><h2 id="report-insights-title" className="text-xl font-medium tracking-tight">Worth a closer look</h2></div>
        <div className="space-y-7"><div><p className="text-xs text-white/65">Leading campaign</p><h3 className="mt-2 text-lg font-medium">{best ? best.name : "Your next contribution starts here"}</h3><p className="mt-2 text-sm leading-relaxed text-white/75">{best ? Math.round(best.raised/report.raised*100) + "% of the amount raised in this selection. Share a progress update with the people behind it." : "There are no successful contributions in this selection yet."}</p></div>
        <div className="border-t border-white/15 pt-6"><div className="flex items-center gap-2 text-violet-200"><Repeat2 size={17} aria-hidden="true" /><h3 className="text-sm font-medium">People who gave again</h3></div><p className="mt-3 text-3xl font-medium tabular-nums">{report.repeatDonors}<span className="ml-2 text-sm font-normal text-white/65">of {report.donors} paid contributors</span></p><p className="mt-2 text-sm leading-relaxed text-white/75">Contributors with more than one successful gift in this period. A thank-you and a project update can help keep them involved.</p></div>
        <div className="border-t border-white/15 pt-6"><h3 className="text-sm font-medium text-amber-200">Awaiting confirmation</h3><p className="mt-3 text-2xl font-medium tabular-nums">{money(report.pendingAmount)}</p><p className="mt-2 text-sm leading-relaxed text-white/75">Pending payments are excluded from the raised total. Check the payment records for their current status.</p><Link href="/host/transactions" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-white underline underline-offset-4">Review transactions<ArrowUpRight size={15} aria-hidden="true" /></Link></div></div>
      </aside>
    </div>
    <p className="mt-6 text-xs leading-relaxed text-steel">Based on recorded donation data. Average donation uses successful payments; success rate uses all payment attempts. Amounts are before withdrawals. Dates use Ghana time (GMT).</p>
  </div>;
}
