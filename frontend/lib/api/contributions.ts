import { api } from "./client";

export interface BackendContributor {
  id: string;
  msisdn: string;
  name?: string | null;
  email?: string | null;
}

export interface BackendPaymentAttempt {
  id: string;
  reference: string;
  provider: string;
  channel?: string;
  msisdn?: string;
  paymentMethod?: string;
  status: string;
  failureReason?: string | null;
  amount: string;
  currency: string;
  createdAt: string;
}

export interface BackendContribution {
  id: string;
  reference: string;
  projectId: string;
  purposeId?: string | null;
  contributorId: string;
  amount: string;
  currency: string;
  status: "INITIATED" | "PENDING" | "CONFIRMED" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    name: string;
    eventCode?: string;
  } | null;
  contributor?: BackendContributor | null;
  purpose?: {
    id: string;
    name: string;
    code: string;
  } | null;
  paymentAttempts?: BackendPaymentAttempt[];
}

export interface ContributionSummary {
  received: number; // in pesewas
  paid: number;
  pending: number;
  failed: number;
}

export interface ContributionsPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  summary?: ContributionSummary;
}

export interface ContributionsResponse {
  success: boolean;
  message: string;
  data: BackendContribution[];
  meta: ContributionsPaginationMeta;
}

export interface SingleContributionResponse {
  success: boolean;
  message: string;
  data: BackendContribution;
}

export interface GetContributionsParams {
  projectId?: string;
  campaignId?: string;
  status?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export async function getContributions(params?: GetContributionsParams): Promise<{
  contributions: BackendContribution[];
  total: number;
  meta: ContributionsPaginationMeta;
}> {
  const { data } = await api.get<ContributionsResponse>("/contributions", { params });
  return {
    contributions: data.data || [],
    total: data.meta?.total || (data.data || []).length,
    meta: data.meta,
  };
}

export async function getContributionById(id: string): Promise<BackendContribution> {
  const { data } = await api.get<SingleContributionResponse>(`/contributions/${id}`);
  return data.data;
}

