import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

/* ── FAQ item — uses .faq CSS from marketing.css ── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details>
      <summary>
        {question}
        <Plus size={20} aria-hidden="true" />
      </summary>
      <p>{answer}</p>
    </details>
  );
}


/* ── Step card — uses .step CSS from marketing.css ── */
function StepItem({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <article className="step">
      <span className="step-number">{number}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

const STEPS = [
  {
    title: "Give your goal a home.",
    body: "Tell your story, set a target in Ghana cedis, and prepare your campaign for review.",
  },
  {
    title: "Bring your people together.",
    body: "Share your purpose with your association, congregation, or community. Give everyone a clear reason to help.",
  },
  {
    title: "Keep the progress open.",
    body: "Follow contributions, plan a withdrawal request, and keep supporters informed along the way.",
  },
  {
    title: "Celebrate what you raised.",
    body: "Once your goal is met, request a payout and share the outcome with every contributor who made it possible.",
  },
];

const JOURNEY_STEPS = [
  {
    title: "Give your community a clear goal",
    body: "Start with the purpose, a target in Ghana cedis (GH₵), and a closing date. Explain who will benefit and how the money will be used.",
    example: "Example: GH₵ 50,000 for a community borehole in the Eastern Region.",
  },
  {
    title: "Prepare your campaign for review",
    body: "Provide the organiser's details and a clear campaign description. The planned review process gives an administrator a chance to check a campaign before it opens for contributions.",
    example: "Have your project budget, beneficiary details, and organiser contact ready.",
  },
  {
    title: "Share the campaign with your people",
    body: "The intended donation journey uses USSD so supporters can contribute from a basic phone. Share the approved campaign instructions through WhatsApp groups, community meetings, and announcements.",
    example: "A school's old students' association can share the same campaign with members across Ghana.",
  },
  {
    title: "Track contributions and request a payout",
    body: "The host dashboard is being built to bring campaign totals, contribution records, and withdrawal requests together. Withdrawals are intended to pass through admin review.",
    example: "Keep your community updated on what has been collected and what the funds will support.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Who is RaiseFundz for?",
    answer:
      "Community organisers, alumni groups, congregations, and nonprofits in Ghana who want to bring people together around a clear fundraising goal.",
  },
  {
    question: "Can I collect donations right now?",
    answer:
      "This site previews the fundraising experience. Live USSD collections and payouts are still in development. Example campaign figures are illustrative.",
  },
  {
    question: "Will supporters need a smartphone?",
    answer:
      "The planned giving journey uses USSD, so supporters can contribute from a basic mobile phone. No live RaiseFundz shortcode has been published yet.",
  },
  {
    question: "What should I prepare for a campaign?",
    answer:
      "A clear purpose, a target in Ghana cedis, a budget, a closing date, and a named organiser. The host guide walks you through the details.",
  },
];

/* ── Combined section rendered on landing page ── */
export default function LandingStepsAndFAQ() {
  return (
    <>
      {/* How it works — navy band, uses marketing.css .steps/.step/.section-navy */}
      <section
        className="wrap section section-band section-navy"
        id="steps"
      >
        <div className="section-heading">
          <h2>
            One idea.
            <br />A community behind it.
          </h2>
          <a className="section-link" href="#journey">
            The full journey <ArrowRight size={16} />
          </a>
        </div>
        <div className="steps steps-4">
          {STEPS.map(({ title, body }, i) => (
            <StepItem
              key={title}
              number={`0${i + 1}`}
              title={title}
              body={body}
            />
          ))}
        </div>
      </section>

      {/* From an idea to a funded project — ported from how-it-works */}
      <section className="page-section" id="journey">
        <h2>From an idea to a funded project</h2>
        <ol className="space-y-0">
          {JOURNEY_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="grid gap-5 border-t border-ash py-9 md:grid-cols-[80px_1fr_1fr] md:gap-10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime text-lg font-medium">
                0{index + 1}
              </span>
              <div>
                <h3 className="mb-3 text-2xl font-medium tracking-tight">
                  {step.title}
                </h3>
                <p className="leading-relaxed text-graphite">{step.body}</p>
              </div>
              <p className="self-start rounded-[28px] bg-parchment p-6 leading-relaxed text-graphite">
                {step.example}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ — uses marketing.css .faq */}
      <section className="wrap section">
        <div className="section-heading">
          <h2>
            A few things
            <br />
            before you begin.
          </h2>
          <p>Get to know the experience we&apos;re building.</p>
        </div>
        <div className="faq">
          {FAQ_ITEMS.map(({ question, answer }) => (
            <FAQItem key={question} question={question} answer={answer} />
          ))}
        </div>
      </section>
    </>
  );
}
