import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { RoleProvider, RoleRouteGuard } from "@/components/auth/RoleProvider";
import { Suspense } from "react";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <Suspense fallback={<div className="min-h-screen bg-stone-light" />}>
        <RoleRouteGuard>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <Header />
              <main className="flex-1 bg-stone-light p-4 sm:p-5 lg:p-6">{children}</main>
            </div>
          </div>
        </RoleRouteGuard>
      </Suspense>
    </RoleProvider>
  );
}
