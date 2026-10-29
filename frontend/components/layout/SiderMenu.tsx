"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuByRole } from "@/lib/navigation";
import { useRole } from "@/components/auth/RoleProvider";
import { useSidebar } from "./SidebarContext";

export default function SiderMenu({ forceExpanded = false }: { forceExpanded?: boolean }) {
  const pathname = usePathname();
  const { role } = useRole();
  const { isCollapsed } = useSidebar();
  const collapsed = forceExpanded ? false : isCollapsed;

  const items = menuByRole[role];
  const activeHref = items
    .filter(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((first, second) => second.href.length - first.href.length)[0]?.href;

  return (
    <div className={`flex flex-1 flex-col justify-between overflow-y-auto py-5 ${collapsed ? "px-2" : ""}`}>
      <div>
        {!collapsed ? (
          <p className="px-5 pb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone/35">
            {role === "admin" ? "Administration" : "Workspace"}
          </p>
        ) : (
          <div className="mx-2 mb-3 border-b border-white/10" aria-hidden="true" />
        )}

        <nav aria-label={`${role} navigation`} className={`space-y-1.5 ${collapsed ? "px-0" : "px-3"}`}>
          {items.map(({ label, href, icon: Icon }) => {
            const active = href === activeHref;
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                aria-label={collapsed ? label : undefined}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center rounded-xl transition-all ${
                  collapsed
                    ? "justify-center py-3 px-0 w-full"
                    : "gap-3 px-3 py-2.5 text-sm"
                } ${
                  active
                    ? "bg-white/10 font-semibold text-white shadow-xs"
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
                  size={collapsed ? 20 : 17}
                  className={`shrink-0 transition-colors ${
                    active ? "text-gold" : "text-stone/50 group-hover:text-gold"
                  }`}
                />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Role Footer */}
      {!collapsed ? (
        <div className="mx-3 mt-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone/35">
            Signed in as
          </p>
          <p className="mt-1 text-sm font-semibold capitalize text-white">{role}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-stone/45">
            {role === "admin" ? "Full platform oversight" : "Campaigns and payouts"}
          </p>
        </div>
      ) : (
        <div className="mx-auto mt-6 flex flex-col items-center py-2" title={`Signed in as ${role}`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-bold uppercase text-gold shadow-xs">
            {role.charAt(0)}
          </div>
        </div>
      )}
    </div>
  );
}
