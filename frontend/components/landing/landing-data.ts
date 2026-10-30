/**
 * Placeholder / dummy content for the public landing page.
 * Every export is tagged with the section it belongs to (top to bottom on the page).
 * Replace with real data (API / CMS) when it is available.
 */
import {
  BadgeCheck, Building2, ClipboardList, Globe, GraduationCap,
  HeartHandshake, Lock, RefreshCw, ShieldCheck, Smartphone, Users,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
 * SECTION 1 — Hero (LandingHero.tsx): floating badges over the hero photo
 * ══════════════════════════════════════════════════════════════ */
export const HERO_RAISED_TODAY = 156420;
export const HERO_USSD_CODE = "*920*969#";

/** Mobile networks supported for USSD giving (shown under the hero buttons). */
export const TELECOMS = ["MTN", "Telecel (Vodafone)", "AirtelTigo"];

/* ══════════════════════════════════════════════════════════════
 * SECTION 2 — Social-proof ticker (LandingOverview.tsx): dark scrolling strip under the hero
 * ══════════════════════════════════════════════════════════════ */
export const TICKER_ITEMS = [
  "Withdrawals verified before funds are released",
  "Every contribution tracked securely",
  "Full audit trail on every transaction",
  "Role-based access for organisers and admins",
  "Campaigns reviewed and verified before going live",
  "Create and manage multiple campaigns in one dashboard",
  "Export your full transaction history anytime",
  "Donate online from anywhere in the world",
];

/* ══════════════════════════════════════════════════════════════
 * SECTION 3 — How it works (LandingOverview.tsx): four-step journey
 * ══════════════════════════════════════════════════════════════ */
export const JOURNEY_STEPS = [
  {
    title: "Reach out to us",
    body: "Contact our team and tell us about your cause or organisation. We create your organiser account for you and send you your login details.",
    example: "No sign-up form. We set you up personally.",
  },
  {
    title: "Log in to your dashboard",
    body: "Sign in with the details we gave you. Your dashboard is where you create campaigns, follow donations, and manage your withdrawals.",
    example: "Only you can see your own campaigns and records.",
  },
  {
    title: "Create your campaigns",
    body: "Add your campaign's name, purpose, target amount, and dates. Our team reviews it before it goes live, then you share it with your community and watch donations come in.",
    example: "You can run several campaigns at the same time.",
  },
  {
    title: "Request your money",
    body: "When you are ready to use the funds, request a withdrawal from your dashboard. Once it is verified and approved, the money is released to you.",
    example: "Every request and approval is logged for full transparency.",
  },
];

/* ══════════════════════════════════════════════════════════════
 * SECTION 4 — For organisers (LandingOverview.tsx): "Everything you need" feature cards
 * ══════════════════════════════════════════════════════════════ */
export const HOST_FEATURES = [
  { icon: Smartphone, title: "USSD-powered collection", description: "Donors give via a simple shortcode from any mobile phone — no app, no internet, no bank card. Contributions land in your dashboard instantly.", highlight: false },
  { icon: ClipboardList, title: "Full transaction history", description: "Every donation is logged with the donor's masked number, amount, and timestamp. Export your complete contribution record at any time.", highlight: false },
  { icon: Users, title: "Multi-campaign management", description: "Run multiple fundraisers simultaneously. Set goals, durations, and descriptions for each — all from one unified dashboard.", highlight: false },
  { icon: BadgeCheck, title: "Campaign verification", description: "Your campaigns carry a verified badge that builds donor trust. Admins review campaigns before they go live to the USSD network.", highlight: false },
];

/* ══════════════════════════════════════════════════════════════
 * SECTION 5 — For organisations (LandingOverview.tsx): "Built for groups of every size" cards
 * ══════════════════════════════════════════════════════════════ */
export const ORG_TYPES = [
  { icon: HeartHandshake, title: "Community Groups", description: "Hometown associations, neighbourhood funds, and welfare groups can unite around a shared goal — with full transparency for every contributor." },
  { icon: Building2, title: "NGOs", description: "Run multiple concurrent campaigns with admin oversight, donor reporting, and exportable records for grant compliance and accountability." },
  { icon: GraduationCap, title: "Schools & Institutions", description: "Fee drives, bursary funds, and alumni giving campaigns — managed by admin staff with role-based access and withdrawal approval flows." },
  { icon: Globe, title: "Faith Organisations", description: "Tithes, building funds, and mission drives collected via USSD from your congregation — anywhere, any time, any network." },
];

/* ══════════════════════════════════════════════════════════════
 * SECTION 6 — FAQ (LandingStepsAndFAQ.tsx)
 * ══════════════════════════════════════════════════════════════ */
export const FAQ_ITEMS = [
  {
    question: "Who is RaiseFundz for?",
    answer:
      "Community organisers, alumni groups, congregations, nonprofits and individuals in Ghana who want to bring people together around a clear fundraising goal.",
  },
  {
    question: "Can I collect donations right now?",
    answer:
      "This site previews the fundraising experience. Live USSD collections and payouts are active for registered organisers following admin review.",
  },
  {
    question: "Will supporters need a smartphone?",
    answer:
      "The giving journey uses USSD, so supporters can contribute from a basic mobile phone on any network in Ghana without an internet connection.",
  },
  {
    question: "What should I prepare for a campaign?",
    answer:
      "A clear purpose, a target in Ghana cedis, a budget, a closing date, and organiser contact information. The organiser dashboard walks you through each step.",
  },
];

/* ══════════════════════════════════════════════════════════════
 * SECTION 7 — Security (LandingTrust.tsx): dark "Your donors' trust" section
 * ══════════════════════════════════════════════════════════════ */
export const SECURITY_POINTS = [
  {
    icon: Lock,
    title: "Role-based access control",
    description: "Organisers see only their own campaigns. Admins have platform-wide visibility with separate approval workflows. No role can exceed its defined permissions.",
  },
  {
    icon: ShieldCheck,
    title: "Withdrawal verification",
    description: "All withdrawals go through an admin review step before funds are released. No money moves without an explicit approval in the admin console.",
  },
  {
    icon: RefreshCw,
    title: "Full audit trail",
    description: "Every transaction, withdrawal request, and admin action is logged with a timestamp. Your records are complete, tamper-evident, and always accessible.",
  },
];

/* ══════════════════════════════════════════════════════════════
 * SECTION 8 — Testimonials (LandingTrust.tsx): "Communities that chose RaiseFundz"
 * ══════════════════════════════════════════════════════════════ */
export const TESTIMONIALS = [
  {
    quote: "We raised over GH₵ 14,000 for a community borehole in just three weeks. Our members in the diaspora could even contribute — they just sent the shortcode and donated from wherever they were.",
    name: "Maame Esi Asante",
    role: "Secretary, Aburi Hometown Association",
    initials: "MA",
  },
  {
    quote: "RaiseFundz made our school fees drive transparent for the first time. Parents could see the progress in real time, and we completed the campaign 20 days ahead of schedule.",
    name: "Emmanuel Boateng",
    role: "Headmaster, Cape Coast Community School",
    initials: "EB",
  },
  {
    quote: "As an NGO we needed proper audit trails for our donors. RaiseFundz's exportable records and withdrawal approval flow made our compliance reporting straightforward.",
    name: "Akosua Mensah",
    role: "Director, Kumasi Women's Welfare Trust",
    initials: "AM",
  },
];

/* ══════════════════════════════════════════════════════════════
 * SECTION 9 — Illustrative campaigns (LandingTrust.tsx): "Local causes. Shared purpose."
 * ══════════════════════════════════════════════════════════════ */
export const ILLUSTRATIVE_CAMPAIGNS = [
  {
    description: "A hometown association brings members together to fund a borehole, with a clear budget and regular progress updates shared across WhatsApp groups.",
    name: "Clean water for the community",
    role: "Aburi · Eastern Region",
    raised: "GH₵ 28,475",
    goal: "GH₵ 50,000",
  },
  {
    description: "A market women's welfare group organises an appeal to support a member's medical expenses, keeping all contributors informed with every update.",
    name: "Support when it matters",
    role: "Kumasi · Ashanti Region",
    raised: "GH₵ 14,200",
    goal: "GH₵ 20,000",
  },
  {
    description: "An old students' association rallies alumni around books, furniture, and a better reading space for current students — all via USSD.",
    name: "A library for the next generation",
    role: "Cape Coast · Central Region",
    raised: "GH₵ 9,850",
    goal: "GH₵ 15,000",
  },
];
