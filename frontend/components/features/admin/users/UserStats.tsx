import { CircleDollarSign, Clock3, UserCheck, Users } from "lucide-react";
import MetricCard from "@/components/ui/MetricCard";
import { formatCount, formatMoney } from "@/lib/format";
import type { HostCounts } from "../admin-api";

const accents = ["blue", "green", "gold", "purple"] as const;

export default function UserStats({ counts }: { counts?: HostCounts }) {
  const dash = "–";
  const stats = [
    { label: "Total hosts", value: counts ? formatCount(counts.total) : dash, icon: Users },
    { label: "Active hosts", value: counts ? formatCount(counts.active) : dash, icon: UserCheck },
    { label: "Pending requests", value: counts ? formatCount(counts.pending) : dash, icon: Clock3 },
    { label: "Funds issued", value: counts ? formatMoney(counts.fundsIssued) : dash, icon: CircleDollarSign },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }, index) => (
        <MetricCard key={label} label={label} value={value} icon={Icon} accent={accents[index]} />
      ))}
    </section>
  );
}
