import type { Metadata } from "next";
import CampaignList from "@/app/dashboard/host/_components/CampaignList";
import HostHeading from "@/app/dashboard/host/_components/HostHeading";
export const metadata: Metadata = { title: "Your campaigns | ZFund" };
export default function CampaignsPage() {
  return <div className="mx-auto max-w-[1400px] py-3 md:py-5"><HostHeading title="Your campaigns" description="Every cause you have brought to life. Find a campaign, check its progress, or open a row for more details." /><CampaignList /><p className="mt-6 text-xs leading-relaxed text-steel">Amounts are in Ghana cedis. Campaign totals include paid contributions only.</p></div>;
}
