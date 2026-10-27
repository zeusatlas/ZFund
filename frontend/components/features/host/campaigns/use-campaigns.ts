"use client";
import { useMemo, useSyncExternalStore } from "react";
import { campaigns as examples, type Campaign } from "@/components/features/host/shared/demo";
import { storedCampaignSchema } from "@/components/features/host/campaigns/campaign-schema";

const STORAGE_KEY = "zfund-host-campaigns-v1";
const CHANGE_EVENT = "zfund-host-campaigns-changed";
function subscribe(notify: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === STORAGE_KEY || event.key === null) notify(); };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(CHANGE_EVENT, notify); };
}
function snapshot() {
  try { return window.localStorage.getItem(STORAGE_KEY) ?? "[]"; }
  catch { return "[]"; }
}
function readCampaigns(raw: string): Campaign[] {
  return storedCampaignSchema.array().parse(JSON.parse(raw));
}
export function useCampaigns() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  return useMemo(() => {
    try { return [...readCampaigns(raw), ...examples]; }
    catch { return examples; }
  }, [raw]);
}
export function saveCampaign(campaign: Campaign) {
  // Read again at save time so another tab's additions are preserved.
  const existing = readCampaigns(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
  const valid = storedCampaignSchema.parse(campaign);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([valid, ...existing]));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
