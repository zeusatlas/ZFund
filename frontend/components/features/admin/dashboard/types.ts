export type HostStatus = "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";

export type DashboardOverview = {
  currency: string;
  fundsGenerated: { value: string; changePct: number | null };
  activeHosts: { value: number; newThisMonth: number };
  pendingRequests: { value: number; pendingHosts: number; pendingOrganizations: number };
  transactions: { value: number; changePct: number | null };
};

export type FundTrend = {
  period: TrendPeriod;
  buckets: { key: string; label: string; amount: string }[];
  average: string;
  current: string;
};

export type TrendPeriod = "12m" | "30d";

export type HostAccount = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: HostStatus;
  fundsIssued: string;
  lastActiveAt: string | null;
  createdAt: string;
};

export type ActivityEntry = {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  actorName: string | null;
  amount?: string;
  createdAt: string;
};

export type NewHostInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};
