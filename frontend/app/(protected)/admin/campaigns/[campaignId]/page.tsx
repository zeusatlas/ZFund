import CampaignDetails from "@/components/features/admin/campaigns/CampaignDetails";

export const dynamic = "force-dynamic";

export default async function CampaignDetailsPage({
  params,
}: Readonly<{
  params: Promise<{ campaignId: string }>;
}>) {
  const { campaignId } = await params;
  return <CampaignDetails campaignId={campaignId} />;
}
