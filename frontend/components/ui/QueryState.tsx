import { AlertTriangle, RefreshCw } from "lucide-react";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-xl bg-navy/10 ${className}`} />;
}

export function ErrorNote({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-crimson/20 bg-crimson/5 px-4 py-3.5 text-sm text-crimson"
    >
      <span className="flex items-center gap-2.5">
        <AlertTriangle size={16} aria-hidden="true" />
        {message ?? "Something went wrong loading this."}
      </span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-crimson shadow-sm transition-colors hover:bg-crimson/10"
        >
          <RefreshCw size={13} aria-hidden="true" />
          Retry
        </button>
      )}
    </div>
  );
}
