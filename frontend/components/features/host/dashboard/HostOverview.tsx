"use client";

import Link from "next/link";
import { ArrowUpRight, Wallet, FolderHeart, Users, Radio, AlertCircle, RotateCcw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import CampaignList from "@/components/features/host/campaigns/CampaignList";
import CreateCampaignModal from "@/components/features/host/campaigns/CreateCampaignModal";
import HostHeading from "@/components/features/host/shared/HostHeading";
import { money } from "@/components/features/host/shared/demo";
import RefreshData from "@/components/features/host/shared/RefreshData";
import MetricCard from "@/components/ui/MetricCard";
import {
  useCampaignsList,
  useProjectStatsQuery,
} from "@/components/features/host/campaigns/use-campaigns";

export default function HostOverview() {
  const queryClient = useQueryClient();
  const {
    data: statsData,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: statsError,
    refetch: refetchStats,
  } = useProjectStatsQuery();

  const {
    campaigns,
    isLoading: isLoadingCampaigns,
    isError: isErrorCampaigns,
    refetch: refetchCampaigns,
  } = useCampaignsList();

  const handleRefresh = async () => {
    await Promise.all([
      refetchStats(),
      refetchCampaigns(),
      queryClient.invalidateQueries({ queryKey: ["projects"] }),
      queryClient.invalidateQueries({ queryKey: ["contributions"] }),
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] }),
    ]);
  };

  const isInitialLoading = isLoadingStats && isLoadingCampaigns && campaigns.length === 0;

  // Real values loaded from PostgreSQL database
  const totalRaised = statsData?.totalRaised ?? campaigns.reduce((sum, c) => sum + (c.raised || 0), 0);
  const campaignsCreated = statsData?.campaignsCreated ?? campaigns.length;
  const contributorsPaid = statsData?.contributorsPaid ?? campaigns.reduce((sum, c) => sum + (c.contributors || 0), 0);
  const activeCampaigns = statsData?.activeCampaigns ?? campaigns.filter((c) => c.status === "Active").length;

  const stats = [
    {
      label: "Total money raised",
      value: isInitialLoading ? (
        <span className="inline-block animate-pulse opacity-60">···</span>
      ) : (
        money(totalRaised)
      ),
      detail: "All successful contributions",
      icon: Wallet,
      accent: "green" as const,
    },
    {
      label: "Campaigns created",
      value: isInitialLoading ? (
        <span className="inline-block animate-pulse opacity-60">···</span>
      ) : (
        campaignsCreated.toLocaleString()
      ),
      detail: "Across all campaign statuses",
      icon: FolderHeart,
      accent: "blue" as const,
    },
    {
      label: "Contributors who paid",
      value: isInitialLoading ? (
        <span className="inline-block animate-pulse opacity-60">···</span>
      ) : (
        contributorsPaid.toLocaleString()
      ),
      detail: "Unique contributors · Paid only",
      icon: Users,
      accent: "gold" as const,
    },
    {
      label: "Active campaigns",
      value: isInitialLoading ? (
        <span className="inline-block animate-pulse opacity-60">···</span>
      ) : (
        activeCampaigns.toLocaleString()
      ),
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
        <RefreshData onRefresh={handleRefresh} />
      </HostHeading>

      {/* Database Error Banner if queries fail */}
      {(isErrorStats || isErrorCampaigns) && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-crimson/20 bg-crimson/5 p-4 text-sm text-crimson"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="shrink-0" />
            <span>
              Failed to load live database metrics:{" "}
              {(statsError as Error)?.message || "Database connection error."}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 rounded-lg bg-crimson px-3 py-1.5 text-xs font-medium text-white hover:bg-crimson/90 transition-colors"
          >
            <RotateCcw size={13} />
            Retry
          </button>
        </div>
      )}

      {/* Real Statistics Metric Cards */}
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

      {/* Active Campaigns Section */}
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
            <CreateCampaignModal onCreated={handleRefresh} />
            <Link
              href="/host/withdrawals"
              className="inline-flex items-center gap-2 rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm font-medium text-navy hover:bg-stone transition-colors"
            >
              <Wallet size={17} aria-hidden="true" />
              Request withdrawal
            </Link>
            <Link
              href="/host/campaigns"
              className="inline-flex items-center gap-2 rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm font-medium text-navy hover:bg-stone transition-colors"
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
