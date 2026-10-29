import { contributions } from "@/components/features/host/shared/demo";

export type TransactionStatus = "Paid" | "Pending" | "Failed";
export type Transaction = {
  id: string;
  reference: string;
  campaignId: string;
  contributorId: string;
  phone: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  time: string;
  method: string;
  note: string;
  campaignName?: string;
  donorName?: string;
  rawStatus?: string;
  paymentReference?: string;
};
// Illustrative payment metadata for the existing contributions.
const times = ["14:32:00", "09:18:00", "16:05:00", "11:42:00", "08:26:00", "17:10:00", "13:54:00", "10:23:00", "15:37:00", "12:08:00", "09:46:00", "18:15:00"];
export const transactions: Transaction[] = contributions.map((item, index) => ({
  ...item,
  reference: "ZF-" + item.date.replaceAll("-", "") + "-" + item.id,
  time: times[index],
  method: "Mobile money",
  note: item.status === "Paid" ? "Payment confirmed. Included in your total received." : item.status === "Pending" ? "Awaiting payment confirmation. Not yet included in your total received." : "The donor did not authorise the payment before the request expired. No contribution was received.",
}));
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
    (!query || item.reference.toLowerCase().includes(query) || item.phone.includes(query) || (/^[\d\s*]+$/.test(query) && digits.length > 0 && item.phone.replace(/\D/g, "").includes(digits)))
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
      "Donor phone (masked)",
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
