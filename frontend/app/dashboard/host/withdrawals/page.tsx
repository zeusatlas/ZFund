import type { Metadata } from "next";
import WithdrawalsDashboard from "../_components/WithdrawalsDashboard";
export const metadata: Metadata = { title: "Your withdrawals | ZFund" };
export default function WithdrawalsPage() {
  return <WithdrawalsDashboard />;
}
