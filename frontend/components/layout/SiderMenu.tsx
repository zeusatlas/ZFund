"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardByRole, menuByRole, type UserRole } from "@/lib/navigation";
import { useRole } from "@/components/auth/RoleProvider";

export default function SiderMenu() {
  const pathname = usePathname();
  const { role, setRole } = useRole();
  const items = menuByRole[role];

  return (
    <div className="flex flex-1 flex-col">
      <nav aria-label={`${role} navigation`} className="space-y-1 px-3">
        {items.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-steel/60 font-medium text-white"
                  : "text-stone/75 hover:bg-steel/40 hover:text-white"
              }`}
            >
              <Icon aria-hidden="true" size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-steel/40 p-3">
        <p className="px-3 pb-2 text-xs text-stone/50">Test as role</p>
        <div className="grid grid-cols-2 gap-2">
          {(["admin", "host"] as UserRole[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRole(option)}
              className={`rounded-md px-2 py-1.5 text-xs capitalize transition-colors ${
                role === option
                  ? "bg-gold text-midnight"
                  : "bg-steel/40 text-stone/75 hover:bg-steel/60 hover:text-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <Link
          href={dashboardByRole[role]}
          className="mt-2 block px-3 text-center text-xs text-stone/50 hover:text-stone"
        >
          Switch role to its dashboard
        </Link>
      </div>
    </div>
  );
}
