import MobileNav from "./MobileNav";
import { SidebarContent } from "./Sidebar";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-navy/10 bg-white px-4 md:px-6">
      <div className="flex items-center gap-2">
        <MobileNav>
          <SidebarContent />
        </MobileNav>
        <h1 className="text-lg font-semibold text-navy">Dashboard</h1>
      </div>
      <UserMenu />
    </header>
  );
}
