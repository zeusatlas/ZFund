export type FundStatus = "Completed" | "Pending" | "Declined";

export type FundRecord = {
  id: string;
  host: string;
  purpose: string;
  amount: string;
  status: FundStatus;
  createdAt: string;
};

export const funds: FundRecord[] = [
  { id: "FND-10482", host: "Amelia Rivers", purpose: "Partner settlement", amount: "GHS 12,500.00", status: "Completed", createdAt: "Today, 09:42" },
  { id: "FND-10476", host: "Marcus Chen", purpose: "Operating fund", amount: "GHS 6,750.00", status: "Completed", createdAt: "Yesterday" },
  { id: "FND-10451", host: "Sofia Bennett", purpose: "Vendor allocation", amount: "GHS 3,600.00", status: "Pending", createdAt: "Oct 24, 2026" },
  { id: "FND-10420", host: "Noah Williams", purpose: "Project advance", amount: "GHS 4,200.00", status: "Completed", createdAt: "Oct 21, 2026" },
  { id: "FND-10398", host: "Marcus Chen", purpose: "Supplier payment", amount: "GHS 2,850.00", status: "Declined", createdAt: "Oct 18, 2026" },
];
