"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const BUILD_YEAR = 2026;

/** Renders the current year without making the (server-rendered) footer depend on `new Date()`. */
export default function CurrentYear() {
  const year = useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => BUILD_YEAR);
  return <>{year}</>;
}
