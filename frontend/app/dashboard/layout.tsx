import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { RoleProvider, RoleRouteGuard } from "@/components/auth/RoleProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProvider>
      <RoleRouteGuard>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Header />
            <main className="flex-1 bg-stone-light p-6">{children}</main>
          </div>
        </div>
      </RoleRouteGuard>
    </RoleProvider>
  );
}
