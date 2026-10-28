import type { Metadata } from "next";
import { FAQ, PageCTA, PageIntro, PageSection } from "@/components/landing/PublicPage";

export const metadata: Metadata = {
  title: "How it works | RaiseFundz",
  description: "Explore the RaiseFundz fundraising journey for Ghana, from a campaign idea to contributions in Ghana cedis and a withdrawal request.",
};

const steps = [
  { title: "Give your community a clear goal", body: "Start with the purpose, a target in Ghana cedis (GH₵), and a closing date. Explain who will benefit and how the money will be used.", example: "Example: GH₵ 50,000 for a community borehole in the Eastern Region." },
  { title: "Prepare your campaign for review", body: "Provide the organiser’s details and a clear campaign description. The planned review process gives an administrator a chance to check a campaign before it opens for contributions.", example: "Have your project budget, beneficiary details, and organiser contact ready." },
  { title: "Share the campaign with your people", body: "The intended donation journey uses USSD so supporters can contribute from a basic phone. Share the approved campaign instructions through WhatsApp groups, community meetings, and announcements.", example: "A school’s old students’ association can share the same campaign with members across Ghana." },
  { title: "Track contributions and request a payout", body: "The host dashboard is being built to bring campaign totals, contribution records, and withdrawal requests together. Withdrawals are intended to pass through admin review.", example: "Keep your community updated on what has been collected and what the funds will support." },
];

export default function HowItWorksPage() {
  return <>
    <PageIntro label="How it works" title="A shared goal. A simple way to give.">From a neighbourhood project to an old students’ appeal, here is the fundraising journey we are building for Ghana.</PageIntro>
    <PageSection title="From an idea to a funded project">
      <ol className="space-y-0">
        {steps.map((step, index) => <li key={step.title} className="grid gap-5 border-t border-ash py-9 md:grid-cols-[80px_1fr_1fr] md:gap-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime text-lg font-medium">0{index + 1}</span>
          <div><h3 className="mb-3 text-2xl font-medium tracking-tight">{step.title}</h3><p className="leading-relaxed text-graphite">{step.body}</p></div>
          <p className="self-start rounded-[28px] bg-parchment p-6 leading-relaxed text-graphite">{step.example}</p>
        </li>)}
      </ol>
    </PageSection>
    <div className="bg-parchment"><PageSection title="Before you get started"><FAQ items={[
      { question: "Which currency does RaiseFundz use?", answer: "Campaign examples and goals use Ghana cedis, shown as GH₵. GHS is the currency code for the Ghana cedi." },
      { question: "Can I collect donations right now?", answer: "The site currently previews the fundraising experience. Campaign creation, live USSD collections, and payouts are still being developed." },
      { question: "Is there a shortcode I can dial?", answer: "No live RaiseFundz shortcode is published here yet. Donation instructions will be available when the collection service launches." },
    ]} /></PageSection></div>
    <PageCTA title="Start with a campaign people can understand." href="/for-hosts" label="Explore the host guide" />
  </>;
}
