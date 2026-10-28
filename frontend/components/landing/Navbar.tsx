"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent as ReactMouseEvent } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import HostCtaLink from "@/components/landing/HostCtaLink";

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#for-hosts", label: "For hosts" },
  { href: "#for-organizations", label: "For organisations" },
  { href: "#security", label: "Security" },
];

const HOME = "/home";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // The marketing landing exists at both "/" and "/home" (two variants),
  // so section links must scroll within whichever one is open.
  const onLanding = pathname === "/" || pathname === HOME;

  function goToSection(event: ReactMouseEvent<HTMLAnchorElement>, hash: string) {
    if (!onLanding) {
      setMobileOpen(false);
      return; // let Next.js navigate to /home#...
    }
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    event.preventDefault();
    setMobileOpen(false);
    // Let the drawer's scroll lock clear before scrolling to the section.
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", hash);
    }, 100);
  }

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
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
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
      className="marketing-nav sticky z-50"
      data-scrolled={scrolled}
    >
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between px-5 sm:px-6">

        {/* Wordmark */}
        <Link
          href="/"
          className="brand text-off-ink"
        >
          RaiseFundz
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 rounded-full border border-ash/70 bg-white/60 p-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={onLanding ? link.href : `${HOME}${link.href}`}
              onClick={(event) => goToSection(event, link.href)}
              className="rounded-full px-4 py-2 text-[13px] font-medium text-graphite transition-all duration-200 hover:bg-parchment hover:text-off-ink hover:shadow-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/login"
            className="text-[14px] font-medium text-graphite transition-colors hover:text-off-ink"
          >
            Sign in
          </Link>
          <HostCtaLink
            onClick={() => setMobileOpen(false)}
            className="pill pill-primary"
          >
            Host a campaign
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </HostCtaLink>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          className="flex h-11 w-11 items-center justify-center rounded-full text-off-ink lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div id="mobile-navigation" className="mobile-menu-panel overflow-y-auto bg-parchment px-6 pb-8 pt-6 lg:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={onLanding ? link.href : `${HOME}${link.href}`}
                className="flex items-center justify-between rounded-2xl px-4 py-4 text-[16px] font-medium text-graphite transition-colors hover:bg-white/70 hover:text-off-ink"
                onClick={(event) => goToSection(event, link.href)}
              >
                {link.label}
                <ArrowRight size={16} className="text-smoke" />
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex flex-col gap-3 border-t border-ash pt-6">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-2xl border border-ash bg-white/60 px-5 py-3.5 text-center text-[15px] font-medium text-off-ink transition-colors hover:bg-white"
            >
              Sign in
            </Link>
            <HostCtaLink
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-off-ink px-5 py-3.5 text-center text-[15px] font-semibold text-parchment shadow-md"
            >
              Host a campaign <ArrowRight size={15} />
            </HostCtaLink>
          </div>
        </div>
      )}
    </header>
  );
}
