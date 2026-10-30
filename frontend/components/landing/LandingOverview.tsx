import {
  TICKER_ITEMS, JOURNEY_STEPS, HOST_FEATURES, ORG_TYPES,
} from "@/components/landing/landing-data";

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

  return (
    <div className="overflow-hidden bg-off-ink py-6">
      <div className="flex min-w-max animate-marquee items-center gap-14 px-6 text-[14px] font-semibold uppercase tracking-[0.12em] text-parchment/80">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-5">
            <span className="h-2.5 w-2.5 rounded-full bg-lime" />
            {item}
          </span>
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
    <div className={`card-hover group rounded-[18px] p-3.5 transition-all ${
      highlight
        ? "bg-lime text-off-ink shadow-md"
        : "border border-ash/70 bg-white"
    }`}>
      <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-[12px] transition-colors ${
        highlight
          ? "bg-off-ink/10 group-hover:bg-off-ink/20"
          : "bg-parchment group-hover:bg-ash/50 border border-ash/40"
      }`}>
        <Icon size={16} className={highlight ? "text-off-ink" : "text-off-ink"} />
      </div>
      <h3 className={`mb-1.5 text-[14px] font-bold tracking-[-0.2px] ${highlight ? "text-off-ink" : "text-off-ink"}`}>
        {title}
      </h3>
      <p className={`text-[13px] leading-snug ${highlight ? "text-off-ink/75" : "text-graphite"}`}>
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
    <div className="card-hover group rounded-[24px] bg-white border border-ash/70 p-5 transition-all hover:border-off-ink/30 shadow-2xs">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[16px] bg-off-ink transition-colors group-hover:bg-charcoal">
        <Icon size={19} className="text-parchment" />
      </div>
      <h3 className="mb-2 text-[15px] font-bold text-off-ink">{title}</h3>
      <p className="text-[14px] leading-relaxed text-graphite">{description}</p>
    </div>
  );
}


/* ── Main component ── */
export default function LandingOverview() {


  return (
    <>
      {/* Section 2: Social proof ticker & Stats (Light) */}
      <SocialProofTicker />

      {/* Section 3: How it works / From an idea to a funded project (Light) */}
      <section id="how-it-works" className="scroll-mt-20 bg-parchment py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-16">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="mt-2 text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-[-1.5px] text-off-ink">
              From an idea to a funded project
            </h2>
            <p className="mt-3 text-[16px] text-graphite max-w-xl leading-relaxed">
              Four clear steps, from getting your account to receiving your funds.
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

      {/* Section 4: For organisers (Light) */}
      <section id="for-organisers" className="scroll-mt-20 bg-navy py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-4">
            <SectionLabel>For organisers</SectionLabel>
          </div>
          <div className="mb-16">
            <h2 className="text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-[-1.5px] text-white">
              Everything you need<br />
              <span className="text-white/60 font-medium">to run a successful fundraiser.</span>
            </h2>
           
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HOST_FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: For organisations (Light) */}
      <section id="for-organizations" className="scroll-mt-20 bg-white py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-4">
            <SectionLabel>For organisations</SectionLabel>
          </div>
          <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
            <h2 className="text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-[-1.5px] text-off-ink">
              Built for
            </h2>
          
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ORG_TYPES.map((org) => (
              <OrgCard key={org.title} {...org} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
