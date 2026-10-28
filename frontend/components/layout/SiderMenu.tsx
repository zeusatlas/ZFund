"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuByRole } from "@/lib/navigation";
import { useRole } from "@/components/auth/RoleProvider";

export default function SiderMenu() {
  const pathname = usePathname();
  const { role } = useRole();
  const items = menuByRole[role];
  const activeHref = items
    .filter(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((first, second) => second.href.length - first.href.length)[0]?.href;

  return (
    <div className="flex flex-1 flex-col justify-between overflow-y-auto py-5">
      <div>
        <p className="px-5 pb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone/35">
          {role === "admin" ? "Administration" : "Workspace"}
        </p>
        <nav aria-label={`${role} navigation`} className="space-y-1 px-3">
          {items.map(({ label, href, icon: Icon }) => {
            const active = href === activeHref;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-white/10 font-semibold text-white"
                    : "text-stone/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-gold transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
                <Icon
                  aria-hidden="true"
                  size={17}
                  className={active ? "text-gold" : "text-stone/50 group-hover:text-gold"}
                />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mx-3 mt-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone/35">
          Signed in as
        </p>
        <p className="mt-1 text-sm font-semibold capitalize text-white">{role}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-stone/45">
          {role === "admin" ? "Full platform oversight" : "Campaigns and payouts"}
        </p>
      </div>
    </div>
  );
}
