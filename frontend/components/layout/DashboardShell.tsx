import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { RoleProvider, RoleRouteGuard } from "@/components/auth/RoleProvider";
import { Suspense } from "react";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <Suspense fallback={<div className="min-h-screen bg-stone-light" />}>
        <RoleRouteGuard>
          <div className="flex min-h-screen bg-stone-light">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <Header />
              <main className="flex-1 px-4 pb-10 pt-6 sm:px-5 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px]">{children}</div>
              </main>
            </div>
          </div>
        </RoleRouteGuard>
      </Suspense>
    </RoleProvider>
  );
}
