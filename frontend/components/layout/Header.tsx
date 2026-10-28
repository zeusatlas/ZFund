"use client";

import { usePathname } from "next/navigation";
import { useRole } from "@/components/auth/RoleProvider";
import { menuByRole } from "@/lib/navigation";
import MobileNav from "./MobileNav";
import { SidebarContent } from "./Sidebar";
import UserMenu from "./UserMenu";

export default function Header() {
  const pathname = usePathname();
  const { role } = useRole();
  const currentItem = menuByRole[role]
    .filter(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((first, second) => second.href.length - first.href.length)[0];
  const pageTitle = currentItem?.label ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-navy/10 bg-white/85 px-3 backdrop-blur-md sm:h-16 sm:px-5 lg:px-8">
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav>
          <SidebarContent />
        </MobileNav>
        <div className="min-w-0">
          <p className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-steel sm:block">
            {role === "admin" ? "Admin console" : "Host workspace"}
          </p>
          <h1 className="truncate text-base font-semibold tracking-tight text-navy md:text-[17px]">
            {pageTitle}
          </h1>
        </div>
      </div>
      <UserMenu />
    </header>
  );
}
