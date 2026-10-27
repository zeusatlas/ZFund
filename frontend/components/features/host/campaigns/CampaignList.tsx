"use client";
import { useState } from "react";
import { Search, FolderHeart, MapPin } from "lucide-react";
import { campaignTotals, dateLabel, money, type CampaignStatus } from "@/components/features/host/shared/demo";

import { useCampaigns } from "@/components/features/host/campaigns/use-campaigns";
import CreateCampaignModal from "@/components/features/host/campaigns/CreateCampaignModal";
import Select from "react-select";
import { getSelectStyles } from "@/components/ui/selectStyles";

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "raised", label: "Most raised" },
  { value: "name", label: "Campaign name" },
];

function StatusBadge({ status }: { status: CampaignStatus }) {
  const style = status === "Active" ? "bg-emerald-50 text-emerald-800" : status === "Completed" ? "bg-navy/10 text-navy" : "bg-stone text-steel";
  return <span className={"inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium " + style}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}

export default function CampaignList({ compact = false }: { compact?: boolean }) {
  const campaigns = useCampaigns();
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");
  const filtered = campaigns.filter(campaign => (status === "All" || campaign.status === status) && [campaign.name, campaign.location, campaign.id, campaign.category].join(" ").toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => sort === "raised" ? campaignTotals(b.id).raised - campaignTotals(a.id).raised : sort === "name" ? a.name.localeCompare(b.name) : b.created.localeCompare(a.created));
  const visible = compact ? campaigns.filter(campaign => campaign.status === "Active") : filtered;
  return <div>
    {!compact && <div className="mb-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-steel">Bring your next cause to life.</p>
        <CreateCampaignModal onCreated={name => { setQuery(""); setStatus("All"); setSort("newest"); setNotice(name + " was created as a draft and saved in this browser."); }} />
      </div>
      <p role="status" className={notice ? "rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900" : "sr-only"}>{notice}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search aria-hidden="true" size={18} className="pointer-events-none absolute left-4 top-3.5 text-steel" /><label htmlFor="campaign-search" className="sr-only">Search campaigns</label><input id="campaign-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by campaign, location or ID" className="w-full rounded-xl border border-navy/15 bg-white py-3 pl-11 pr-4 text-sm text-navy placeholder:text-steel/75" /></div>
        <div className="w-full sm:w-52">
          <label htmlFor="campaign-sort" className="sr-only">Sort campaigns</label>
          <Select
            inputId="campaign-sort"
            instanceId="campaign-sort-select"
            value={sortOptions.find(opt => opt.value === sort)}
            onChange={opt => { if (opt) setSort(opt.value); }}
            options={sortOptions}
            isSearchable={false}
            styles={getSelectStyles({ minHeight: "46px" })}
            aria-label="Sort campaigns"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by campaign status">{["All", "Active", "Completed", "Draft"].map(filter => <button type="button" key={filter} aria-pressed={status === filter} onClick={() => setStatus(filter)} className={"rounded-full px-4 py-2 text-sm transition-colors " + (status === filter ? "bg-navy text-white" : "bg-white text-steel hover:bg-stone")}>{filter} <span className="ml-2 opacity-75">{filter === "All" ? campaigns.length : campaigns.filter(c => c.status === filter).length}</span></button>)}</div>
      <p role="status" className="text-sm text-steel">Showing {filtered.length} of {campaigns.length} campaigns</p>
    </div>}
    <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white">
      {visible.length === 0 ? <div className="px-6 py-16 text-center"><Search aria-hidden="true" size={28} className="mx-auto mb-4 text-steel" /><h3 className="text-lg font-medium text-navy">No campaigns match your search</h3><p className="mt-2 text-sm text-steel">Try another name or choose a different status.</p><button type="button" onClick={() => { setQuery(""); setStatus("All"); }} className="mt-5 rounded-lg bg-navy px-4 py-2 text-sm text-white">Clear filters</button></div> : visible.map(campaign => {
        const totals = campaignTotals(campaign.id);
        const percent = Math.round(totals.raised / campaign.goal * 100);
        return <details key={campaign.id} className="group border-b border-navy/10 last:border-b-0">
          <summary className="cursor-pointer list-none p-5 transition-colors hover:bg-stone-light [&::-webkit-details-marker]:hidden md:p-6">
            <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(180px,1fr)_100px]">
              <div className="flex min-w-0 items-start gap-4"><div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone text-navy sm:flex"><FolderHeart aria-hidden="true" size={21} /></div><div className="min-w-0"><h3 className="font-medium text-navy">{campaign.name}</h3><p className="mt-1 text-xs text-steel">{campaign.id} · {campaign.category}</p><p className="mt-2 flex items-center gap-1 text-xs text-steel"><MapPin aria-hidden="true" size={12} />{campaign.location}</p></div></div>
              <div><div className="mb-2 flex flex-wrap items-baseline justify-between gap-2"><span className="text-sm font-medium tabular-nums text-navy">{money(totals.raised)}</span><span className="text-xs tabular-nums text-steel">{percent}%</span></div><progress aria-label={campaign.name + " fundraising progress"} value={totals.raised} max={campaign.goal} className="block h-1.5 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-stone [&::-webkit-progress-value]:bg-gold [&::-moz-progress-bar]:bg-gold" /><p className="mt-2 text-xs text-steel">of {money(campaign.goal)} goal · {totals.contributors} paid {totals.contributors === 1 ? "contributor" : "contributors"}</p></div>
              <div className="flex items-center justify-between gap-3 lg:block lg:text-right"><StatusBadge status={campaign.status} /><span className="mt-3 text-xs text-steel group-open:hidden lg:block">View details +</span><span className="mt-3 hidden text-xs text-steel group-open:block">Close details −</span></div>
            </div>
          </summary>
          <div className="grid gap-6 border-t border-navy/10 bg-stone-light p-6 md:grid-cols-2"><p className="max-w-xl text-sm leading-relaxed text-steel">{campaign.description}</p><dl className="grid grid-cols-2 gap-4 text-sm"><div><dt className="text-steel">Created</dt><dd className="mt-1 font-medium text-navy">{dateLabel(campaign.created)}</dd></div><div><dt className="text-steel">{campaign.status === "Completed" ? "Closed" : "Closing date"}</dt><dd className="mt-1 font-medium text-navy">{dateLabel(campaign.closing)}</dd></div></dl></div>
        </details>;
      })}
    </div>
  </div>;
}
