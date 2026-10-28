import { z } from "zod";

export const categories = [
  "Community Development",
  "Schools & Education",
  "Churches & Religious Groups",
  "Alumni Associations",
  "Events (Weddings & Funerals)",
  "General Fundraising",
  "Other",
] as const;

export const campaignFormSchema = z.object({
  name: z.string().trim().min(2, "Enter a campaign name with at least 2 characters.").max(100),
  eventCode: z
    .string()
    .trim()
    .regex(/^[0-9]{3,10}$/, "Event code must be 3–10 digits (e.g. 1042) for USSD dialing."),
  category: z.string().min(1, "Please select a category."),
  location: z.string().trim().max(120).optional().default(""),
  description: z.string().trim().max(2000).optional().default(""),
  goal: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount with up to two decimal places (e.g. 25000.00)."),
  closing: z.string().optional().default(""),
  welcomeMessage: z.string().trim().max(120).optional().default(""),
});

export const storedCampaignSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  eventCode: z.string().optional(),
  category: z.string(),
  location: z.string().optional(),
  description: z.string().optional(),
  goal: z.number().int().min(0),
  closing: z.string().optional(),
  created: z.string().optional(),
  status: z.enum(["Draft", "Active", "Completed"]),
});
