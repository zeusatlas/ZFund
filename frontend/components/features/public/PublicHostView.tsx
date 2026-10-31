"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Megaphone,
  ArrowRight,
  Smartphone,
} from "lucide-react";
import { formatMoney, formatCount } from "@/lib/format";
import { type PublicHostProfile } from "@/lib/api/public";

interface PublicHostViewProps {
  profile: PublicHostProfile;
}

export default function PublicHostView({ profile }: PublicHostViewProps) {
  const { host, campaigns } = profile;

  return (
    <div className="min-h-screen bg-slate-50 text-navy font-sans antialiased">
      {/* Top Header */}
      <header className="border-b border-navy/10 bg-white sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/images/logo.png"
              alt="RaiseFundz Logo"
              width={36}
              height={36}
              priority
              className="h-9 w-9 object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-navy leading-none">
                RaiseFundz<span className="text-gold">.</span>
              </span>
              <span className="text-[10px] text-steel tracking-wider uppercase font-semibold">
                Host Profile
              </span>
            </div>
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-navy/15 bg-white px-3.5 py-2 text-xs font-bold text-navy hover:bg-navy/5 shadow-2xs transition-all"
          >
            Host Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
        {/* Host Profile Banner */}
        <div className="rounded-0 border border-navy/10 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-navy text-2xl font-black text-gold shadow-md">
              {host.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-extrabold text-navy sm:text-3xl">
                  {host.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  <ShieldCheck size={14} className="text-emerald-700" />
                  Verified Organizer
                </span>
              </div>
              <p className="text-xs font-mono text-steel">@{host.slug}</p>
              <p className="text-xs text-steel max-w-xl">
                Official fundraising portal for {host.name}. Choose an active campaign below to view full details and support with Mobile Money or International Cards.
              </p>
            </div>
          </div>
        </div>

        {/* Active Campaigns Listing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-navy/10 pb-3">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <Megaphone size={18} className="text-gold" />
              <span>Active Fundraisers ({campaigns.length})</span>
            </h2>
            <span className="text-xs text-steel">Accepting contributions</span>
          </div>

          {campaigns.length === 0 ? (
            <div className="rounded-2xl border border-navy/10 bg-white p-10 text-center space-y-2">
              <p className="text-sm font-semibold text-navy">No active campaigns right now</p>
              <p className="text-xs text-steel">
                This host currently does not have any ongoing fundraisers accepting contributions.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {campaigns.map((c) => {
                const targetNum = parseFloat(c.targetAmount || "0");
                return (
                  <Link
                    key={c.id}
                    href={`/${host.slug}/${c.slug}`}
                    className="flex flex-col justify-between rounded-2xl border border-navy/10 bg-white p-5 sm:p-6 shadow-xs hover:border-navy/25 hover:shadow-md transition-all group cursor-pointer block"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        {c.category ? (
                          <span className="rounded-full bg-navy/5 px-2.5 py-0.5 font-semibold text-navy">
                            {c.category}
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                          <Smartphone size={11} />
                          *920*969*{c.eventCode}#
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-navy group-hover:text-gold transition-colors">
                        {c.name}
                      </h3>

                      {c.description && (
                        <p className="text-xs text-steel line-clamp-2 leading-relaxed">
                          {c.description}
                        </p>
                      )}

                      {/* Progress bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex items-baseline justify-between text-xs">
                          <span className="font-bold text-navy">
                            {formatMoney(c.totalRaised)}
                          </span>
                          {targetNum > 0 && (
                            <span className="text-steel">
                              of {formatMoney(targetNum)}
                            </span>
                          )}
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-navy/10">
                          <div
                            className="h-full bg-linear-to-r from-gold to-amber-500 rounded-full"
                            style={{ width: `${c.percentFunded}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-steel">
                          <span>{c.percentFunded}% funded</span>
                          <span>{formatCount(c.contributorsCount)} donors</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-navy/10 flex items-center justify-between">
                      <span className="text-xs text-steel group-hover:text-navy transition-colors">
                        View full story & donate
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-3.5 py-1.5 text-xs font-bold text-white group-hover:bg-navy/90 transition-colors shadow-xs">
                        <span>Support</span>
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-navy/10 bg-white py-8 text-center text-xs text-steel">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-navy">RaiseFundz.com</span>
            <span>• Verified Fundraising Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-navy hover:underline">
              Home
            </Link>
            <Link href="/terms" className="hover:text-navy hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-navy hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
