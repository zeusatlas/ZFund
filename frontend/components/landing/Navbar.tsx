"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent as ReactMouseEvent } from "react";
import { ArrowRight, Menu, X, Zap } from "lucide-react";
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
  const onHome = pathname === HOME;

  function goToSection(event: ReactMouseEvent<HTMLAnchorElement>, hash: string) {
    if (!onHome) {
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-ash/60 bg-parchment/90 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-parchment"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between px-5 sm:px-6">

        {/* Wordmark */}
        <Link
          href={HOME}
          className="flex items-center gap-2.5 group"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-lime text-sm font-bold text-off-ink shadow-md transition-transform group-hover:scale-105">
            R
            <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
          <span className="text-[18px] font-bold tracking-tight text-off-ink">RaiseFundz</span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 rounded-full border border-ash/70 bg-white/60 p-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={onHome ? link.href : `${HOME}${link.href}`}
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
          <HostCtaLink className="group inline-flex items-center gap-2 rounded-full bg-off-ink px-5 py-2.5 text-[14px] font-semibold text-parchment shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg">
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
          className="rounded-xl border border-ash bg-white/60 p-2 text-off-ink transition-colors hover:bg-parchment lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="animate-drawer-in absolute inset-x-0 top-[68px] max-h-[calc(100dvh-68px)] overflow-y-auto border-t border-ash/60 bg-parchment/98 px-5 pb-10 pt-6 backdrop-blur-xl lg:hidden"
        >
          {/* Live indicator mobile */}
          <div className="mb-6 flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-3">
            <Zap size={14} className="text-lime" fill="currentColor" />
            <span className="text-[13px] font-medium text-graphite">Donations happening right now across Ghana</span>
          </div>

          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={onHome ? link.href : `${HOME}${link.href}`}
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
