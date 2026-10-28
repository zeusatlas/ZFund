import type { Metadata } from "next";
import HostOverview from "@/components/features/host/dashboard/HostOverview";

export const metadata: Metadata = { title: "Host dashboard | RaiseFundz" };
export default function HostDashboardPage() {
  return <HostOverview />;
}
