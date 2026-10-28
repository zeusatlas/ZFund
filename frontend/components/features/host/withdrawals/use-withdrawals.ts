"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWithdrawal,
  deleteWithdrawal,
  getWithdrawals,
  getWithdrawalById,
  updateWithdrawal,
  type BackendWithdrawalView,
  type CreateWithdrawalPayload,
  type GetWithdrawalsParams,
  type UpdateWithdrawalPayload,
} from "@/lib/api/withdrawals";
import type { Withdrawal, WithdrawalStatus } from "@/components/features/host/withdrawals/withdrawals";

export function backendToWithdrawal(w: BackendWithdrawalView): Withdrawal {
  const amountInPesewas = w.amount ? Math.round(parseFloat(w.amount) * 100) : 0;

  const statusMap: Record<string, WithdrawalStatus> = {
    PENDING: "In review",
    PROCESSING: "Processing",
    DONE: "Paid",
    REJECTED: "Rejected",
  };

  const status: WithdrawalStatus = statusMap[w.status] || "In review";
  const createdAt = w.createdAt || new Date().toISOString();
  const date = createdAt.slice(0, 10);
  const time = createdAt.length >= 19 ? createdAt.slice(11, 19) : "";

  const digits = (w.accountNumber || "").replace(/\D/g, "");
  const destination = digits.length >= 4 ? `•••• ${digits.slice(-4)}` : `•••• ${w.accountNumber || "0000"}`;

  const defaultNote =
    w.status === "PENDING"
      ? "Awaiting administrator review."
      : w.status === "PROCESSING"
        ? "Approved. Payout confirmation is pending."
        : w.status === "DONE"
          ? "Payout completed."
          : "Recipient details did not match or request was rejected. No funds were deducted.";

  return {
    id: w.id,
    reference: w.reference,
    campaignId: w.projectId || "",
    campaignName: w.projectName,
    amount: amountInPesewas,
    status,
    rawStatus: w.status,
    date,
    time,
    method: w.method === "BANK_TRANSFER" ? "Bank transfer" : "Mobile money",
    recipient: w.recipientName,
    institution: w.institution,
    destination,
    accountNumber: w.accountNumber,
    purpose: w.purpose,
    note: w.reviewNote || defaultNote,
  };
}

export function useWithdrawalsQuery(params?: GetWithdrawalsParams) {
  return useQuery({
    queryKey: ["withdrawals", params],
    queryFn: async () => {
      const res = await getWithdrawals(params);
      const items = res.withdrawals.map(backendToWithdrawal);
      const b = res.meta?.balance;

      const balance = b
        ? {
            raised: Math.round(parseFloat(b.raised || "0") * 100),
            reserved: Math.round(parseFloat(b.reserved || "0") * 100),
            paid: Math.round(parseFloat(b.paid || "0") * 100),
            available: Math.round(parseFloat(b.available || "0") * 100),
          }
        : undefined;

      return {
        items,
        total: res.total,
        meta: res.meta,
        balance,
      };
    },
    staleTime: 5_000,
  });
}

export function useWithdrawals(): Withdrawal[] {
  const { data } = useWithdrawalsQuery();
  return useMemo(() => data?.items || [], [data?.items]);
}

export function useWithdrawal(id: string) {
  return useQuery({
    queryKey: ["withdrawal", id],
    queryFn: async () => {
      const data = await getWithdrawalById(id);
      return backendToWithdrawal(data);
    },
    enabled: Boolean(id),
  });
}

export function useCreateWithdrawalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWithdrawalPayload) => createWithdrawal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateWithdrawalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateWithdrawalPayload }) =>
      updateWithdrawal(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
    },
  });
}

export function useDeleteWithdrawalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWithdrawal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export async function requestWithdrawal(payload: CreateWithdrawalPayload) {
  const created = await createWithdrawal(payload);
  return backendToWithdrawal(created);
}
