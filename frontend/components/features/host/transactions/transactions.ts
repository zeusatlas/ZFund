export type TransactionStatus = "Paid" | "Pending" | "Failed";
export type Transaction = {
  id: string;
  reference: string;
  campaignId: string;
  campaignName?: string;
  contributorId?: string;
  donorName?: string;
  phone: string;
  amount: number;
  status: TransactionStatus;
  rawStatus?: string;
  date: string;
  time: string;
  method: string;
  note: string;
  paymentReference?: string;
};
export type Stats = {
  received: number;
  paidCount: number;
  pendingCount: number;
  failedCount: number;
};
export function transactionStats(items: Transaction[]): Stats {
  const result: Stats = { received: 0, paidCount: 0, pendingCount: 0, failedCount: 0 };
  for (const item of items) {
    if (item.status === "Paid") {
      result.received += item.amount;
      result.paidCount++;
    } else if (item.status === "Pending") {
      result.pendingCount++;
    } else if (item.status === "Failed") {
      result.failedCount++;
    }
  }
  return result;
}
export type TransactionFilters = { query: string; campaignId: string; status: string; from: string; to: string };
export const emptyFilters: TransactionFilters = { query: "", campaignId: "All", status: "All", from: "", to: "" };
export function filterTransactions(items: Transaction[], filters: TransactionFilters) {
  if (filters.from && filters.to && filters.from > filters.to) return [];
  const query = filters.query.trim().toLowerCase();
  const digits = query.replace(/\D/g, "");
  return items.filter(item =>
    (filters.campaignId === "All" || item.campaignId === filters.campaignId) &&
    (filters.status === "All" || item.status === filters.status) &&
    (!filters.from || item.date >= filters.from) &&
    (!filters.to || item.date <= filters.to) &&
    (!query || item.reference.toLowerCase().includes(query) || item.phone.includes(query) || (digits.length > 0 && item.phone.replace(/\D/g, "").includes(digits)))
  ).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}
export function transactionSummary(items: Transaction[]) {
  return {
    received: items.filter(item => item.status === "Paid").reduce((total, item) => total + item.amount, 0),
    paid: items.filter(item => item.status === "Paid").length,
    pending: items.filter(item => item.status === "Pending").length,
    failed: items.filter(item => item.status === "Failed").length,
  };
}
function csvCell(value: string) {
  const safe = /^[=+\-@\t\r\n]/.test(value) ? "'" + value : value;
  return '"' + safe.replaceAll('"', '""') + '"';
}
export function transactionsCsv(items: Transaction[], campaignNames: Record<string, string>) {
  const rows = [
    [
      "Reference",
      "Donor phone",
      "Campaign",
      "Gross Amount (GHS)",
      "Platform Fee 14% (GHS)",
      "Net Proceeds 86% (GHS)",
      "Payment method",
      "Status",
      "Date (Ghana)",
      "Time (GMT)",
      "Details",
    ],
    ...items.map(item => {
      const gross = (item.amount / 100).toFixed(2);
      const fee = (Math.round(item.amount * 0.14) / 100).toFixed(2);
      const net = ((item.amount - Math.round(item.amount * 0.14)) / 100).toFixed(2);
      return [
        item.reference,
        "'" + item.phone,
        campaignNames[item.campaignId] ?? item.campaignName ?? item.campaignId,
        gross,
        fee,
        net,
        item.method,
        item.status === "Paid" ? "Successful" : item.status,
        item.date,
        item.time,
        item.note,
      ];
    }),
  ];
  return "\uFEFF" + rows.map(row => row.map(csvCell).join(",")).join("\r\n");
}
