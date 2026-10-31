"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
  Users,
  ArrowRight,
  QrCode,
  Layers,
  HeartHandshake,
  MessageSquarePlus,
  Loader2,
  X as CloseIcon,
  Share2,
  Phone,
  Mail,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { formatMoney, formatCount, timeAgo } from "@/lib/format";
import { type PublicCampaign, type WordOfSupport, addWordOfSupport } from "@/lib/api/public";
import DonationModal from "./DonationModal";
import Modal from "@/components/ui/Modal";

/* =========================================================================
 * Brand Icons for Social Sharing (WhatsApp, Facebook, X, Instagram)
 * ========================================================================= */

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function XIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

/* =========================================================================
 * Payment Method Brand Logos (MoMo, Telecel, AT, Visa, Mastercard, Apple Pay)
 * ========================================================================= */

function MtnMomoLogo() {
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg border border-navy/10 bg-white px-2.5 py-1.5 shadow-2xs hover:border-navy/25 transition-colors"
      title="MTN MoMo"
    >
      <Image
        src="/images/mtn-momo.webp"
        alt="MTN MoMo"
        width={72}
        height={20}
        className="h-4.5 w-auto object-contain"
      />
    </span>
  );
}

function TelecelCashLogo() {
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg border border-navy/10 bg-white px-2.5 py-1.5 shadow-2xs hover:border-navy/25 transition-colors"
      title="Telecel Cash"
    >
      <Image
        src="/images/telecel-cash.jpg"
        alt="Telecel Cash"
        width={72}
        height={20}
        className="h-4.5 w-auto object-contain"
      />
    </span>
  );
}

function AtMoneyLogo() {
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg border border-navy/10 bg-white px-2.5 py-1.5 shadow-2xs hover:border-navy/25 transition-colors"
      title="AT Money"
    >
      <Image
        src="/images/at-money-logo.jpeg"
        alt="AT Money"
        width={72}
        height={20}
        className="h-4.5 w-auto object-contain"
      />
    </span>
  );
}

function VisaLogo() {
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg border border-navy/10 bg-white px-2.5 py-1.5 shadow-2xs hover:border-navy/25 transition-colors"
      title="Visa"
    >
      <Image
        src="/images/visa-card.svg"
        alt="Visa"
        width={72}
        height={20}
        className="h-4.5 w-auto object-contain"
      />
    </span>
  );
}

function MastercardLogo() {
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg border border-navy/10 bg-white px-2.5 py-1.5 shadow-2xs hover:border-navy/25 transition-colors"
      title="Mastercard"
    >
      <Image
        src="/images/mastercard.webp"
        alt="Mastercard"
        width={72}
        height={20}
        className="h-4.5 w-auto object-contain"
      />
    </span>
  );
}

function ApplePayLogo() {
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg border border-navy/10 bg-white px-2.5 py-1.5 shadow-2xs hover:border-navy/25 transition-colors"
      title="Apple Pay"
    >
      <Image
        src="/images/apple-pay.png"
        alt="Apple Pay"
        width={72}
        height={20}
        className="h-4.5 w-auto object-contain"
      />
    </span>
  );
}

function PaystackBadge() {
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg border border-navy/10 bg-white px-2.5 py-1.5 shadow-2xs hover:border-navy/25 transition-colors"
      title="PayPal"
    >
      <Image
        src="/images/paypal.png"
        alt="Mastercard"
        width={72}
        height={20}
        className="h-4.5 w-auto object-contain"
      />
    </span>
  );
}

/* =========================================================================
 * Main Component
 * ========================================================================= */

interface PublicCampaignViewProps {
  campaign: PublicCampaign;
}

export default function PublicCampaignView({ campaign }: PublicCampaignViewProps) {
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [donorsDrawerOpen, setDonorsDrawerOpen] = useState(false);
  const [copiedUssd, setCopiedUssd] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  // Words of Support state
  const [wordsList, setWordsList] = useState<WordOfSupport[]>(campaign.wordsOfSupport || []);
  const [visibleWordsCount, setVisibleWordsCount] = useState(5);
  const [supportFormOpen, setSupportFormOpen] = useState(false);
  const [supportName, setSupportName] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [isAnonSupport, setIsAnonSupport] = useState(false);
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);

  // Lock body scroll when donors drawer is open
  useEffect(() => {
    if (!donorsDrawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [donorsDrawerOpen]);

  const ussdString = `*920*969*${campaign.eventCode}#`;
  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://raisefundz.com/${campaign.host.slug}/${campaign.slug}`;

  const hostEmailValue =
    campaign.host.email ||
    (campaign.host.slug === "koranteng-kessie" || campaign.host.id ? "host@raisefundz.com" : null);

  const hostPhoneDisplay = campaign.host.phone
    ? campaign.host.phone.startsWith("233")
      ? `+${campaign.host.phone}`
      : campaign.host.phone
    : null;

  function copyUssd() {
    navigator.clipboard.writeText(ussdString);
    setCopiedUssd(true);
    toast.success("USSD dial code copied! Dial on your phone to donate.");
    setTimeout(() => setCopiedUssd(false), 2500);
  }

  function copyShareLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    toast.success("Campaign link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2500);
  }

  function copyContact(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopiedContact(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopiedContact(null), 2500);
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(
      `Support "${campaign.name}" on RaiseFunds! Every donation counts.\n\nDonate online by Card or Mobile Money:\n${shareUrl}\n\nOr dial USSD: ${ussdString}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  }

  function shareFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  }

  function shareTwitter() {
    const text = encodeURIComponent(
      `Support "${campaign.name}" on RaiseFunds!\nDonate online or dial ${ussdString}:`
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  }

  function shareInstagram() {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    toast.success("Campaign link copied! You can now paste it into your Instagram Story or Bio.");
    setTimeout(() => setCopiedLink(false), 2500);
    window.open("https://instagram.com", "_blank");
  }

  async function handlePostWordOfSupport(e: React.FormEvent) {
    e.preventDefault();
    const cleanMsg = supportMessage.trim();
    if (!cleanMsg || cleanMsg.length < 2) {
      toast.error("Please enter a message of support (at least 2 characters).");
      return;
    }

    setIsSubmittingSupport(true);
    try {
      const newComment = await addWordOfSupport(campaign.id, {
        name: isAnonSupport ? "Anonymous Supporter" : supportName.trim() || undefined,
        message: cleanMsg,
        isAnonymous: isAnonSupport,
      });

      setWordsList((prev) => [newComment, ...prev]);
      setSupportMessage("");
      setSupportFormOpen(false);
      toast.success("Thank you! Your words of support have been posted.");
    } catch {
      toast.error("Failed to post words of support. Please try again.");
    } finally {
      setIsSubmittingSupport(false);
    }
  }

  const targetNum = parseFloat(campaign.targetAmount || "0");
  const raisedNum = parseFloat(campaign.totalRaised || "0");
  const percent = targetNum > 0 ? Math.min(Math.round((raisedNum / targetNum) * 100), 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-navy font-sans antialiased">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-navy/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
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
                Verified Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-navy/15 bg-white px-3.5 py-2 text-xs font-bold text-navy hover:bg-navy/5 shadow-2xs transition-all"
            >
              Host Sign In
            </Link>
            <button
              type="button"
              onClick={() => setDonateModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-navy/90 transition-all cursor-pointer"
            >
              <Heart size={14} className="fill-gold text-gold" />
              <span>Donate</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Campaign Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 sm:py-8">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-12">
          {/* Left Column: Story, Host, Tiers, Words of Support & Supporters (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Category Pill & Host Info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {campaign.category && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-navy/5 px-2.5 py-0.5 text-xs font-semibold text-navy">
                    <Layers size={11} />
                    {campaign.category.name}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  <ShieldCheck size={12} className="text-emerald-700" />
                  Verified Campaign
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl md:text-4xl leading-tight">
                {campaign.name}
              </h1>

              {/* Host Card */}
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-navy/10 bg-white p-3.5 shadow-xs">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  {campaign.host.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-steel">Organized by: </span>
                    <Link
                      href={`/${campaign.host.slug}`}
                      className="text-xs font-bold text-navy hover:underline truncate"
                    >
                      {campaign.host.name}
                    </Link>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-steel">Contact: </span>
                    {campaign.host.phone ? (
                      <button
                        type="button"
                        onClick={() => setContactModalOpen(true)}
                        className="text-xs font-semibold text-navy hover:text-gold hover:underline transition-colors cursor-pointer"
                      >
                        {campaign.host.phone.startsWith("233")
                          ? `+${campaign.host.phone}`
                          : campaign.host.phone}
                      </button>
                    ) : (
                      <span className="text-xs text-steel">Not provided</span>
                    )}
                  </div>
                  {campaign.organization ? (
                    <p className="text-[11px] text-steel truncate">
                      {campaign.organization.name}
                    </p>
                  ) : (
                    <p className="text-[11px] text-steel">Individual Campaign Host</p>
                  )}
                </div>
                <Link
                  href={`/${campaign.host.slug}`}
                  className="rounded-lg border border-navy/15 px-2.5 py-1 text-[11px] font-semibold text-steel hover:text-navy hover:bg-navy/5 transition-colors"
                >
                  View Host
                </Link>
              </div>
            </div>

            {/* USSD Banner for Local Donors */}
            <div className="rounded-2xl border border-gold/40 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-900">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      In Ghana? Dial USSD Code
                    </span>
                    <p className="mt-0.5 text-base font-extrabold tracking-wide text-navy font-mono">
                      {ussdString}
                    </p>
                    <p className="text-xs text-amber-950/80 mt-0.5">
                      Works on MTN, Telecel, and AirtelTigo. No internet required.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyUssd}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-amber-600/30 bg-white px-3 py-1.5 text-xs font-bold text-navy shadow-xs hover:bg-amber-50 transition-colors cursor-pointer"
                  title="Copy USSD Code"
                >
                  {copiedUssd ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
                  <span>{copiedUssd ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Campaign Narrative & Description */}
            <div className="rounded-2xl border border-navy/10 bg-white p-5 sm:p-7 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-navy border-b border-navy/10 pb-3">
                About this Fundraiser
              </h2>
              <div className="prose prose-sm max-w-none text-navy/85 leading-relaxed whitespace-pre-line text-sm">
                {campaign.description || "The organizer has not provided additional narrative for this campaign."}
              </div>

              {/* Allocation Tiers (Purposes) */}
              {campaign.purposes && campaign.purposes.length > 0 && (
                <div className="pt-4 border-t border-navy/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-steel mb-3">
                    Contribution Purposes & Tiers
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {campaign.purposes.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-xl border border-navy/10 bg-slate-50/70 p-3 text-xs"
                      >
                        <span className="font-bold text-navy block">{p.name}</span>
                        {p.description && (
                          <span className="text-steel text-[11px] mt-0.5 block">
                            {p.description}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* =========================================================================
             * Words of Support Section
             * ========================================================================= */}
            <div className="rounded-2xl border border-navy/10 bg-white p-5 sm:p-7 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600 shadow-2xs">
                    <HeartHandshake size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy flex items-center gap-2">
                      <span>Words of Support</span>
                      <span className="rounded-full bg-navy/5 px-2 py-0.5 text-xs font-semibold text-steel">
                        {wordsList.length}
                      </span>
                    </h3>
                    <p className="text-[11px] text-steel">
                      Kind messages and prayers from supporters
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSupportFormOpen(!supportFormOpen)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-navy/15 bg-white px-3.5 py-2 text-xs font-bold text-navy hover:bg-navy/5 transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
                >
                  {supportFormOpen ? (
                    <>
                      <CloseIcon size={14} />
                      <span>Close</span>
                    </>
                  ) : (
                    <>
                      <MessageSquarePlus size={14} className="text-pink-600" />
                      <span>Add Words of Support</span>
                    </>
                  )}
                </button>
              </div>

              {/* Form to Post Words of Support */}
              {supportFormOpen && (
                <form
                  onSubmit={handlePostWordOfSupport}
                  className="rounded-xl border border-navy/15 bg-slate-50/80 p-4 space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy">
                      Leave a message of encouragement
                    </span>
                    <button
                      type="button"
                      onClick={() => setSupportFormOpen(false)}
                      className="text-xs text-steel hover:text-navy cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-steel uppercase mb-1">
                      Your Name (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Auntie Akosua / Nana Yaw"
                      value={supportName}
                      onChange={(e) => setSupportName(e.target.value)}
                      disabled={isAnonSupport}
                      maxLength={60}
                      className="w-full rounded-xl border border-navy/20 bg-white px-3.5 py-2 text-xs text-navy placeholder:text-steel/50 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-steel uppercase">
                        Your Message *
                      </label>
                      <span className="text-[10px] text-steel">
                        {supportMessage.length}/500
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Share prayers, warm wishes, or words of encouragement for this fundraiser..."
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      required
                      maxLength={500}
                      className="w-full rounded-xl border border-navy/20 bg-white px-3.5 py-2 text-xs text-navy placeholder:text-steel/50 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-steel">
                      <input
                        type="checkbox"
                        checked={isAnonSupport}
                        onChange={(e) => setIsAnonSupport(e.target.checked)}
                        className="rounded border-navy/30 text-navy focus:ring-navy"
                      />
                      <span>Post anonymously</span>
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmittingSupport || !supportMessage.trim()}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-navy/90 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
                    >
                      {isSubmittingSupport ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Posting...</span>
                        </>
                      ) : (
                        <>
                          <Heart size={13} className="fill-gold text-gold" />
                          <span>Post Words of Support</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Words of Support List (Recent 10 with Load More) */}
              {wordsList.length > 0 ? (
                <div className="space-y-3">
                  {wordsList.slice(0, visibleWordsCount).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-navy/5 bg-slate-50/60 p-4 text-xs transition-colors hover:bg-slate-50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-amber-400/25 to-gold/30 text-xs font-extrabold text-navy">
                            {item.name ? item.name[0].toUpperCase() : "A"}
                          </div>
                          <div>
                            <span className="font-bold text-navy block">{item.name}</span>
                            <span className="text-[10px] text-steel">
                              {timeAgo(item.createdAt)}
                            </span>
                          </div>
                        </div>

                        {item.amount && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            <Heart size={10} className="fill-emerald-700 text-emerald-700" />
                            <span>Donated {formatMoney(item.amount)}</span>
                          </span>
                        )}
                      </div>

                      <p className="text-navy/90 text-xs italic pl-2.5 leading-relaxed border-l-2 border-gold/70">
                        &ldquo;{item.message}&rdquo;
                      </p>
                    </div>
                  ))}

                  {/* Load More Button (5 more at a time) */}
                  {wordsList.length > visibleWordsCount && (
                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => setVisibleWordsCount((prev) => prev + 5)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-navy/15 bg-white px-5 py-2.5 text-xs font-bold text-navy hover:bg-navy/5 shadow-2xs transition-all cursor-pointer"
                      >
                        <span>Load More ({wordsList.length - visibleWordsCount} remaining)</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-7 px-4 rounded-xl border border-dashed border-navy/15 bg-slate-50/40 space-y-2">
                  <p className="text-xs text-steel">
                    No words of support yet. Leave the very first message of encouragement!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Donation Card, Progress, and Supporters Wall (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            {/* Sticky Donation Card */}
            <div className="sticky top-20 space-y-6">
              <div className="rounded-2xl border border-navy/15 bg-white p-6 shadow-md space-y-6">
                {/* Financial Progress */}
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-navy sm:text-3xl">
                      {formatMoney(campaign.totalRaised)}
                    </span>
                    {targetNum > 0 && (
                      <span className="text-xs font-medium text-steel">
                        of {formatMoney(targetNum)} goal
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="h-3 w-full overflow-hidden rounded-full bg-navy/10">
                      <div
                        className="h-full bg-linear-to-r from-gold to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs font-semibold text-steel">
                      <span>{percent}% funded</span>
                      <span>{formatCount(campaign.contributorsCount)} contributions</span>
                    </div>
                  </div>
                </div>

                {/* Big Donation CTA */}
                <button
                  type="button"
                  onClick={() => setDonateModalOpen(true)}
                  className="w-full rounded-xl bg-navy py-3.5 text-sm font-bold text-white shadow-lg shadow-navy/20 hover:bg-navy/90 hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Heart size={18} className="fill-gold text-gold group-hover:scale-110 transition-transform" />
                  <span>Donate Now (Card or MoMo)</span>
                  <ArrowRight size={16} className="text-white/80" />
                </button>

                {/* Share Button (triggers Share Modal) */}
                <button
                  type="button"
                  onClick={() => setShareModalOpen(true)}
                  className="w-full rounded-xl border border-navy/15 bg-white py-3 text-xs font-bold text-navy hover:bg-navy/5 shadow-2xs transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Share2 size={15} className="text-gold group-hover:scale-110 transition-transform" />
                  <span>Share Fundraiser</span>
                </button>
              </div>

              {/* Supporters Wall (Recent 5 with "See All" button triggering Drawer) */}
              <div className="rounded-2xl border border-navy/10 bg-white p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-navy/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy/5 text-navy">
                      <Users size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-navy flex items-center gap-1.5">
                        <span>Donors Wall</span>
                        <span className="rounded-full bg-navy/5 px-1.5 py-0.5 text-[11px] font-semibold text-steel">
                          {formatCount(campaign.contributorsCount)}
                        </span>
                      </h3>
                      <span className="text-[10px] text-steel">Recent contributions</span>
                    </div>
                  </div>

                  {campaign.recentDonations && campaign.recentDonations.length > 5 && (
                    <button
                      type="button"
                      onClick={() => setDonorsDrawerOpen(true)}
                      className="text-xs font-bold text-gold hover:text-amber-600 cursor-pointer flex items-center gap-1"
                    >
                      <span>See All</span>
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>

                {campaign.recentDonations && campaign.recentDonations.length > 0 ? (
                  <div className="space-y-2.5">
                    {campaign.recentDonations.slice(0, 5).map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between rounded-xl border border-navy/5 bg-slate-50/60 p-2.5 text-xs transition-colors hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy/10 text-xs font-bold text-navy">
                            {d.donorName ? d.donorName[0].toUpperCase() : "D"}
                          </div>
                          <div>
                            <span className="font-bold text-navy block text-xs">{d.donorName}</span>
                            <span className="text-[10px] text-steel">
                              {timeAgo(d.createdAt)} {d.purpose ? `• ${d.purpose}` : ""}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-navy text-xs">
                          {formatMoney(d.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-5 text-xs text-steel">
                    Be the very first generous supporter to donate to this campaign!
                  </p>
                )}

                {campaign.recentDonations && campaign.recentDonations.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setDonorsDrawerOpen(true)}
                    className="w-full rounded-xl border border-navy/15 bg-slate-50/70 py-2.5 text-xs font-bold text-navy hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>See All Supporters ({formatCount(campaign.contributorsCount)})</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Donation Checkout Modal */}
      <DonationModal
        campaign={campaign}
        open={donateModalOpen}
        onClose={() => setDonateModalOpen(false)}
      />

      {/* All Supporters Drawer */}
      {donorsDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="presentation">
          {/* Backdrop overlay */}
          <button
            type="button"
            aria-label="Close all supporters drawer"
            onClick={() => setDonorsDrawerOpen(false)}
            className="fixed inset-0 h-full w-full cursor-default bg-midnight/55 backdrop-blur-[1px] transition-opacity duration-300"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full">
            <aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="all-donors-drawer-title"
              className="flex w-screen max-w-md flex-col bg-stone-light text-navy shadow-2xl animate-drawer border-l border-navy/10"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-navy/10 bg-white p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-navy" />
                    <h2 id="all-donors-drawer-title" className="text-lg font-bold text-navy">
                      All Supporters ({formatCount(campaign.contributorsCount)})
                    </h2>
                  </div>
                  <p className="text-xs text-steel mt-0.5">
                    Generous people supporting this campaign
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDonorsDrawerOpen(false)}
                  aria-label="Close drawer"
                  className="rounded-lg p-2 text-steel hover:bg-navy/5 hover:text-navy cursor-pointer transition-colors"
                >
                  <CloseIcon size={18} />
                </button>
              </div>

              {/* Drawer List Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-stone-light">
                {campaign.recentDonations && campaign.recentDonations.length > 0 ? (
                  campaign.recentDonations.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between rounded-xl border border-navy/10 bg-white p-3.5 text-xs shadow-2xs transition-colors hover:border-navy/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/10 text-xs font-bold text-navy">
                          {d.donorName ? d.donorName[0].toUpperCase() : "D"}
                        </div>
                        <div>
                          <span className="font-bold text-navy block text-sm">{d.donorName}</span>
                          <span className="text-[11px] text-steel">
                            {timeAgo(d.createdAt)} {d.purpose ? `• ${d.purpose}` : ""}
                          </span>
                        </div>
                      </div>
                      <span className="font-extrabold text-navy text-sm">
                        {formatMoney(d.amount)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-10 text-xs text-steel">
                    No contributions recorded yet.
                  </p>
                )}
              </div>

              {/* Drawer Footer CTA */}
              <div className="border-t border-navy/10 p-4 bg-white">
                <button
                  type="button"
                  onClick={() => {
                    setDonorsDrawerOpen(false);
                    setDonateModalOpen(true);
                  }}
                  className="w-full rounded-xl bg-navy py-3 text-xs font-bold text-white shadow-md hover:bg-navy/90 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Heart size={14} className="fill-gold text-gold" />
                  <span>Join Supporters & Donate</span>
                </button>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* Share Campaign Modal */}
      {shareModalOpen && (
        <Modal
          onClose={() => setShareModalOpen(false)}
          title="Share this Fundraiser"
          eyebrow="Spread the word"
        >
          <div className="p-5 sm:p-6 space-y-5">
            <p className="text-xs text-steel leading-relaxed">
              Sharing this campaign with your network, family, and friends helps reach more people and hit the goal faster.
            </p>

            {/* Social Media Platforms */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-steel block mb-2.5">
                Share to Social Media
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={shareWhatsApp}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 py-3 px-3 text-xs font-bold text-[#128C7E] hover:bg-[#25D366]/20 transition-all shadow-2xs group cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <WhatsAppIcon className="h-4.5 w-4.5 shrink-0 fill-[#25D366] group-hover:scale-110 transition-transform" />
                  <span>WhatsApp</span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={shareFacebook}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#1877F2]/30 bg-[#1877F2]/10 py-3 px-3 text-xs font-bold text-[#1877F2] hover:bg-[#1877F2]/20 transition-all shadow-2xs group cursor-pointer"
                  title="Share on Facebook"
                >
                  <FacebookIcon className="h-4.5 w-4.5 shrink-0 fill-[#1877F2] group-hover:scale-110 transition-transform" />
                  <span>Facebook</span>
                </button>

                {/* X (Twitter) */}
                <button
                  type="button"
                  onClick={shareTwitter}
                  className="flex items-center justify-center gap-2 rounded-xl border border-navy/20 bg-navy/5 py-3 px-3 text-xs font-bold text-navy hover:bg-navy/10 transition-all shadow-2xs group cursor-pointer"
                  title="Share on X"
                >
                  <XIcon className="h-4 w-4 shrink-0 fill-navy group-hover:scale-110 transition-transform" />
                  <span>X (Twitter)</span>
                </button>

                {/* Instagram */}
                <button
                  type="button"
                  onClick={shareInstagram}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#E1306C]/30 bg-[#E1306C]/10 py-3 px-3 text-xs font-bold text-[#E1306C] hover:bg-[#E1306C]/20 transition-all shadow-2xs group cursor-pointer"
                  title="Share on Instagram"
                >
                  <InstagramIcon className="h-4.5 w-4.5 shrink-0 fill-[#E1306C] group-hover:scale-110 transition-transform" />
                  <span>Instagram</span>
                </button>
              </div>
            </div>

            {/* Copy Link */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-steel block mb-1.5">
                Copy Campaign Link
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1 truncate rounded-xl border border-navy/15 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-navy">
                  {shareUrl}
                </div>
                <button
                  type="button"
                  onClick={copyShareLink}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2.5 text-xs font-bold text-white hover:bg-navy/90 transition-colors shadow-2xs cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-steel block mb-1.5">
                Campaign QR Code
              </span>
              <div className="rounded-2xl border border-navy/10 bg-slate-50/70 p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-navy/15 bg-white p-2 shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                      shareUrl
                    )}`}
                    alt="Campaign QR Code"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 font-bold text-xs text-navy">
                    <QrCode size={15} className="text-gold" />
                    <span>Scan with Mobile Camera</span>
                  </div>
                  <p className="text-[11px] text-steel leading-relaxed">
                    Point any smartphone camera at this code to open and donate to this campaign immediately.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShareModalOpen(false);
                      setQrModalOpen(true);
                    }}
                    className="text-xs font-bold text-navy hover:underline cursor-pointer inline-flex items-center gap-1 pt-0.5"
                  >
                    <span>View Larger QR Code</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* QR Code Sharing Modal */}
      {qrModalOpen && (
        <Modal
          onClose={() => setQrModalOpen(false)}
          title="Scan to Donate"
        >
          <div className="text-center py-4 space-y-4">
            <p className="text-xs text-steel">
              Scan this code with a mobile phone camera to open this campaign instantly:
            </p>
            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border border-navy/15 bg-white p-3 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  shareUrl
                )}`}
                alt="Campaign QR Code"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="rounded-xl border border-navy/10 bg-navy/5 p-3 text-xs font-mono text-navy">
              {shareUrl}
            </div>
            <button
              type="button"
              onClick={copyShareLink}
              className="w-full rounded-xl bg-navy py-2.5 text-xs font-bold text-white hover:bg-navy/90 transition-colors cursor-pointer"
            >
              {copiedLink ? "Link Copied" : "Copy URL"}
            </button>
          </div>
        </Modal>
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-navy/10 bg-white py-10 text-xs text-steel">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Accepted Payment Channels */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row pb-6 border-b border-navy/10">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-navy">
                Accepted Payment Channels:
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                Instant & Secure
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <MtnMomoLogo />
              <TelecelCashLogo />
              <AtMoneyLogo />
              <VisaLogo />
              <MastercardLogo />
              <ApplePayLogo />
              <PaystackBadge />
            </div>
          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              {/* <span className="font-extrabold text-navy">RaiseFundz.com</span> */}
              <span>© 2026 RaiseFundz. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-navy hover:underline">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-navy hover:underline">
                Privacy Policy
              </Link>
              <Link href="/contact" className="hover:text-navy hover:underline">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Contact Host Button at Bottom Right Corner */}
      <aside aria-label="Contact host floating action" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => setContactModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2.5 sm:px-5 sm:py-3 text-xs font-bold text-white shadow-xl hover:bg-navy/90 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all border border-gold/40 cursor-pointer"
          aria-label={`Contact organizer ${campaign.host.name}`}
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
          title="Contact Campaign Organizer"
          eyebrow="Organizer Details"
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
                  {campaign.host.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-sm font-bold text-navy truncate">
                      {campaign.host.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      <ShieldCheck size={11} className="text-emerald-700" />
                      Verified Organizer
                    </span>
                  </div>
                  <p className="text-xs font-mono text-steel">@{campaign.host.slug}</p>
                  {campaign.organization ? (
                    <p className="text-[11px] text-steel truncate mt-0.5">
                      Representing <span className="font-medium text-navy">{campaign.organization.name}</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-steel mt-0.5">Individual Campaign Host</p>
                  )}
                </div>
              </div>

              {/* Host contact details summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2.5 border-t border-navy/10 text-xs">
                <div className="flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 border border-navy/5 shadow-2xs min-w-0">
                  <Phone size={13} className="text-gold shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-semibold text-steel block">Phone / MoMo</span>
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
              {campaign.host.phone ? (
                <a
                  href={`tel:${campaign.host.phone.startsWith("+") ? campaign.host.phone : `+${campaign.host.phone}`}`}
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
                  href={`mailto:${hostEmailValue}?subject=${encodeURIComponent(`Inquiry regarding "${campaign.name}"`)}`}
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
              {/* Public Host Profile Link */}
              <Link
                href={`/${campaign.host.slug}`}
                onClick={() => setContactModalOpen(false)}
                className="flex items-center justify-between gap-2 rounded-xl border border-navy/10 bg-stone-light/40 p-3 text-xs font-semibold text-navy hover:bg-stone transition-colors group"
              >
                <span>View all campaigns by this organizer</span>
                <ArrowRight size={13} className="text-steel group-hover:text-gold transition-colors group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
