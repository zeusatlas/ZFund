export type WithdrawalStatus = "Pending" | "Approved" | "Rejected";

export type WithdrawalRequest = {
  id: string;
  host: string;
  initials: string;
  amount: string;
  destination: string;
  requestedAt: string;
  status: WithdrawalStatus;
};

export const withdrawalRequests: WithdrawalRequest[] = [
  { id: "WDR-1001", host: "Amelia Rivers", initials: "AR", amount: "GHS 8,200.00", destination: "•••• 4821", requestedAt: "Today, 09:44", status: "Pending" },
  { id: "WDR-1002", host: "Marcus Chen", initials: "MC", amount: "GHS 3,600.00", destination: "•••• 1930", requestedAt: "Yesterday", status: "Pending" },
  { id: "WDR-0998", host: "Noah Williams", initials: "NW", amount: "GHS 4,200.00", destination: "•••• 7012", requestedAt: "Oct 21, 2026", status: "Approved" },
  { id: "WDR-0994", host: "Marcus Chen", initials: "MC", amount: "GHS 2,850.00", destination: "•••• 1930", requestedAt: "Oct 18, 2026", status: "Rejected" },
];
