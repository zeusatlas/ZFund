import type { Metadata } from "next";
import WithdrawalsDashboard from "@/components/features/host/withdrawals/WithdrawalsDashboard";
export const metadata: Metadata = { title: "Your withdrawals | ZFund" };
export default function WithdrawalsPage() {
  return <WithdrawalsDashboard />;
}
