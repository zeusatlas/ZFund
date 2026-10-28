import Link from "next/link";
import SiderMenu from "./SiderMenu";

// Shared by the desktop sidebar and the mobile drawer.
export function SidebarContent() {
  return (
    <>
      <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-5">
        <Link href="/home" className="inline-flex items-center gap-2.5 text-[17px] font-semibold tracking-tight text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-xs font-bold text-navy">
            R
          </span>
          RaiseFundz
        </Link>
      </div>
      <SiderMenu />
    </>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-midnight text-stone md:flex lg:w-[17rem]">
      <SidebarContent />
    </aside>
  );
}
