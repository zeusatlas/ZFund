import type { Metadata } from "next";
import ReportsDashboard from "@/components/features/host/reports/ReportsDashboard";
export const metadata: Metadata = { title: "Your reports | RaiseFundz" };
export default function ReportsPage() { return <ReportsDashboard />; }
