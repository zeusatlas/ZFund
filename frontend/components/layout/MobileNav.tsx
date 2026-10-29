"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SiderMenu from "./SiderMenu";
import { useSidebar } from "./SidebarContext";

export default function MobileNav() {
  const { isMobileOpen, setIsMobileOpen } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMobileOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isMobileOpen, setIsMobileOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open navigation menu"
        className="rounded-xl border border-navy/10 p-2 text-navy transition-colors hover:bg-stone"
      >
        <Menu size={20} />
      </button>

      {isMobileOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999]" role="dialog" aria-modal="true">
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-midnight/70 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-out drawer positioned on top of all page contents */}
            <aside
              className="animate-drawer-left fixed inset-y-0 left-0 z-[10000] flex h-full w-72 max-w-[85vw] flex-col bg-midnight text-stone shadow-2xl"
              onClick={(e) => {
                // Auto-close when clicking any link
                if ((e.target as HTMLElement).closest("a")) setIsMobileOpen(false);
              }}
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-steel/40 px-5">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-white hover:text-stone/90"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-xs">
                    <Image
                      src="/images/logo.png"
                      alt="RaiseFundz logo"
                      width={24}
                      height={24}
                      priority
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span>RaiseFundz</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  aria-label="Close navigation menu"
                  className="rounded-lg p-1.5 text-stone/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-1 flex-col overflow-y-auto">
                <SiderMenu forceExpanded={true} />
              </div>
            </aside>
          </div>,
          document.body
        )}
    </div>
  );
}
