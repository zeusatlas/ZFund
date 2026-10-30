"use client";

import Link from "next/link";
import { ArrowUpRight, Wallet, FolderHeart, Users, Radio, AlertCircle, RotateCcw, Percent, CheckCircle2 } from "lucide-react";
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

  // Dynamically calculate total platform commission based on each campaign's individual commission percentage
  const commission = campaigns.reduce((sum, c) => {
    const rate = (c.commissionPercentage ?? 14) / 100;
    return sum + Math.round((c.raised || 0) * rate);
  }, 0);
  const netRaised = totalRaised - commission;

  // Average or effective commission rate
  const effectiveRate = totalRaised > 0
    ? ((commission / totalRaised) * 100).toFixed(1)
    : (campaigns.length > 0 ? (campaigns.reduce((sum, c) => sum + (c.commissionPercentage ?? 14), 0) / campaigns.length).toFixed(1) : "14.0");
  const effectiveNetRate = (100 - parseFloat(effectiveRate)).toFixed(1);

  const stats = [
    {
      label: "Total gross raised",
      value: isInitialLoading ? (
        <span className="inline-block animate-pulse opacity-60">···</span>
      ) : (
        money(totalRaised)
      ),
      detail: "Gross successful contributions",
      icon: Wallet,
      accent: "green" as const,
    },
    {
      label: `Platform fee (${effectiveRate}%)`,
      value: isInitialLoading ? (
        <span className="inline-block animate-pulse opacity-60">···</span>
      ) : (
        money(commission)
      ),
      detail: "Dynamically calculated per campaign",
      icon: Percent,
      accent: "gold" as const,
    },
    {
      label: `Net credited (${effectiveNetRate}%)`,
      value: isInitialLoading ? (
        <span className="inline-block animate-pulse opacity-60">···</span>
      ) : (
        money(netRaised)
      ),
      detail: "Net available for your projects",
      icon: CheckCircle2,
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
      accent: "purple" as const,
    },
    {
      label: "Active campaigns",
      value: isInitialLoading ? (
        <span className="inline-block animate-pulse opacity-60">···</span>
      ) : (
        activeCampaigns.toLocaleString()
      ),
      detail: "Currently accepting contributions",
      icon: Radio,
      accent: "blue" as const,
    },
  ];

  return (
    <div className="w-full space-y-7">
      <HostHeading
        title="Your impact, at a glance."
        description="Keep track of what your community has raised, transparent platform fees, and campaigns in motion."
      >
        <RefreshData onRefresh={handleRefresh} />
      </HostHeading>

      {/* Database Error Banner if queries fail */}
      {(isErrorStats || isErrorCampaigns) && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 border border-crimson/20 bg-crimson/5 p-4 text-sm text-crimson"
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

      {/* Commission Transparency Banner */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-navy/10 bg-white p-4 text-xs text-navy shadow-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-gold/15 text-gold font-bold text-sm">
            %
          </div>
          <div>
            <p className="font-semibold text-navy">14% Platform Fee Transparency</p>
            <p className="text-steel mt-0.5">
              A standard 14% platform commission is charged on all received donations to support secure USSD access, payment gateway integrations, and instant settlement infrastructure. 86% of every contribution goes directly to your campaign.
            </p>
          </div>
        </div>
        <Link
          href="/host/withdrawals"
          className="inline-flex shrink-0 items-center gap-1 font-semibold text-navy hover:text-gold transition-colors"
        >
          Payouts & balances <ArrowUpRight size={14} />
        </Link>
      </div> */}

      {/* Real Statistics Metric Cards */}
      <section
        aria-label="Fundraising statistics"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
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
            <h2 className="text-lg font-semibold tracking-tight text-navy sm:text-xl">
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
        Total gross raised counts successful contributions before platform commission and withdrawals.
        Pending and failed payments are excluded.
      </p>
    </div>
  );
}
