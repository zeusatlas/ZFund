import type { Metadata } from "next";
import AdminReports from "@/components/features/admin/reports/AdminReports";

export const metadata: Metadata = { title: "Reports | RaiseFunds" };

export default function AdminReportsPage() {
  return <AdminReports />;
}
