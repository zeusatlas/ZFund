import { api } from "@/lib/api/client";
import type { HostSettings } from "@/components/features/host/settings/settings";

export interface PlatformFeeInfo {
  commissionPercentage: number;
  hostNetPercentage: number;
  accountFee: string;
  disbursementFee: string;
  currency: string;
  masterShortcode: string;
  description: string;
}

export interface SettingsApiResponse {
  settings: HostSettings;
  fees: PlatformFeeInfo;
}

export async function getSettings(): Promise<SettingsApiResponse> {
  const { data } = await api.get<{ success: boolean; data: SettingsApiResponse }>("/settings");
  return data.data;
}

export async function updateSettings(
  settings: Partial<HostSettings>
): Promise<HostSettings> {
  const { data } = await api.put<{ success: boolean; data: HostSettings }>("/settings", settings);
  return data.data;
}

export async function getPlatformFees(): Promise<PlatformFeeInfo> {
  const { data } = await api.get<{ success: boolean; data: PlatformFeeInfo }>("/settings/fees");
  return data.data;
}

