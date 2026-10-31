import { api } from "./client";

export interface PublicCampaign {
  id: string;
  name: string;
  slug: string;
  description?: string;
  eventCode: string;
  currency: string;
  targetAmount?: string;
  minAmount: string;
  maxAmount: string;
  welcomeMessage?: string;
  status: string;
  acceptsContributions: boolean;
  startDate?: string;
  endDate?: string;
  category?: {
    id: string;
    name: string;
    slug?: string;
  } | null;
  organization?: {
    id: string;
    name: string;
    slug?: string;
    verificationStatus?: string;
  } | null;
  host: {
    id: string;
    name: string;
    slug: string;
  };
  totalRaised: string;
  contributorsCount: number;
  percentFunded: number;
  purposes: Array<{
    id: string;
    name: string;
    code?: string;
    description?: string;
    isDefault?: boolean;
  }>;
  paymentMethods: Array<{
    method: string;
    provider: string;
  }>;
  recentDonations: Array<{
    id: string;
    donorName: string;
    amount: string;
    currency: string;
    createdAt: string;
    purpose?: string;
  }>;
  wordsOfSupport?: WordOfSupport[];
}

export interface WordOfSupport {
  id: string;
  name: string;
  message: string;
  amount?: string;
  currency?: string;
  createdAt: string;
  isAnonymous?: boolean;
}

export interface PublicHostProfile {
  host: {
    id: string;
    name: string;
    slug: string;
  };
  campaigns: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    eventCode: string;
    category?: string;
    targetAmount?: string;
    totalRaised: string;
    percentFunded: number;
    contributorsCount: number;
  }>;
}

export interface InitiateDonationInput {
  projectId: string;
  purposeId?: string;
  amount: string;
  channel: "mobile_money" | "card";
  msisdn?: string;
  email?: string;
  name?: string;
  isAnonymous?: boolean;
  wordsOfSupport?: string;
  comment?: string;
  callbackUrl?: string;
}

export interface InitiateDonationResult {
  authorizationUrl?: string;
  paymentAttempt: {
    id: string;
    reference: string;
    status: string;
    amount: string;
    currency: string;
    channel: string;
    provider: string;
  };
  contribution: {
    id: string;
    reference: string;
    status: string;
    amount: string;
  };
}

export async function getPublicCampaign(hostSlug: string, campaignSlug: string): Promise<PublicCampaign> {
  const { data } = await api.get(`/public/campaigns/${encodeURIComponent(hostSlug)}/${encodeURIComponent(campaignSlug)}`);
  return data.data;
}

export async function getPublicCampaignByCode(identifier: string): Promise<PublicCampaign> {
  const { data } = await api.get(`/public/campaigns/code/${encodeURIComponent(identifier)}`);
  return data.data;
}

export async function getPublicHost(hostSlug: string): Promise<PublicHostProfile> {
  const { data } = await api.get(`/public/hosts/${encodeURIComponent(hostSlug)}`);
  return data.data;
}

export async function initiatePublicDonation(input: InitiateDonationInput): Promise<InitiateDonationResult> {
  const { data } = await api.post("/payments/initiate", input);
  return data.data;
}

export async function verifyDonationPayment(reference: string) {
  const { data } = await api.get(`/payments/verify/${encodeURIComponent(reference)}`);
  return data.data;
}

export async function addWordOfSupport(
  projectId: string,
  input: { name?: string; message: string; isAnonymous?: boolean }
): Promise<WordOfSupport> {
  const { data } = await api.post(`/public/campaigns/${encodeURIComponent(projectId)}/support-words`, input);
  return data.data;
}

