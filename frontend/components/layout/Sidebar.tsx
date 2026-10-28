import Link from "next/link";
import SiderMenu from "./SiderMenu";

// Shared by the desktop sidebar and the mobile drawer.
export function SidebarContent() {
  return (
    <>
      <div className="flex h-16 shrink-0 items-center border-b border-steel/40 px-6">
        <Link href="/admin" className="text-lg font-semibold tracking-tight">
          RaiseFundz
        </Link>
      </div>
      <SiderMenu />
    </>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-midnight text-stone md:flex">
      <SidebarContent />
    </aside>
  );
}
