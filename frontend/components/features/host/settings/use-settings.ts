"use client";

import { useSyncExternalStore } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { defaultHostSettings, hostSettingsSchema, type HostSettings } from "@/components/features/host/settings/settings";
import { getSettings, updateSettings } from "@/lib/api/settings";

const BASE_STORAGE_KEY = "raisefundz-host-settings-v2";
const CHANGE_EVENT = "raisefundz-host-settings-changed";

function getStorageKey(userId?: string) {
  return userId ? `${BASE_STORAGE_KEY}-${userId}` : BASE_STORAGE_KEY;
}

function subscribe(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key?.startsWith(BASE_STORAGE_KEY) || event.key === null) notify();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, notify);
  };
}

export function useHostSettings(userId?: string): HostSettings {
  const key = getStorageKey(userId);
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(key) ?? "";
      } catch {
        return "";
      }
    },
    () => ""
  );

  // Live database query for settings
  const { data: serverSettings } = useQuery({
    queryKey: ["settings", userId],
    queryFn: async () => {
      const res = await getSettings();
      if (res.settings) {
        // Cache to local storage for instant offline access
        try {
          window.localStorage.setItem(key, JSON.stringify(res.settings));
          window.dispatchEvent(new Event(CHANGE_EVENT));
        } catch {}
      }
      return res.settings;
    },
    enabled: Boolean(userId),
    staleTime: 60 * 1000,
  });

  if (serverSettings) return serverSettings;

  if (!raw) return defaultHostSettings;
  try {
    return hostSettingsSchema.parse({ ...defaultHostSettings, ...JSON.parse(raw) });
  } catch {
    return defaultHostSettings;
  }
}

export function useUpdateHostSettingsMutation(userId?: string) {
  const queryClient = useQueryClient();
  const key = getStorageKey(userId);

  return useMutation({
    mutationFn: async (settings: HostSettings) => {
      const valid = hostSettingsSchema.parse(settings);
      // Immediately cache locally
      try {
        window.localStorage.setItem(key, JSON.stringify(valid));
        window.dispatchEvent(new Event(CHANGE_EVENT));
      } catch {}
      return updateSettings(valid);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["settings", userId], updated);
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}

export async function saveHostSettings(settings: HostSettings, userId?: string) {
  const valid = hostSettingsSchema.parse(settings);
  const key = getStorageKey(userId);
  try {
    window.localStorage.setItem(key, JSON.stringify(valid));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {}

  try {
    await updateSettings(valid);
  } catch {
    // If backend is momentarily unreachable, localStorage ensures seamless offline UX
  }
}
