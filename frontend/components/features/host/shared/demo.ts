export type CampaignStatus = "Active" | "Completed" | "Draft";
export type Campaign = {
  id: string;
  name: string;
  location: string;
  category: string;
  description: string;
  goal: number;
  status: CampaignStatus;
  created: string;
  closing: string;
  eventCode?: string;
  rawStatus?: string;
  currency?: string;
  acceptsContributions?: boolean;
  raised?: number;
  contributors?: number;
};
// Illustrative data. All amounts are in pesewas.
export const campaigns: Campaign[] = [
  { id: "ZF-006", name: "Aburi community borehole", location: "Aburi, Eastern Region", category: "Community", description: "A shared appeal to fund a borehole and improve access to clean water for households in the community.", goal: 5000000, status: "Active", created: "2026-10-12", closing: "2026-12-15" },
  { id: "ZF-005", name: "Books for the next generation", location: "Cape Coast, Central Region", category: "Education", description: "Old students coming together to furnish a school library with books, shelves, and reading tables.", goal: 3000000, status: "Active", created: "2026-10-05", closing: "2026-11-30" },
  { id: "ZF-004", name: "Market women’s welfare fund", location: "Kumasi, Ashanti Region", category: "Welfare", description: "Support for members of our market association during medical emergencies and difficult times.", goal: 2000000, status: "Active", created: "2026-09-18", closing: "2026-12-31" },
  { id: "ZF-003", name: "School essentials appeal", location: "Tamale, Northern Region", category: "Education", description: "School bags, exercise books, and learning materials for children at the start of term.", goal: 1500000, status: "Completed", created: "2026-08-01", closing: "2026-09-30" },
  { id: "ZF-002", name: "Community food drive", location: "Accra, Greater Accra Region", category: "Community", description: "A neighbourhood food drive to prepare and distribute essential food packages.", goal: 1000000, status: "Completed", created: "2026-07-10", closing: "2026-08-20" },
  { id: "ZF-001", name: "Youth skills workshop", location: "Ho, Volta Region", category: "Community", description: "A practical skills workshop for young people, with materials and equipment covered by the campaign.", goal: 2500000, status: "Draft", created: "2026-06-20", closing: "2027-01-31" },
];
export const contributions = [
  { id: "TX-012", campaignId: "ZF-006", contributorId: "D-001", phone: "024 *** 0345", amount: 1250000, status: "Paid", date: "2026-10-27" },
  { id: "TX-011", campaignId: "ZF-005", contributorId: "D-002", phone: "020 *** 0891", amount: 840000, status: "Paid", date: "2026-10-26" },
  { id: "TX-010", campaignId: "ZF-006", contributorId: "D-003", phone: "027 *** 0202", amount: 750000, status: "Paid", date: "2026-10-25" },
  { id: "TX-009", campaignId: "ZF-004", contributorId: "D-004", phone: "055 *** 1120", amount: 425000, status: "Paid", date: "2026-10-24" },
  { id: "TX-008", campaignId: "ZF-006", contributorId: "D-001", phone: "024 *** 0345", amount: 847500, status: "Paid", date: "2026-10-23" },
  { id: "TX-007", campaignId: "ZF-005", contributorId: "D-005", phone: "050 *** 0456", amount: 400000, status: "Paid", date: "2026-10-22" },
  { id: "TX-006", campaignId: "ZF-004", contributorId: "D-006", phone: "054 *** 0712", amount: 350000, status: "Paid", date: "2026-10-21" },
  { id: "TX-005", campaignId: "ZF-006", contributorId: "D-007", phone: "026 *** 0880", amount: 50000, status: "Pending", date: "2026-10-20" },
  { id: "TX-004", campaignId: "ZF-003", contributorId: "D-008", phone: "024 *** 0901", amount: 1000000, status: "Paid", date: "2026-09-28" },
  { id: "TX-003", campaignId: "ZF-003", contributorId: "D-009", phone: "020 *** 0144", amount: 500000, status: "Paid", date: "2026-09-25" },
  { id: "TX-002", campaignId: "ZF-002", contributorId: "D-010", phone: "027 *** 0420", amount: 1000000, status: "Paid", date: "2026-08-19" },
  { id: "TX-001", campaignId: "ZF-004", contributorId: "D-011", phone: "050 *** 0600", amount: 10000, status: "Failed", date: "2026-10-19" },
] as const;
export function campaignTotals(id: string) {
  const paid = contributions.filter(item => item.campaignId === id && item.status === "Paid");
  return { raised: paid.reduce((sum, item) => sum + item.amount, 0), contributors: new Set(paid.map(item => item.contributorId)).size };
}
export const paidContributions = contributions.filter(item => item.status === "Paid");
export const hostStats = {
  raised: paidContributions.reduce((sum, item) => sum + item.amount, 0),
  campaigns: campaigns.length,
  contributors: new Set(paidContributions.map(item => item.contributorId)).size,
  active: campaigns.filter(item => item.status === "Active").length,
};
export function money(pesewas: number) { return "GH₵ " + (pesewas / 100).toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
export function dateLabel(date: string) { return new Intl.DateTimeFormat("en-GH", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date + "T12:00:00Z")); }
