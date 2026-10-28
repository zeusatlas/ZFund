"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function MobileNav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="rounded-xl border border-navy/10 p-2 text-navy transition-colors hover:bg-stone"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-midnight/55 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="animate-drawer-left relative flex h-full w-72 max-w-[82%] flex-col bg-midnight text-stone shadow-2xl"
            // Close the drawer when a link inside it is clicked.
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setOpen(false);
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-full p-1.5 text-stone/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
            {children}
          </aside>
        </div>
      )}
    </div>
  );
}
