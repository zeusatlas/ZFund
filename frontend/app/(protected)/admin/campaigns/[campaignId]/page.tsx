import CampaignDetails from "@/components/features/admin/campaigns/CampaignDetails";

export const instant = false;

export default async function CampaignDetailsPage({
  params,
}: Readonly<{
  params: Promise<{ campaignId: string }>;
}>) {
  const { campaignId } = await params;
  return <CampaignDetails campaignId={campaignId} />;
}
