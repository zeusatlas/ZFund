"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getContributions,
  getContributionById,
  type BackendContribution,
  verifyPayment,
  type GetContributionsParams,

} from "@/lib/api/contributions";
import type { Transaction, TransactionStatus } from "./transactions";

export function formatPhone(phone?: string | null): string {
  if (!phone) return "—";
  return phone.trim();
}

/**
 * Returns phone number in full (legacy alias preserved for backwards compatibility)
 */
export function maskPhone(phone?: string | null): string {
  return formatPhone(phone);
}

export function contributionToTransaction(c: BackendContribution): Transaction {
  const amountInPesewas = c.amount ? Math.round(parseFloat(c.amount) * 100) : 0;

  let status: TransactionStatus = "Pending";
  if (c.status === "CONFIRMED") {
    status = "Paid";
  } else if (c.status === "FAILED" || c.status === "REFUNDED" || c.status === "PARTIALLY_REFUNDED") {
    status = "Failed";
  } else {
    status = "Pending";
  }

  const createdAt = c.createdAt || new Date().toISOString();
  const date = createdAt.slice(0, 10);
  const time = createdAt.length >= 19 ? createdAt.slice(11, 19) : "00:00:00";

  const firstAttempt = c.paymentAttempts?.[0];
  const method =
    firstAttempt?.channel === "card"
      ? "Card"
      : firstAttempt?.provider
        ? `${firstAttempt.provider === "ROBSPAY" ? "Mobile money" : firstAttempt.provider}`
        : "Mobile money";

  let note = "Awaiting payment confirmation. Not yet included in your total received.";
  if (c.status === "CONFIRMED") {
    note = "Payment confirmed. Included in your total received.";
  } else if (c.status === "FAILED") {
    note =
      firstAttempt?.failureReason ||
      "The donor did not authorise the payment before the request expired. No contribution was received.";
  } else if (c.status === "REFUNDED" || c.status === "PARTIALLY_REFUNDED") {
    note = "The contribution has been refunded to the donor.";
  }

  return {
    id: c.reference || c.id.slice(0, 8),
    reference: c.reference,
    campaignId: c.projectId,
    campaignName: c.project?.name,
    contributorId: c.contributorId,
    donorName: c.contributor?.name || undefined,
    phone: formatPhone(c.contributor?.msisdn),
    amount: amountInPesewas,
    status,
    rawStatus: c.status,
    date,
    time,
    method,
    note,
    paymentReference: firstAttempt?.reference || c.reference,
  };
}

export function useTransactionsQuery(params?: GetContributionsParams) {
  return useQuery({
    queryKey: ["contributions", params],
    queryFn: () => getContributions(params),
    staleTime: 5_000,
    refetchInterval: 10_000,
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ["contribution", id],
    queryFn: async () => {
      const data = await getContributionById(id);
      return contributionToTransaction(data);
    },
    enabled: !!id,
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reference: string) => verifyPayment(reference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributions"] });
      queryClient.invalidateQueries({ queryKey: ["contribution"] });
    },
  });
}

export const useVerifyPaymentMutation = useVerifyPayment;
