"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CircleDollarSign, Clock3, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import MetricCard from "@/components/ui/MetricCard";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { formatCount, formatMoney, timeAgo } from "@/lib/format";
import { format } from "date-fns";
import RowMenu from "@/components/ui/RowMenu";
import { useHostDetail } from "../admin-api";
import { CampaignStatusBadge } from "../campaigns/campaign-status";
import StatusBadge from "./StatusBadge";

const accents = ["blue", "green", "gold", "purple"] as const;

export default function UserDetails({ userId }: { userId: string }) {
  const { data, isPending, isError, error, refetch } = useHostDetail(userId);
  const router = useRouter();

  const back = (
    <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm font-medium text-steel hover:text-navy">
      <ArrowLeft size={16} />
      Back to host accounts
    </Link>
  );

  if (isPending) {
    return (
      <div className="w-full space-y-6">
        {back}
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }
  if (isError) {
    const notFound = (error as { status?: number }).status === 404;
    return (
      <div className="w-full space-y-6">
        {back}
        <ErrorNote message={notFound ? "This host could not be found." : (error as { message?: string }).message} onRetry={notFound ? undefined : () => refetch()} />
      </div>
    );
  }

  const { host, stats, funds } = data;
  const name = `${host.firstName} ${host.lastName}`;
  const initials = `${host.firstName[0] ?? ""}${host.lastName[0] ?? ""}`.toUpperCase();
  const lastAccess = host.lastActiveAt ? timeAgo(host.lastActiveAt) : "Not signed in yet";

  const cards = [
    { label: "Total funds", value: formatMoney(stats.totalFunds), icon: CircleDollarSign },
    { label: "This month", value: formatMoney(stats.fundsThisMonth), icon: ArrowUpRight },
    { label: "Transactions", value: formatCount(stats.transactions), icon: FileText },
    { label: "Last access", value: lastAccess, icon: Clock3 },
  ];

  return (
    <div className="w-full space-y-6">
      {back}

      <section className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-base font-medium text-white">{initials}</span>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-navy">{name}</h1>
              <StatusBadge status={host.status} />
            </div>
            <p className="mt-1 text-sm text-steel">{[host.email, host.phone].filter(Boolean).join(" · ")}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon }, index) => (
          <MetricCard key={label} label={label} value={value} icon={icon} accent={accents[index]} />
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-navy/10 p-5 md:p-6">
          <div>
            <h2 className="font-semibold text-navy">Campaigns</h2>
            <p className="mt-1 text-sm text-steel">Every campaign created by this host.</p>
          </div>
          <span className="rounded-full bg-stone px-3 py-1 text-xs font-medium text-steel">{funds.length} campaigns</span>
        </div>

        {funds.length === 0 ? (
          <p className="p-8 text-center text-sm text-steel">This host has not created any campaigns yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-stone-light text-xs uppercase tracking-wide text-steel">
                <tr>
                  <th className="px-5 py-3 font-medium">Campaign</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Raised</th>
                  <th className="px-4 py-3 font-medium">Contributions</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                {funds.map((fund) => (
                  <tr key={fund.id} className="text-sm">
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">{fund.name}</p>
                      <p className="mt-0.5 text-xs text-steel">Code {fund.eventCode}</p>
                    </td>
                    <td className="px-4 py-4"><CampaignStatusBadge status={fund.status} /></td>
                    <td className="px-4 py-4 font-medium text-ink">{formatMoney(fund.raised)}</td>
                    <td className="px-4 py-4 text-ink">{formatCount(fund.transactions)}</td>
                    <td className="px-4 py-4 text-xs text-steel">{format(new Date(fund.createdAt), "MMM d, yyyy")}</td>
                    <td className="px-5 py-4 text-right">
                      <RowMenu
                        label={`Actions for ${fund.name}`}
                        items={[{ label: "View details", onSelect: () => router.push(`/admin/campaigns/${fund.id}`) }]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <article className="self-start rounded-xl border border-navy/10 bg-white p-5 shadow-sm md:p-6">
          <h2 className="font-semibold text-navy">Account summary</h2>
          <dl className="mt-4 divide-y divide-navy/10 text-sm">
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-steel">Status</dt>
              <dd><StatusBadge status={host.status} /></dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-steel">Joined</dt>
              <dd className="text-right font-medium text-ink">{format(new Date(host.createdAt), "MMM d, yyyy")}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-steel">Last access</dt>
              <dd className="text-right font-medium text-ink">{lastAccess}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-steel">Access level</dt>
              <dd className="font-medium text-ink">Fund host</dd>
            </div>
          </dl>
        </article>
      </section>
    </div>
  );
}
