import type { Campaign } from "@/components/features/host/shared/demo";
import type { Transaction } from "@/components/features/host/transactions/transactions";

export function buildReport(
  transactions: Transaction[],
  campaigns: Campaign[],
  month: string,
  campaignId: string
) {
  const scoped = transactions.filter(
    (item) =>
      (month === "All" || item.date.startsWith(month)) &&
      (campaignId === "All" || item.campaignId === campaignId)
  );

  const paid = scoped.filter((item) => item.status === "Paid");
  const raised = paid.reduce((sum, item) => sum + item.amount, 0);

  const donorCounts = new Map<string, number>();
  paid.forEach((item) => {
    const key = item.contributorId || item.phone || item.id;
    donorCounts.set(key, (donorCounts.get(key) ?? 0) + 1);
  });
  const donors = donorCounts.size;
  const repeatDonors = [...donorCounts.values()].filter((count) => count > 1).length;

  const statuses = ["Paid", "Pending", "Failed"] as const;
  const outcomes = statuses.map((status) => ({
    status,
    count: scoped.filter((item) => item.status === status).length,
  }));

  const performance = campaigns
    .filter((campaign) => campaignId === "All" || campaign.id === campaignId)
    .map((campaign) => {
      const gifts = paid.filter((item) => item.campaignId === campaign.id);
      const giftsRaised = gifts.reduce((sum, item) => sum + item.amount, 0);
      return {
        ...campaign,
        raised: giftsRaised > 0 ? giftsRaised : (month === "All" ? (campaign.raised || 0) : 0),
        donors:
          new Set(gifts.map((item) => item.contributorId || item.phone || item.id)).size ||
          (month === "All" ? (campaign.contributors || 0) : 0),
        gifts: gifts.length,
      };
    })
    .sort((a, b) => b.raised - a.raised || a.name.localeCompare(b.name));

  // Buckets for trend chart
  let bucketKeys: string[] = [];
  if (month !== "All") {
    const [year, monthNumber] = month.split("-").map(Number);
    if (!isNaN(year) && !isNaN(monthNumber)) {
      const days = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
      bucketKeys = Array.from(
        { length: days },
        (_, index) => `${month}-${String(index + 1).padStart(2, "0")}`
      );
    }
  } else {
    const validDates = transactions
      .map((item) => item.date)
      .filter((d) => d && /^\d{4}-\d{2}/.test(d))
      .sort();

    if (validDates.length > 0) {
      const firstMonth = validDates[0].slice(0, 7);
      const lastMonth = validDates[validDates.length - 1].slice(0, 7);
      const cursor = new Date(`${firstMonth}-01T00:00:00Z`);
      let count = 0;
      while (cursor.toISOString().slice(0, 7) <= lastMonth && count < 36) {
        bucketKeys.push(cursor.toISOString().slice(0, 7));
        cursor.setUTCMonth(cursor.getUTCMonth() + 1);
        count++;
      }
    } else {
      // Default to last 6 months so empty chart renders cleanly
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
        bucketKeys.push(d.toISOString().slice(0, 7));
      }
    }
  }

  const trend = bucketKeys.map((key) => ({
    key,
    amount: paid
      .filter((item) => item.date.startsWith(key))
      .reduce((sum, item) => sum + item.amount, 0),
  }));

  const pendingAmount = scoped
    .filter((item) => item.status === "Pending")
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    scoped,
    paid,
    raised,
    donors,
    repeatDonors,
    average: paid.length ? Math.round(raised / paid.length) : 0,
    successRate: scoped.length ? (paid.length / scoped.length) * 100 : null,
    outcomes,
    performance,
    trend,
    pendingAmount,
  };
}

export function monthLabel(month: string) {
  if (!month || month === "All") return "All recorded months";
  try {
    const d = new Date(`${month}-01T00:00:00Z`);
    if (isNaN(d.getTime())) return month;
    return new Intl.DateTimeFormat("en-GH", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(d);
  } catch {
    return month;
  }
}
