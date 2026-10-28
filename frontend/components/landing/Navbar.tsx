"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import HostCtaLink from "@/components/landing/HostCtaLink";

const navLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-hosts", label: "For hosts" },
  { href: "/for-organizations", label: "For organisations" },
  { href: "/security", label: "Security" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-200 ${
        scrolled ? "border-b border-ash" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        {/* Wordmark */}
        <Link
          href="/"
          className="text-[18px] font-medium tracking-tight text-off-ink"
        >
          RaiseFunds
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`text-[14px] font-medium transition-colors duration-150 hover:text-off-ink ${pathname === link.href ? "text-off-ink underline decoration-lime decoration-4 underline-offset-8" : "text-graphite"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 lg:flex">
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="text-[14px] font-medium text-graphite transition-colors hover:text-off-ink"
          >
            Sign in
          </Link>
          <HostCtaLink
            onClick={() => setMobileOpen(false)}
            className="rounded-full bg-lime px-5 py-2 text-[14px] font-medium text-off-ink transition-opacity hover:opacity-85"
          >
            Host a campaign
          </HostCtaLink>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          className="rounded-md p-2 text-off-ink lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div id="mobile-navigation" className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-ash bg-white px-6 pb-8 pt-6 lg:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
                className={`text-[16px] font-medium ${pathname === link.href ? "text-off-ink underline decoration-lime decoration-4 underline-offset-8" : "text-graphite"}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-3 border-t border-ash pt-6">
            <Link
              href="/login"
            onClick={() => setMobileOpen(false)}
              className="text-[16px] font-medium text-graphite"
            >
              Sign in
            </Link>
            <HostCtaLink
            onClick={() => setMobileOpen(false)}
              className="rounded-full bg-lime px-5 py-3 text-center text-[15px] font-medium text-off-ink"
            >
              Host a campaign
            </HostCtaLink>
          </div>
        </div>
      )}
    </header>
  );
}
