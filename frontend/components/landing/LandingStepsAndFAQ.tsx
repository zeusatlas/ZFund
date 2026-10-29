import Image from "next/image";
import { Plus } from "lucide-react";
import {
  FAQ_ITEMS,
} from "@/components/landing/landing-data";

/* ── Section Label ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ash bg-parchment px-3.5 py-1.5 shadow-2xs">
      <span className="h-1.5 w-1.5 rounded-full bg-off-ink" />
      <span className="text-eyebrow text-graphite">{children}</span>
    </div>
  );
}

/* ── FAQ item ── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border-b border-ash/70 py-6">
      <summary className="flex cursor-pointer items-center justify-between gap-6 text-[20px] sm:text-[22px] font-semibold text-off-ink list-none">
        <span>{question}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ash bg-parchment text-off-ink transition-transform duration-200 group-open:rotate-45">
          <Plus size={16} aria-hidden="true" />
        </span>
      </summary>
      <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-graphite">{answer}</p>
    </details>
  );
}


/* ── Section 6: FAQ (White) ── */
export default function LandingStepsAndFAQ() {
  return (
    <section className="bg-parchment py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-16">
          <div>
            <div className="mb-14">
              <SectionLabel>Frequently asked questions</SectionLabel>
              <h2 className="mt-2 text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-[-1.5px] text-off-ink">
                A few things
                <br />
                before you begin.
              </h2>
              <p className="mt-3 text-[15px] text-graphite">Get to know the platform and how fundraising works.</p>
            </div>

            <div className="border-t border-ash/70">
              {FAQ_ITEMS.map(({ question, answer }) => (
                <FAQItem key={question} question={question} answer={answer} />
              ))}
            </div>
          </div>

          <div className="relative hidden overflow-hidden rounded-[36px] lg:sticky lg:top-28 lg:block">
            <Image
              src="/images/hero.png"
              alt="A fundraiser celebrating a donation received on her phone"
              width={1145}
              height={1374}
              sizes="400px"
              className="h-[560px] w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/10 to-transparent" />
            <p className="absolute inset-x-0 bottom-0 p-8 text-[16px] font-semibold leading-relaxed text-white">
              Still curious? Every cedi raised is tracked, from the first USSD dial to payout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
