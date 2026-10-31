import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { getPublicHost } from "@/lib/api/public";
import PublicHostView from "@/components/features/public/PublicHostView";

interface PageProps {
  params: Promise<{
    hostSlug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { hostSlug } = await params;
  try {
    const profile = await getPublicHost(hostSlug);
    return {
      title: `${profile.host.name} | Verified Host on RaiseFunds`,
      description: `Support fundraisers organized by ${profile.host.name} on RaiseFunds.`,
    };
  } catch {
    return {
      title: "Host Profile | RaiseFunds",
    };
  }
}

export default async function PublicHostPage({ params }: PageProps) {
  const { hostSlug } = await params;

  let profile = null;
  let errorMessage: string | null = null;

  try {
    profile = await getPublicHost(hostSlug);
  } catch (err: unknown) {
    errorMessage =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      `The host '@${hostSlug}' could not be found.`;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-lg space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <AlertCircle size={28} />
          </div>
          <h1 className="text-xl font-bold text-navy">Host Not Found</h1>
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

  return <PublicHostView profile={profile} />;
}
