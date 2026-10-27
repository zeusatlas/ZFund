"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import { dashboardByRole, type UserRole } from "@/lib/navigation";

type RoleContextValue = {
  role: UserRole;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const role: UserRole = pathname.startsWith("/dashboard/host") ? "host" : "admin";

  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRole must be used inside RoleProvider");
  return context;
}

/** Demo-only route protection. Replace this with server auth when available. */
export function RoleRouteGuard({ children }: { children: React.ReactNode }) {
  const { role } = useRole();
  const pathname = usePathname();
  const router = useRouter();

  const isAdminRoute = pathname.startsWith("/dashboard/admin");
  const isHostRoute = pathname.startsWith("/dashboard/host");
  const canAccess = (role === "admin" && isAdminRoute) || (role === "host" && isHostRoute);

  useEffect(() => {
    if ((isAdminRoute || isHostRoute) && !canAccess) {
      router.replace(dashboardByRole[role]);
    }
  }, [canAccess, isAdminRoute, isHostRoute, role, router]);

  if ((isAdminRoute || isHostRoute) && !canAccess) return null;
  return <>{children}</>;
}
