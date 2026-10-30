"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import { adminRoot } from "../admin-api";
import type { ApiEnvelope } from "@/lib/api/types";
import type {
  ActivityEntry,
  DashboardOverview,
  FundTrend,
  HostAccount,
  NewHostInput,
  TrendPeriod,
} from "./types";

export const adminKeys = {
  all: [...adminRoot, "dashboard"] as const,
  overview: () => [...adminKeys.all, "overview"] as const,
  trend: (period: TrendPeriod) => [...adminKeys.all, "fund-trend", period] as const,
  hosts: (limit: number) => [...adminKeys.all, "hosts", limit] as const,
  activity: (limit: number) => [...adminKeys.all, "recent-activity", limit] as const,
};

async function get<T>(path: string, params?: Record<string, string | number>) {
  const { data } = await api.get<ApiEnvelope<T>>(`/admin/dashboard/${path}`, { params });
  return data.data;
}

export function useDashboardOverview() {
  return useQuery({ queryKey: adminKeys.overview(), queryFn: () => get<DashboardOverview>("overview"), staleTime: 15_000, refetchInterval: 15_000 });
}

export function useFundTrend(period: TrendPeriod) {
  return useQuery({
    queryKey: adminKeys.trend(period),
    queryFn: () => get<FundTrend>("fund-trend", { period }),
    // Keep the old chart on screen while the other period loads.
    placeholderData: keepPreviousData,
  });
}

export function useHostAccounts(limit = 2) {
  return useQuery({ queryKey: adminKeys.hosts(limit), queryFn: () => get<HostAccount[]>("hosts", { limit }) });
}

export function useRecentActivity(limit = 3) {
  return useQuery({
    queryKey: adminKeys.activity(limit),
    queryFn: () => get<ActivityEntry[]>("recent-activity", { limit }),
    staleTime: 15_000,
    refetchInterval: 15_000,
  });
}

export function useAddHost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewHostInput) => {
      const { data } = await api.post<ApiEnvelope<{ id: string; smsSent: boolean }>>("/users", {
        ...input,
        role: "ACCOUNT_OWNER",
      });
      return data.data;
    },
    onSuccess: (user, input) => {
      // Overview counts, host list and activity feed all depend on a new host.
      queryClient.invalidateQueries({ queryKey: adminRoot });
      if (user.smsSent) {
        toast.success(`${input.firstName} ${input.lastName} was added and sent their sign-in details by SMS.`);
      } else {
        toast.warning(`${input.firstName} ${input.lastName} was added, but the SMS could not be sent. Share their email and phone number with them directly.`);
      }
    },
  });
}
