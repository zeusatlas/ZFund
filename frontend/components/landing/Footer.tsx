import Image from "next/image";
import Link from "next/link";
import CurrentYear from "@/components/landing/CurrentYear";
import { HOST_FEATURES } from "@/components/landing/landing-data";

const columns = {
  Platform: [
    { href: "#how-it-works", label: "How it works" },
    { href: "#for-organisers", label: "For organisers" },
    { href: "#for-organizations", label: "For organisations" },
    { href: "#security", label: "Security" },
  ],
  Features: HOST_FEATURES.map(({ title }) => ({ href: undefined, label: title })),
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "#security", label: "Security details" },
    { href: "/contact", label: "Contact us" },
  ],
};

export default function Footer() {
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
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1.5 shadow-md">
                <Image src="/images/logo.png" alt="" width={36} height={36} className="h-full w-full" />
              </span>
              <span className="text-[19px] font-bold text-white">RaiseFundz</span>
            </Link>
            <p className="mt-5 max-w-[220px] text-[14px] leading-relaxed text-parchment/45">
              Bringing Ghana&apos;s communities together through transparent fundraising.
              Shared goals. Contributions in cedis. A purpose everyone can follow.
            </p>
           
          </div>

          {/* Link columns */}
          {Object.entries(columns).map(([section, links]) => (
            <div key={section}>
              <p className="mb-5 text-eyebrow text-parchment/35">{section}</p>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <Link
                        href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                        className="text-[14px] text-parchment/55 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <span className="text-[14px] text-parchment/55">{link.label}</span>
                    )}
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
              © <CurrentYear /> RaiseFundz. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
