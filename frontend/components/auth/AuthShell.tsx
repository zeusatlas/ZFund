"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ShieldCheck, Smartphone, TrendingUp } from "lucide-react";
import "./auth.css";

const highlights = [
  { icon: Smartphone, text: "Donors give by USSD from any phone" },
  { icon: TrendingUp, text: "Watch contributions arrive in real time" },
  { icon: ShieldCheck, text: "Every withdrawal reviewed before release" },
];

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_1fr]">
      {/* Left Column: Centered vertically and horizontally */}
      <aside className="relative hidden overflow-hidden bg-off-ink text-white lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12 xl:p-16">
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-lime/20 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-40 -left-24 h-[460px] w-[460px] rounded-full bg-charcoal blur-2xl pointer-events-none"
        />

        <Link
          href="/"
          className="absolute top-8 left-8 lg:top-12 lg:left-14 text-[22px] font-medium tracking-tight text-white hover:text-lime transition-colors z-20"
        >
          RaiseFundz
        </Link>

        <div className="relative z-10 w-full max-w-md mx-auto my-auto flex flex-col justify-center space-y-10">
          <div>
            <p className="text-eyebrow mb-4 text-lime font-medium tracking-wider uppercase text-xs">
              Fundraising for Ghana
            </p>
            <h2 className="text-[38px] xl:text-[44px] font-medium leading-[1.05] tracking-[-1.5px] text-white">
              Bring your community together around one goal.
            </h2>
            <ul className="mt-8 space-y-3.5">
              {highlights.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-[15px] text-white/80">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Icon size={17} className="text-lime" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full rounded-3xl bg-white/[0.07] p-6 backdrop-blur border border-white/10 shadow-lg">
            <p className="text-eyebrow text-white/50 text-xs uppercase tracking-wider">Example campaign</p>
            <p className="mt-1.5 text-[16px] font-medium text-white">Aburi Community Water Project</p>
            <p className="mt-4 text-[30px] font-medium leading-none tracking-[-1px] text-white">GH₵ 28,475</p>
            <p className="mt-1 text-[12px] text-white/60">raised of GH₵ 50,000 goal</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-[57%] rounded-full bg-lime" />
            </div>
          </div>
        </div>
      </aside>

      {/* Right Column: Centered vertically and horizontally */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 py-12 sm:px-10 lg:px-14 xl:px-20 bg-stone-light/30">
        <div className="auth-content w-full max-w-[420px] mx-auto">
          <Link
            href="/"
            className="mb-8 block text-[22px] font-medium tracking-tight text-off-ink lg:hidden text-center"
          >
            RaiseFundz
          </Link>
          {children}
        </div>
      </section>
    </main>
  );
}
