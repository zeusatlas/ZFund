import Link from "next/link";
import { ArrowRight } from "lucide-react";

const columns = {
  Platform: [
    { href: "#how-it-works", label: "How it works" },
    { href: "#for-hosts", label: "For hosts" },
    { href: "#for-organizations", label: "For organisations" },
    { href: "#security", label: "Security" },
  ],
  Account: [
    { href: "/login", label: "Host dashboard" },
    { href: "/login", label: "Admin console" },
    { href: "/login", label: "Sign in" },
  ],
  Legal: [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "/security", label: "Security details" },
    { href: "#", label: "Contact us" },
  ],
};

export default async function Footer() {
  "use cache";
  return (
    <footer className="relative overflow-hidden bg-off-ink text-parchment">
      {/* Decorative gradient top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/40 to-transparent" />

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -top-32 right-0 h-[400px] w-[400px] rounded-full bg-lime/5 blur-[80px]" />

      <div className="relative mx-auto max-w-[1200px] px-6 py-20">
        {/* Top grid */}
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 md:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-lime to-[#c48a1e] text-[15px] font-bold text-off-ink shadow-md">
                Z
              </span>
              <span className="text-[19px] font-bold text-white">ZFund</span>
            </Link>
            <p className="mt-5 max-w-[220px] text-[14px] leading-relaxed text-parchment/45">
              Bringing Ghana&apos;s communities together through transparent fundraising.
              Shared goals. Contributions in cedis. A purpose everyone can follow.
            </p>
            {/* Mini CTA */}
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-medium text-parchment/70 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              Start fundraising <ArrowRight size={13} />
            </Link>
          </div>

          {/* Link columns */}
          {Object.entries(columns).map(([section, links]) => (
            <div key={section}>
              <p className="mb-5 text-eyebrow text-parchment/35">{section}</p>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                      className="text-[14px] text-parchment/55 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-16 border-t border-white/8 pt-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <p className="text-[12px] text-parchment/35">
                Platform operational · Donations processing in real time
              </p>
            </div>
            <p className="text-[12px] text-parchment/30">
              © {new Date().getFullYear()} ZFund. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
