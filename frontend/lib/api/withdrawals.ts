import { api } from "./client";

export type BackendWithdrawalStatus = "PENDING" | "PROCESSING" | "DONE" | "REJECTED";
export type BackendWithdrawalMethod = "MOBILE_MONEY" | "BANK_TRANSFER";

export interface BackendWithdrawalView {
  id: string;
  reference: string;
  hostId: string;
  hostName: string;
  hostEmail: string;
  projectId?: string | null;
  projectName: string | null;
  amount: string;
  currency: string;
  method: BackendWithdrawalMethod;
  recipientName: string;
  institution: string;
  accountNumber: string;
  purpose: string;
  status: BackendWithdrawalStatus;
  reviewNote?: string | null;
  reviewedByName?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
}

export interface WithdrawalBalanceSummary {
  raised: string;
  reserved: string;
  paid: string;
  available: string;
}

export interface WithdrawalsPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  balance?: WithdrawalBalanceSummary;
}

export interface WithdrawalsResponse {
  success: boolean;
  message: string;
  data: BackendWithdrawalView[];
  meta: WithdrawalsPaginationMeta;
}

export interface SingleWithdrawalResponse {
  success: boolean;
  message: string;
  data: BackendWithdrawalView;
}

export interface GetWithdrawalsParams {
  projectId?: string;
  campaignId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateWithdrawalPayload {
  projectId?: string;
  campaignId?: string;
  amount: string | number;
  method: BackendWithdrawalMethod | "Mobile money" | "Bank transfer";
  recipientName?: string;
  recipient?: string;
  institution: string;
  accountNumber?: string;
  account?: string;
  purpose: string;
}

export interface UpdateWithdrawalPayload {
  amount?: string | number;
  method?: BackendWithdrawalMethod | "Mobile money" | "Bank transfer";
  recipientName?: string;
  recipient?: string;
  institution?: string;
  accountNumber?: string;
  account?: string;
  purpose?: string;
}

export async function getWithdrawals(params?: GetWithdrawalsParams): Promise<{
  withdrawals: BackendWithdrawalView[];
  total: number;
  meta: WithdrawalsPaginationMeta;
}> {
  const { data } = await api.get<WithdrawalsResponse>("/withdrawals", { params });
  return {
    withdrawals: data.data || [],
    total: data.meta?.total || (data.data || []).length,
    meta: data.meta,
  };
}

export async function getWithdrawalById(id: string): Promise<BackendWithdrawalView> {
  const { data } = await api.get<SingleWithdrawalResponse>(`/withdrawals/${id}`);
  return data.data;
}

export async function createWithdrawal(
  payload: CreateWithdrawalPayload
): Promise<BackendWithdrawalView> {
  const { data } = await api.post<SingleWithdrawalResponse>("/withdrawals", payload);
  return data.data;
}

export async function updateWithdrawal(
  id: string,
  payload: UpdateWithdrawalPayload
): Promise<BackendWithdrawalView> {
  const { data } = await api.put<SingleWithdrawalResponse>(`/withdrawals/${id}`, payload);
  return data.data;
}

export async function deleteWithdrawal(id: string): Promise<void> {
  await api.delete(`/withdrawals/${id}`);
}

