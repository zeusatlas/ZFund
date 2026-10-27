"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CircleDollarSign,
  Clock3,
  FileText,
} from "lucide-react";
import { useState } from "react";
import MetricCard from "@/components/ui/MetricCard";
import type { HostAccount } from "../dashboard/data";
import { getUserDetails } from "./user-data";

function StatusBadge({ status }: { status: HostAccount["status"] }) {
  const styles = {
    Active: "bg-[#e9f4ef] text-[#287754]",
    Pending: "bg-[#fff4dc] text-[#a26c12]",
    Suspended: "bg-[#fbeaea] text-[#a13d3d]",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function ActivityIcon({ type }: { type: "fund" | "access" | "transaction" }) {
  if (type === "fund") return <CircleDollarSign size={15} />;
  if (type === "transaction") return <Check size={15} />;
  return <Clock3 size={15} />;
}

export default function UserDetails({ user }: { user: HostAccount }) {
  const details = getUserDetails(user);
  const [hostEvents, setHostEvents] = useState(details.events);
  const [showAllEvents, setShowAllEvents] = useState(false);

  const stats = [
    { label: "Total funds", value: details.totalFunds, icon: CircleDollarSign },
    { label: "This month", value: details.fundsThisMonth, icon: ArrowUpRight },
    { label: "Transactions", value: details.transactions, icon: FileText },
    { label: "Last access", value: details.lastLogin, icon: Clock3 },
  ];

  function clearEvent(eventId: string) {
    setHostEvents((events) => events.filter((event) => event.id !== eventId));
  }

  const visibleEvents = showAllEvents ? hostEvents : hostEvents.slice(0, 2);

  return (
    <div className="w-full max-w-6xl space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm font-medium text-steel hover:text-navy"
      >
        <ArrowLeft size={16} />
        Back to host accounts
      </Link>

      <section className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-base font-medium text-white">
            {user.initials}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-navy">
                {user.name}
              </h1>
              <StatusBadge status={user.status} />
            </div>
            <p className="mt-1 text-sm text-steel">{user.phone}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }, index) => (
          <MetricCard key={label} label={label} value={value} icon={Icon} accent={["blue", "green", "gold", "purple"][index] as "blue" | "green" | "gold" | "purple"} />
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-navy">Fund events</h2>
              <p className="mt-1 text-sm text-steel">
                Every fund and activity created by this host.
              </p>
            </div>
            <span className="rounded-full bg-stone px-3 py-1 text-xs font-medium text-steel">
              {hostEvents.length} events
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {visibleEvents.map((event) => (
              <div key={event.id} className="flex min-w-0 flex-col rounded-lg border border-navy/10 bg-stone-light p-4 transition hover:border-navy/20">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone text-navy">
                  <ActivityIcon type={event.type} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="text-sm font-medium text-ink">{event.title}</p>
                    <span className="text-xs text-steel">{event.date}</span>
                  </div>
                  <p className="mt-1 text-sm text-steel">{event.description}</p>
                  {event.amount && <p className="mt-1 text-xs font-semibold text-navy">{event.amount}</p>}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link href={`/admin/users/${user.id}/events/${event.id}`} className="text-xs font-medium text-gold hover:text-navy">
                      View details
                    </Link>
                    <button type="button" onClick={() => clearEvent(event.id)} className="text-xs font-medium text-crimson hover:underline">
                      Clear event
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {hostEvents.length === 0 && (
              <p className="py-6 text-sm text-steel md:col-span-2">No events remain for this host.</p>
            )}
          </div>
          {hostEvents.length > 2 && (
            <button type="button" onClick={() => setShowAllEvents((current) => !current)} className="mt-4 text-sm font-medium text-gold hover:text-navy">
              {showAllEvents ? "Show fewer events" : `Show all ${hostEvents.length} events`}
            </button>
          )}
        </article>

        <article className="self-start rounded-xl border border-navy/10 bg-white p-5 shadow-sm md:p-6">
          <h2 className="font-semibold text-navy">Account summary</h2>
          <dl className="mt-4 divide-y divide-navy/10 text-sm">
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-steel">Status</dt>
              <dd><StatusBadge status={user.status} /></dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-steel">Last access</dt>
              <dd className="text-right font-medium text-ink">{details.lastLogin}</dd>
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
