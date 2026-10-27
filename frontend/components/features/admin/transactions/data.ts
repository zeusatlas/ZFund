export type TransactionStatus = "Completed" | "Pending" | "Failed";

export type TransactionRecord = {
  id: string;
  fundId: string;
  host: string;
  amount: string;
  status: TransactionStatus;
  date: string;
};

export const transactions: TransactionRecord[] = [
  { id: "TRX-10482", fundId: "FND-10482", host: "Amelia Rivers", amount: "GHS 8,200.00", status: "Completed", date: "Today, 09:44" },
  { id: "TRX-10476", fundId: "FND-10476", host: "Marcus Chen", amount: "GHS 3,600.00", status: "Completed", date: "Yesterday" },
  { id: "TRX-10451", fundId: "FND-10451", host: "Sofia Bennett", amount: "GHS 1,850.00", status: "Pending", date: "Oct 24, 2026" },
  { id: "TRX-10420", fundId: "FND-10420", host: "Noah Williams", amount: "GHS 4,200.00", status: "Completed", date: "Oct 21, 2026" },
  { id: "TRX-10398", fundId: "FND-10398", host: "Marcus Chen", amount: "GHS 2,850.00", status: "Failed", date: "Oct 18, 2026" },
];
