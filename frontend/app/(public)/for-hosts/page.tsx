import type { Metadata } from "next";
import { FAQ, PageCTA, PageIntro, PageSection } from "@/components/landing/PublicPage";

export const metadata: Metadata = { title: "For hosts | RaiseFunds", description: "Plan a Ghanaian fundraiser with clear goals, contribution records, and community updates." };

export default function ForHostsPage() {
  return <>
    <PageIntro label="For hosts" title="Bring your people behind a purpose.">Organising a medical appeal, a community project, or a school fundraiser? Give supporters a clear reason to contribute and keep them close to the progress.</PageIntro>
    <PageSection title="A good campaign starts with the details">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-8">
          {[
            ["Tell the story", "Explain the need, who you are raising money for, and your connection to the project. Use details your community can recognise."],
            ["Set a goal in Ghana cedis", "Break down the costs and choose a realistic closing date. Include the materials, labour, or support the campaign will pay for."],
            ["Keep supporters informed", "Plan regular updates for your WhatsApp group, association, or congregation. Share progress and explain any changes to the budget."],
          ].map(([title, body]) => <div key={title}><h3 className="mb-3 text-xl font-medium">{title}</h3><p className="max-w-xl leading-relaxed text-graphite">{body}</p></div>)}
        </div>
        <aside className="rounded-[28px] bg-parchment p-7 md:p-10">
          <p className="mb-6 text-sm text-graphite">Illustrative campaign brief</p>
          <h3 className="text-3xl font-medium tracking-tight">A new library for our school.</h3>
          <p className="mt-4 leading-relaxed text-graphite">An old students’ association in Cape Coast brings members together to create a reading space for the next generation.</p>
          <dl className="mt-8 divide-y divide-ash">
            {[["Books", "GH₵ 12,000"], ["Shelving and furniture", "GH₵ 10,000"], ["Room improvements", "GH₵ 8,000"], ["Campaign goal", "GH₵ 30,000"]].map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-3 py-4"><dt className="text-graphite">{label}</dt><dd className="font-medium">{value}</dd></div>)}
          </dl>
        </aside>
      </div>
    </PageSection>
    <div className="bg-parchment"><PageSection title="Your planned host workspace">
      <div className="grid gap-6 md:grid-cols-3">{[
        ["Campaign overview", "See your goals, campaign timelines, and contribution totals in one place."],
        ["Contribution records", "Follow individual gifts with amounts in GH₵, timestamps, and masked donor numbers."],
        ["Withdrawal requests", "Submit a payout request and follow its progress through the intended administrator review."],
      ].map(([title, body]) => <article key={title} className="rounded-[28px] bg-white p-8"><h3 className="mb-4 text-xl font-medium">{title}</h3><p className="leading-relaxed text-graphite">{body}</p></article>)}</div>
      <p className="mt-8 text-sm text-graphite">These features are in development. The current dashboard is a preview.</p>
    </PageSection></div>
    <PageSection title="Planning your fundraiser"><FAQ items={[
      { question: "What should I prepare?", answer: "A campaign name, a clear description, your target in GH₵, a deadline, and a cost breakdown. Get permission before sharing someone else’s personal story or photographs." },
      { question: "Can an association organise a campaign?", answer: "Yes, associations are one of the audiences RaiseFunds is being designed for. Agree on the campaign organiser, who reviews spending, and how members will receive updates." },
    ]} /></PageSection>
    <PageCTA title="Know every step before you begin." href="/how-it-works" label="See how it works" />
  </>;
}
