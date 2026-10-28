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

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  function goToSection(event: ReactMouseEvent<HTMLAnchorElement>, hash: string) {
    if (pathname !== "/") {
      setMobileOpen(false);
      return;
    }
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    event.preventDefault();
    setMobileOpen(false);
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
          ? "border-b border-ash/60 bg-parchment/95 backdrop-blur-md"
          : "border-b border-transparent bg-parchment"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between px-5 sm:px-6">

        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-off-ink text-sm font-bold text-parchment transition-transform group-hover:scale-105">
            R
          </span>
          <span className="text-[18px] font-bold tracking-tight text-off-ink">RaiseFundz</span>
        </Link>

        {/* Desktop Nav - Clean text links, no background color and no shadow */}
        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={pathname === "/" ? link.href : `/${link.href}`}
              onClick={(event) => goToSection(event, link.href)}
              className="text-[14px] font-medium text-graphite transition-colors hover:text-off-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 lg:flex">
          <Link
            href="/login"
            className="text-[14px] font-medium text-graphite transition-colors hover:text-off-ink"
          >
            Sign in
          </Link>
          <HostCtaLink className="group inline-flex items-center gap-2 rounded-full bg-off-ink px-5 py-2.5 text-[14px] font-semibold text-parchment transition-all hover:bg-charcoal hover:-translate-y-0.5">
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
          className="rounded-xl border border-ash/80 bg-white p-2 text-off-ink transition-colors hover:bg-parchment lg:hidden"
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
          <div className="mb-6 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 border border-ash/60">
            <Zap size={14} className="text-off-ink" fill="currentColor" />
            <span className="text-[13px] font-medium text-graphite">Donations happening right now across Ghana</span>
          </div>

          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={pathname === "/" ? link.href : `/${link.href}`}
                className="flex items-center justify-between rounded-2xl px-4 py-4 text-[16px] font-medium text-graphite transition-colors hover:bg-white hover:text-off-ink"
                onClick={(event) => goToSection(event, link.href)}
              >
                {link.label}
                <ArrowRight size={16} className="text-smoke" />
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex flex-col gap-3 border-t border-ash/60 pt-6">
            <Link
              href="/login"
              className="flex w-full items-center justify-center rounded-2xl border border-ash/80 bg-white py-3.5 text-[15px] font-semibold text-off-ink"
              onClick={() => setMobileOpen(false)}
            >
              Sign in
            </Link>
            <HostCtaLink
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-off-ink py-3.5 text-[15px] font-semibold text-parchment"
              onClick={() => setMobileOpen(false)}
            >
              Host a campaign
              <ArrowRight size={15} />
            </HostCtaLink>
          </div>
        </div>
      )}
    </header>
  );
}
