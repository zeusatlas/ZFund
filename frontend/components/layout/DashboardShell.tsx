import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import { RoleProvider, RoleRouteGuard } from "@/components/auth/RoleProvider";
import { Suspense } from "react";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <SidebarProvider>
        <Suspense fallback={<div className="min-h-screen bg-stone-light" />}>
          <RoleRouteGuard>
            <div className="flex min-h-screen bg-stone-light">
              <Sidebar />
              <div className="flex min-w-0 flex-1 flex-col">
                <Header />
                <main className="flex-1 px-3 pb-10 pt-6 sm:px-5 lg:px-8">
                  <div className="w-full">{children}</div>
                </main>
              </div>
            </div>
          </RoleRouteGuard>
        </Suspense>
      </SidebarProvider>
    </RoleProvider>
  );
}
