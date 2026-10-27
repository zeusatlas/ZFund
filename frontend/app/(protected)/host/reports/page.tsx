import type { Metadata } from "next";
import ReportsDashboard from "@/components/features/host/reports/ReportsDashboard";
export const metadata: Metadata = { title: "Your reports | ZFund" };
export default function ReportsPage() { return <ReportsDashboard />; }
