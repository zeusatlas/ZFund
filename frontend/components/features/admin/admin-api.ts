"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import type { ApiEnvelope } from "@/lib/api/types";
import type { HostAccount, HostStatus } from "./dashboard/types";

export type HostCounts = { total: number; active: number; pending: number; suspended: number; fundsIssued: string };

export type TransactionCounts = { total: number; completed: number; pending: number; failed: number; refunded: number; processed: string };

export type ActivityLogEntry = {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  actorName: string | null;
  amount?: string;
  createdAt: string;
};

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

export type FundCounts = {
  total: number;
  published: number;
  draft: number;
  suspended: number;
  pendingReview?: number;
  raised: string;
};

export type FundDetail = Fund & {
  description?: string;
  currency: string;
  startDate?: string;
  endDate?: string;
  contributors: number;
  averageAmount: string;
};

export type ContributionRow = {
  id: string;
  reference: string;
  contributorName: string | null;
  msisdn: string | null;
  amount: string;
  status: Transaction["status"];
  purposeName: string | null;
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

export type WithdrawalStatus = "PENDING" | "PROCESSING" | "DONE" | "REJECTED";

export type Withdrawal = {
  id: string;
  reference: string;
  hostId: string;
  hostName: string;
  hostEmail: string;
  projectName: string | null;
  amount: string;
  currency: string;
  method: "MOBILE_MONEY" | "BANK_TRANSFER";
  recipientName: string;
  institution: string;
  accountNumber: string;
  purpose: string;
  status: WithdrawalStatus;
  reviewNote?: string;
  reviewedByName: string | null;
  reviewedAt?: string;
  createdAt: string;
};

export type WithdrawalCounts = {
  total: number;
  pending: number;
  processing: number;
  done: number;
  rejected: number;
  outstanding: string;
  paidOut: string;
};

export type HostDetail = {
  host: HostAccount;
  stats: { totalFunds: string; fundsThisMonth: string; transactions: number };
  funds: Fund[];
};

export type ListParams = { page: number; search?: string; status?: string; limit?: number };

/** Everything the admin area caches lives under this root, so one invalidate refreshes it all. */
export const adminRoot = ["admin"] as const;

export const adminApiKeys = {
  hosts: (params: ListParams) => [...adminRoot, "hosts", params] as const,
  host: (id: string) => [...adminRoot, "host", id] as const,
  transactions: (params: ListParams) => [...adminRoot, "transactions", params] as const,
  activity: (page: number) => [...adminRoot, "activity", page] as const,
  campaigns: (params: ListParams) => [...adminRoot, "campaigns", params] as const,
  campaign: (id: string) => [...adminRoot, "campaign", id] as const,
  contributions: (id: string, params: ListParams) => [...adminRoot, "campaign", id, "contributions", params] as const,
  withdrawals: (params: ListParams) => [...adminRoot, "withdrawals", params] as const,
};

const PAGE_LIMIT = 10;

async function list<T, M = object>(path: string, { page, search, status, limit }: ListParams) {
  const { data } = await api.get<ApiEnvelope<T[]> & { meta: NonNullable<ApiEnvelope<T[]>["meta"]> & M }>(path, {
    params: { page, limit: limit ?? PAGE_LIMIT, search: search || undefined, status: status || undefined },
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

export function useCampaigns(params: ListParams) {
  return useQuery({
    queryKey: adminApiKeys.campaigns(params),
    queryFn: () => list<Fund, { counts: FundCounts }>("/admin/funds", params),
    placeholderData: keepPreviousData,
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: adminApiKeys.campaign(id),
    queryFn: async () => (await api.get<ApiEnvelope<FundDetail>>(`/admin/funds/${id}`)).data.data,
  });
}

export function useCampaignContributions(id: string, params: ListParams, enabled = true) {
  return useQuery({
    queryKey: adminApiKeys.contributions(id, params),
    queryFn: () => list<ContributionRow>(`/admin/funds/${id}/contributions`, params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useTransactions(params: ListParams, enabled = true) {
  return useQuery({
    queryKey: adminApiKeys.transactions(params),
    queryFn: () => list<Transaction, { counts: TransactionCounts }>("/admin/transactions", params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useActivity(page: number) {
  return useQuery({
    queryKey: adminApiKeys.activity(page),
    queryFn: () => list<ActivityLogEntry>("/admin/activity", { page }),
    placeholderData: keepPreviousData,
  });
}

export function useWithdrawals(params: ListParams) {
  return useQuery({
    queryKey: adminApiKeys.withdrawals(params),
    queryFn: () => list<Withdrawal, { counts: WithdrawalCounts }>("/admin/withdrawals", params),
    placeholderData: keepPreviousData,
  });
}

export function useUpdateWithdrawalStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: Exclude<WithdrawalStatus, "PENDING">; note?: string }) => {
      const { data } = await api.patch<ApiEnvelope<Withdrawal>>(`/admin/withdrawals/${id}/status`, { status, note: note || undefined });
      return data.data;
    },
    onSuccess: (withdrawal) => {
      queryClient.invalidateQueries({ queryKey: adminRoot });
      const verb = { PROCESSING: "moved to processing", DONE: "marked as done", REJECTED: "rejected", PENDING: "updated" }[withdrawal.status];
      toast.success(`${withdrawal.reference} ${verb}.`);
    },
    onError: (error) => toast.error((error as { message?: string }).message ?? "Could not update the request."),
  });
}

export function useUpdateHostStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: HostStatus; name: string }) => {
      const { data } = await api.patch<ApiEnvelope<{ id: string; status: HostStatus }>>(`/users/${id}/status`, { status });
      return data.data;
    },
    onSuccess: (user, { name }) => {
      queryClient.invalidateQueries({ queryKey: adminRoot });
      toast.success(
        user.status === "SUSPENDED"
          ? `${name} has been suspended.`
          : user.status === "ACTIVE"
            ? `${name} now has active access.`
            : `${name} will be active after their first sign-in.`,
      );
    },
    onError: (error) => toast.error((error as { message?: string }).message ?? "Could not update the host."),
  });
}

export function useUpdateCampaignStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: "PUBLISHED" | "APPROVED" | "DRAFT" | "SUSPENDED" | "REJECTED" | "SCHEDULED";
      notes?: string;
    }) => {
      const { data } = await api.patch<ApiEnvelope<Fund>>(`/admin/funds/${id}/status`, {
        status,
        notes: notes || undefined,
      });
      return data.data;
    },
    onSuccess: (fund) => {
      queryClient.invalidateQueries({ queryKey: adminRoot });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      const verb =
        fund.status === "PUBLISHED"
          ? "approved and is now live on the USSD network!"
          : fund.status === "SCHEDULED"
            ? "approved and scheduled to go live on start date!"
            : fund.status === "REJECTED"
              ? "rejected"
              : fund.status === "DRAFT"
                ? "returned to draft"
                : fund.status === "APPROVED"
                  ? "approved"
                  : "updated";
      toast.success(`Campaign "${fund.name}" ${verb}.`);
    },
    onError: (error) =>
      toast.error((error as { message?: string }).message ?? "Could not update the campaign status."),
  });
}
