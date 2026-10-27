"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { dashboardByRole, type UserRole } from "@/lib/navigation";

const ROLE_STORAGE_KEY = "zfund-demo-role";
const DEFAULT_ROLE: UserRole = "host";

type RoleContextValue = {
  role: UserRole;
  setRole: (role: UserRole) => void;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(DEFAULT_ROLE);

  function setRole(nextRole: UserRole) {
    setRoleState(nextRole);
    window.localStorage.setItem(ROLE_STORAGE_KEY, nextRole);
  }

  return (
    <RoleContext.Provider value={{ role, setRole }}>
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
