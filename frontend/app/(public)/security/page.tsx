import type { Metadata } from "next";
import { ClipboardList, LockKeyhole, ShieldCheck } from "lucide-react";
import { FAQ, PageCTA, PageIntro, PageSection } from "@/components/landing/PublicPage";

export const metadata: Metadata = { title: "Security | RaiseFundz", description: "Understand RaiseFundz’s planned campaign reviews, access controls, and withdrawal approvals." };

export default function SecurityPage() {
  return <>
    <PageIntro label="Security" title="Trust starts with knowing what happens next.">Clear responsibilities, careful reviews, and understandable records are at the heart of the fundraising experience we are building.</PageIntro>
    <PageSection title="The controls we are designing">
      <div className="grid gap-6 md:grid-cols-3">{[
        { icon: LockKeyhole, title: "Separate access by role", body: "Hosts are intended to manage their own campaigns. Administrators will have separate review responsibilities. Authentication and role enforcement are still in development." },
        { icon: ShieldCheck, title: "Review before release", body: "Campaign approval and withdrawal approval are planned as distinct steps. A submitted payout request should require review before any funds are released." },
        { icon: ClipboardList, title: "A record of decisions", body: "Contribution records and administrator actions are intended to include timestamps, so campaign activity and approval decisions can be followed." },
      ].map(({ icon: Icon, title, body }) => <article key={title} className="rounded-[28px] bg-parchment p-8"><Icon aria-hidden="true" size={28} className="mb-8" /><h3 className="mb-4 text-xl font-medium">{title}</h3><p className="leading-relaxed text-graphite">{body}</p></article>)}</div>
    </PageSection>
    <section className="bg-charcoal text-white"><div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 md:grid-cols-2">
      <h2 className="max-w-md text-3xl font-medium tracking-tight md:text-4xl">A preview today.<br />Clear expectations from day one.</h2>
      <div className="space-y-5 leading-relaxed text-white/80"><p>This website currently demonstrates the product. Live payment collection, authentication, and the controls described above have not launched.</p><p>Campaigns, balances, and donor activity shown in previews are illustrative. They are not records of money held by RaiseFundz.</p></div>
    </div></section>
    <PageSection title="Questions about giving safely"><FAQ items={[
      { question: "Should I share my mobile money PIN with a host?", answer: "No. Do not share your mobile money PIN or one-time codes with campaign organisers or anyone claiming to be support." },
      { question: "Do the phone numbers in the preview identify real donors?", answer: "No. They are masked Ghanaian-format examples used to demonstrate how contribution records could look." },
      { question: "Does this page claim a security certification?", answer: "No. It explains the intended controls and current product status. It does not claim certification, a completed security audit, or regulatory approval." },
      { question: "Can I send money using this website now?", answer: "No live collection service is connected to this preview. Do not treat sample campaign information as payment instructions." },
    ]} /></PageSection>
    <PageCTA title="See the full fundraising journey." href="/how-it-works" label="Explore how it works" />
  </>;
}
