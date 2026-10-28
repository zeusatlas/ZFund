import type { Metadata } from "next";
import HostOverview from "@/components/features/host/dashboard/HostOverview";

export const metadata: Metadata = { title: "Host dashboard | RaiseFunds" };
export default function HostDashboardPage() {
  return <HostOverview />;
}
