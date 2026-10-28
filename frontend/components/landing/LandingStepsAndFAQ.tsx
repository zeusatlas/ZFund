import { Plus } from "lucide-react";

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

const FAQ_ITEMS = [
  {
    question: "Who is RaiseFundz for?",
    answer:
      "Community organisers, alumni groups, congregations, and nonprofits in Ghana who want to bring people together around a clear fundraising goal.",
  },
  {
    question: "Can I collect donations right now?",
    answer:
      "This site previews the fundraising experience. Live USSD collections and payouts are active for registered hosts following admin review.",
  },
  {
    question: "Will supporters need a smartphone?",
    answer:
      "The giving journey uses USSD, so supporters can contribute from a basic mobile phone on any network in Ghana without an internet connection.",
  },
  {
    question: "What should I prepare for a campaign?",
    answer:
      "A clear purpose, a target in Ghana cedis, a budget, a closing date, and organiser contact information. The host dashboard walks you through each step.",
  },
];

/* ── Section 6: FAQ (White) ── */
export default function LandingStepsAndFAQ() {
  return (
    <section className="bg-white py-24 border-t border-ash/60">
      <div className="mx-auto max-w-[1200px] px-6">
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
    </section>
  );
}
