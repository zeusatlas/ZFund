import type { Campaign } from "@/components/features/host/shared/demo";
import type { Transaction } from "@/components/features/host/transactions/transactions";

export function buildReport(transactions: Transaction[], campaigns: Campaign[], month: string, campaignId: string) {
  const scoped = transactions.filter(item => (month === "All" || item.date.startsWith(month)) && (campaignId === "All" || item.campaignId === campaignId));
  const paid = scoped.filter(item => item.status === "Paid");
  const raised = paid.reduce((sum, item) => sum + item.amount, 0);
  const donorCounts = new Map<string, number>();
  paid.forEach(item => donorCounts.set(item.contributorId, (donorCounts.get(item.contributorId) ?? 0) + 1));
  const donors = donorCounts.size;
  const repeatDonors = [...donorCounts.values()].filter(count => count > 1).length;
  const statuses = ["Paid", "Pending", "Failed"] as const;
  const outcomes = statuses.map(status => ({ status, count: scoped.filter(item => item.status === status).length }));
  const performance = campaigns.filter(campaign => campaignId === "All" || campaign.id === campaignId).map(campaign => {
    const gifts = paid.filter(item => item.campaignId === campaign.id);
    return { ...campaign, raised: gifts.reduce((sum, item) => sum + item.amount, 0), donors: new Set(gifts.map(item => item.contributorId)).size, gifts: gifts.length };
  }).sort((a, b) => b.raised - a.raised || a.name.localeCompare(b.name));
  // Always show the full chosen month, including days without a paid donation.
  let bucketKeys: string[] = [];
  if (month !== "All") {
    const [year, monthNumber] = month.split("-").map(Number);
    const days = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
    bucketKeys = Array.from({ length: days }, (_, index) => month + "-" + String(index + 1).padStart(2, "0"));
  } else if (transactions.length) {
    const dates = transactions.map(item => item.date).sort();
    const cursor = new Date(dates[0].slice(0, 7) + "-01T00:00:00Z");
    const last = dates[dates.length - 1].slice(0, 7);
    while (cursor.toISOString().slice(0, 7) <= last) {
      bucketKeys.push(cursor.toISOString().slice(0, 7));
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }
  }
  const trend = bucketKeys.map(key => ({ key, amount: paid.filter(item => item.date.startsWith(key)).reduce((sum, item) => sum + item.amount, 0) }));
  return { scoped, paid, raised, donors, repeatDonors, average: paid.length ? Math.round(raised / paid.length) : 0, successRate: scoped.length ? paid.length / scoped.length * 100 : null, outcomes, performance, trend, pendingAmount: scoped.filter(item => item.status === "Pending").reduce((sum, item) => sum + item.amount, 0) };
}
export function monthLabel(month: string) {
  return new Intl.DateTimeFormat("en-GH", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(month + "-01T00:00:00Z"));
}
