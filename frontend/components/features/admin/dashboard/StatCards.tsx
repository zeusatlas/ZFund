"use client";

import { CircleDollarSign, Clock3, FilePlus2, Users } from "lucide-react";
import MetricCard from "@/components/ui/MetricCard";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { formatChange, formatCount, formatMoney } from "@/lib/format";
import { useDashboardOverview } from "./use-admin-dashboard";

export function StatCards() {
  const { data, isPending, isError, error, refetch } = useDashboardOverview();

  if (isPending) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
      </section>
    );
  }
  if (isError) return <ErrorNote message={(error as { message?: string }).message} onRetry={() => refetch()} />;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Funds generated"
        value={formatMoney(data.fundsGenerated.value)}
        detail={formatChange(data.fundsGenerated.changePct)}
        icon={CircleDollarSign}
        accent="green"
      />
      <MetricCard
        label="Active host accounts"
        value={formatCount(data.activeHosts.value)}
        detail={`+${data.activeHosts.newThisMonth} this month`}
        icon={Users}
        accent="blue"
      />
      <MetricCard
        label="Pending requests"
        value={formatCount(data.pendingRequests.value)}
        detail={`${data.pendingRequests.pendingHosts} hosts · ${data.pendingRequests.pendingOrganizations} organisations`}
        icon={Clock3}
        accent="gold"
      />
      <MetricCard
        label="Total transactions"
        value={formatCount(data.transactions.value)}
        detail={formatChange(data.transactions.changePct)}
        icon={FilePlus2}
        accent="purple"
      />
    </section>
  );
}
