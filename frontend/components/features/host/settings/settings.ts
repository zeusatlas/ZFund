import { z } from "zod";

export const hostSettingsSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(100),
  organisation: z.string().trim().max(120),
  phone: z.string().trim().regex(/^(0\d{9}|\+233\d{9})$/, "Enter a valid Ghana mobile number."),
  email: z.string().trim().email("Enter a valid email address."),
  contributionAlerts: z.boolean(),
  withdrawalUpdates: z.boolean(),
  campaignDigest: z.boolean(),
  preferredPayout: z.enum(["Mobile money", "Bank transfer"]),
});

export type HostSettings = z.infer<typeof hostSettingsSchema>;

export const defaultHostSettings: HostSettings = {
  fullName: "Jane Doe",
  organisation: "Aburi Community Projects",
  phone: "0240000345",
  email: "jane@zfund.com",
  contributionAlerts: true,
  withdrawalUpdates: true,
  campaignDigest: false,
  preferredPayout: "Mobile money",
};
