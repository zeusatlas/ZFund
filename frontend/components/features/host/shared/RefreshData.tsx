"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export default function RefreshData({ onRefresh }: { onRefresh?: () => void | Promise<void> } = {}) {
  const [updated, setUpdated] = useState("Just now");
  const [showUpdated, setShowUpdated] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowUpdated(false), 4000);
    return () => window.clearTimeout(timer);
  }, [updated]);

  async function refresh() {
    if (onRefresh) {
      setIsSpinning(true);
      setUpdated("Refreshing…");
      try {
        await onRefresh();
        setUpdated("Just now");
        setShowUpdated(true);
      } finally {
        setTimeout(() => setIsSpinning(false), 400);
      }
    } else {
      setUpdated("Refreshing…");
      window.setTimeout(() => window.location.reload(), 80);
    }
  }

  return (
    <div className="flex items-center gap-3 text-xs text-steel">
      {showUpdated && <span>Updated {updated}</span>}
      <button
        type="button"
        onClick={refresh}
        disabled={isSpinning}
        className="inline-flex items-center gap-1.5 rounded-lg border border-navy/15 bg-white px-2.5 py-1.5 font-medium text-navy hover:bg-stone disabled:opacity-60 transition-colors"
      >
        <RefreshCw size={13} className={isSpinning ? "animate-spin" : ""} aria-hidden="true" />
        Refresh
      </button>
    </div>
  );
}
