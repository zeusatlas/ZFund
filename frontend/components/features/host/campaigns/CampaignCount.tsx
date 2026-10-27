"use client";
import { useCampaigns } from "@/components/features/host/campaigns/use-campaigns";
export default function CampaignCount() { return useCampaigns().length; }
