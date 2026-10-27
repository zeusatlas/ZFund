import { CircleDollarSign, Clock3, UserCheck, Users } from "lucide-react";
import type { HostAccount } from "../dashboard/data";
import MetricCard from "@/components/ui/MetricCard";

export default function UserStats({ hosts }: { hosts: HostAccount[] }) {
  const activeHosts = hosts.filter((host) => host.status === "Active").length;
  const pendingHosts = hosts.filter((host) => host.status === "Pending").length;
  const totalFunds = hosts.reduce((total, host) => {
    return total + Number(host.fundsIssued.replace("GHS ", "").replace(/,/g, ""));
  }, 0);

  const stats = [
    { label: "Total hosts", value: hosts.length, icon: Users },
    { label: "Active hosts", value: activeHosts, icon: UserCheck },
    { label: "Pending requests", value: pendingHosts, icon: Clock3 },
    {
      label: "Funds issued",
      value: `GHS ${totalFunds.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`,
      icon: CircleDollarSign,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }, index) => (
        <MetricCard
          key={label}
          label={label}
          value={value}
          icon={Icon}
          accent={["blue", "green", "gold", "purple"][index] as "blue" | "green" | "gold" | "purple"}
        />
      ))}
    </section>
  );
}
