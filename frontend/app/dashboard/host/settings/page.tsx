import type { Metadata } from "next";
import SettingsDashboard from "../_components/SettingsDashboard";

export const metadata: Metadata = { title: "Settings | ZFund" };

export default function SettingsPage() {
  return <SettingsDashboard />;
}
