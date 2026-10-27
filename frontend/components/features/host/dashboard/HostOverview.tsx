import Link from "next/link";
import { ArrowUpRight, Plus, Wallet, FolderHeart, Users, Radio } from "lucide-react";
import CampaignList from "@/components/features/host/campaigns/CampaignList";
import HostHeading from "@/components/features/host/shared/HostHeading";
import { hostStats, money } from "@/components/features/host/shared/demo";
import RefreshData from "@/components/features/host/shared/RefreshData";
import MetricCard from "@/components/ui/MetricCard";

export default function HostOverview() {
  const stats = [
    {
      label: "Total money raised",
      value: money(hostStats.raised),
      detail: "All successful contributions",
      icon: Wallet,
      accent: "green" as const,
    },
    {
      label: "Campaigns created",
      value: hostStats.campaigns,
      detail: "Across all campaign statuses",
      icon: FolderHeart,
      accent: "blue" as const,
    },
    {
      label: "Contributors who paid",
      value: hostStats.contributors,
      detail: "Unique contributors · Paid only",
      icon: Users,
      accent: "gold" as const,
    },
    {
      label: "Active campaigns",
      value: hostStats.active,
      detail: "Currently collecting contributions",
      icon: Radio,
      accent: "purple" as const,
    },
  ];
  return (
    <div className="w-full space-y-7">
      <HostHeading
        title="Your impact, at a glance."
        description="Keep track of what your community has raised and the campaigns bringing people together."
      >
        <RefreshData />
      </HostHeading>
      <section
        aria-label="Fundraising statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map(({ label, value, detail, icon: Icon, accent }) => (
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
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/host/campaigns"
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-steel"
            >
              <Plus size={17} aria-hidden="true" />
              Create campaign
            </Link>
            <Link
              href="/host/withdrawals"
              className="inline-flex items-center gap-2 rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm font-medium text-navy hover:bg-stone"
            >
              <Wallet size={17} aria-hidden="true" />
              Request withdrawal
            </Link>
            <Link
              href="/host/campaigns"
              className="inline-flex items-center gap-2 rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm font-medium text-navy hover:bg-stone"
            >
              All campaigns <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
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
