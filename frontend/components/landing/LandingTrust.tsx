import { ArrowRight, Lock, RefreshCw, ShieldCheck, Quote, Star } from "lucide-react";
import HostCtaLink from "@/components/landing/HostCtaLink";

/* ── Section Label reused ── */
function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 ${
      dark ? "border-white/10 bg-white/5" : "border-ash bg-white"
    }`}>
      <span className="h-1.5 w-1.5 rounded-full bg-lime" />
      <span className={`text-eyebrow ${dark ? "text-parchment/60" : "text-graphite"}`}>{children}</span>
    </div>
  );
}

/* ── Testimonial card ── */
function TestimonialCard({
  quote, name, role, initials,
}: {
  quote: string; name: string; role: string; initials: string;
}) {
  return (
    <div className="card-hover flex flex-col rounded-[28px] border border-ash/70 bg-white p-8">
      <div className="mb-4 flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill="currentColor" className="text-lime" />
        ))}
      </div>
      <Quote size={20} className="mb-4 text-lime opacity-50" />
      <p className="mb-8 flex-1 text-[15px] leading-[1.7] text-graphite">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3 border-t border-ash pt-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime text-[14px] font-bold text-off-ink">
          {initials}
        </span>
        <div>
          <p className="text-[14px] font-bold text-off-ink">{name}</p>
          <p className="text-[12px] text-graphite">{role}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Campaign example card ── */
function CampaignCard({
  description, name, role, raised, goal,
}: {
  description: string; name: string; role: string; raised: string; goal: string;
}) {
  return (
    <div className="card-hover rounded-[28px] bg-white p-8">
      <p className="mb-6 text-[15px] leading-[1.7] text-graphite">{description}</p>
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-ash">
        <div className="h-full w-3/5 rounded-full bg-lime" />
      </div>
      <div className="flex items-end justify-between border-t border-ash pt-5">
        <div>
          <p className="text-[14px] font-bold text-off-ink">{name}</p>
          <p className="text-[12px] text-graphite">{role}</p>
        </div>
        <div className="text-right">
          <p className="text-[14px] font-bold text-off-ink">{raised}</p>
          <p className="text-[11px] text-graphite">of {goal} goal</p>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function LandingTrust() {
  const securityPoints = [
    {
      icon: Lock,
      title: "Role-based access control",
      description: "Hosts see only their own campaigns. Admins have platform-wide visibility with separate approval workflows. No role can exceed its defined permissions.",
    },
    {
      icon: ShieldCheck,
      title: "Withdrawal verification",
      description: "All withdrawals go through an admin review step before funds are released. No money moves without an explicit approval in the admin console.",
    },
    {
      icon: RefreshCw,
      title: "Full audit trail",
      description: "Every transaction, withdrawal request, and admin action is logged with a timestamp. Your records are complete, tamper-evident, and always accessible.",
    },
  ];

  const testimonials = [
    {
      quote: "We raised over GH₵ 14,000 for a community borehole in just three weeks. Our members in the diaspora could even contribute — they just sent the shortcode and donated from wherever they were.",
      name: "Maame Esi Asante",
      role: "Secretary, Aburi Hometown Association",
      initials: "MA",
    },
    {
      quote: "RaiseFundz made our school fees drive transparent for the first time. Parents could see the progress in real time, and we completed the campaign 20 days ahead of schedule.",
      name: "Emmanuel Boateng",
      role: "Headmaster, Cape Coast Community School",
      initials: "EB",
    },
    {
      quote: "As an NGO we needed proper audit trails for our donors. RaiseFundz's exportable records and withdrawal approval flow made our compliance reporting straightforward.",
      name: "Akosua Mensah",
      role: "Director, Kumasi Women's Welfare Trust",
      initials: "AM",
    },
  ];

  const campaigns = [
    {
      description: "A hometown association brings members together to fund a borehole, with a clear budget and regular progress updates shared across WhatsApp groups.",
      name: "Clean water for the community",
      role: "Aburi · Eastern Region",
      raised: "GH₵ 28,475",
      goal: "GH₵ 50,000",
    },
    {
      description: "A market women's welfare group organises an appeal to support a member's medical expenses, keeping all contributors informed with every update.",
      name: "Support when it matters",
      role: "Kumasi · Ashanti Region",
      raised: "GH₵ 14,200",
      goal: "GH₵ 20,000",
    },
    {
      description: "An old students' association rallies alumni around books, furniture, and a better reading space for current students — all via USSD.",
      name: "A library for the next generation",
      role: "Cape Coast · Central Region",
      raised: "GH₵ 9,850",
      goal: "GH₵ 15,000",
    },
  ];

  return (
    <>
      {/* Security */}
      <section id="security" className="scroll-mt-20 bg-off-ink py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel dark>Security</SectionLabel>
              <h2 className="mt-2 text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-[-1.5px] text-white">
                Your donors&apos; trust
                <br />
                <span className="text-parchment/50 font-medium">is non-negotiable.</span>
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-parchment/50 md:pb-2">
              RaiseFundz is built from the ground up with controls that protect every cedi raised and every person involved.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {securityPoints.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card-hover rounded-[28px] bg-white/5 p-8 ring-1 ring-white/8 hover:bg-white/8">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[18px] bg-lime/10">
                  <Icon size={20} className="text-lime" />
                </div>
                <h3 className="mb-3 text-[18px] font-bold text-white">{title}</h3>
                <p className="text-[14px] leading-relaxed text-parchment/55">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-parchment py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-16 text-center">
            <SectionLabel>What people say</SectionLabel>
            <h2 className="mt-2 text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-[-1.5px] text-off-ink">
              Communities that chose RaiseFundz
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* Campaigns */}
      <section className="bg-stone py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-16">
            <SectionLabel>Illustrative campaigns</SectionLabel>
            <h2 className="mt-2 text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-[-1.5px] text-off-ink">
              Local causes.
              <br />
              <span className="text-graphite font-medium">Shared purpose.</span>
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {campaigns.map((c) => (
              <CampaignCard key={c.name} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* Grand CTA */}
      <section className="relative overflow-hidden bg-lime py-28">
        {/* decorative radial glow */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-white/15 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-24 left-0 h-[350px] w-[350px] rounded-full bg-off-ink/10 blur-[60px]" />

        <div className="relative mx-auto max-w-[1200px] px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-off-ink/10 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-off-ink/60" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-off-ink/70">Free to start — no credit card needed</span>
          </div>
          <h2 className="mb-6 text-[clamp(42px,5vw,72px)] font-bold leading-[0.93] tracking-[-2.5px] text-off-ink">
            Launch your fundraiser.
            <br />
            Start collecting today.
          </h2>
          <p className="mx-auto mb-12 max-w-[420px] text-[17px] leading-relaxed text-off-ink/65">
            Create your host account, set up your campaign, and share a USSD shortcode your community
            can use from any mobile phone — all in under 10 minutes.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <HostCtaLink className="group inline-flex items-center gap-2 rounded-full bg-off-ink px-8 py-4.5 text-[16px] font-bold text-parchment shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
              Host a campaign
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </HostCtaLink>
            <HostCtaLink className="inline-flex items-center gap-2 rounded-full border-2 border-off-ink/30 bg-transparent px-8 py-4 text-[16px] font-semibold text-off-ink transition-all hover:border-off-ink/60 hover:bg-off-ink/5">
              Sign in to dashboard
            </HostCtaLink>
          </div>
        </div>
      </section>
    </>
  );
}
