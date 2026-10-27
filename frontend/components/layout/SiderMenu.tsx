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
    <div className="flex flex-1 flex-col">
      <nav aria-label={`${role} navigation`} className="space-y-1 px-3">
        {items.map(({ label, href, icon: Icon }) => {
          const active = href === activeHref;
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

    </div>
  );
}
