"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useMe } from "@/lib/auth/auth";
import { AddHostModal } from "./AddHostModal";
import { FundGeneration } from "./FundGeneration";
import { HostAccounts } from "./HostAccounts";
import { RecentActivity } from "./RecentActivity";
import { SecurityCard } from "./SecurityCard";
import { StatCards } from "./StatCards";

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

export default function AdminDashboard() {
  const [showAddHost, setShowAddHost] = useState(false);
  const { data: me } = useMe();

  return (
    <div className="w-full space-y-7">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-eyebrow mb-2 text-gold">Admin overview</p>
          <h1 className="page-title" suppressHydrationWarning>
            {greeting()}{me ? `, ${me.firstName}` : ""}
          </h1>
          <p className="page-subtitle">
            Here’s what’s happening across your fund network today.
          </p>
        </div>

        <button type="button" onClick={() => setShowAddHost(true)} className="btn-primary w-fit">
          <UserPlus size={17} />
          Add host account
        </button>
      </section>

      <StatCards />

      <section className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <FundGeneration />
        <RecentActivity />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <HostAccounts />
        <SecurityCard />
      </section>

      {showAddHost && <AddHostModal onClose={() => setShowAddHost(false)} />}
    </div>
  );
}
