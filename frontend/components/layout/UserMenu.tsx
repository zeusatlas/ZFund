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
        className="flex items-center gap-2 rounded-md p-1 transition-colors hover:bg-stone"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-medium text-stone">
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
          className="absolute right-0 mt-2 w-56 rounded-md border border-navy/10 bg-white py-1 shadow-lg"
        >
          <div className="border-b border-navy/10 px-4 py-3">
            <p className="text-sm font-medium text-ink">{user.name}</p>
            <p className="truncate text-xs text-steel">{user.email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-crimson transition-colors hover:bg-stone"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
