import type { Metadata } from "next";
import HostOverview from "@/components/features/host/dashboard/HostOverview";

export const metadata: Metadata = { title: "Host dashboard | ZFund" };
export default function HostDashboardPage() {
  return <HostOverview />;
}
