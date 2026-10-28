"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HostCtaLink from "@/components/landing/HostCtaLink";
import { useEffect, useRef, useState } from "react";

/* ── Animated stat counter ── */
function Counter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const start = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref} className="tabular-nums">{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ── Activity item in the mockup ── */
function ActivityItem({ name, amount, time }: { name: string; amount: string; time: string }) {
  return (
    <div className="flex items-center justify-between rounded-[14px] bg-white px-4 py-2.5 border border-ash/40">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-off-ink text-[11px] font-bold text-parchment">
          {name[0]}
        </span>
        <div>
          <p className="text-[13px] font-semibold text-off-ink">{name}</p>
          <p className="text-[11px] text-graphite">{time}</p>
        </div>
      </div>
      <span className="rounded-full bg-parchment px-2.5 py-1 text-[12px] font-bold text-off-ink border border-ash/60">{amount}</span>
    </div>
  );
}

/* ── Dashboard Mockup ── */
function DashboardMockup() {
  const activities = [
    { name: "Kwame A.", amount: "GH₵ 50", time: "just now" },
    { name: "Abena M.", amount: "GH₵ 100", time: "2 min ago" },
    { name: "Kofi O.", amount: "GH₵ 25", time: "8 min ago" },
    { name: "Ama S.", amount: "GH₵ 200", time: "15 min ago" },
  ];

  const progress = 57;

  return (
    <div className="w-full space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite">Live campaign</p>
          <p className="mt-1 text-[15px] font-semibold leading-snug text-off-ink">Aburi Community Water Project</p>
        </div>
        <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full bg-stone px-2.5 py-1 text-[10px] font-semibold text-off-ink border border-ash">
          <span className="h-1.5 w-1.5 rounded-full bg-off-ink" />
          Active
        </span>
      </div>

      <div>
        <p className="text-[34px] font-bold leading-none tracking-[-1.5px] text-off-ink">GH₵ 28,475</p>
        <p className="mt-1 text-[12px] text-graphite">raised of GH₵ 50,000 goal</p>
      </div>

      <div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-ash">
          <div
            className="h-full rounded-full bg-off-ink"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1.5 text-right text-[11px] font-medium text-graphite">{progress}% funded</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Donors", value: "847" },
          { label: "Avg gift", value: "GH₵ 34" },
          { label: "Days left", value: "12" },
        ].map((s) => (
          <div key={s.label} className="rounded-[14px] bg-white px-3 py-3 text-center border border-ash/40">
            <p className="text-[16px] font-bold text-off-ink">{s.value}</p>
            <p className="text-[10px] text-graphite">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite mb-2.5">Recent via USSD</p>
        <div className="space-y-2">
          {activities.map((a) => <ActivityItem key={a.name} {...a} />)}
        </div>
      </div>
    </div>
  );
}

/* ── Hero: Section 1 (Light Beige) ── */
export default function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-parchment text-off-ink">
      {/* Subtle neutral background glow */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-white/40 blur-[100px]" />

      <div className="relative mx-auto max-w-[1240px] px-5 py-16 sm:px-6 md:py-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left: Copy */}
          <div className="animate-slide-up">
            <h1 className="mb-6 text-[clamp(48px,6vw,80px)] font-bold leading-[0.93] tracking-[-3.5px] text-off-ink">
              Raise funds.
              <br />
              <span className="text-off-ink">Any phone.</span>
              <br />
              <span className="text-graphite font-medium">Any network.</span>
            </h1>

            <p className="mb-10 max-w-[440px] text-[18px] leading-[1.6] text-graphite">
              RaiseFundz lets your community donate via USSD shortcode — no app, no internet needed.
              Launch a campaign, share a code, collect in real time.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <HostCtaLink className="group inline-flex items-center gap-2 rounded-full bg-off-ink px-7 py-4 text-[15px] font-bold text-parchment shadow-md transition-all hover:bg-charcoal hover:-translate-y-0.5">
                Start for free
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </HostCtaLink>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-ash bg-white px-7 py-4 text-[15px] font-semibold text-graphite transition-all hover:border-off-ink/40 hover:text-off-ink"
              >
                See how it works
              </Link>
            </div>

            <p className="mt-8 text-[13px] text-smoke">
              Free to start · No credit card needed · Withdraw anytime
            </p>
          </div>

          {/* Right: Mockup */}
          <div className="animate-slide-up-delay-2 relative">
            {/* Floating "raised today" badge */}
            <div className="absolute -left-4 top-8 z-10 hidden rounded-2xl border border-ash bg-white px-4 py-3 shadow-md sm:block"
              style={{ animation: "float 6s 0.5s ease-in-out infinite" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite">Raised today</p>
              <p className="mt-0.5 text-lg font-bold text-off-ink">
                <Counter prefix="GH₵ " target={156420} />
              </p>
            </div>

            {/* Main mockup */}
            <div className="animate-float rounded-[36px] border border-ash/60 bg-white/70 p-3 shadow-lg sm:p-4">
              <div className="rounded-[28px] bg-parchment p-5 border border-ash/40 sm:p-6">
                <DashboardMockup />
              </div>
            </div>

            {/* USSD code badge */}
            <div
              className="absolute -bottom-4 -right-2 z-10 hidden rounded-2xl bg-off-ink px-4 py-3 text-parchment shadow-md sm:block"
              style={{ animation: "float 7s 1.2s ease-in-out infinite" }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-parchment/60">Give via USSD</p>
              <p className="mt-0.5 font-bold text-white">*920*969#</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
