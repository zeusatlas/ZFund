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
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-navy/10 bg-white px-3 sm:h-16 sm:px-5 lg:px-6">
      <div className="flex items-center gap-2">
        <MobileNav>
          <SidebarContent />
        </MobileNav>
        <div>
          <h1 className="text-base font-semibold uppercase text-navy md:text-[17px]">
            {pageTitle}
          </h1>
        </div>
      </div>
      <UserMenu />
    </header>
  );
}
