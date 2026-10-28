"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useSyncExternalStore } from "react";
import { dashboardForStoredToken } from "@/lib/auth/auth";

const emptySubscribe = () => () => {};

/** Sends signed-in users to their dashboard and everyone else to the login page. */
export default function HostCtaLink({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const href = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      return () => window.removeEventListener("storage", onStoreChange);
    },
    () => dashboardForStoredToken() ?? "/login",
    () => "/login",
  );

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
