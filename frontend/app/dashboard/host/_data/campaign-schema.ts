import { z } from "zod";
export const categories = ["Community", "Education", "Welfare", "Medical", "Faith", "Other"] as const;
export const campaignFormSchema = z.object({
  name: z.string().trim().min(3, "Enter a campaign name with at least 3 characters.").max(100),
  category: z.enum(categories),
  location: z.string().trim().min(2, "Enter the town or city and region.").max(120),
  description: z.string().trim().min(20, "Tell contributors about your campaign in at least 20 characters.").max(2000),
  goal: z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount with up to two decimal places.").transform(value => Math.round(Number(value) * 100)).pipe(z.number().int().min(100, "The goal must be at least GH₵ 1.").max(10000000000, "The goal cannot exceed GH₵ 100,000,000.")),
  closing: z.iso.date(),
});
export const storedCampaignSchema = z.object({
  id: z.string().startsWith("LOCAL-"),
  name: z.string().min(3).max(100),
  category: z.enum(categories),
  location: z.string().min(2).max(120),
  description: z.string().min(20).max(2000),
  goal: z.number().int().min(100).max(10000000000),
  closing: z.iso.date(),
  created: z.iso.date(),
  status: z.literal("Draft"),
});
