import {
  CircleDollarSign,
  Clock3,
  FilePlus2,
  Users,
} from "lucide-react";
import { adminStats } from "./data";
import MetricCard from "@/components/ui/MetricCard";

const icons = { funds: CircleDollarSign, hosts: Users, pending: Clock3, transactions: FilePlus2 };

export function StatCards() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {adminStats.map((stat) => {
        return <MetricCard key={stat.label} label={stat.label} value={stat.value} detail={stat.detail} icon={icons[stat.icon]} accent={stat.accent} />;
      })}
    </section>
  );
}
