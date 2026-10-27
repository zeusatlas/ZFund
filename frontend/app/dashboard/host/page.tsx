import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Plus, Wallet, FolderHeart, Users, Radio } from "lucide-react";
import CampaignList from "@/app/dashboard/host/_components/CampaignList";
import CampaignCount from "./_components/CampaignCount";
import HostHeading from "@/app/dashboard/host/_components/HostHeading";
import { hostStats, money } from "@/app/dashboard/host/_data/demo";
import RefreshData from "./_components/RefreshData";

export const metadata: Metadata = { title: "Host dashboard | ZFund" };
export default function HostDashboardPage() {
  const stats = [
    {
      title: "Total money raised",
      value: money(hostStats.raised),
      note: "All successful contributions",
      icon: Wallet,
    },
    {
      title: "Campaigns created",
      value: <CampaignCount />,
      note: "Across all campaign statuses",
      icon: FolderHeart,
    },
    {
      title: "Contributors who paid",
      value: hostStats.contributors,
      note: "Unique contributors · Paid only",
      icon: Users,
    },
    {
      title: "Active campaigns",
      value: hostStats.active,
      note: "Currently collecting contributions",
      icon: Radio,
    },
  ];
  return (
    <div className="mx-auto max-w-[1400px] py-3 md:py-5">
      <HostHeading
        title="Your impact, at a glance."
        description="Keep track of what your community has raised and the campaigns bringing people together."
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div className="flex flex-wrap gap-3"><Link href="/dashboard/host/campaigns" className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-steel"><Plus size={17} aria-hidden="true" />Create campaign</Link><Link href="/dashboard/host/withdrawals" className="inline-flex items-center gap-2 rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm font-medium text-navy hover:bg-stone"><Wallet size={17} aria-hidden="true" />Request withdrawal</Link></div><RefreshData /></div>
      <section
        aria-label="Fundraising statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map(({ title, value, note, icon: Icon }, index) => (
          <article
            key={title}
            className={
              "min-w-0 rounded-2xl border p-5 lg:p-6 " +
              (index === 0
                ? "border-navy bg-navy text-white"
                : "border-navy/10 bg-white text-navy")
            }
          >
            <div className="mb-7 flex items-center justify-between gap-3">
              <h2
                className={
                  "text-sm " + (index === 0 ? "text-white/85" : "text-steel")
                }
              >
                {title}
              </h2>
              <Icon
                aria-hidden="true"
                size={20}
                className={index === 0 ? "text-gold" : "text-steel"}
              />
            </div>
            <p className="break-words text-[clamp(24px,2.4vw,34px)] font-medium leading-tight tracking-tight tabular-nums">
              {value}
            </p>
            <p
              className={
                "mt-3 text-xs leading-relaxed " +
                (index === 0 ? "text-white/70" : "text-steel")
              }
            >
              {note}
            </p>
          </article>
        ))}
      </section>
      <section className="mt-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium tracking-tight text-navy">
              Campaigns in motion
            </h2>
            <p className="mt-1 text-sm text-steel">
              Your active fundraisers and how far they have come.
            </p>
          </div>
          <Link
            href="/dashboard/host/campaigns"
            className="inline-flex items-center gap-2 rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-sm font-medium text-navy hover:bg-stone"
          >
            All campaigns <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <CampaignList compact />
      </section>
      <p className="mt-6 text-xs leading-relaxed text-steel">
        Total raised counts successful contributions before any withdrawals.
        Pending and failed payments are excluded.
      </p>
    </div>
  );
}
