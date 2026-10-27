"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import type { HostAccount, HostStatus } from "./dashboard/types";

export type HostCounts = { total: number; active: number; pending: number; suspended: number; fundsIssued: string };

export type Fund = {
  id: string;
  name: string;
  eventCode: string;
  status: "DRAFT" | "PUBLISHED" | "SUSPENDED" | string;
  hostId: string;
  hostName: string;
  raised: string;
  targetAmount?: string;
  transactions: number;
  createdAt: string;
};

export type Transaction = {
  id: string;
  reference: string;
  amount: string;
  status: "INITIATED" | "PENDING" | "CONFIRMED" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  projectId: string;
  projectName: string;
  hostName: string;
  contributorName: string | null;
  createdAt: string;
};

export type HostDetail = {
  host: HostAccount;
  stats: { totalFunds: string; fundsThisMonth: string; transactions: number };
  funds: Fund[];
};

export type ListParams = { page: number; search?: string; status?: string };

/** Everything the admin area caches lives under this root, so one invalidate refreshes it all. */
export const adminRoot = ["admin"] as const;

export const adminApiKeys = {
  hosts: (params: ListParams) => [...adminRoot, "hosts", params] as const,
  host: (id: string) => [...adminRoot, "host", id] as const,
  funds: (params: ListParams) => [...adminRoot, "funds", params] as const,
  transactions: (params: ListParams) => [...adminRoot, "transactions", params] as const,
};

const PAGE_LIMIT = 10;

async function list<T, M = object>(path: string, { page, search, status }: ListParams) {
  const { data } = await api.get<ApiEnvelope<T[]> & { meta: NonNullable<ApiEnvelope<T[]>["meta"]> & M }>(path, {
    params: { page, limit: PAGE_LIMIT, search: search || undefined, status: status || undefined },
  });
  return { items: data.data, meta: data.meta };
}

export function useHosts(params: ListParams) {
  return useQuery({
    queryKey: adminApiKeys.hosts(params),
    queryFn: () => list<HostAccount, { counts: HostCounts }>("/admin/hosts", params),
    placeholderData: keepPreviousData,
  });
}

export function useHostDetail(id: string) {
  return useQuery({
    queryKey: adminApiKeys.host(id),
    queryFn: async () => (await api.get<ApiEnvelope<HostDetail>>(`/admin/hosts/${id}`)).data.data,
  });
}

export function useFunds(params: ListParams, enabled = true) {
  return useQuery({
    queryKey: adminApiKeys.funds(params),
    queryFn: () => list<Fund>("/admin/funds", params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useTransactions(params: ListParams, enabled = true) {
  return useQuery({
    queryKey: adminApiKeys.transactions(params),
    queryFn: () => list<Transaction>("/admin/transactions", params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useUpdateHostStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: HostStatus; name: string }) => {
      const { data } = await api.patch<ApiEnvelope<{ id: string; status: HostStatus }>>(`/users/${id}/status`, { status });
      return data.data;
    },
    onSuccess: (_user, { status, name }) => {
      queryClient.invalidateQueries({ queryKey: adminRoot });
      toast.success(status === "SUSPENDED" ? `${name} has been suspended.` : `${name} now has active access.`);
    },
    onError: (error) => toast.error((error as { message?: string }).message ?? "Could not update the host."),
  });
}
