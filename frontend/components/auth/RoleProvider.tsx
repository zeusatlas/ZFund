"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import { adminRoles, useMe } from "@/lib/auth/auth";
import type { ApiError } from "@/lib/api/client";
import { tokenStorage } from "@/lib/api/token-storage";
import type { UserRole } from "@/lib/navigation";

type RoleContextValue = {
  role: UserRole;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const role: UserRole = pathname.startsWith("/host") ? "host" : "admin";

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

/**
 * Protects every dashboard route. Signed-out visitors go to /login, and signed-in users are
 * kept on the dashboard that matches their role (hosts cannot open /admin and vice versa).
 */
export function RoleRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, error, refetch } = useMe();

  const isAdminRoute = pathname.startsWith("/admin");
  const isHostRoute = pathname.startsWith("/host");
  const status = (error as Partial<ApiError> | null)?.status;
  const authFailed = status === 401 || status === 403;
  const isAdmin = user ? adminRoles.includes(user.role) : false;
  const wrongDashboard = Boolean(user) && ((isAdminRoute && !isAdmin) || (isHostRoute && isAdmin));

  useEffect(() => {
    if (!tokenStorage.getAccess() || authFailed) {
      tokenStorage.clear();
      router.replace("/login");
      return;
    }
    if (wrongDashboard) router.replace(isAdmin ? "/admin" : "/host");
  }, [authFailed, wrongDashboard, isAdmin, router]);

  if (error && !authFailed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-stone-light text-sm text-steel">
        <p>We couldn&apos;t load your account. Check your connection and try again.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-xl bg-navy px-4 py-2 text-xs font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render nothing until we know who is signed in, so protected content never flashes.
  if (!user || wrongDashboard) return <div className="min-h-screen bg-stone-light" />;
  return <>{children}</>;
}
