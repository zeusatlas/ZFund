import type { HostAccount } from "../dashboard/data";

export type UserEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  amount?: string;
  type: "fund" | "access" | "transaction";
  status?: "Completed" | "In progress" | "Pending";
};

export type UserDetails = {
  totalFunds: string;
  fundsThisMonth: string;
  transactions: string;
  lastLogin: string;
  events: UserEvent[];
};

export const userDetails: Record<string, UserDetails> = {
  "USR-1001": {
    totalFunds: "GHS 42,850.00",
    fundsThisMonth: "GHS 12,500.00",
    transactions: "28",
    lastLogin: "Today, 09:18",
    events: [
      { id: "event-001", title: "Partner settlement fund", description: "Created a partner settlement fund", date: "Today, 09:42", amount: "+GHS 12,500.00", type: "fund", status: "In progress" },
      { id: "event-002", title: "Settlement completed", description: "Settlement #ZF-10482 completed", date: "Today, 09:44", amount: "GHS 8,200.00", type: "transaction", status: "Completed" },
      { id: "event-003", title: "Account accessed", description: "Signed in from Chrome on Windows", date: "Today, 09:18", type: "access" },
      { id: "event-004", title: "Operating fund", description: "Created an operating fund", date: "Oct 18, 2026", amount: "+GHS 6,750.00", type: "fund", status: "Completed" },
    ],
  },
  "USR-1002": {
    totalFunds: "GHS 31,200.00",
    fundsThisMonth: "GHS 6,750.00",
    transactions: "19",
    lastLogin: "Today, 08:36",
    events: [
      { id: "event-005", title: "Operating fund", description: "Created an operating fund", date: "Today, 08:10", amount: "+GHS 6,750.00", type: "fund", status: "In progress" },
      { id: "event-006", title: "Account accessed", description: "Signed in from Safari on macOS", date: "Today, 08:36", type: "access" },
      { id: "event-007", title: "Vendor allocation", description: "Vendor allocation #ZF-10398 completed", date: "Oct 14, 2026", amount: "GHS 3,600.00", type: "transaction", status: "Completed" },
    ],
  },
  "USR-1003": {
    totalFunds: "GHS 0.00",
    fundsThisMonth: "GHS 0.00",
    transactions: "0",
    lastLogin: "Not yet accessed",
    events: [{ id: "event-008", title: "Invitation sent", description: "Host invitation is awaiting acceptance", date: "Today, 07:45", type: "access" }],
  },
  "USR-1004": {
    totalFunds: "GHS 28,640.00",
    fundsThisMonth: "GHS 4,200.00",
    transactions: "16",
    lastLogin: "Yesterday, 16:20",
    events: [
      { id: "event-009", title: "Vendor allocation fund", description: "Created a vendor allocation fund", date: "Yesterday, 16:42", amount: "+GHS 4,200.00", type: "fund", status: "In progress" },
      { id: "event-010", title: "Account accessed", description: "Signed in from Chrome on Android", date: "Yesterday, 16:20", type: "access" },
    ],
  },
};

export function getUserDetails(user: HostAccount) {
  return userDetails[user.id] ?? {
    totalFunds: user.fundsIssued,
    fundsThisMonth: "GHS 0.00",
    transactions: "0",
    lastLogin: user.lastActive,
    events: [],
  };
}

export function getUserEvent(user: HostAccount, eventId: string) {
  return getUserDetails(user).events.find((event) => event.id === eventId);
}
