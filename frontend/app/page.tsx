import Link from "next/link";
import { ArrowRight, Smartphone, WalletCards, BarChart3, ShieldCheck, Users, ClipboardList, LockKeyhole, HeartHandshake, GraduationCap, Building2, CircleCheck, Sprout } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import MarketingMotion from "@/components/landing/MarketingMotion";
import Footer from "@/components/landing/Footer";
import HostCtaLink from "@/components/landing/HostCtaLink";
import { FAQ } from "@/components/landing/PublicPage";
import "@/components/landing/marketing.css";

export default function Home() {
  return (
    <MarketingMotion>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <section className="hero wrap">
          <p className="kicker">Shared purpose. Collective possibility.</p>
          <h1>Good things happen<br />when we give together.</h1>
          <p className="hero-copy">A simpler way to bring Ghana’s communities behind a cause. Plan your fundraiser, connect your people, and keep every contribution in view.</p>
          <div className="hero-actions">
            <HostCtaLink className="pill pill-primary">Host a campaign <ArrowRight size={16} /></HostCtaLink>
            <Link href="/how-it-works" className="pill">Explore how it works</Link>
          </div>
          <div className="fund-flow" aria-label="Planned fundraising flow: communities, alumni and supporters connect through ZFund to campaigns, contributions and shared progress">
            <div className="flow-stack">
              <div className="flow-node"><Users size={17} /> Communities</div>
              <div className="flow-node"><GraduationCap size={17} /> Alumni groups</div>
              <div className="flow-node"><HeartHandshake size={17} /> Supporters</div>
            </div>
            <div className="flow-hub"><Sprout size={25} className="mx-auto text-gold" /><strong>ZFund</strong><span>One purpose. Brought together.</span></div>
            <div className="flow-stack">
              <div className="flow-node"><ClipboardList size={17} /> Clear campaigns</div>
              <div className="flow-node"><Smartphone size={17} /> Simple giving</div>
              <div className="flow-node"><BarChart3 size={17} /> Shared progress</div>
            </div>
          </div>
        </section>
        <div className="wrap context-strip">
          <span><CircleCheck size={16} /> Built around Ghana’s communities</span>
          <span><WalletCards size={16} /> Goals in Ghana cedis</span>
          <span><Smartphone size={16} /> USSD giving in development</span>
        </div>

        <section className="wrap section section-band section-mist" id="for-hosts">
          <div className="section-heading"><h2>A clear picture.<br />From the first contribution.</h2><p>Less time piecing things together. More room to focus on the people and purpose behind your fundraiser.</p></div>
          <div className="feature-grid">
            <article className="feature feature-highlight">
              <BarChart3 size={25} aria-hidden="true" /><h3>Your cause, in view.</h3><p>A shared place for campaign goals, contribution records, and the progress that matters.</p>
              <div className="mini-ledger"><span className="kicker">Illustrative campaign</span><div><span>Aburi community water project</span></div><div className="ledger-total"><span>GH₵ 28,475</span><span>57%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-smoke" aria-label="Example campaign: 57 percent funded"><span className="block h-full w-[57%] bg-gold" /></div><div><span>Raised toward the goal</span><span>GH₵ 50,000</span></div></div>
            </article>
            <article className="feature"><Smartphone size={25} aria-hidden="true" /><h3>Giving that meets people where they are.</h3><p>We’re building USSD contributions so supporters can give from a basic phone, without needing an app or internet connection.</p></article>
            <article className="feature"><WalletCards size={25} aria-hidden="true" /><h3>A considered path to payout.</h3><p>Planned withdrawal reviews and clear records help organisers follow what happens after a contribution.</p><Link href="/for-hosts" className="section-link mt-8">Meet your workspace <ArrowRight size={16} /></Link></article>
          </div>
        </section>

        <section className="wrap section section-band section-navy" id="how-it-works">
          <div className="section-heading"><h2>One idea.<br />A community behind it.</h2><Link className="section-link" href="/how-it-works">The full journey <ArrowRight size={16} /></Link></div>
          <div className="steps">{[
            ["Give your goal a home.", "Tell your story, set a target in Ghana cedis, and prepare your campaign for review."],
            ["Bring your people together.", "Share your purpose with your association, congregation, or community. Give everyone a clear reason to help."],
            ["Keep the progress open.", "Follow contributions, plan a withdrawal request, and keep supporters informed along the way."],
          ].map(([title, body], i) => <article key={title} className="step"><span className="step-number">0{i + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
        </section>

        <section className="wrap section community section-band section-gold-wash" id="for-organizations">
          <div className="community-copy"><p className="kicker">For the people who bring people together</p><h2>Different communities.<br />The same spirit of giving.</h2><p>A school library. A community borehole. Support for a neighbour. Make your shared purpose something everyone can be part of.</p><Link href="/for-organizations" className="pill">For your organisation <ArrowRight size={16} /></Link></div>
          <div className="community-list">{[{ icon: HeartHandshake, title: "Community & welfare groups" }, { icon: GraduationCap, title: "Schools & old students" }, { icon: Users, title: "Churches & mosques" }, { icon: Building2, title: "NGOs & nonprofits" }].map(({ icon: Icon, title }) => <Link href="/for-organizations" key={title}><Icon size={24} aria-hidden="true" /><h3>{title}</h3><ArrowRight size={18} aria-hidden="true" /></Link>)}</div>
        </section>

        <section className="wrap security-section" id="security"><div className="trust-panel">
          <div><h2>Trust belongs<br />in every step.</h2><p>People give because they care. We’re designing the review process and records to help you honour that trust.</p><Link className="section-link" href="/security">Our approach to security <ArrowRight size={16} /></Link></div>
          <div className="trust-points">{[{ icon: ShieldCheck, title: "Review before release", body: "Separate campaign and withdrawal reviews are part of the planned workflow." }, { icon: LockKeyhole, title: "Clear responsibilities", body: "Distinct host and administrator roles, with a purpose for each." }, { icon: ClipboardList, title: "Records you can follow", body: "Contribution details and decisions brought into one understandable view." }].map(({ icon: Icon, title, body }) => <div key={title}><Icon size={23} aria-hidden="true" /><section><h3>{title}</h3><p>{body}</p></section></div>)}</div>
        </div></section>

        <section className="wrap section"><div className="section-heading"><h2>A few things<br />before you begin.</h2><p>Get to know the experience we’re building.</p></div><FAQ items={[
          { question: "Who is ZFund for?", answer: "Community organisers, alumni groups, congregations, and nonprofits in Ghana who want to bring people together around a clear fundraising goal." },
          { question: "Can I collect donations right now?", answer: "This site previews the fundraising experience. Live USSD collections and payouts are still in development. Example campaign figures are illustrative." },
          { question: "Will supporters need a smartphone?", answer: "The planned giving journey uses USSD, so supporters can contribute from a basic mobile phone. No live ZFund shortcode has been published yet." },
          { question: "What should I prepare for a campaign?", answer: "A clear purpose, a target in Ghana cedis, a budget, a closing date, and a named organiser. The host guide walks you through the details." },
        ]} /></section>
        <section className="wrap closing"><h2>Your community has a purpose.<br />Give it a place to grow.</h2><p>Start with the people you know and the change you want to make together.</p><HostCtaLink className="pill pill-dark">Explore your host dashboard <ArrowRight size={16} /></HostCtaLink></section>
      </main>
      <Footer />
    </MarketingMotion>
  );
}
