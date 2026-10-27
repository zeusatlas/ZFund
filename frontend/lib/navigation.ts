import type { LucideIcon } from "lucide-react";
import { Activity, Banknote, LayoutDashboard, Settings, Users } from "lucide-react";

export type UserRole = "admin" | "host";

export type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const adminMenu: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/admin/users", icon: Users },
  { label: "Activity", href: "/dashboard/admin/activity", icon: Activity },
  { label: "Withdrawals", href: "/dashboard/admin/withdrawals", icon: Banknote },
  { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export const hostMenu: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard/host", icon: LayoutDashboard },
];

export const menuByRole: Record<UserRole, MenuItem[]> = {
  admin: adminMenu,
  host: hostMenu,
};

export const dashboardByRole: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  host: "/dashboard/host",
};
