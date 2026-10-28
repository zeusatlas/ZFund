import {
  Building2, ClipboardList, Globe, GraduationCap,
  HeartHandshake, Smartphone, Users, WalletCards,
  BarChart3, BadgeCheck, CheckCircle2,
} from "lucide-react";

/* ── Section Label ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ash bg-white px-3.5 py-1.5 shadow-2xs">
      <span className="h-1.5 w-1.5 rounded-full bg-off-ink" />
      <span className="text-eyebrow text-graphite">{children}</span>
    </div>
  );
}

function SocialProofTicker() {
  const items = [
    "847 donors gave today",
    "GH₵ 156,420 raised this month",
    "Donations happening across Ghana",
    "Every contribution tracked securely",
  ];

  return (
    <div className="overflow-hidden border-y border-ash/60 bg-white py-3.5">
      <div className="flex min-w-max animate-marquee items-center gap-10 px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-graphite">
        {[...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-off-ink/40" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatsBar() {
  const stats = [
    { value: "GH₵ 2.4M+", label: "raised through RaiseFundz" },
    { value: "12,000+", label: "contributions processed" },
    { value: "98%", label: "successful campaigns" },
    { value: "16 regions", label: "reached across Ghana" },
  ];

  return (
    <div className="border-b border-ash/60 bg-white py-10">
      <div className="mx-auto grid max-w-[1200px] gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <p className="text-[26px] font-bold tracking-[-0.8px] text-off-ink">{stat.value}</p>
            <p className="mt-1 text-[13px] text-graphite">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Feature card ── */
function FeatureCard({
  icon: Icon, title, description, highlight = false,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div className={`card-hover group rounded-[28px] p-7 transition-all ${
      highlight
        ? "bg-off-ink text-parchment shadow-md"
        : "border border-ash/70 bg-parchment"
    }`}>
      <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-[18px] transition-colors ${
        highlight
          ? "bg-white/10 group-hover:bg-white/20"
          : "bg-white group-hover:bg-ash/50 border border-ash/40"
      }`}>
        <Icon size={20} className={highlight ? "text-white" : "text-off-ink"} />
      </div>
      <h3 className={`mb-3 text-[17px] font-bold tracking-[-0.3px] ${highlight ? "text-white" : "text-off-ink"}`}>
        {title}
      </h3>
      <p className={`text-[14px] leading-relaxed ${highlight ? "text-parchment/70" : "text-graphite"}`}>
        {description}
      </p>
    </div>
  );
}

/* ── Org card ── */
function OrgCard({
  icon: Icon, title, description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="card-hover group rounded-[28px] bg-white border border-ash/70 p-7 transition-all hover:border-off-ink/30 shadow-2xs">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[18px] bg-off-ink transition-colors group-hover:bg-charcoal">
        <Icon size={19} className="text-parchment" />
      </div>
      <h3 className="mb-2.5 text-[17px] font-bold text-off-ink">{title}</h3>
      <p className="text-[14px] leading-relaxed text-graphite">{description}</p>
    </div>
  );
}

const JOURNEY_STEPS = [
  {
    title: "Give your community a clear goal",
    body: "Start with the purpose, a target in Ghana cedis (GH₵), and a closing date. Explain who will benefit and how the money will be used.",
    example: "Example: GH₵ 50,000 for a community borehole in the Eastern Region.",
  },
  {
    title: "Prepare your campaign for review",
    body: "Provide the organiser's details and a clear campaign description. The review process gives an administrator a chance to check a campaign before it opens for contributions.",
    example: "Have your project budget, beneficiary details, and organiser contact ready.",
  },
  {
    title: "Share the campaign with your people",
    body: "The donation journey uses USSD so supporters can contribute from a basic phone. Share the approved campaign instructions through WhatsApp groups, community meetings, and announcements.",
    example: "A school's alumni association can share the same campaign shortcode across Ghana.",
  },
  {
    title: "Track contributions and request a payout",
    body: "The host dashboard brings campaign totals, contribution records, and withdrawal requests together. When ready, request a payout directly to mobile money or bank.",
    example: "Keep your community updated on what has been collected and what the funds support.",
  },
];

/* ── Main component ── */
export default function LandingOverview() {
  const hostFeatures = [
    { icon: Smartphone, title: "USSD-powered collection", description: "Donors give via a simple shortcode from any mobile phone — no app, no internet, no bank card. Contributions land in your dashboard instantly.", highlight: false },
    { icon: BarChart3, title: "Live campaign analytics", description: "Watch contributions roll in with real-time totals, donor counts, and average gift sizes. Know exactly how your campaign is performing.", highlight: true },
    { icon: WalletCards, title: "On-demand withdrawals", description: "Request a withdrawal whenever you're ready. Choose mobile money or bank, and track the status through to completion.", highlight: false },
    { icon: ClipboardList, title: "Full transaction history", description: "Every donation is logged with the donor's masked number, amount, and timestamp. Export your complete contribution record at any time.", highlight: false },
    { icon: Users, title: "Multi-campaign management", description: "Run multiple fundraisers simultaneously. Set goals, durations, and descriptions for each — all from one unified dashboard.", highlight: false },
    { icon: BadgeCheck, title: "Campaign verification", description: "Your campaigns carry a verified badge that builds donor trust. Admins review campaigns before they go live to the USSD network.", highlight: false },
  ];

  const orgTypes = [
    { icon: HeartHandshake, title: "Community Groups", description: "Hometown associations, neighbourhood funds, and welfare groups can unite around a shared goal — with full transparency for every contributor." },
    { icon: Building2, title: "NGOs & Nonprofits", description: "Run multiple concurrent campaigns with admin oversight, donor reporting, and exportable records for grant compliance and accountability." },
    { icon: GraduationCap, title: "Schools & Institutions", description: "Fee drives, bursary funds, and alumni giving campaigns — managed by admin staff with role-based access and withdrawal approval flows." },
    { icon: Globe, title: "Faith Organisations", description: "Tithes, building funds, and mission drives collected via USSD from your congregation — anywhere, any time, any network." },
  ];

  return (
    <>
      {/* Section 2: Social proof ticker & Stats (White) */}
      <SocialProofTicker />
      <StatsBar />

      {/* Section 3: How it works / From an idea to a funded project (Light Beige) */}
      <section id="how-it-works" className="scroll-mt-20 bg-parchment py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-16">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="mt-2 text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-[-1.5px] text-off-ink">
              From an idea to a funded project
            </h2>
            <p className="mt-3 text-[16px] text-graphite max-w-xl leading-relaxed">
              Four simple steps from creating your fundraiser to receiving your community&apos;s contributions.
            </p>
          </div>

          <ol className="space-y-0">
            {JOURNEY_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="grid gap-6 border-t border-ash/70 py-10 md:grid-cols-[72px_1fr_1.1fr] md:gap-10"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-off-ink text-parchment text-base font-bold shadow-sm">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="mb-3 text-[22px] font-bold tracking-tight text-off-ink">
                    {step.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-graphite">{step.body}</p>
                </div>
                <div className="self-start rounded-[24px] bg-white border border-ash/70 p-6 shadow-2xs">
                  <p className="text-[14px] leading-relaxed text-off-ink font-medium">
                    {step.example}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Section 4: For hosts (White) */}
      <section id="for-hosts" className="scroll-mt-20 bg-white py-24 border-t border-ash/60">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-4">
            <SectionLabel>For hosts</SectionLabel>
          </div>
          <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-[-1.5px] text-off-ink">
              Everything you need<br />
              <span className="text-graphite font-medium">to run a successful fundraiser.</span>
            </h2>
            <p className="max-w-xs text-[15px] leading-relaxed text-graphite md:pb-2">
              Powerful tools built specifically for Ghanaian fundraisers — no technical knowledge required.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hostFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: For organisations (Light Beige) */}
      <section id="for-organizations" className="scroll-mt-20 bg-parchment py-24 border-t border-ash/60">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-4">
            <SectionLabel>For organisations</SectionLabel>
          </div>
          <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
            <h2 className="text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-[-1.5px] text-off-ink">
              Built for groups
              <br />
              <span className="text-graphite font-medium">of every size.</span>
            </h2>
            <div>
              <p className="text-[16px] leading-relaxed text-graphite md:max-w-sm">
                Whether you&apos;re a community group of 30 or a national NGO running dozens of campaigns,
                RaiseFundz scales with you — admin controls that match your governance needs.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-[13px] text-graphite font-medium">
                  <CheckCircle2 size={15} className="text-off-ink" /> Free to start
                </span>
                <span className="inline-flex items-center gap-1.5 text-[13px] text-graphite font-medium">
                  <CheckCircle2 size={15} className="text-off-ink" /> No setup fees
                </span>
                <span className="inline-flex items-center gap-1.5 text-[13px] text-graphite font-medium">
                  <CheckCircle2 size={15} className="text-off-ink" /> Cancel anytime
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {orgTypes.map((org) => (
              <OrgCard key={org.title} {...org} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
