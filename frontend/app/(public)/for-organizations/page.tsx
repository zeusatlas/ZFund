import type { Metadata } from "next";
import { Building2, GraduationCap, HeartHandshake, Users } from "lucide-react";
import { PageCTA, PageIntro, PageSection } from "@/components/landing/PublicPage";

export const metadata: Metadata = { title: "For organisations | RaiseFunds", description: "Fundraising for Ghana’s community associations, schools, faith communities, and nonprofits." };

const organisations = [
  { icon: HeartHandshake, title: "Community and welfare groups", body: "Bring neighbours, hometown associations, and welfare groups together around a shared need.", example: "A community in Tamale plans a clean-water appeal." },
  { icon: GraduationCap, title: "Schools and old students", body: "Give alumni and parent associations a shared view of school improvement and student support campaigns.", example: "Old students in Cape Coast raise funds for library books." },
  { icon: Users, title: "Churches and mosques", body: "Organise building funds, community outreach, and welfare appeals with clear goals for your congregation.", example: "A congregation in Kumasi prepares a community food drive." },
  { icon: Building2, title: "NGOs and nonprofits", body: "Explain each project’s purpose and budget, and plan how to report contributions and spending to supporters.", example: "An Accra-based group prepares a school-supplies campaign." },
];

export default function OrganisationsPage() {
  return <>
    <PageIntro label="For organisations" title="One community. Many ways to make a difference.">Built around the groups that bring Ghana together, from hometown associations to schools, congregations, and local nonprofits.</PageIntro>
    <PageSection title="A place for your shared purpose">
      <div className="grid gap-6 md:grid-cols-2">{organisations.map(({ icon: Icon, title, body, example }) => <article key={title} className="rounded-[28px] bg-parchment p-8 md:p-10">
        <Icon size={28} aria-hidden="true" className="mb-8" />
        <h3 className="mb-4 text-2xl font-medium tracking-tight">{title}</h3>
        <p className="leading-relaxed text-graphite">{body}</p>
        <p className="mt-8 border-t border-ash pt-5 text-sm leading-relaxed text-graphite">Illustrative use case: {example}</p>
      </article>)}</div>
    </PageSection>
    <section className="bg-charcoal text-white"><div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 md:grid-cols-2">
      <div><h2 className="text-4xl font-medium leading-tight tracking-tight">Clear responsibilities.<br />Stronger accountability.</h2><p className="mt-6 max-w-lg leading-relaxed text-white/75">ZFund’s planned host and administrator roles separate day-to-day campaign management from campaign and withdrawal review.</p></div>
      <dl className="space-y-7">{[["Campaign organiser", "Prepares the appeal, maintains the budget, and keeps supporters informed."], ["Administrator", "Reviews campaign submissions and withdrawal requests in the planned approval workflow."], ["Community", "Receives clear updates about the purpose, progress, and use of contributions."]].map(([title, body]) => <div key={title} className="border-t border-white/25 pt-5"><dt className="text-lg font-medium text-lime">{title}</dt><dd className="mt-2 leading-relaxed text-white/75">{body}</dd></div>)}</dl>
    </div></section>
    <PageSection title="Agree on the basics together"><div className="grid gap-8 md:grid-cols-3">{[["A specific purpose", "Choose a project members can understand, with a budget in Ghana cedis."], ["A named organiser", "Decide who will maintain the campaign and answer supporters’ questions."], ["An update schedule", "Agree when to share progress and how to explain the use of funds."]].map(([title, body]) => <div key={title}><h3 className="mb-3 text-xl font-medium">{title}</h3><p className="leading-relaxed text-graphite">{body}</p></div>)}</div></PageSection>
    <PageCTA title="Make accountability part of your plan." href="/security" label="Read about trust and security" />
  </>;
}
