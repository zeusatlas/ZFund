import type { LucideIcon } from "lucide-react";
import { Activity, Banknote } from "lucide-react";
import {
  BarChart3,
  CircleDollarSign,
  Megaphone,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

export type UserRole = "admin" | "host";

export type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const adminMenu: MenuItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
  { label: "Activity logs", href: "/admin/activity", icon: Activity },
  { label: "Withdrawal requests", href: "/admin/withdrawals", icon: Banknote },
  {
    label: "Transactions",
    href: "/admin/transactions",
    icon: FileText,
  },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export const hostMenu: MenuItem[] = [
  { label: "Dashboard", href: "/host", icon: LayoutDashboard },
  {
    label: "Campaigns",
    href: "/host/campaigns",
    icon: CircleDollarSign,
  },
  {
    label: "Transactions",
    href: "/host/transactions",
    icon: FileText,
  },
  { label: "Withdrawals", href: "/host/withdrawals", icon: Wallet },
  { label: "Reports", href: "/host/reports", icon: BarChart3 },
  { label: "Settings", href: "/host/settings", icon: Settings },
];

export const menuByRole: Record<UserRole, MenuItem[]> = {
  admin: adminMenu,
  host: hostMenu,
};

export const dashboardByRole: Record<UserRole, string> = {
  admin: "/admin",
  host: "/host",
};
