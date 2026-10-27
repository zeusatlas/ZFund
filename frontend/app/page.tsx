import Link from "next/link";
import {
  ArrowRight,
  Smartphone,
  WalletCards,
  BarChart3,
  ShieldCheck,
  Users,
  ClipboardList,
  BadgeCheck,
  Lock,
  RefreshCw,
  Globe,
  Building2,
  HeartHandshake,
  GraduationCap,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

// ─── Campaign Dashboard Mockup ────────────────────────────────────────────────
function DashboardMockup() {
  const recentDonors = [
    { name: "024 *** 0345", amount: "GH₵ 50", time: "2 min ago" },
    { name: "020 *** 0891", amount: "GH₵ 100", time: "11 min ago" },
    { name: "027 *** 0202", amount: "GH₵ 25", time: "28 min ago" },
  ];

  const raised = 28475;
  const goal = 50000;
  const progress = Math.round((raised / goal) * 100);

  return (
    <div className="rounded-[28px] bg-parchment p-7">
      {/* Campaign header */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-eyebrow text-graphite">Example campaign</p>
          <p className="mt-1.5 text-[17px] font-medium leading-snug text-off-ink">
            Aburi Community Water Project
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-lime px-3 py-1 text-[11px] font-medium text-off-ink">
          Preview
        </span>
      </div>

      {/* Amount raised */}
      <p className="text-[36px] font-medium leading-none tracking-[-1.5px] text-off-ink">
        GH₵ 28,475
      </p>
      <p className="mt-1 mb-4 text-[13px] text-graphite">
        raised of GH₵ 50,000 goal
      </p>

      {/* Progress bar */}
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-ash">
        <div
          className="h-full rounded-full bg-lime transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-3 gap-2">
        {[
          { label: "Donors", value: "847" },
          { label: "Avg gift", value: "GH₵ 33.62" },
          { label: "Days left", value: "12" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[18px] bg-white px-3 py-3 text-center"
          >
            <p className="text-[16px] font-medium text-off-ink">{s.value}</p>
            <p className="text-[11px] text-graphite">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent contributions */}
      <p className="text-eyebrow mb-3 text-graphite">Recent via USSD</p>
      <div className="space-y-2">
        {recentDonors.map((d) => (
          <div
            key={d.name}
            className="flex items-center justify-between rounded-[14px] bg-white px-4 py-2.5"
          >
            <div>
              <p className="text-[13px] font-medium text-off-ink">{d.name}</p>
              <p className="text-[11px] text-graphite">{d.time}</p>
            </div>
            <span className="text-[13px] font-medium text-off-ink">
              {d.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-[28px] bg-white p-8 transition-transform duration-200 hover:-translate-y-1">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[18px] bg-parchment transition-colors group-hover:bg-lime/20">
        <Icon size={20} className="text-off-ink" />
      </div>
      <h3 className="mb-3 text-[18px] font-medium tracking-[-0.3px] text-off-ink">
        {title}
      </h3>
      <p className="text-[15px] leading-relaxed text-graphite">{description}</p>
    </div>
  );
}

// ─── Org Card ─────────────────────────────────────────────────────────────────
function OrgCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] bg-parchment p-8">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[14px] bg-off-ink">
        <Icon size={18} className="text-lime" />
      </div>
      <h3 className="mb-2 text-[17px] font-medium text-off-ink">{title}</h3>
      <p className="text-[14px] leading-relaxed text-graphite">{description}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const hostFeatures = [
    {
      icon: Smartphone,
      title: "USSD-powered collection",
      description:
        "Donors give via a simple USSD shortcode from any mobile phone — no app, no internet, no bank card required. Contributions land in your dashboard instantly.",
    },
    {
      icon: BarChart3,
      title: "Live campaign analytics",
      description:
        "Watch contributions roll in with real-time totals, donor counts, and average gift sizes. Know exactly how your campaign is performing at any moment.",
    },
    {
      icon: WalletCards,
      title: "On-demand withdrawals",
      description:
        "Request a withdrawal whenever you're ready. Choose your payout method — mobile money or bank — and track the status through to completion.",
    },
    {
      icon: ClipboardList,
      title: "Full transaction history",
      description:
        "Every donation is logged with the donor's masked number, amount, and timestamp. Download or export your complete contribution record at any time.",
    },
    {
      icon: Users,
      title: "Multi-campaign management",
      description:
        "Run multiple fundraisers simultaneously. Set goals, durations, and descriptions for each — and see all of them from one unified host dashboard.",
    },
    {
      icon: BadgeCheck,
      title: "Campaign verification",
      description:
        "Your campaigns carry a verified badge that builds donor trust. Admins review and approve campaigns before they go live to the USSD network.",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: ClipboardList,
      title: "Create your campaign",
      description:
        "Sign up as a host and set up your fundraiser in minutes. Add a name, goal, description, and duration. Submit for admin review — it's usually approved within hours.",
    },
    {
      number: "02",
      icon: Smartphone,
      title: "Share the USSD code",
      description:
        "Once live, your campaign gets a unique USSD shortcode. Share it anywhere — WhatsApp, posters, church bulletins. Anyone with a phone can donate instantly.",
    },
    {
      number: "03",
      icon: WalletCards,
      title: "Track and withdraw",
      description:
        "Every donation appears in your dashboard in real time. When you're ready, request a withdrawal and receive the funds to your mobile money or bank account.",
    },
  ];

  const orgTypes = [
    {
      icon: HeartHandshake,
      title: "Community Groups",
      description:
        "Hometown associations, neighbourhood funds, and welfare groups can bring their communities together around a shared fundraising goal.",
    },
    {
      icon: Building2,
      title: "NGOs & Nonprofits",
      description:
        "Run multiple concurrent campaigns with admin oversight, donor reporting, and exportable records for grant compliance and accountability.",
    },
    {
      icon: GraduationCap,
      title: "Schools & Institutions",
      description:
        "Fee drives, bursary funds, and alumni giving campaigns — all managed by admin staff with role-based access and withdrawal approval flows.",
    },
    {
      icon: Globe,
      title: "Faith Organisations",
      description:
        "Tithes, building funds, and mission drives collected via USSD from your congregation — anywhere, any time, any network.",
    },
  ];

  const securityPoints = [
    {
      icon: Lock,
      title: "Role-based access control",
      description:
        "Hosts see only their own campaigns. Admins have platform-wide visibility with separate approval workflows. No role can exceed its defined permissions.",
    },
    {
      icon: ShieldCheck,
      title: "Withdrawal verification",
      description:
        "All withdrawals go through an admin review step before funds are released. No money moves without an explicit approval in the admin console.",
    },
    {
      icon: RefreshCw,
      title: "Full audit trail",
      description:
        "Every transaction, withdrawal request, and admin action is logged with a timestamp. Your records are complete, tamper-evident, and always accessible.",
    },
  ];

  const campaignExamples = [
    {
      description:
        "A hometown association brings members together to fund a borehole, with a clear budget and regular progress updates.",
      name: "Clean water for the community",
      role: "Aburi · Eastern Region",
    },
    {
      description:
        "A market women’s welfare group organises an appeal to support a member’s medical expenses and keep contributors informed.",
      name: "Support when it matters",
      role: "Kumasi · Ashanti Region",
    },
    {
      description:
        "An old students’ association rallies alumni around books, furniture, and a better reading space for current students.",
      name: "A library for the next generation",
      role: "Cape Coast · Central Region",
    },
  ];

  return (
    <div className="bg-white text-off-ink">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="overflow-hidden bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:py-32">
          <div className="grid items-center gap-16 md:grid-cols-[1fr_1.05fr]">
            {/* Left: copy */}
            <div>
              <div className="mb-8 inline-flex items-center rounded-full bg-lime px-4 py-1.5">
                <span className="text-eyebrow text-off-ink">
                  Fundraising for Ghana
                </span>
              </div>

              <h1 className="mb-6 text-[clamp(44px,5.2vw,68px)] font-medium leading-[0.94] tracking-[-2.5px] text-off-ink">
                Donors give by phone.
                <br />
                <span className="text-graphite">
                  You manage everything here.
                </span>
              </h1>

              <p className="mb-10 max-w-[420px] text-[17px] leading-[1.55] text-graphite">
                ZFund brings Ghana’s communities together through USSD fundraising.
                Launch a campaign, share a shortcode, and watch contributions
                arrive in real time — then withdraw whenever you&apos;re ready.
              </p>

              <div className="flex flex-wrap items-center gap-5">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-[28px] bg-lime px-6 py-3.5 text-[15px] font-medium text-off-ink transition-opacity hover:opacity-85"
                >
                  Host a campaign
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/how-it-works"
                  className="border-b border-off-ink pb-0.5 text-[15px] font-medium text-off-ink transition-colors hover:border-graphite hover:text-graphite"
                >
                  See how it works
                </Link>
              </div>
            </div>

            {/* Right: campaign dashboard mockup */}
            <div className="hidden animate-float md:block">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────────── */}
      <section className="border-y border-ash">
        <div className="mx-auto max-w-[1200px] px-6 py-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:divide-x sm:divide-ash">
            {[
              { value: "GH₵", label: "Fundraising in Ghana cedis" },
              { value: "USSD", label: "Giving designed for a basic phone" },
              { value: "Community", label: "Built around the causes you care about" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="sm:px-10 sm:first:pl-0 sm:last:pr-0"
              >
                <p className="text-[42px] font-medium leading-none tracking-[-2px] text-off-ink">
                  {stat.value}
                </p>
                <p className="mt-2 text-[14px] text-graphite">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-parchment py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-16 max-w-xl">
            <p className="text-eyebrow mb-4 text-graphite">How it works</p>
            <h2 className="text-[clamp(36px,4vw,52px)] font-medium leading-[1.05] tracking-[-1.5px] text-off-ink">
              From campaign to
              <br />
              payout in three steps.
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.number}>
                <div className="mb-7 flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lime text-[13px] font-medium text-off-ink">
                    {step.number}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="hidden h-px flex-1 bg-ash md:block" />
                  )}
                </div>
                <h3 className="mb-3 text-[20px] font-medium tracking-[-0.3px] text-off-ink">
                  {step.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-graphite">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Host Features ───────────────────────────────────────────────────── */}
      <section id="for-hosts" className="bg-white py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-16 max-w-2xl">
            <p className="text-eyebrow mb-4 text-graphite">For hosts</p>
            <h2 className="text-[clamp(36px,4vw,52px)] font-medium leading-[1.05] tracking-[-1.5px] text-off-ink">
              Everything you need to run
              <br />a successful fundraiser.
            </h2>
          </div>

          {/* 3×2 grid — white cards on white bg, use parchment cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hostFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-[15px] font-medium text-off-ink transition-opacity hover:opacity-85"
            >
              Open host dashboard
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── For Organizations ───────────────────────────────────────────────── */}
      <section id="for-organizations" className="bg-parchment py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
            <div>
              <p className="text-eyebrow mb-4 text-graphite">
                For organisations
              </p>
              <h2 className="text-[clamp(36px,4vw,52px)] font-medium leading-[1.05] tracking-[-1.5px] text-off-ink">
                Built for groups
                <br />
                of every size.
              </h2>
            </div>
            <p className="text-[16px] leading-relaxed text-graphite md:max-w-sm md:pb-2">
              Whether you&apos;re a community group of 30 or a national NGO
              running dozens of campaigns, ZFund scales to how you work — with
              admin controls that match your governance needs.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {orgTypes.map((o) => (
              <OrgCard key={o.title} {...o} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Security ────────────────────────────────────────────────────────── */}
      <section id="security" className="bg-white py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-16 max-w-xl">
            <p className="text-eyebrow mb-4 text-graphite">Security</p>
            <h2 className="text-[clamp(36px,4vw,52px)] font-medium leading-[1.05] tracking-[-1.5px] text-off-ink">
              Your donors&apos; trust
              <br />
              is non-negotiable.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {securityPoints.map((s) => (
              <div
                key={s.title}
                className="rounded-[28px] bg-charcoal p-8 text-white"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-[14px] bg-lime/15">
                  <s.icon size={18} className="text-lime" />
                </div>
                <h3 className="mb-3 text-[18px] font-medium text-white">
                  {s.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-white/65">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section className="bg-parchment py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-16 max-w-xl">
            <p className="text-eyebrow mb-4 text-graphite">Illustrative campaigns</p>
            <h2 className="text-[clamp(36px,4vw,48px)] font-medium leading-[1.05] tracking-[-1.5px] text-off-ink">
              Local causes.
              <br />
              Shared purpose.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {campaignExamples.map((t) => (
              <div key={t.name} className="rounded-[28px] bg-white p-8">
                <p className="mb-8 text-[16px] leading-[1.65] text-graphite">
                  {t.description}
                </p>
                <div className="border-t border-ash pt-5">
                  <p className="text-[14px] font-medium text-off-ink">
                    {t.name}
                  </p>
                  <p className="text-[13px] text-graphite">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lime CTA Band ───────────────────────────────────────────────────── */}
      <section className="bg-lime py-24">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <h2 className="mb-6 text-[clamp(44px,5vw,72px)] font-medium leading-[0.93] tracking-[-2.5px] text-off-ink">
            Launch your fundraiser.
            <br />
            Start collecting today.
          </h2>
          <p className="mx-auto mb-12 max-w-[400px] text-[17px] leading-relaxed text-off-ink/65">
            Create your host account, set up your campaign, and share a USSD
            shortcode your community can use from any mobile phone.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-[28px] bg-off-ink px-8 py-4 text-[15px] font-medium text-white transition-opacity hover:opacity-85"
            >
              Host a campaign
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/dashboard"
              className="border-b border-off-ink pb-0.5 text-[15px] font-medium text-off-ink"
            >
              Sign in to dashboard
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
