import type { Metadata } from "next";
import CampaignList from "@/components/features/host/campaigns/CampaignList";
import HostHeading from "@/components/features/host/shared/HostHeading";
export const metadata: Metadata = { title: "Your campaigns | RaiseFundz" };

export default function CampaignsPage() {
  return (
    <div className="w-full space-y-7">
      <HostHeading
        title="Your campaigns"
        description="Every cause you have brought to life. Find a campaign, check its progress, or open a row for more details."
      />
      <CampaignList />
      <p className="mt-6 text-xs leading-relaxed text-steel">
        Amounts are in Ghana cedis. Campaign totals include paid contributions only.
      </p>
    </div>
  );
}
