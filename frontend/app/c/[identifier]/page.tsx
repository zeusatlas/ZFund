import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { getPublicCampaignByCode } from "@/lib/api/public";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    identifier: string;
  }>;
}

export default async function ShortCodeRedirectPage({ params }: PageProps) {
  const { identifier } = await params;

  let redirectUrl: string | null = null;
  try {
    const campaign = await getPublicCampaignByCode(identifier);
    const hostSlug = campaign?.host?.slug || "host";
    const campaignSlug = campaign?.slug || campaign?.eventCode || identifier;
    if (campaignSlug) {
      redirectUrl = `/${hostSlug}/${campaignSlug}`;
    }
  } catch {
    // If not found, show error state below
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-lg space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <AlertCircle size={28} />
        </div>
        <h1 className="text-xl font-bold text-navy">Campaign Not Found</h1>
        <p className="text-xs text-steel leading-relaxed">
          No active campaign matching code or ID &ldquo;{identifier}&rdquo; was found.
        </p>
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
