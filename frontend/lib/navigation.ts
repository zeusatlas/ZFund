import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CircleDollarSign,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

export type UserRole = "admin" | "host";

export type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

// Keep menu definitions separate from the component so adding or removing an
// item does not require changing the sidebar rendering logic.
export const adminMenu: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/admin/users", icon: Users },
  { label: "Funds", href: "/dashboard/admin/funds", icon: CircleDollarSign },
  { label: "Transactions", href: "/dashboard/admin/transactions", icon: FileText },
  { label: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export const hostMenu: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard/host", icon: LayoutDashboard },
  { label: "My funds", href: "/dashboard/host/funds", icon: CircleDollarSign },
  { label: "Transactions", href: "/dashboard/host/transactions", icon: FileText },
  { label: "Reports", href: "/dashboard/host/reports", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/host/settings", icon: Settings },
];

export const menuByRole: Record<UserRole, MenuItem[]> = {
  admin: adminMenu,
  host: hostMenu,
};

export const dashboardByRole: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  host: "/dashboard/host",
};
