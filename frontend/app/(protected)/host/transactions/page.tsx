import type { Metadata } from "next";
import TransactionsDashboard from "@/components/features/host/transactions/TransactionsDashboard";

export const metadata: Metadata = { title: "Your transactions | RaiseFunds" };
export default function TransactionsPage() {
  return <TransactionsDashboard />;
}
