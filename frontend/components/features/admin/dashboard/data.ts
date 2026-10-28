export type HostStatus = "Active" | "Pending" | "Suspended";

export type HostAccount = {
  id: string;
  name: string;
  phone: string;
  initials: string;
  status: HostStatus;
  fundsIssued: string;
  lastActive: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  amount?: string;
  time: string;
  tone: "success" | "warning" | "neutral";
};

export const adminStats = [
  { label: "Funds generated", value: "GHS 248,560.00", detail: "+12.8% vs last month", icon: "funds" as const, accent: "green" },
  { label: "Active host accounts", value: "24", detail: "+3 this month", icon: "hosts" as const, accent: "blue" },
  { label: "Pending requests", value: "18", detail: "6 need review", icon: "pending" as const, accent: "gold" },
  { label: "Total transactions", value: "1,284", detail: "+8.4% vs last month", icon: "transactions" as const, accent: "purple" },
] as const;

export const hostAccounts: HostAccount[] = [
  { id: "USR-1001", name: "Amelia Rivers", phone: "+233 24 555 0101", initials: "AR", status: "Active", fundsIssued: "GHS 42,850.00", lastActive: "12 min ago" },
  { id: "USR-1002", name: "Marcus Chen", phone: "+233 20 555 0102", initials: "MC", status: "Active", fundsIssued: "GHS 31,200.00", lastActive: "38 min ago" },
  { id: "USR-1003", name: "Sofia Bennett", phone: "+233 50 555 0103", initials: "SB", status: "Pending", fundsIssued: "GHS 0.00", lastActive: "Awaiting invite" },
  { id: "USR-1004", name: "Noah Williams", phone: "+233 27 555 0104", initials: "NW", status: "Active", fundsIssued: "GHS 28,640.00", lastActive: "2 hrs ago" },
];

export const recentActivity: ActivityItem[] = [
  { id: "activity-001", title: "Funds generated", description: "Amelia Rivers generated a new fund", amount: "+GHS 12,500.00", time: "12 min ago", tone: "success" },
  { id: "activity-002", title: "New host request", description: "Sofia Bennett is waiting for approval", time: "45 min ago", tone: "warning" },
  { id: "activity-003", title: "Transaction completed", description: "Settlement #ZF-10482 was completed", amount: "GHS 8,200.00", time: "1 hr ago", tone: "neutral" },
  { id: "activity-004", title: "Funds generated", description: "Marcus Chen generated a new fund", amount: "+GHS 6,750.00", time: "2 hrs ago", tone: "success" },
];

export const fundTrend = [42, 55, 48, 68, 58, 75, 70, 84, 78, 92, 86, 100];
