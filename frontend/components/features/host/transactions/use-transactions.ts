"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getContributions,
  getContributionById,
  type BackendContribution,
  type GetContributionsParams,
} from "@/lib/api/contributions";
import type { Transaction, TransactionStatus } from "./transactions";

export function maskPhone(phone?: string | null): string {
  if (!phone) return "—";
  const trimmed = phone.trim();
  if (trimmed.length >= 9) {
    const prefix = trimmed.slice(0, 3);
    const suffix = trimmed.slice(-4);
    return `${prefix} *** ${suffix}`;
  }
  return trimmed;
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
        ? `${firstAttempt.provider === "PAYSTACK" ? "Mobile money" : firstAttempt.provider}`
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
    phone: maskPhone(c.contributor?.msisdn),
    amount: amountInPesewas,
    status,
    rawStatus: c.status,
    date,
    time,
    method,
    note,
  };
}

export function useTransactionsQuery(params?: GetContributionsParams) {
  return useQuery({
    queryKey: ["contributions", params],
    queryFn: () => getContributions(params),
    staleTime: 5_000,
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ["contribution", id],
    queryFn: async () => {
      const contrib = await getContributionById(id);
      return contributionToTransaction(contrib);
    },
    enabled: Boolean(id),
  });
}

