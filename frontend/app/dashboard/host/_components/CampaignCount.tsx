"use client";
import { useCampaigns } from "../_data/use-campaigns";
export default function CampaignCount() { return useCampaigns().length; }
