import { z } from "zod";

export const GHANA_BANKS = [
  "Absa Bank Ghana Ltd",
  "Access Bank (Ghana) Plc",
  "Agricultural Development Bank Plc (ADB)",
  "ARB Apex Bank Ltd (Mini-central bank for Rural and Community Banks)",
  "Bank of Africa Ghana Limited",
  "CalBank PLC",
  "Consolidated Bank Ghana Limited (CBG)",
  "Ecobank Ghana Plc",
  "Fidelity Bank (Ghana) Ltd",
  "First Atlantic Bank PLC",
  "FBNBank Ghana Limited",
  "First National Bank (Ghana)",
  "GCB Bank PLC",
  "Guaranty Trust Bank (Ghana) Ltd (GTBank)",
  "National Investment Bank Limited (NIB)",
  "OmniBSIC Bank Ghana",
  "Prudential Bank",
  "Republic Bank (Ghana) PLC",
  "Société Générale Ghana PLC",
  "Stanbic Bank Ghana Limited",
  "Standard Chartered Bank Ghana PLC",
  "United Bank for Africa Ghana (UBA)",
  "Universal Merchant Bank (UMB)",
  "Zenith Bank (Ghana)",
] as const;

export type GhanaBank = (typeof GHANA_BANKS)[number];

export const hostSettingsSchema = z.object({
  firstName: z.string().trim().max(50).optional().default(""),
  lastName: z.string().trim().max(50).optional().default(""),
  organisation: z.string().trim().max(120).optional().default(""),
  phone: z.string().trim().optional().default(""),
  email: z.string().trim().optional().default(""),
  // Notifications
  contributionAlerts: z.boolean().default(true),
  withdrawalUpdates: z.boolean().default(true),
  campaignDigest: z.boolean().default(false),
  // Payout defaults
  preferredPayout: z.enum(["Mobile money", "Bank transfer"]).default("Mobile money"),
  defaultInstitution: z.string().trim().max(100).default("MTN Mobile Money"),
  defaultRecipient: z.string().trim().max(100).default(""),
  defaultAccount: z.string().trim().max(50).default(""),
  defaultBranch: z.string().trim().max(100).optional().default(""),
});

export type HostSettings = z.infer<typeof hostSettingsSchema>;

export const defaultHostSettings: HostSettings = {
  firstName: "",
  lastName: "",
  organisation: "",
  phone: "",
  email: "",
  contributionAlerts: true,
  withdrawalUpdates: true,
  campaignDigest: false,
  preferredPayout: "Mobile money",
  defaultInstitution: "MTN Mobile Money",
  defaultRecipient: "",
  defaultAccount: "",
  defaultBranch: "",
};
