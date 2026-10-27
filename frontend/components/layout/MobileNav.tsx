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
        className="rounded-md p-2 text-navy transition-colors hover:bg-stone"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-ink/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="relative flex h-full w-64 max-w-[80%] flex-col bg-midnight text-stone shadow-xl"
            // Close the drawer when a link inside it is clicked.
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setOpen(false);
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-md p-1 text-stone/80 transition-colors hover:bg-steel/40"
            >
              <X size={20} />
            </button>
            {children}
          </aside>
        </div>
      )}
    </div>
  );
}
