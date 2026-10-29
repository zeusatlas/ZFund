"use client";

import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import SiderMenu from "./SiderMenu";
import { useSidebar } from "./SidebarContext";

export function SidebarContent({ forceExpanded = false }: { forceExpanded?: boolean }) {
  const { isCollapsed, toggleCollapse } = useSidebar();
  const collapsed = forceExpanded ? false : isCollapsed;

  return (
    <div className="flex h-full flex-col">
      <div
        className={`flex h-16 shrink-0 items-center border-b border-steel/40 transition-all ${collapsed ? "justify-center px-2" : "justify-between px-5"
          }`}
      >
        {!collapsed ? (
          <>
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-white hover:text-stone/90"
            >
              RaiseFundz
            </Link>
            <button
              type="button"
              onClick={toggleCollapse}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              className="rounded-lg p-1.5 text-stone/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <PanelLeftClose size={18} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className="flex items-center justify-center rounded-lg p-1.5 text-stone/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <PanelLeftOpen size={20} />
          </button>
        )}
      </div>
      <SiderMenu forceExpanded={forceExpanded} />
    </div>
  );
}

export default function Sidebar() {
  const { isCollapsed } = useSidebar();

  return (
    <aside
      className={`sticky top-0 z-30 hidden h-screen shrink-0 flex-col bg-midnight text-stone transition-all duration-300 ease-in-out md:flex ${isCollapsed ? "w-[72px]" : "w-64"
        }`}
    >
      <SidebarContent />
    </aside>
  );
}
