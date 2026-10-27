"use client";

import { useSyncExternalStore } from "react";
import { defaultHostSettings, hostSettingsSchema, type HostSettings } from "@/components/features/host/settings/settings";

const STORAGE_KEY = "zfund-host-settings-v1";
const CHANGE_EVENT = "zfund-host-settings-changed";

function subscribe(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) notify();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, notify);
  };
}

function snapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function useHostSettings() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "");
  if (!raw) return defaultHostSettings;
  try {
    return hostSettingsSchema.parse({ ...defaultHostSettings, ...JSON.parse(raw) });
  } catch {
    return defaultHostSettings;
  }
}

export function saveHostSettings(settings: HostSettings) {
  const valid = hostSettingsSchema.parse(settings);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
