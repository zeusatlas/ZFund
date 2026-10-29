"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HostCtaLink from "@/components/landing/HostCtaLink";
import { useEffect, useRef, useState } from "react";
import { HERO_RAISED_TODAY, HERO_USSD_CODE } from "@/components/landing/landing-data";

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
              <Link href="/login" className="group inline-flex items-center gap-2 rounded-full bg-off-ink px-7 py-4 text-[15px] font-bold text-parchment shadow-md transition-all hover:bg-charcoal hover:-translate-y-0.5">
                Start for free
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
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
                <Counter prefix="GH₵ " target={HERO_RAISED_TODAY} />
              </p>
            </div>

            {/* Hero photo */}
            <div className="animate-float overflow-hidden rounded-[36px] border border-ash/60 shadow-lg">
              <Image
                src="/images/hero.png"
                alt="A fundraiser celebrating a donation received on her phone"
                width={1145}
                height={1374}
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="h-[420px] w-full object-cover object-top sm:h-[520px] lg:h-[580px]"
              />
            </div>

            {/* USSD code badge */}
            <div
              className="absolute -bottom-4 -right-2 z-10 hidden rounded-2xl bg-off-ink px-4 py-3 text-parchment shadow-md sm:block"
              style={{ animation: "float 7s 1.2s ease-in-out infinite" }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-parchment/60">Give via USSD</p>
              <p className="mt-0.5 font-bold text-white">{HERO_USSD_CODE}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
