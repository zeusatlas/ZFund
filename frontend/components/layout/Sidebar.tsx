"use client";

import Image from "next/image";
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
        className={`flex h-16 shrink-0 items-center border-b border-steel/40 transition-all ${
          collapsed ? "justify-between px-3" : "justify-between px-5"
        }`}
      >
        {!collapsed ? (
          <>
            <Link
              href="/"
              className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-white hover:text-stone/90"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-xs">
                <Image
                  src="/images/logo.png"
                  alt="RaiseFundz logo"
                  width={24}
                  height={24}
                  priority
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="truncate">RaiseFundz</span>
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
          <div className="flex w-full items-center justify-between">
            <Link
              href="/"
              title="RaiseFundz"
              className="flex shrink-0 items-center transition-transform hover:scale-105"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-xs">
                <Image
                  src="/images/logo.png"
                  alt="RaiseFundz logo"
                  width={24}
                  height={24}
                  priority
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>
            <button
              type="button"
              onClick={toggleCollapse}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="flex items-center justify-center rounded-lg p-1.5 text-stone/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <PanelLeftOpen size={18} />
            </button>
          </div>
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
      className={`sticky top-0 z-30 hidden h-screen shrink-0 flex-col bg-midnight text-stone transition-all duration-300 ease-in-out md:flex ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <SidebarContent />
    </aside>
  );
}
