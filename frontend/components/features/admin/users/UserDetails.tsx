"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CircleDollarSign, Clock3, FileText } from "lucide-react";
import { useState } from "react";
import MetricCard from "@/components/ui/MetricCard";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { formatCount, formatMoney, timeAgo } from "@/lib/format";
import { format } from "date-fns";
import { useHostDetail } from "../admin-api";
import StatusBadge from "./StatusBadge";

const accents = ["blue", "green", "gold", "purple"] as const;

export default function UserDetails({ userId }: { userId: string }) {
  const { data, isPending, isError, error, refetch } = useHostDetail(userId);
  const [showAll, setShowAll] = useState(false);

  const back = (
    <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm font-medium text-steel hover:text-navy">
      <ArrowLeft size={16} />
      Back to host accounts
    </Link>
  );

  if (isPending) {
    return (
      <div className="w-full max-w-6xl space-y-6">
        {back}
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }
  if (isError) {
    const notFound = (error as { status?: number }).status === 404;
    return (
      <div className="w-full max-w-6xl space-y-6">
        {back}
        <ErrorNote message={notFound ? "This host could not be found." : (error as { message?: string }).message} onRetry={notFound ? undefined : () => refetch()} />
      </div>
    );
  }

  const { host, stats, funds } = data;
  const name = `${host.firstName} ${host.lastName}`;
  const initials = `${host.firstName[0] ?? ""}${host.lastName[0] ?? ""}`.toUpperCase();
  const lastAccess = host.lastActiveAt ? timeAgo(host.lastActiveAt) : "Not signed in yet";
  const visibleFunds = showAll ? funds : funds.slice(0, 2);

  const cards = [
    { label: "Total funds", value: formatMoney(stats.totalFunds), icon: CircleDollarSign },
    { label: "This month", value: formatMoney(stats.fundsThisMonth), icon: ArrowUpRight },
    { label: "Transactions", value: formatCount(stats.transactions), icon: FileText },
    { label: "Last access", value: lastAccess, icon: Clock3 },
  ];

  return (
    <div className="w-full max-w-6xl space-y-6">
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

      <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-navy">Funds</h2>
              <p className="mt-1 text-sm text-steel">Every fund created by this host.</p>
            </div>
            <span className="rounded-full bg-stone px-3 py-1 text-xs font-medium text-steel">{funds.length} funds</span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {visibleFunds.map((fund) => (
              <div key={fund.id} className="flex min-w-0 flex-col rounded-lg border border-navy/10 bg-stone-light p-4 transition hover:border-navy/20">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{fund.name}</p>
                  <span className="text-xs text-steel">{format(new Date(fund.createdAt), "MMM d, yyyy")}</span>
                </div>
                <p className="mt-1 text-sm text-steel">Code {fund.eventCode} · {fund.transactions} transactions</p>
                <p className="mt-1 text-xs font-semibold text-navy">{formatMoney(fund.raised)} raised</p>
                <Link href={`/admin/campaigns/${fund.id}`} className="mt-4 text-xs font-medium text-gold hover:text-navy">
                  View details
                </Link>
              </div>
            ))}
            {funds.length === 0 && <p className="py-6 text-sm text-steel md:col-span-2">This host has not created any funds yet.</p>}
          </div>
          {funds.length > 2 && (
            <button type="button" onClick={() => setShowAll((current) => !current)} className="mt-4 text-sm font-medium text-gold hover:text-navy">
              {showAll ? "Show fewer funds" : `Show all ${funds.length} funds`}
            </button>
          )}
        </article>

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
