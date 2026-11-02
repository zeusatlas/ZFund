import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { getPublicCampaign } from "@/lib/api/public";
import PublicCampaignView from "@/components/features/public/PublicCampaignView";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    hostSlug: string;
    campaignSlug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { hostSlug, campaignSlug } = await params;
  try {
    const campaign = await getPublicCampaign(hostSlug, campaignSlug);
    return {
      title: `${campaign.name} | Support on RaiseFunds`,
      description:
        campaign.description?.slice(0, 160) ||
        `Support ${campaign.name} organized by ${campaign.host.name} on RaiseFunds.`,
      openGraph: {
        title: campaign.name,
        description: campaign.description?.slice(0, 160),
        type: "website",
      },
    };
  } catch {
    return {
      title: "Campaign | RaiseFunds",
    };
  }
}

export default async function PublicCampaignPage({ params }: PageProps) {
  const { hostSlug, campaignSlug } = await params;

  let campaign = null;
  let errorMessage: string | null = null;

  try {
    campaign = await getPublicCampaign(hostSlug, campaignSlug);
  } catch (err: unknown) {
    errorMessage =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      "This campaign could not be found or is not currently accepting public contributions.";
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-lg space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <AlertCircle size={28} />
          </div>
          <h1 className="text-xl font-bold text-navy">Campaign Not Available</h1>
          <p className="text-xs text-steel leading-relaxed">{errorMessage}</p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2.5 text-xs font-bold text-white hover:bg-navy/90 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Return to RaiseFunds Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <PublicCampaignView campaign={campaign} />;
}
