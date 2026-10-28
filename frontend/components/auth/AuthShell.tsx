import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Smartphone, TrendingUp } from "lucide-react";

const highlights = [
  { icon: Smartphone, text: "Donors give by USSD from any phone" },
  { icon: TrendingUp, text: "Watch contributions arrive in real time" },
  { icon: ShieldCheck, text: "Every withdrawal reviewed before release" },
];

/** Full-screen split layout: brand panel on the left, form on the right. */
export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-stone-light lg:grid lg:grid-cols-[0.92fr_1.08fr]">
      <aside className="relative hidden overflow-hidden bg-navy text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-gold/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-40 -left-24 h-[460px] w-[460px] rounded-full bg-midnight blur-2xl"
        />

        <Link
          href="/home"
          className="relative inline-flex w-fit items-center gap-3 text-[20px] font-semibold tracking-tight"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-sm text-navy">
            R
          </span>
          RaiseFundz
        </Link>

        <div className="relative max-w-md">
          <p className="text-eyebrow mb-5 text-gold">Fundraising for Ghana</p>
          <h2 className="text-[clamp(40px,4vw,60px)] font-medium leading-[0.98] tracking-[-2px]">
            One trusted place for every contribution.
          </h2>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/60">
            Sign in to manage campaigns, follow contributions as they arrive, and keep
            every cedi accounted for.
          </p>
          <ul className="mt-10 space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[15px] text-white/75">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon size={17} className="text-gold" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative flex items-center gap-2 text-xs text-white/40">
          <ShieldCheck size={14} className="text-gold" />
          Secured with one-time codes — no passwords to remember.
        </p>
      </aside>

      <section className="flex items-center px-5 py-8 sm:px-10 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-[480px]">
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/home"
              className="inline-flex items-center gap-2 text-[18px] font-semibold tracking-tight text-navy lg:hidden"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-xs text-navy">
                R
              </span>
              RaiseFundz
            </Link>
            <Link
              href="/home"
              className="ml-auto inline-flex items-center gap-1.5 text-sm text-steel transition-colors hover:text-navy"
            >
              Back to home <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="rounded-[32px] border border-navy/10 bg-white p-6 shadow-sm sm:p-9">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
