"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Megaphone,
  ArrowRight,
  Smartphone,
  Phone,
  Mail,
  MessageSquare,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { formatMoney, formatCount } from "@/lib/format";
import { type PublicHostProfile } from "@/lib/api/public";
import Modal from "@/components/ui/Modal";

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface PublicHostViewProps {
  profile: PublicHostProfile;
}

export default function PublicHostView({ profile }: PublicHostViewProps) {
  const { host, campaigns } = profile;
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  const hostEmailValue =
    host.email ||
    (host.slug === "koranteng-kessie" || host.id ? "host@raisefundz.com" : null);

  const hostPhoneDisplay = host.phone
    ? host.phone.startsWith("233")
      ? `+${host.phone}`
      : host.phone
    : null;

  function copyContact(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopiedContact(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopiedContact(null), 2500);
  }

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
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono text-steel">@{host.slug}</span>
                {host.phone && (
                  <>
                    <span className="text-steel/40">·</span>
                    <button
                      type="button"
                      onClick={() => setContactModalOpen(true)}
                      className="font-medium text-navy hover:text-gold hover:underline transition-colors cursor-pointer"
                    >
                      {host.phone.startsWith("233") ? `+${host.phone}` : host.phone}
                    </button>
                  </>
                )}
              </div>
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
            <div className="grid gap-2 md:grid-cols-3">
              {campaigns.map((c) => {
                const targetNum = parseFloat(c.targetAmount || "0");
                return (
                  <Link
                    key={c.id}
                    href={`/${host.slug}/${c.slug}`}
                    className="flex flex-col justify-between rounded-0 border border-navy/10 bg-white p-5 sm:p-6 shadow-xs hover:border-navy/25 hover:shadow-md transition-all group cursor-pointer block"
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
            {/* <span className="font-extrabold text-navy">RaiseFundz.com</span> */}
            <span>© 2026 RaiseFundz. All rights reserved.</span>
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

      {/* Floating Contact Host Button at Bottom Right Corner */}
      <aside aria-label="Contact host floating action" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => setContactModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2.5 sm:px-5 sm:py-3 text-xs font-bold text-white shadow-xl hover:bg-navy/90 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all border border-gold/40 cursor-pointer"
          aria-label={`Contact organizer ${host.name}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <MessageSquare size={15} className="text-gold" />
          <span>Contact Host / Organizer</span>
        </button>
      </aside>

      {/* Contact Host Modal */}
      {contactModalOpen && (
        <Modal
          size="md"
          title="Contact Host"
          eyebrow="Organizer Contact Details"
          onClose={() => setContactModalOpen(false)}
          footer={
            <div className="flex items-center justify-end w-full">
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                className="rounded-xl border border-navy/20 bg-white px-5 py-2 text-xs font-semibold text-navy hover:bg-stone transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Host Profile Header Card with Contact Details */}
            <div className="rounded-2xl border border-navy/10 bg-stone-light/60 p-4 space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-sm font-extrabold text-gold shadow-xs">
                  {host.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-sm font-bold text-navy truncate">{host.name}</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      <ShieldCheck size={11} className="text-emerald-700" />
                      Verified Organizer
                    </span>
                  </div>
                  <p className="text-xs font-mono text-steel">@{host.slug}</p>
                  <p className="text-[11px] text-steel mt-0.5">
                    Host of {campaigns.length} active {campaigns.length === 1 ? "fundraiser" : "fundraisers"} on RaiseFundz
                  </p>
                </div>
              </div>

              {/* Host contact details summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2.5 border-t border-navy/10 text-xs">
                <div className="flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 border border-navy/5 shadow-2xs min-w-0">
                  <Phone size={13} className="text-gold shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-semibold text-steel block">Phone</span>
                    <span className="font-mono text-xs font-bold text-navy truncate block">
                      {hostPhoneDisplay || "Not provided"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 border border-navy/5 shadow-2xs min-w-0">
                  <Mail size={13} className="text-gold shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-semibold text-steel block">Email Address</span>
                    <span className="text-xs font-semibold text-navy truncate block" title={hostEmailValue || undefined}>
                      {hostEmailValue || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions (Call Host & Email Host) */}
            <div className="flex items-center gap-2">
              {host.phone ? (
                <a
                  href={`tel:${host.phone.startsWith("+") ? host.phone : `+${host.phone}`}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-navy py-2.5 text-xs font-bold text-white shadow-xs hover:bg-navy/90 hover:shadow-md transition-all cursor-pointer"
                >
                  <Phone size={13} />
                  <span>Call Host</span>
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-400 cursor-not-allowed"
                >
                  <Phone size={13} />
                  <span>Call Host</span>
                </button>
              )}

              {hostEmailValue ? (
                <a
                  href={`mailto:${hostEmailValue}?subject=${encodeURIComponent(`Inquiry for ${host.name}`)}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gold py-2.5 text-xs font-bold text-navy shadow-xs hover:bg-gold-light hover:shadow-md transition-all cursor-pointer"
                >
                  <Mail size={13} />
                  <span>Email Host</span>
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-400 cursor-not-allowed"
                >
                  <Mail size={13} />
                  <span>Email Host</span>
                </button>
              )}
            </div>

            {/* Detailed Contact Channels with Copy actions */}
            <div className="space-y-2.5">
              {/* Phone Channel */}
              <div className="rounded-xl border border-navy/10 bg-white p-3.5 shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy">
                      <Phone size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-steel uppercase tracking-wider">Phone / MoMo</p>
                      <p className="text-xs font-bold text-navy font-mono truncate">
                        {hostPhoneDisplay || "Not provided by host"}
                      </p>
                    </div>
                  </div>
                  {host.phone && (
                    <button
                      type="button"
                      onClick={() => copyContact(host.phone!, "Phone number")}
                      className="inline-flex items-center gap-1 rounded-lg border border-navy/15 px-2.5 py-1 text-xs font-medium text-navy hover:bg-stone transition-colors cursor-pointer shrink-0"
                      title="Copy phone number"
                    >
                      {copiedContact === "Phone number" ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      <span>{copiedContact === "Phone number" ? "Copied" : "Copy"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Email Channel */}
              <div className="rounded-xl border border-navy/10 bg-white p-3.5 shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy">
                      <Mail size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-steel uppercase tracking-wider">Email Address</p>
                      <p className="text-xs font-semibold text-navy truncate">
                        {hostEmailValue || "Not provided by host"}
                      </p>
                    </div>
                  </div>
                  {hostEmailValue && (
                    <button
                      type="button"
                      onClick={() => copyContact(hostEmailValue, "Email address")}
                      className="inline-flex items-center gap-1 rounded-lg border border-navy/15 px-2.5 py-1 text-xs font-medium text-navy hover:bg-stone transition-colors cursor-pointer shrink-0"
                      title="Copy email address"
                    >
                      {copiedContact === "Email address" ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      <span>{copiedContact === "Email address" ? "Copied" : "Copy"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Trust note */}
            <p className="text-[11px] leading-relaxed text-steel text-center pt-1">
              For your safety, never share your Mobile Money PIN or banking credentials with anyone.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
