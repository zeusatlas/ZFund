"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface SidebarContextValue {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("zfund_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      } else if (typeof window !== "undefined" && window.innerWidth < 1024) {
        // On tablet screens, default to collapsed icon-only to leave space for contents
        setIsCollapsed(true);
      }
    } catch {
      // Ignore localStorage unavailable in SSR / strict modes
    }
  }, []);

  function toggleCollapse() {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("zfund_sidebar_collapsed", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }

  function toggleMobile() {
    setIsMobileOpen((prev) => !prev);
  }

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleCollapse,
        setIsCollapsed,
        isMobileOpen,
        setIsMobileOpen,
        toggleMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    return {
      isCollapsed: false,
      toggleCollapse: () => {},
      setIsCollapsed: () => {},
      isMobileOpen: false,
      setIsMobileOpen: () => {},
      toggleMobile: () => {},
    };
  }
  return context;
}

