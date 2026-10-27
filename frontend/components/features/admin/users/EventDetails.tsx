"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ErrorNote, Skeleton } from "@/components/ui/QueryState";
import { formatMoney } from "@/lib/format";
import { useHostDetail } from "../admin-api";

const fundStatus: Record<string, string> = { PUBLISHED: "Published", DRAFT: "Draft", SUSPENDED: "Suspended" };

export default function EventDetails({ userId, eventId }: { userId: string; eventId: string }) {
  const { data, isPending, isError, error, refetch } = useHostDetail(userId);
  const fund = data?.funds.find((item) => item.id === eventId);

  const back = (
    <Link href={`/admin/users/${userId}`} className="inline-flex items-center gap-2 text-sm font-medium text-steel hover:text-navy">
      <ArrowLeft size={16} />
      {data ? `Back to ${data.host.firstName} ${data.host.lastName}` : "Back to host"}
    </Link>
  );

  if (isPending) {
    return <div className="w-full max-w-4xl space-y-6">{back}<Skeleton className="h-64 rounded-xl" /></div>;
  }
  if (isError) {
    return <div className="w-full max-w-4xl space-y-6">{back}<ErrorNote message={(error as { message?: string }).message} onRetry={() => refetch()} /></div>;
  }
  if (!fund) {
    return <div className="w-full max-w-4xl space-y-6">{back}<ErrorNote message="This fund could not be found for this host." /></div>;
  }

  const rows: [string, string][] = [
    ["Host", `${data.host.firstName} ${data.host.lastName}`],
    ["Event code", fund.eventCode],
    ["Created", format(new Date(fund.createdAt), "MMM d, yyyy, HH:mm")],
    ["Status", fundStatus[fund.status] ?? fund.status],
    ["Transactions", String(fund.transactions)],
    ...(fund.targetAmount ? ([["Target", formatMoney(fund.targetAmount)]] as [string, string][]) : []),
  ];

  return (
    <div className="w-full max-w-4xl space-y-6">
      {back}
      <section className="rounded-xl border border-navy/10 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-navy/10 p-5 md:flex-row md:items-start md:justify-between md:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">Fund</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-navy md:text-3xl">{fund.name}</h1>
          </div>
          <div className="md:text-right">
            <p className="text-xs uppercase tracking-wide text-steel">Raised</p>
            <p className="mt-1 text-2xl font-semibold text-navy">{formatMoney(fund.raised)}</p>
          </div>
        </div>
        <dl className="divide-y divide-navy/10 p-5 text-sm md:p-7">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-3">
              <dt className="text-steel">{label}</dt>
              <dd className="text-right font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
