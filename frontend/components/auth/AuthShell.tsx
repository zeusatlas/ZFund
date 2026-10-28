import Link from "next/link";
import { ShieldCheck, Smartphone, TrendingUp } from "lucide-react";

const highlights = [
  { icon: Smartphone, text: "Donors give by USSD from any phone" },
  { icon: TrendingUp, text: "Watch contributions arrive in real time" },
  { icon: ShieldCheck, text: "Every withdrawal reviewed before release" },
];

/** Full-screen split layout: brand panel on the left, form on the right. */
export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-off-ink text-white lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-lime/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-40 -left-24 h-[460px] w-[460px] rounded-full bg-charcoal blur-2xl"
        />

        <Link href="/" className="relative text-[22px] font-medium tracking-tight">
          ZFund
        </Link>

        <div className="relative max-w-md">
          <p className="text-eyebrow mb-5 text-lime">Fundraising for Ghana</p>
          <h2 className="text-[44px] font-medium leading-[1.02] tracking-[-1.5px]">
            Bring your community together around one goal.
          </h2>
          <ul className="mt-10 space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[15px] text-white/75">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Icon size={17} className="text-lime" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative w-full max-w-md rounded-3xl bg-white/[0.07] p-6 backdrop-blur">
          <p className="text-eyebrow text-white/50">Example campaign</p>
          <p className="mt-1.5 text-[16px] font-medium">Aburi Community Water Project</p>
          <p className="mt-4 text-[30px] font-medium leading-none tracking-[-1px]">GH₵ 28,475</p>
          <p className="mt-1 text-[12px] text-white/50">raised of GH₵ 50,000 goal</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-[57%] rounded-full bg-lime" />
          </div>
        </div>
      </aside>

      <section className="flex items-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
        <div className="w-full max-w-[420px] text-left">
          <Link href="/" className="mb-10 block text-[20px] font-medium tracking-tight text-off-ink lg:hidden">
            ZFund
          </Link>
          {children}
        </div>
      </section>
    </main>
  );
}
