import Link from "next/link";

const columns = {
  Platform: [
    { href: "/how-it-works", label: "How it works" },
    { href: "/for-hosts", label: "For hosts" },
    { href: "/for-organizations", label: "For organisations" },
    { href: "/security", label: "Security" },
  ],
  Account: [
    { href: "/login", label: "Host dashboard" },
    { href: "/login", label: "Admin console" },
    { href: "/login", label: "Sign in" },
  ],
  Legal: [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "/security", label: "Security" },
    { href: "#", label: "Contact us" },
  ],
};

export default async function Footer() {
  "use cache";
  return (
    <footer className="bg-off-ink text-parchment">
      <div className="mx-auto max-w-[1200px] px-6 py-20">
        {/* Top grid */}
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 md:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-[18px] font-medium text-white">
              ZFund
            </Link>
            <p className="mt-4 max-w-[220px] text-[14px] leading-relaxed text-parchment/50">
              Bringing Ghana’s communities together through clearer fundraising.
              Shared goals. Contributions in cedis. A purpose everyone can follow.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(columns).map(([section, links]) => (
            <div key={section}>
              <p className="mb-5 text-eyebrow text-ash/70">{section}</p>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-parchment/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-[12px] text-parchment/30">
            © {new Date().getFullYear()} ZFund. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-[12px] text-parchment/30 transition-colors hover:text-white/60"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-[12px] text-parchment/30 transition-colors hover:text-white/60"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
