import type { Metadata } from "next";
import SettingsDashboard from "@/components/features/host/settings/SettingsDashboard";

export const metadata: Metadata = { title: "Settings | RaiseFunds" };

export default function SettingsPage() {
  return <SettingsDashboard />;
}
