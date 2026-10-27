import Link from "next/link";

// Shared by the desktop sidebar and the mobile drawer.
export function SidebarContent() {
  return (
    <>
      <div className="flex h-16 shrink-0 items-center border-b border-steel/40 px-6">
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
          ZFund
        </Link>
      </div>
      <nav className="flex-1 p-4">{/* Sidebar links go here */}</nav>
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
