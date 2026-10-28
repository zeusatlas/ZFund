"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type Status = "idle" | "refreshing" | "done";

export default function RefreshData() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status !== "done") return;
    const timer = window.setTimeout(() => setStatus("idle"), 3500);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function refresh() {
    setStatus("refreshing");
    await queryClient.invalidateQueries();
    setStatus("done");
  }

  return (
    <div className="flex items-center gap-3 text-xs text-steel">
      <span aria-live="polite" className="min-w-0">
        {status === "refreshing" ? "Refreshing…" : status === "done" ? "Updated just now" : ""}
      </span>
      <button
        type="button"
        onClick={refresh}
        disabled={status === "refreshing"}
        className="btn-secondary px-3 py-1.5 text-xs"
      >
        <RefreshCw
          size={13}
          aria-hidden="true"
          className={status === "refreshing" ? "animate-spin" : ""}
        />
        Refresh
      </button>
    </div>
  );
}
