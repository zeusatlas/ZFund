"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLogout, useMe } from "@/lib/auth/auth";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function UserMenu() {
  const router = useRouter();
  const { data: me } = useMe();
  const logout = useLogout();
  const user = me
    ? { name: `${me.firstName} ${me.lastName}`.trim(), email: me.email }
    : { name: "…", email: "" };
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function handleLogout() {
    setOpen(false);
    logout.mutate(undefined, { onSettled: () => router.replace("/login") });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-transparent p-1 pr-2 transition-colors hover:border-navy/10 hover:bg-stone"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-semibold text-stone">
          {initials(user.name)}
        </span>
        <ChevronDown
          size={16}
          className={`text-steel transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-drawer-in absolute right-0 mt-2 w-60 overflow-hidden surface-card shadow-lg"
        >
          <div className="border-b border-navy/10 bg-stone-light px-4 py-3">
            <p className="text-sm font-semibold text-navy">{user.name}</p>
            <p className="truncate text-xs text-steel">{user.email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-crimson transition-colors hover:bg-crimson/5"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
